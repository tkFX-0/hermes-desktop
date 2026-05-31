/**
 * MT5 バックテスト記録（エクスポート JSON 読取・redacted 要約）
 * ライブ売買は実行しない。Strategy Tester 起動は GO 時のみ・オプション。
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { isScopedExecutionAllowed } from "./execution-scope-policy.mjs";
import { readMt5Data, scanMt5DataPath } from "../shikishima-mt5.mjs";

const ROOT = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop");

function redactNumbers(obj) {
  if (obj == null) return obj;
  if (typeof obj === "number") return "[n]";
  if (Array.isArray(obj)) return obj.slice(0, 20).map(redactNumbers);
  if (typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (/balance|equity|profit|lot|margin|deposit|withdraw/i.test(k)) {
        out[k] = "[redacted]";
      } else {
        out[k] = redactNumbers(v);
      }
    }
    return out;
  }
  return String(obj).slice(0, 120);
}

/**
 * @param {string} mqBase
 */
function findBacktestJsonFiles(mqBase) {
  const found = [];
  if (!existsSync(mqBase)) return found;
  const scanDir = (dir, depth = 0) => {
    if (depth > 4) return;
    let entries = [];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) scanDir(p, depth + 1);
      else if (/backtest|tester|report/i.test(e.name) && e.name.endsWith(".json")) {
        found.push(p);
      }
    }
  };
  scanDir(join(mqBase, "Common", "Files"));
  try {
    for (const id of readdirSync(mqBase)) {
      if (id === "Common") continue;
      scanDir(join(mqBase, id, "MQL5", "Files"), 0);
    }
  } catch {
    /* ignore */
  }
  return found.slice(0, 8);
}

/**
 * @param {string} [projectRoot]
 * @param {(k: string) => string|undefined} [getEnv]
 */
export function runMt5BacktestRecord(projectRoot = ROOT, getEnv = (k) => process.env[k]) {
  if (!isScopedExecutionAllowed("mt5_backtest", getEnv, projectRoot)) {
    return {
      ok: false,
      allowed: false,
      reason: "mt5_backtest_scope_hold",
      summary: "SHIKISHIMA_MT5_BACKTEST_GO または execution-scope-go.local.json が未設定"
    };
  }

  const scan = scanMt5DataPath();
  const live = readMt5Data();
  const btFiles = findBacktestJsonFiles(scan.mqBase);

  let backtestSnippet = null;
  if (btFiles.length) {
    try {
      const raw = JSON.parse(readFileSync(btFiles[0], "utf8"));
      backtestSnippet = redactNumbers(raw);
    } catch {
      backtestSnippet = { file: btFiles[0].split(/[/\\]/).pop(), parse: "failed" };
    }
  }

  const summary = {
    allowed: true,
    at: new Date().toISOString(),
    terminalsFound: scan.terminals?.length ?? 0,
    dataFilePresent: Boolean(live),
    backtestFiles: btFiles.map((p) => p.split(/[/\\]/).pop()),
    liveMetricsRedacted: live
      ? {
          symbol: live.symbol ?? live.Symbol ?? "?",
          openPositions: Array.isArray(live.positions)
            ? live.positions.length
            : Array.isArray(live.openPositions)
              ? live.openPositions.length
              : 0
        }
      : null,
    backtestSnippet,
    note: "ライブ注文は送信していません。金額フィールドは redacted。"
  };

  const outPath = join(projectRoot, ".shikishima-memory", "mt5-backtest-last.json");
  mkdirSync(join(projectRoot, ".shikishima-memory"), { recursive: true });
  writeFileSync(outPath, JSON.stringify(summary, null, 2), "utf8");

  return {
    ok: true,
    allowed: true,
    summary,
    text:
      `📈 **ちはや** — MT5バックテスト記録\n` +
      `端末: ${summary.terminalsFound} · BT JSON: ${summary.backtestFiles.length}件\n` +
      (summary.backtestFiles.length
        ? `ファイル: ${summary.backtestFiles.join(", ")}`
        : "BT専用JSON未検出（EAが `*backtest*.json` を Files に出力すると自動取込）") +
      `\n保存: \`.shikishima-memory/mt5-backtest-last.json\`（金額 redacted）`
  };
}
