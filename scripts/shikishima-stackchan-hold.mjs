#!/usr/bin/env node
/**
 * StackChan 音声・Discord 読み上げを HOLD（完全自律作業中はデバイス経路を止める）
 *
 *   node scripts/shikishima-stackchan-hold.mjs
 *   node scripts/shikishima-stackchan-hold.mjs --restart-bot
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { patchEnvLocal, defaultEnvLocalPath } from "./lib/env-local-patch.mjs";
import { stackchanFace } from "./shikishima-stackchan.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const restartBot = process.argv.includes("--restart-bot");

const patches = patchEnvLocal(defaultEnvLocalPath(root), {
  SHIKISHIMA_STACKCHAN_HOLD: "1",
  STACKCHAN_DISCORD_VOICE: "0",
});

console.log("[StackChan HOLD] .env.local updated:", patches.map((p) => p.key).join(", "));

try {
  const r = await stackchanFace("normal");
  console.log("[StackChan HOLD] face_mode normal:", r.ok ? "ok" : r.error ?? "fail");
} catch (e) {
  console.warn("[StackChan HOLD] device unreachable (env HOLD still applied):", e.message);
}

if (restartBot) {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync(
    process.execPath,
    ["scripts/shikishima-process-preflight.mjs", "--clean", "--restart-dev"],
    { cwd: root, stdio: "inherit", env: { ...process.env, SHIKISHIMA_STACKCHAN_HOLD: "1", STACKCHAN_DISCORD_VOICE: "0" } },
  );
  process.exit(r.status ?? 1);
}

console.log(`
StackChan は HOLD です（発話・Discord→VOICEVOX オフ）。
再開: SHIKISHIMA_STACKCHAN_HOLD=0 および必要なら STACKCHAN_DISCORD_VOICE=1 を .env.local に戻して Bot 再起動。
`);
