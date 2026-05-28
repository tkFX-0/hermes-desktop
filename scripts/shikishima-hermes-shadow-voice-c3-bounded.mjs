/**
 * Track C3 — Hermes shadow bounded always-on voice pilot (StackChan path).
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_CYCLES = Number(process.env.SHIKISHIMA_C3_MAX_CYCLES ?? "3");
const COOLDOWN_MS = Number(process.env.SHIKISHIMA_C3_COOLDOWN_MS ?? "30000");
const PHRASES = ["よろしく。", "承知しました。", "了解しました。"];

process.env.SHIKISHIMA_SHADOW_VOICE_PILOT ??= "1";
process.env.STACKCHAN_VOICE_PILOT_SEND ??= "1";
process.env.STACKCHAN_VOICEVOX_VOLUME ??= "1.6";

const { stackchanSay } = await import("./shikishima-stackchan.mjs");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const startedIso = new Date().toISOString();
const cycles = [];

console.log(
  JSON.stringify({
    phase: "C3_start",
    maxCycles: MAX_CYCLES,
    cooldownMs: COOLDOWN_MS,
    hermesDaemonStarted: false
  })
);

for (let i = 0; i < MAX_CYCLES; i++) {
  const phrase = PHRASES[i % PHRASES.length];
  const result = await stackchanSay(phrase, { skipMilestone: true, skipMotion: true });
  cycles.push({
    cycle: i + 1,
    atIso: new Date().toISOString(),
    ok: Boolean(result.ok)
  });
  console.log(JSON.stringify({ phase: "C3_cycle", cycle: i + 1, ok: result.ok }));
  if (i < MAX_CYCLES - 1) await sleep(COOLDOWN_MS);
}

const pass = cycles.every((c) => c.ok);
const report = {
  schema: "shikishima-hermes-shadow-c3/v1",
  track: "C3",
  startedIso,
  endedIso: new Date().toISOString(),
  maxCycles: MAX_CYCLES,
  cooldownMs: COOLDOWN_MS,
  cycles,
  pass,
  hermesDaemonStarted: false,
  sidebotStarted: false,
  execution: "disabled",
  productionReady: false
};

const jsonPath = join(REPO_ROOT, "docs/shikishima/FULL_AUTONOMY_C3_HERMES_SHADOW_VOICE_EVIDENCE.json");
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ phase: "C3_end", pass, jsonPath }));
process.exit(pass ? 0 : 1);
