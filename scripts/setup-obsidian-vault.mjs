#!/usr/bin/env node
/**
 * Obsidian Vault 整理 + .env.local に OBSIDIAN_VAULT_PATH を設定
 * ファイル移動のみ（削除なし）
 */

import { existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { patchEnvLocal, defaultEnvLocalPath } from "./lib/env-local-patch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const VAULT = "C:\\Users\\81903\\Documents\\Obsidian Vault";
const asJson = process.argv.includes("--json");

const report = {
  vault: VAULT,
  moves: [],
  created: [],
  envPatches: [],
  errors: [],
};

function safeRename(from, to) {
  if (!existsSync(from)) return;
  if (existsSync(to)) {
    report.errors.push(`skip_exists:${to}`);
    return;
  }
  mkdirSync(dirname(to), { recursive: true });
  renameSync(from, to);
  report.moves.push({ from, to });
}

try {
  const shikishima = join(VAULT, "しきしま");
  const inbox = join(shikishima, "inbox");
  const plan = join(shikishima, "計画");
  const evidence = join(VAULT, "30_Evidence");

  for (const d of [shikishima, inbox, plan, evidence]) {
    if (!existsSync(d)) {
      mkdirSync(d, { recursive: true });
      report.created.push(d);
    }
  }

  safeRename(join(VAULT, "無題のファイル.md"), join(inbox, "無題のファイル.md"));

  const legacyPlan = join(VAULT, "しきしま計画");
  if (existsSync(legacyPlan) && !existsSync(plan)) {
    safeRename(legacyPlan, plan);
  } else if (existsSync(legacyPlan) && existsSync(plan)) {
    report.errors.push("both_plan_dirs:手動で しきしま/計画 に統合してください");
  }

  const readme = join(VAULT, "README-しきしま連携.md");
  if (!existsSync(readme)) {
    writeFileSync(
      readme,
      [
        "# しきしま × Obsidian",
        "",
        "この Vault は **あなたの Obsidian アカウント／Sync** に紐づくローカルフォルダです。",
        "しきしま Bot は `OBSIDIAN_VAULT_PATH` でここを参照します（クラウドログインは Bot 側では不要）。",
        "",
        "| フォルダ | 用途 |",
        "|----------|------|",
        "| `しきしま/inbox/` | 未整理メモ |",
        "| `しきしま/計画/` | 計画・ロードマップ |",
        "| `30_Evidence/` | Bot ツール用の証跡メモ（任意） |",
        "",
        "憲法GO の正式証跡は別途 `shikishima-library/30_Evidence/` にも書きます。",
        "",
      ].join("\n"),
      "utf-8",
    );
    report.created.push(readme);
  }

  const envPath = defaultEnvLocalPath(root);
  report.envPatches = patchEnvLocal(envPath, {
    OBSIDIAN_VAULT_PATH: VAULT,
    SHIKISHIMA_BILLING_MODE: "subscription_only",
    SHIKISHIMA_ALLOW_PAID_API: "0",
  });
} catch (e) {
  report.errors.push(e instanceof Error ? e.message : String(e));
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("[Setup] Obsidian Vault:", VAULT);
  console.log("  created:", report.created.length, "moves:", report.moves.length);
  for (const m of report.moves) console.log(`    ${m.from} -> ${m.to}`);
  console.log("  .env.local patched keys:", report.envPatches.map((p) => p.key).join(", "));
  if (report.errors.length) console.log("  notes:", report.errors.join("; "));
}

process.exit(report.errors.some((e) => !e.startsWith("skip_")) ? 1 : 0);
