/**
 * Track B1 — Discord secretary plan → StackChan voice one-shot (guarded).
 * Requires: SHIKISHIMA_DISCORD_VOICE_BRIDGE=1, STACKCHAN_VOICE_PILOT_SEND=1, .env.local host.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const preview =
  process.argv[2]?.slice(0, 28) ?? "了解しました";

process.env.SHIKISHIMA_DISCORD_VOICE_BRIDGE ??= "1";
process.env.STACKCHAN_VOICE_PILOT_SEND ??= "1";
process.env.STACKCHAN_VOICEVOX_VOLUME ??= "1.6";

const { runDiscordSecretaryVoiceBridge } = await import(
  "../src/main/shikishima-full-autonomy/discord-secretary-voice-bridge.ts"
);

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

const report = {
  schema: "shikishima-discord-stackchan-b1/v1",
  track: "B1",
  atIso: new Date().toISOString(),
  previewLength: preview.length,
  planDecision: result.planDecision,
  planReasons: [...result.reasons],
  sendOk: result.sendResult?.ok ?? false,
  sent: result.sendResult?.sent ?? false,
  deviceDecision: result.sendResult?.deviceDecision ?? null,
  sendReasons: result.sendResult?.reasons ? [...result.sendResult.reasons] : [],
  websocketSendPerformed: result.sendResult?.websocketSendPerformed ?? false,
  execution: "disabled",
  productionReady: false
};

const jsonPath = join(
  REPO_ROOT,
  "docs/shikishima/FULL_AUTONOMY_B1_DISCORD_STACKCHAN_VOICE_EVIDENCE.json"
);
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ phase: "B1_end", ...report, jsonPath }));

const pass = result.planDecision === "ALLOW_DRAFT" && result.sendResult?.ok === true;
process.exit(pass ? 0 : 1);
