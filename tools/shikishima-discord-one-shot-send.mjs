#!/usr/bin/env node
/**
 * Rally 4 — supervised one-shot Discord REST send (bot token).
 * No retry, no gateway, no webhook, no token/channel/message ID logging.
 */
import https from "node:https";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ENV_BOT_TOKEN = "SHIKISHIMA_DISCORD_BOT_TOKEN";
const ENV_CHANNEL_ID = "SHIKISHIMA_DISCORD_OPERATOR_REVIEW_CHANNEL_ID";
const ENV_TARGET_LABEL = "SHIKISHIMA_DISCORD_OPERATOR_REVIEW_TARGET_LABEL";

const FORBIDDEN_TARGET_PATTERNS = [
  /^https?:\/\//i,
  /discord\.com\/api\/webhooks/i,
  /\bBearer\s+/i,
  /\bsk-[A-Za-z0-9]/,
  /^\d{10,}$/,
  /\bchannel_id:\s*\d+/i,
  /[A-Za-z]:\\Users\\/
];

function parseArgs(argv) {
  const args = { inputPath: null, dryRunOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--input" && next) {
      args.inputPath = next;
      i++;
    } else if (arg === "--dry-run-only") {
      args.dryRunOnly = true;
    }
  }
  return args;
}

function readPayload(inputPath) {
  const raw = inputPath ? readFileSync(inputPath, "utf8") : readFileSync(0, "utf8");
  return JSON.parse(raw);
}

function envPresent(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

function validateTargetLabel(targetLabel) {
  const trimmed = String(targetLabel ?? "").trim();
  if (!trimmed) return "targetLabel is required";
  if (FORBIDDEN_TARGET_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return "targetLabel must be a label only";
  }
  return null;
}

function buildPreflight(payload) {
  const reasons = [];
  const targetError = validateTargetLabel(payload.targetLabel);
  if (targetError) reasons.push(targetError);
  if (!String(payload.messageMarkdown ?? "").trim()) reasons.push("messageMarkdown is required");
  if (!String(payload.humanGoReference ?? "").trim()) reasons.push("humanGoReference is required");
  if (payload.dryRunStatus === "BLOCKED") reasons.push("dryRunStatus is BLOCKED");
  if (payload.dryRunStatus === "HOLD") reasons.push("dryRunStatus is HOLD");

  const credentialPresence = {
    botTokenPresent: envPresent(ENV_BOT_TOKEN),
    channelIdPresent: envPresent(ENV_CHANNEL_ID),
    targetLabelPresent: envPresent(ENV_TARGET_LABEL)
  };

  if (!credentialPresence.botTokenPresent) reasons.push(`missing ${ENV_BOT_TOKEN}`);
  if (!credentialPresence.channelIdPresent) reasons.push(`missing ${ENV_CHANNEL_ID}`);
  if (!credentialPresence.targetLabelPresent) reasons.push(`missing ${ENV_TARGET_LABEL}`);

  const hardBlockers = reasons.filter(
    (reason) => !reason.startsWith("dryRunStatus is") && !reason.startsWith("missing SHIKISHIMA_")
  );
  const credentialMissing =
    !credentialPresence.botTokenPresent ||
    !credentialPresence.channelIdPresent ||
    !credentialPresence.targetLabelPresent;

  let status = "READY_TO_SEND_ONCE";
  if (hardBlockers.length > 0 || payload.dryRunStatus === "BLOCKED") {
    status = "BLOCKED";
  } else if (credentialMissing || payload.dryRunStatus === "HOLD") {
    status = "HOLD";
  }

  return {
    status,
    maySendExactlyOnce: status === "READY_TO_SEND_ONCE",
    reasons,
    credentialPresence,
    targetLabel: String(payload.targetLabel ?? "").trim()
  };
}

function truncateContent(content) {
  const hardMax = 2000;
  const marker = "\n\n[truncated]";
  if (content.length <= hardMax) return content;
  return content.slice(0, hardMax - marker.length) + marker;
}

function discordPostMessage(channelId, token, content) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      content: truncateContent(content),
      allowed_mentions: { parse: [] }
    });
    const path = `/api/v10/channels/${channelId}/messages`;
    const req = https.request(
      {
        hostname: "discord.com",
        path,
        method: "POST",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "ShikishimaOneShot/1.0 (Rally4)",
          "Content-Length": Buffer.byteLength(body)
        },
        timeout: 15_000
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          let parsed = null;
          try {
            parsed = data ? JSON.parse(data) : null;
          } catch {
            parsed = null;
          }
          resolve({
            status: res.statusCode ?? 0,
            headers: res.headers,
            body: parsed
          });
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("discord_request_timeout"));
    });
    req.write(body);
    req.end();
  });
}

function redactOutcome(apiResponse) {
  const created = apiResponse.status >= 200 && apiResponse.status < 300;
  const rateLimited = apiResponse.status === 429;
  return {
    status: created ? "SENT_ONCE" : rateLimited ? "FAILED" : "FAILED",
    actualSendCount: created ? 1 : 0,
    messageReferenceRedacted: created ? "REDACTED_MESSAGE_ID_PRESENT" : "REDACTED_MESSAGE_ID_ABSENT",
    rateLimitedRedacted: rateLimited,
    networkCall: true,
    externalApiWrite: created
  };
}

export async function runDiscordOneShotSend(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const payload = readPayload(args.inputPath);
  const preflight = buildPreflight(payload);
  const evidenceId = payload.evidenceId ?? "discord-one-shot:operator-review";

  const baseResult = {
    oneShotOnly: true,
    targetLabel: preflight.targetLabel,
    evidenceId,
    gateRestoredToHold: true,
    webhookUsed: false,
    botRuntimeStarted: false,
    gatewayUsed: false,
    autoRetry: false,
    autoReply: false,
    tokenPrinted: false,
    channelIdPrinted: false,
    rawMessageIdPrinted: false,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false
  };

  if (!preflight.maySendExactlyOnce || args.dryRunOnly) {
    return {
      ok: false,
      preflightStatus: preflight.status,
      ...baseResult,
      status: preflight.status,
      actualSendCount: 0,
      actualDiscordSend: false,
      networkCall: false,
      externalApiWrite: false,
      reasons: preflight.reasons
    };
  }

  const token = process.env[ENV_BOT_TOKEN];
  const channelId = process.env[ENV_CHANNEL_ID];

  const apiResponse = await discordPostMessage(channelId, token, payload.messageMarkdown);
  const outcome = redactOutcome(apiResponse);

  return {
    ok: outcome.actualSendCount === 1,
    preflightStatus: "READY_TO_SEND_ONCE",
    ...baseResult,
    status: outcome.status,
    actualSendCount: outcome.actualSendCount,
    actualDiscordSend: outcome.actualSendCount === 1,
    messageReferenceRedacted: outcome.messageReferenceRedacted,
    rateLimitedRedacted: outcome.rateLimitedRedacted,
    networkCall: outcome.networkCall,
    externalApiWrite: outcome.externalApiWrite,
    httpStatusCategory:
      apiResponse.status >= 200 && apiResponse.status < 300
        ? "success"
        : apiResponse.status === 429
          ? "rate_limited"
          : "error",
    reasons: preflight.reasons
  };
}

const isMain =
  process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) {
  runDiscordOneShotSend()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.ok ? 0 : 1);
    })
    .catch((error) => {
      console.error(JSON.stringify({ ok: false, errorCategory: error.message ?? "unknown_error" }));
      process.exit(1);
    });
}
