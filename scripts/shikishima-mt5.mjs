/**
 * Shikishima MT5 Data Integration — Lv6-C (完全版)
 * MT5 EA が書き出すJSONを読み込んでパフォーマンス監視
 *
 * データフロー:
 *   MT5 EA (ShikishimaDataExport.mq5) → MQL5\Files\shikishima_mt5.json
 *   → このモジュールが読み込み → 週次レポート / DD監視 / Discord通知
 *
 * MT5パス (デフォルト): C:\Users\{user}\AppData\Roaming\MetaQuotes\Terminal\{ID}\MQL5\Files\
 *   → .env.local の MT5_DATA_PATH で上書き可能
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, watchFile, readdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const MEM_DIR   = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".shikishima-memory");
const PERF_FILE = join(MEM_DIR, "mt5_performance.json");

// MT5データファイルパスを解決 (自動スキャン付き)
function getMt5DataPath() {
  // 1. .env.localで明示指定されていればそれを使う
  try {
    const envPath = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".env.local");
    if (existsSync(envPath)) {
      const line = readFileSync(envPath, "utf-8").split("\n").find(l => l.startsWith("MT5_DATA_PATH="));
      if (line) {
        const p = line.split("=").slice(1).join("=").trim();
        if (p && existsSync(p)) return p;
      }
    }
  } catch { /* ignore */ }

  // 2. MetaQuotes Terminal IDを全スキャン
  const mqBase = join(homedir(), "AppData", "Roaming", "MetaQuotes", "Terminal");
  const candidates = [
    // Common Files (全Terminal共有)
    join(mqBase, "Common", "Files", "shikishima_mt5.json"),
  ];

  // 各Terminal IDフォルダをスキャン
  try {
    if (existsSync(mqBase)) {
      for (const id of readdirSync(mqBase)) {
        if (id === "Common") continue;
        const p = join(mqBase, id, "MQL5", "Files", "shikishima_mt5.json");
        candidates.push(p);
      }
    }
  } catch { /* ignore */ }

  // 存在するファイルの中から最初に見つかったものを返す
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }

  // 3. フォールバック
  return join(mqBase, "Common", "Files", "shikishima_mt5.json");
}

// スキャンして見つかったパスを返す (診断用)
export function scanMt5DataPath() {
  const mqBase = join(homedir(), "AppData", "Roaming", "MetaQuotes", "Terminal");
  const found = [];
  const candidates = [join(mqBase, "Common", "Files", "shikishima_mt5.json")];
  try {
    if (existsSync(mqBase)) {
      for (const id of readdirSync(mqBase)) {
        if (id === "Common") continue;
        candidates.push(join(mqBase, id, "MQL5", "Files", "shikishima_mt5.json"));
        // MT5のインストール確認用
        const mtExe = join(mqBase, id, "terminal64.exe");
        if (existsSync(mtExe)) {
          found.push({ type: "terminal", id, path: join(mqBase, id) });
        }
      }
    }
  } catch { /* ignore */ }
  const dataFiles = candidates.filter(existsSync);
  return { terminals: found, dataFiles, mqBase };
}

// ─── MT5データ読み込み ────────────────────────────────────────────────────────

/**
 * MT5が書き出すJSONのスキーマ:
 * {
 *   updatedAt: "2026-05-22 15:30:00",
 *   account: { balance, equity, margin, freeMargin, profit, currency },
 *   positions: [{ ticket, symbol, type, lots, openPrice, currentPrice, profit, swap, commission }],
 *   history: [{ ticket, symbol, type, lots, openTime, closeTime, openPrice, closePrice, profit }],
 *   summary: { todayProfit, weekProfit, drawdownPct, winRate, totalTrades }
 * }
 */
