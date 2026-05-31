#!/usr/bin/env node
/**
 * 全てGO — スコープ付き実行 + 憲法 GO 記録（グローバル execution=disabled は不変）
 *
 *   node scripts/shikishima-zenbu-go-activate.mjs
 */

import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recordUserExecutionScopeGo } from "./lib/execution-scope-policy.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const memory = join(root, ".shikishima-memory");

mkdirSync(memory, { recursive: true });

const scopeDoc = recordUserExecutionScopeGo(root, {
  note: "全てGO 2026-06-01: autonomous_dev + orchestratorRelaxed + MT5 backtest dry-run; live/git/push/production HOLD"
});

writeFileSync(
  join(memory, "zenbu-go.local.json"),
  JSON.stringify(
    {
      acknowledgedAtIso: new Date().toISOString(),
      note: "Discord 全てGO — 開発レーン拒否なし（dev pipeline + WF + kaihatu vitest pass 前提）",
      globalExecutionStillDisabled: true
    },
    null,
    2
  ),
  "utf8"
);

const act = spawnSync(process.execPath, ["scripts/shikishima-constitutional-go-activate.mjs"], {
  cwd: root,
  encoding: "utf8",
  timeout: 60_000
});

console.log(
  JSON.stringify(
    {
      executionScope: { recordedAt: scopeDoc.recordedAt },
      zenbuGo: join(memory, "zenbu-go.local.json"),
      constitutionalActivate: {
        status: act.status,
        stdout: (act.stdout ?? "").trim().slice(0, 800)
      }
    },
    null,
    2
  )
);

if (act.status !== 0) process.exit(act.status ?? 1);
