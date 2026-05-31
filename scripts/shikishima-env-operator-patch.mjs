#!/usr/bin/env node
/**
 * DISCORD_OPERATOR_USER_ID を .env.local に設定（値はログに出さない）
 *
 *   node scripts/shikishima-env-operator-patch.mjs <DiscordユーザーID>
 *
 * ID は Discord 設定 → 詳細 → 開発者モード ON → 自分のプロフィール右クリック → ID をコピー
 */

import { patchEnvLocal, defaultEnvLocalPath } from "./lib/env-local-patch.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = process.argv[2]?.trim() ?? "";

if (!/^\d{17,20}$/.test(raw)) {
  console.error(
    "[operator-patch] Usage: node scripts/shikishima-env-operator-patch.mjs <17-20桁のDiscordユーザーID>"
  );
  process.exit(1);
}

patchEnvLocal(defaultEnvLocalPath(root), { DISCORD_OPERATOR_USER_ID: raw });
console.log("[operator-patch] DISCORD_OPERATOR_USER_ID updated (value not logged)");
console.log("[operator-patch] Discord: !multi-room-test · preflight --restart-dev で Bot 再読込");
