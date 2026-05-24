/**
 * ちはや SKILLS — FX専任エージェント
 * SK-CHI-01: market_analysis / SK-CHI-02: ea_report
 * SK-CHI-03: prop_status / SK-CHI-04: risk_calc / SK-CHI-05: kill_zone_alert
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { SkillInput, SkillOutput, AgentContext } from "./skill-types";
import { claudeCodeTask } from "../claude-code-service";
import { runHermesResearch } from "../hermes-research-runner";

// MT5 JSON ファイルパス
const MT5_JSON = join(
  homedir(),
  "AppData", "Roaming", "MetaQuotes", "Terminal",
  "17B1E2CE53EB7DD538974AA7E52030B3",
  "MQL5", "Files", "shikishima_mt5.json"
);

// トレード設定
const TRADE_CONFIG = {
  accountSize: 100_000,  // 運用口座サイズ (変更可)
  maxDD:       0.05,     // DD上限目安 5%
};

// ─── 共通ユーティリティ ───────────────────────────────────────────────────────

function readMt5Data(): Record<string, unknown> | null {
  try {
    if (!existsSync(MT5_JSON)) return null;
    const raw = readFileSync(MT5_JSON, "utf-8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch { return null; }
}

function jstHour(): number {
  return new Date(Date.now() + 9 * 3600 * 1000).getUTCHours();
}
function jstMinute(): number {
  return new Date(Date.now() + 9 * 3600 * 1000).getUTCMinutes();
}

// ─── SK-CHI-01: market_analysis ──────────────────────────────────────────────

export async function skillMarketAnalysis(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const pair = (input.params?.pair as string) ?? "XAUUSD";
  const tf   = (input.params?.timeframe as string) ?? "H1";

  // Hermes Research でライブ情報取得
  const research = await runHermesResearch(
    `FX分析: ${pair} ${tf}足 現在の状況を以下の観点で分析してください:\n` +
    `1. 現在のトレンド方向\n2. 主要支持線・抵抗線\n3. 注目ファンダメンタル\n4. トレード機会\n5. リスク要因`
  );

  if (research.success && research.content) {
    return {
      success: true,
      result: `[market_analysis] ${pair} ${tf}\n\n${research.content}`,
      data: { pair, tf },
      durationMs: Date.now() - start,
    };
  }

  // Hermes 失敗時は Claude にフォールバック
  const claude = await claudeCodeTask(
    `${pair} ${tf}足の一般的なテクニカル分析ポイントと現在見るべきレベルを説明してください。`,
    "claude-sonnet-4-6"
  );
  return {
    success: claude.success,
    result: `[market_analysis] ${pair} ${tf}\n\n${claude.output}`,
    durationMs: Date.now() - start,
  };
}

// ─── SK-CHI-02: ea_report ─────────────────────────────────────────────────────

export async function skillEaReport(_input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const data = readMt5Data();

  if (!data) {
    return {
      success: false,
      result: "[ea_report] MT5データファイルが見つかりません。MT5が起動してEAが稼働しているか確認してください。",
      durationMs: Date.now() - start,
    };
  }

  const balance   = (data["balance"]   as number | undefined) ?? 0;
  const equity    = (data["equity"]    as number | undefined) ?? 0;
  const drawdown  = (data["drawdown"]  as number | undefined) ?? 0;
  const profit    = (data["profit"]    as number | undefined) ?? 0;
  const positions = (data["positions"] as unknown[] | undefined) ?? [];
  const eaName    = (data["ea_name"]   as string | undefined) ?? "不明";

  const ddPct  = balance > 0 ? ((balance - equity) / balance * 100) : 0;

  const lines = [
    `[ea_report] EA: ${eaName}`,
    ``,
    `残高:      $${balance.toLocaleString()}`,
    `証拠金:    $${equity.toLocaleString()}`,
    `DD:        ${ddPct.toFixed(2)}% ($${(balance - equity).toLocaleString()}) / 目安上限: ${TRADE_CONFIG.maxDD * 100}%`,
    `本日PL:    $${profit.toLocaleString()}`,
    `オープン:  ${positions.length}ポジション`,
    ``,
    ddPct >= TRADE_CONFIG.maxDD * 100 * 0.8
      ? `⚠️ DDが上限目安の80%を超えています！要注意`
      : `✓ DD水準は許容範囲内`,
  ];

  return {
    success: true,
    result: lines.join("\n"),
    data: { balance, equity, drawdown, profit, positions: positions.length, ddPct },
    durationMs: Date.now() - start,
  };
}

// ─── SK-CHI-04: risk_calc ─────────────────────────────────────────────────────

export async function skillRiskCalc(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const lot    = Number(input.params?.lot    ?? input.raw.match(/(\d+\.?\d*)\s*lot/i)?.[1] ?? 1.0);
  const slPips = Number(input.params?.sl_pips ?? input.raw.match(/SL\s*(\d+)/i)?.[1] ?? 20);
  const pair   = (input.params?.pair as string) ?? "XAUUSD";

  // XAUUSD: 1pip = $0.1 per 0.01lot → 1lot = $10/pip
  const pipValue = pair === "XAUUSD" ? lot * 10 : lot * 10;
  const riskUSD  = pipValue * slPips;
  const riskPct  = riskUSD / TRADE_CONFIG.accountSize * 100;

  const lines = [
    `[risk_calc] ${pair} ${lot}lot / SL ${slPips}pips`,
    ``,
    `リスク金額: $${riskUSD.toLocaleString()} (${riskPct.toFixed(2)}%)`,
    `口座サイズ: $${TRADE_CONFIG.accountSize.toLocaleString()}`,
    ``,
    riskPct > 2
      ? `⚠️ リスク2%超 — 推奨: ${(TRADE_CONFIG.accountSize * 0.01 / (slPips * 10)).toFixed(2)}lot以下`
      : `✓ リスク許容範囲内`,
  ];

  return {
    success: true,
    result: lines.join("\n"),
    data: { lot, slPips, riskUSD, riskPct, pair },
    durationMs: Date.now() - start,
  };
}

// ─── SK-CHI-05: kill_zone_alert ──────────────────────────────────────────────

interface KillZone {
  name: string;
  startH: number; startM: number;
  endH: number;   endM: number;
  description: string;
}

const KILL_ZONES: KillZone[] = [
  { name: "London Kill Zone",    startH: 16, startM: 0,  endH: 18, endM: 0,  description: "ロンドン開場 — 流動性急増" },
  { name: "NY Kill Zone (AM)",   startH: 22, startM: 0,  endH: 0,  endM: 30, description: "NY開場 — 大口参入タイミング" },
  { name: "Silver Bullet (AM)",  startH: 12, startM: 0,  endH: 13, endM: 0,  description: "シルバーバレット午前" },
  { name: "Silver Bullet (PM)",  startH: 19, startM: 0,  endH: 20, endM: 0,  description: "シルバーバレット午後" },
];

function minutesUntil(h: number, m: number, nowH: number, nowM: number): number {
  const target = h * 60 + m;
  const now    = nowH * 60 + nowM;
  const diff   = target - now;
  return diff < 0 ? diff + 24 * 60 : diff;
}

export async function skillKillZoneAlert(_input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const nowH = jstHour();
  const nowM = jstMinute();

  const statuses = KILL_ZONES.map((kz) => {
    const minsToStart = minutesUntil(kz.startH, kz.startM, nowH, nowM);
    const minsToEnd   = minutesUntil(kz.endH,   kz.endM,   nowH, nowM);

    // 現在進行中かチェック（跨ぎ対応）
    const startTotal = kz.startH * 60 + kz.startM;
    const endTotal   = kz.endH   * 60 + kz.endM;
    const nowTotal   = nowH      * 60 + nowM;
    const isActive   = endTotal > startTotal
      ? nowTotal >= startTotal && nowTotal < endTotal
      : nowTotal >= startTotal || nowTotal < endTotal;

    return { ...kz, minsToStart, minsToEnd, isActive };
  });

  const active  = statuses.filter((s) => s.isActive);
  const soon    = statuses.filter((s) => !s.isActive && s.minsToStart <= 30);
  const upcoming = statuses
    .filter((s) => !s.isActive && s.minsToStart > 30)
    .sort((a, b) => a.minsToStart - b.minsToStart)
    .slice(0, 2);

  const lines = [
    `[kill_zone_alert] JST ${String(nowH).padStart(2,"0")}:${String(nowM).padStart(2,"0")}`,
    ``,
  ];

  if (active.length > 0) {
    lines.push(`🔴 進行中:`);
    for (const kz of active) lines.push(`  ${kz.name} — ${kz.description} (あと${kz.minsToEnd}分)`);
    lines.push(``);
  }
  if (soon.length > 0) {
    lines.push(`🟡 まもなく:`);
    for (const kz of soon) lines.push(`  ${kz.name} — ${kz.minsToStart}分後 ${kz.description}`);
    lines.push(``);
  }
  if (upcoming.length > 0) {
    lines.push(`⚪ 次回:`);
    for (const kz of upcoming) lines.push(`  ${kz.name} — ${Math.floor(kz.minsToStart / 60)}h${kz.minsToStart % 60}m後`);
  }

  return {
    success: true,
    result: lines.join("\n"),
    data: { active: active.length, soon: soon.length, statuses },
    durationMs: Date.now() - start,
  };
}
