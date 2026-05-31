#!/usr/bin/env node
/**
 * Groq 更新後のローカル確認（キー値は出力しない）
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { groqKeyConfigured } from "./lib/agent-reply-capability.mjs";
import { isLiveApiTickAllowed, isSubscriptionCliOnlyMode } from "./lib/billing-policy.mjs";
import { checkObsidianVaultReady } from "./lib/obsidian-vault-path.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function readEnv() {
  const out = {};
  if (!existsSync(envPath)) return out;
  for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

function checkGroqPing(apiKey) {
  return new Promise((resolve) => {
    if (!apiKey) {
      resolve({ ok: false, error: "no_key" });
      return;
    }
    const body = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "reply with exactly: groq_ok" }],
      max_tokens: 8,
    });
    import("node:https")
      .then(({ request }) => {
        const req = request(
          {
            hostname: "api.groq.com",
            path: "/openai/v1/chat/completions",
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(body),
            },
            timeout: 20_000,
          },
          (res) => {
            let data = "";
            res.on("data", (c) => {
              data += c;
            });
            res.on("end", () => {
              if (res.statusCode !== 200) {
                resolve({ ok: false, error: `http_${res.statusCode}` });
                return;
              }
              try {
                const j = JSON.parse(data);
                const text = j.choices?.[0]?.message?.content ?? "";
                resolve({ ok: true, preview: String(text).slice(0, 40) });
              } catch {
                resolve({ ok: false, error: "parse_error" });
              }
            });
          },
        );
        req.on("error", (e) => resolve({ ok: false, error: e.message }));
        req.on("timeout", () => {
          req.destroy();
          resolve({ ok: false, error: "timeout" });
        });
        req.write(body);
        req.end();
      })
      .catch((e) => resolve({ ok: false, error: e.message }));
  });
}

const env = readEnv();
const get = (k) => env[k];

const report = {
  at: new Date().toISOString(),
  groqKeyConfigured: groqKeyConfigured(get),
  obsidianReady: checkObsidianVaultReady(root).ready,
  billingSubscriptionOnly: isSubscriptionCliOnlyMode(get),
  liveApiAllowed: isLiveApiTickAllowed(get),
  groqPing: null,
};

if (report.groqKeyConfigured) {
  report.groqPing = await checkGroqPing(get("GROQ_API_KEY"));
}

console.log(JSON.stringify(report, null, 2));
process.exit(
  report.groqKeyConfigured && report.obsidianReady && report.groqPing?.ok ? 0 : 1,
);
