/**
 * Track B2 — Bounded Discord secretary → StackChan voice loop (pilot).
 * Max cycles, cooldown, no Discord REST send. Human GO required before run.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_CYCLES = Number(process.env.SHIKISHIMA_B2_MAX_CYCLES ?? "3");
const COOLDOWN_MS = Number(process.env.SHIKISHIMA_B2_COOLDOWN_MS ?? "30000");
const PREVIEWS = ["了解しました", "承知しました", "確認しました"];

process.env.SHIKISHIMA_DISCORD_VOICE_BRIDGE ??= "1";
process.env.STACKCHAN_VOICE_PILOT_SEND ??= "1";
process.env.STACKCHAN_VOICEVOX_VOLUME ??= "1.6";

const { runDiscordSecretaryVoiceBridge } = await import(
  "../src/main/shikishima-full-autonomy/discord-secretary-voice-bridge.ts"
);
const {
  createSchedulerSession,
  enforceCooldown,
  preventRetryLoop,
  recordRouteAttempt
} = await import("../src/main/shikishima-full-autonomy/scheduler-recovery.ts");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const startedIso = new Date().toISOString();
const scheduler = createSchedulerSession(MAX_CYCLES, COOLDOWN_MS);
const cycles = [];

console.log(
  JSON.stringify({
    phase: "B2_start",
    maxCycles: MAX_CYCLES,
    cooldownMs: COOLDOWN_MS,
    execution: "disabled"
  })
);

for (let i = 0; i < MAX_CYCLES; i++) {
  const nowMs = Date.now();
  const routeId = "stackchan.voice.secretary";
  const cooldown = enforceCooldown(scheduler, routeId, nowMs);
  if (!cooldown.allowed) {
    cycles.push({ cycle: i + 1, skipped: true, reason: cooldown.reason });
    break;
  }
  if (!preventRetryLoop(scheduler, routeId)) {
    cycles.push({ cycle: i + 1, skipped: true, reason: "retry_loop_prevented" });
    break;
  }

  const preview = PREVIEWS[i % PREVIEWS.length];
  const result = await runDiscordSecretaryVoiceBridge({
    messageLength: preview.length,
    redactedPreview: preview,
    humanGoApproved: true,
    oneShotDeclared: true,
    timeWindowActive: true,
    voicePilotAudibleAccepted: true,
    bridgeEnvEnabled: true,
    productionReady: false,
    executionEnabled: false,
    actualDeviceSendEnabled: true,
    humanPresent: true,
    manualStopMethodConfirmed: true,
    screenVisible: true,
    timeWindowDeclared: true,
    activeTimeWindow: true
  });

  recordRouteAttempt(scheduler, routeId, nowMs);
  cycles.push({
    cycle: i + 1,
    atIso: new Date().toISOString(),
    previewLength: preview.length,
    planDecision: result.planDecision,
    sendOk: result.sendResult?.ok ?? false,
    sent: result.sendResult?.sent ?? false
  });

  console.log(
    JSON.stringify({
      phase: "B2_cycle",
      cycle: i + 1,
      planDecision: result.planDecision,
      sendOk: result.sendResult?.ok ?? false
    })
  );

  if (i < MAX_CYCLES - 1) await sleep(COOLDOWN_MS);
}

const pass = cycles.length > 0 && cycles.every((c) => !c.skipped && c.sendOk === true);
const report = {
  schema: "shikishima-discord-secretary-b2/v1",
  track: "B2",
  startedIso,
  endedIso: new Date().toISOString(),
  maxCycles: MAX_CYCLES,
  cooldownMs: COOLDOWN_MS,
  cycles,
  pass,
  discordRestSend: false,
  execution: "disabled",
  productionReady: false
};

const jsonPath = join(REPO_ROOT, "docs/shikishima/FULL_AUTONOMY_B2_DISCORD_SECRETARY_EVIDENCE.json");
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ phase: "B2_end", pass, jsonPath }));
process.exit(pass ? 0 : 1);