export function readMt5Data() {
  const path = getMt5DataPath();
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

// ─── パフォーマンス履歴管理 ───────────────────────────────────────────────────

function loadPerfHistory() {
  try {
    if (!existsSync(PERF_FILE)) return [];
    return JSON.parse(readFileSync(PERF_FILE, "utf-8"));
  } catch { return []; }
}

function savePerfHistory(history) {
  if (!existsSync(MEM_DIR)) mkdirSync(MEM_DIR, { recursive: true });
  writeFileSync(PERF_FILE, JSON.stringify(history, null, 2), "utf-8");
}

export function recordDailySnapshot(data) {
  if (!data) return;
  const history = loadPerfHistory();
  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const existing = history.findIndex(h => h.date === today);
  const snapshot = {
    date:         today,
    balance:      data.account?.balance  ?? 0,
    equity:       data.account?.equity   ?? 0,
    profit:       data.account?.profit   ?? 0,
    drawdownPct:  data.summary?.drawdownPct ?? 0,
    todayProfit:  data.summary?.todayProfit ?? 0,
    weekProfit:   data.summary?.weekProfit  ?? 0,
    winRate:      data.summary?.winRate     ?? 0,
    totalTrades:  data.summary?.totalTrades ?? 0,
  };

  if (existing >= 0) history[existing] = snapshot;
  else history.unshift(snapshot);
  if (history.length > 90) history.pop();
  savePerfHistory(history);
  return snapshot;
}

// ─── DD監視 ───────────────────────────────────────────────────────────────────

const DD_WARN_THRESHOLD = 2.0;  // 2%でアラート
const DD_STOP_THRESHOLD = 2.8;  // 2.8%で強いアラート

export function checkDrawdown(data) {
  if (!data?.summary) return null;
  // equity > balance の場合は含み益なのでDDは0扱い
  const raw = data.summary.drawdownPct ?? 0;
  const dd = Math.max(0, raw);
  if (dd >= DD_STOP_THRESHOLD) return { level: "critical", dd };
  if (dd >= DD_WARN_THRESHOLD) return { level: "warning",  dd };
  return { level: "ok", dd };
}

// ─── レポート生成 ─────────────────────────────────────────────────────────────

export function buildAccountSummary(data) {
  if (!data) return "MT5データが取得できません。EAが動作中か確認してください。";
  const acc = data.account ?? {};
  const sum = data.summary ?? {};
  const pos = data.positions ?? [];

  const currency = acc.currency ?? "USD";
  const balance  = acc.balance ?? 0;
  const equity   = acc.equity  ?? 0;
  const rawDD    = sum.drawdownPct ?? 0;
  const ddPct    = Math.max(0, rawDD);
  const ddLabel  = ddPct > 0 ? `${ddPct.toFixed(2)}%` : `0% (含み益 +${(equity - balance).toFixed(0)}${currency})`;

  const lines = [
    `**MT5 口座サマリー** (${data.updatedAt ?? "不明"})`,
    ``,
    `💰 残高: ${balance.toFixed(0)} ${currency} | 評価額: ${equity.toFixed(0)} ${currency}`,
    `📊 本日損益: ${(sum.todayProfit ?? 0).toFixed(0)} ${currency} | 今週: ${(sum.weekProfit ?? 0).toFixed(0)} ${currency}`,
    `📉 DD: ${ddLabel} | 勝率: ${((sum.winRate ?? 0) * 100).toFixed(1)}%`,
    `🔄 総取引数: ${sum.totalTrades ?? 0}回`,
  ];

  if (pos.length > 0) {
    lines.push(``, `**オープンポジション (${pos.length}件)**`);
    for (const p of pos.slice(0, 5)) {
      const side  = p.type === 0 ? "BUY" : "SELL";
      const color = p.profit >= 0 ? "+" : "";
      lines.push(`  ${side} ${p.symbol} ${p.lots}lot  ${color}$${(p.profit ?? 0).toFixed(2)}`);
    }
  }
  return lines.join("\n");
}

export function buildWeeklyPerformanceReport() {
  const history = loadPerfHistory();
  if (history.length < 2) {
    return "データが不足しています（2日以上の記録が必要です）。";
  }

  const latest  = history[0];
  const weekAgo = history.find(h => {
    const d = new Date(latest.date);
    d.setDate(d.getDate() - 7);
    return h.date <= d.toISOString().slice(0, 10);
  }) ?? history[history.length - 1];

  const weekProfit = latest.balance - weekAgo.balance;
  const avgDD      = history.slice(0, 7).reduce((s, h) => s + h.drawdownPct, 0) / Math.min(7, history.length);
  const maxDD      = Math.max(...history.slice(0, 7).map(h => h.drawdownPct));

  return [
    `**週次パフォーマンスレポート**`,
    `期間: ${weekAgo.date} → ${latest.date}`,
    ``,
    `💰 週間損益: ${weekProfit >= 0 ? "+" : ""}$${weekProfit.toFixed(2)}`,
    `📊 現在残高: $${latest.balance.toFixed(2)}`,
    `📉 平均DD: ${avgDD.toFixed(2)}% / 最大DD: ${maxDD.toFixed(2)}%`,
    `🏆 勝率: ${(latest.winRate * 100).toFixed(1)}% (${latest.totalTrades}取引)`,
    ``,
    `ATFunded目標: $9,000 (6%) → 進捗 ${((latest.balance - 150000) / 9000 * 100).toFixed(1)}%`,
  ].join("\n");
}

// ─── MT5コンテキスト (プロンプト注入用) ─────────────────────────────────────

export function buildMt5Context() {
  const data = readMt5Data();
  if (!data) return "";
  const acc = data.account ?? {};
  const sum = data.summary ?? {};
  return [
    `[MT5状態]`,
    `  残高: $${(acc.balance ?? 0).toFixed(0)} | DD: ${(sum.drawdownPct ?? 0).toFixed(2)}%`,
    `  本日損益: $${(sum.todayProfit ?? 0).toFixed(2)} | ポジ: ${(data.positions ?? []).length}件`,
  ].join("\n");
}

// ─── ファイル監視 + 自動チェック ─────────────────────────────────────────────

let _prevDdLevel = "ok";

/**
 * MT5データの変更を監視し、DD異常時にコールバック
 * @param {function} onDdAlert - ({ level, dd }) => void
 * @param {function} onDataUpdate - (data) => void
 */
export function startMt5Watcher(onDdAlert, onDataUpdate) {
  const path = getMt5DataPath();

  if (!existsSync(path)) {
    console.warn(`[MT5] データファイルが見つかりません: ${path}`);
    console.warn(`[MT5] MT5でShikishimaDataExport EAを起動してください`);
    // ファイルが現れるまで30秒ごとにリトライ
    const checkTimer = setInterval(() => {
      if (existsSync(path)) {
        clearInterval(checkTimer);
        startMt5Watcher(onDdAlert, onDataUpdate);
      }
    }, 30_000);
    return;
  }

  // ファイル変更を監視 (MT5は1分ごとに更新)
  watchFile(path, { interval: 5_000 }, () => {
    const data = readMt5Data();
    if (!data) return;

    recordDailySnapshot(data);
    if (onDataUpdate) onDataUpdate(data);

    const ddCheck = checkDrawdown(data);
    if (ddCheck && ddCheck.level !== "ok" && ddCheck.level !== _prevDdLevel) {
      _prevDdLevel = ddCheck.level;
      if (onDdAlert) onDdAlert(ddCheck);
    } else if (ddCheck?.level === "ok") {
      _prevDdLevel = "ok";
    }
  });

  // 日次スナップショット (起動時に1回)
  const data = readMt5Data();
  if (data) recordDailySnapshot(data);

  console.log(`[MT5] ファイル監視開始: ${path}`);
}

// ─── I-6: ATFundedチャレンジ進捗の自動計算 ───────────────────────────────────

// ATFunded口座の設定 (150K×2口座、目標6%=9000ドル)
const ATFUNDED_CONFIG = {
  accountSizeUSD: 150_000,
  targetPct:      6,          // 6% = $9,000
  maxDDPct:       3,          // 3% = $4,500 トレーリングDD
  currency:       "USD",
};

export function calcChallengeProgress(data) {
  if (!data) return null;
  const acc = data.account ?? {};
  const balance = acc.balance ?? 0;
  const equity  = acc.equity  ?? 0;
  const cur     = acc.currency ?? "USD";

  // USD換算 (JPYの場合は概算レート150円)
  const rate = cur === "JPY" ? 1 / 150 : 1;
  const balanceUSD = balance * rate;
  const equityUSD  = equity  * rate;

  const targetGainUSD = ATFUNDED_CONFIG.accountSizeUSD * (ATFUNDED_CONFIG.targetPct / 100);
  const gainUSD       = balanceUSD - ATFUNDED_CONFIG.accountSizeUSD;
  const progressPct   = Math.max(0, (gainUSD / targetGainUSD) * 100);
  const ddPct         = Math.max(0, (ATFUNDED_CONFIG.accountSizeUSD - equityUSD) / ATFUNDED_CONFIG.accountSizeUSD * 100);
  const ddRemainPct   = Math.max(0, ATFUNDED_CONFIG.maxDDPct - ddPct);

  return {
    balanceUSD:     Math.round(balanceUSD),
    gainUSD:        Math.round(gainUSD),
    targetGainUSD,
    progressPct:    Math.min(100, progressPct),
    ddPct,
    ddRemainPct,
    passed:         progressPct >= 100 && ddPct < ATFUNDED_CONFIG.maxDDPct,
  };
}

export function buildChallengeReport(data) {
  const p = calcChallengeProgress(data);
  if (!p) return "ATFundedデータが取得できません。";

  const bar = "█".repeat(Math.floor(p.progressPct / 10)) + "░".repeat(10 - Math.floor(p.progressPct / 10));
  const ddBar = "█".repeat(Math.floor(p.ddPct / 0.3)) + "░".repeat(10 - Math.min(10, Math.floor(p.ddPct / 0.3)));

  return [
    `**ATFunded チャレンジ進捗**`,
    ``,
    `💰 利益進捗: [${bar}] ${p.progressPct.toFixed(1)}%`,
    `  目標: +$${p.targetGainUSD.toLocaleString()} → 現在: ${p.gainUSD >= 0 ? "+" : ""}$${p.gainUSD.toLocaleString()}`,
    `📉 DD使用: [${ddBar}] ${p.ddPct.toFixed(2)}% / 残り ${p.ddRemainPct.toFixed(2)}%`,
    ``,
    p.passed ? `🎉 **チャレンジ合格条件達成！**` : `⏳ 目標まで $${Math.max(0, p.targetGainUSD - p.gainUSD).toLocaleString()} 残り`,
  ].join("\n");
}

// ─── I-7: 複数MT5口座 合算レポート ───────────────────────────────────────────

// 全TerminalのJSONを読み込む
export function readAllMt5Data() {
  const mqBase = join(homedir(), "AppData", "Roaming", "MetaQuotes", "Terminal");
  const results = [];
  try {
    for (const id of readdirSync(mqBase)) {
      if (id === "Common" || id === "Community" || id === "Help") continue;
      const paths = [
        join(mqBase, id, "MQL5", "Files", "shikishima_mt5.json"),
        join(mqBase, "Common", "Files", "shikishima_mt5.json"),
      ];
      for (const p of paths) {
        if (existsSync(p)) {
          try {
            const d = JSON.parse(readFileSync(p, "utf-8"));
            // 重複チェック (同じupdatedAtは除外)
            if (!results.find(r => r.updatedAt === d.updatedAt)) {
              results.push({ ...d, _terminalId: id.slice(0, 12) });
            }
          } catch { /* ignore */ }
          break;
        }
      }
    }
  } catch { /* ignore */ }
  return results;
}

export function buildAllAccountsSummary() {
  const allData = readAllMt5Data();
  if (allData.length === 0) return "MT5データが見つかりません。EAを起動してください。";

  const lines = [`**MT5 全口座サマリー** (${allData.length}口座)`, ``];
  let totalProfitJPY = 0;

  for (const data of allData) {
    const acc = data.account ?? {};
    const sum = data.summary ?? {};
    const cur = acc.currency ?? "USD";
    const dd  = Math.max(0, sum.drawdownPct ?? 0);
    const ddIcon = dd >= 2 ? "🔴" : dd >= 1 ? "🟡" : "🟢";
    lines.push(`**${data._terminalId}** (${cur}) — ${data.updatedAt ?? "不明"}`);
    lines.push(`  ${ddIcon} 残高: ${(acc.balance ?? 0).toFixed(0)} | DD: ${dd.toFixed(2)}% | 損益: ${(acc.profit ?? 0).toFixed(0)}`);
    if ((data.positions ?? []).length > 0) {
      lines.push(`  ポジション: ${data.positions.map(p => `${p.symbol}×${p.lots}`).join(", ")}`);
    }
    lines.push(``);
  }

  return lines.join("\n").slice(0, 1800);
}
