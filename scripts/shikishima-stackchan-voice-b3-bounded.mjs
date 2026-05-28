/**
 * Track B3 — Bounded StackChan production voice loop (pilot).
 * Fixed allowlist phrases, skipMilestone, max cycles + cooldown.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_CYCLES = Number(process.env.SHIKISHIMA_B3_MAX_CYCLES ?? "3");
const COOLDOWN_MS = Number(process.env.SHIKISHIMA_B3_COOLDOWN_MS ?? "30000");
const PHRASES = ["よろしく。", "了解しました。", "確認しました。"];

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
    phase: "B3_start",
    maxCycles: MAX_CYCLES,
    cooldownMs: COOLDOWN_MS,
    productionReady: false,
    execution: "disabled"
  })
);

for (let i = 0; i < MAX_CYCLES; i++) {
  const phrase = PHRASES[i % PHRASES.length];
  const result = await stackchanSay(phrase, { skipMilestone: true, skipMotion: true });
  cycles.push({
    cycle: i + 1,
    atIso: new Date().toISOString(),
    phraseLength: phrase.length,
    ok: Boolean(result.ok),
    blocked: result.blockedReason ?? null
  });
  console.log(JSON.stringify({ phase: "B3_cycle", cycle: i + 1, ok: result.ok }));
  if (i < MAX_CYCLES - 1) await sleep(COOLDOWN_MS);
}

const pass = cycles.every((c) => c.ok === true);
const report = {
  schema: "shikishima-stackchan-voice-b3/v1",
  track: "B3",
  startedIso,
  endedIso: new Date().toISOString(),
  maxCycles: MAX_CYCLES,
  cooldownMs: COOLDOWN_MS,
  cycles,
  pass,
  productionReady: false,
  execution: "disabled"
};

const jsonPath = join(REPO_ROOT, "docs/shikishima/FULL_AUTONOMY_B3_STACKCHAN_VOICE_LOOP_EVIDENCE.json");
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ phase: "B3_end", pass, jsonPath }));
process.exit(pass ? 0 : 1);
