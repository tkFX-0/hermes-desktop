/**
 * Track C2 — Hermes startup shadow voice one-shot (StackChan path).
 * Simulates startup ack; does not start Hermes daemon or SideBot.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const phrase = process.argv[2] ?? "よろしく。";

process.env.SHIKISHIMA_SHADOW_VOICE_PILOT ??= "1";
process.env.STACKCHAN_VOICE_PILOT_SEND ??= "1";
process.env.STACKCHAN_VOICEVOX_VOLUME ??= "1.6";

const { stackchanSay } = await import("./shikishima-stackchan.mjs");

const startedIso = new Date().toISOString();
const result = await stackchanSay(phrase, { skipMilestone: true, skipMotion: true });

const report = {
  schema: "shikishima-hermes-shadow-c2/v1",
  track: "C2",
  trigger: "hermes_startup_simulated",
  startedIso,
  endedIso: new Date().toISOString(),
  phraseLength: phrase.length,
  ok: Boolean(result.ok),
  blocked: result.blockedReason ?? null,
  hermesDaemonStarted: false,
  sidebotStarted: false,
  path: "voicevox_pc_pcm_ws8080",
  execution: "disabled",
  productionReady: false
};

const jsonPath = join(REPO_ROOT, "docs/shikishima/FULL_AUTONOMY_C2_HERMES_SHADOW_VOICE_EVIDENCE.json");
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ phase: "C2_end", ...report, jsonPath }));
process.exit(result.ok ? 0 : 1);
