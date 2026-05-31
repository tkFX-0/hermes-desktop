#!/usr/bin/env node
/**
 * StackChan HOLD 解除（音声・Discord 読み上げを再有効化）
 *
 *   node scripts/shikishima-stackchan-resume.mjs
 *   node scripts/shikishima-stackchan-resume.mjs --restart-bot
 *   node scripts/shikishima-stackchan-resume.mjs --voice-off   # HOLD解除のみ、Discord音声はOFFのまま
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { patchEnvLocal, defaultEnvLocalPath } from "./lib/env-local-patch.mjs";
import { stackchanFace } from "./shikishima-stackchan.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const restartBot = process.argv.includes("--restart-bot");
const voiceOff = process.argv.includes("--voice-off");

const patches = {
  SHIKISHIMA_STACKCHAN_HOLD: "0",
  STACKCHAN_DISCORD_VOICE: voiceOff ? "0" : "1",
};

patchEnvLocal(defaultEnvLocalPath(root), patches);

console.log("[StackChan RESUME] .env.local:", Object.keys(patches).join(", "));

try {
  const r = await stackchanFace("normal");
  console.log("[StackChan RESUME] face_mode normal:", r.ok ? "ok" : r.error ?? "fail");
} catch (e) {
  console.warn("[StackChan RESUME] device:", e.message);
}

if (restartBot) {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync(
    process.execPath,
    ["scripts/shikishima-process-preflight.mjs", "--clean", "--restart-dev"],
    {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, ...patches },
    },
  );
  process.exit(r.status ?? 1);
}

console.log("\nStackChan HOLD 解除済み。Bot 再起動で bridge が ON になります。");
