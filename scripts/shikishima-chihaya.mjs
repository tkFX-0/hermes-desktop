/**
 * @deprecated 2026-05-30 — ちはやエージェント廃止。SideBot は import しない。
 * EA/MT5 → つむぎ、相場調査 → しるべ、管制 → しきしま（AT-AGENT-00 正規5体）。
 * ファイルは参照用に残置。
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import {
  isChihayaHeld as isChihayaHeldFromStore,
  setChihayaHold as setChihayaHoldInStore,
  shouldSendKillZoneAlerts,
} from "./lib/fx-notifications.mjs";
import { isChihayaDirectedMessage } from "./lib/discord-inbound-filter.mjs";

// ─── メモリディレクトリ（bot起動時に setChihayaMemoryDir で上書き可） ───────

let _memoryDir = join(
  homedir(),
  "Desktop",
  "プロジェクトファイル",
  "hermes-desktop",
  ".shikishima-memory",
);

export function setChihayaMemoryDir(dir) {
  _memoryDir = dir;
}

function memoryDir() {
  return _memoryDir;
}

function isChihayaHeld() {
  return isChihayaHeldFromStore(memoryDir());
}

// ─── 設定 ──────────────────────────────────────────────────────────────────────

const MT5_JSON = join(
  homedir(),
  "AppData",
  "Roaming",
  "MetaQuotes",
  "Terminal",
  "17B1E2CE53EB7DD538974AA7E52030B3",
  "MQL5",
  "Files",
  "shikishima_mt5.json",
);

const TRADE = { accountSize: 100_000, maxDD: 0.05 }; // 運用口座設定

// ─── キルゾーン定義 (JST) ──────────────────────────────────────────────────────

const KILL_ZONES = [
  { name: "London Kill Zone", startH: 16, startM: 0, endH: 18, endM: 0, desc: "ロンドン開場" },
  { name: "NY Kill Zone", startH: 22, startM: 0, endH: 0, endM: 30, desc: "NY開場" },
  {
    name: "Silver Bullet (AM)",
    startH: 12,
    startM: 0,
    endH: 13,
    endM: 0,
    desc: "SB午前セッション",
  },
  {
    name: "Silver Bullet (PM)",
    startH: 19,
    startM: 0,
    endH: 20,
    endM: 0,
    desc: "SB午後セッション",
  },
];

// ─── ユーティリティ ────────────────────────────────────────────────────────────

function readMt5() {
  try {
    if (!existsSync(MT5_JSON)) return null;
    return JSON.parse(readFileSync(MT5_JSON, "utf-8"));
  } catch {
    return null;
  }
}

function jstNow() {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return { h: d.getUTCHours(), m: d.getUTCMinutes(), str: d.toISOString().slice(11, 16) };
}

function minsUntil(h, m, nowH, nowM) {
  const diff = h * 60 + m - (nowH * 60 + nowM);
  return diff < 0 ? diff + 1440 : diff;
}

function isInZone(kz, nowH, nowM) {
  const s = kz.startH * 60 + kz.startM;
  const e = kz.endH * 60 + kz.endM;
  const n = nowH * 60 + nowM;
  return e > s ? n >= s && n < e : n >= s || n < e;
}

// ─── スキル実装 ────────────────────────────────────────────────────────────────

export function chihayaKillZone() {
  const { h, m, str } = jstNow();
  const active = KILL_ZONES.filter((z) => isInZone(z, h, m));
  const soon = KILL_ZONES.filter(
    (z) => !isInZone(z, h, m) && minsUntil(z.startH, z.startM, h, m) <= 30,
  );
  const lines = [`📈 **ちはや** — キルゾーン確認 JST ${str}`, ""];

  if (active.length) {
    lines.push("🔴 **進行中:**");
    for (const z of active) {
      const end = minsUntil(z.endH, z.endM, h, m);
      lines.push(`  ${z.name} — ${z.desc} (あと${end}分)`);
    }
    lines.push("");
  }
  if (soon.length) {
    lines.push("🟡 **まもなく:**");
    for (const z of soon) lines.push(`  ${z.name} — ${minsUntil(z.startH, z.startM, h, m)}分後`);
    lines.push("");
  }
  if (!active.length && !soon.length) {
    const next = [...KILL_ZONES]
      .map((z) => ({ ...z, mins: minsUntil(z.startH, z.startM, h, m) }))
      .sort((a, b) => a.mins - b.mins)[0];
    lines.push(`⚪ 次回: ${next.name} — ${Math.floor(next.mins / 60)}h${next.mins % 60}m後`);
  }
  return lines.join("\n");
}

export function chihayaEaReport() {
  const data = readMt5();
  if (!data) {
    return "📈 **ちはや** — MT5データ未取得。MT5を起動してEAが稼働しているか確認してください。";
  }

  const balance = data.balance ?? 0;
  const equity = data.equity ?? 0;
  const profit = data.profit ?? 0;
  const ddPct = balance > 0 ? ((balance - equity) / balance) * 100 : 0;

  return [
    `📈 **ちはや** — EA報告`,
    ``,
    `残高: $${balance.toLocaleString()} | 証拠金: $${equity.toLocaleString()}`,
    `DD: ${ddPct.toFixed(2)}% / 上限目安${TRADE.maxDD * 100}%`,
    `本日PL: $${profit.toLocaleString()}`,
    ddPct >= TRADE.maxDD * 100 * 0.8 ? `⚠️ DD上限目安の80%超 — 要注意` : `✓ DD許容範囲内`,
  ].join("\n");
}

export function chihayaRiskCalc(lot, slPips, pair = "XAUUSD") {
  const pipValue = lot * 10; // XAUUSD 1lot = $10/pip
  const riskUSD = pipValue * slPips;
  const riskPct = (riskUSD / TRADE.accountSize) * 100;
  const safeMax = (TRADE.accountSize * 0.01) / (slPips * 10);

  return [
    `📈 **ちはや** — リスク計算 ${pair} ${lot}lot / SL ${slPips}pips`,
    ``,
    `リスク: $${riskUSD.toLocaleString()} (${riskPct.toFixed(2)}%)`,
    riskPct > 2
      ? `⚠️ リスク2%超 — 推奨: ${safeMax.toFixed(2)}lot以下`
      : `✓ リスク許容範囲内`,
  ].join("\n");
}

// ─── キルゾーン定期アラート (bot から setInterval で呼ぶ) ─────────────────────

let _kzAlerted = new Set();

export function clearKillZoneAlertState() {
  _kzAlerted = new Set();
}

export function checkKillZoneAlert(sendFn) {
  if (!shouldSendKillZoneAlerts(memoryDir())) return;
  const { h, m } = jstNow();
  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  for (const kz of KILL_ZONES) {
    const minsLeft = minsUntil(kz.startH, kz.startM, h, m);
    const key = `${kz.name}-${today}`;
    if (minsLeft <= 15 && minsLeft > 0 && !_kzAlerted.has(key)) {
      _kzAlerted.add(key);
      sendFn(`📈 **ちはや** — ⏰ キルゾーン ${minsLeft}分前: **${kz.name}** (${kz.desc})`);
    }
  }
}

// ─── HOLD制御 (外部から呼び出し可能) ──────────────────────────────────────────

export function setChihayaHold(hold) {
  setChihayaHoldInStore(memoryDir(), hold);
  if (hold) clearKillZoneAlertState();
}

// ─── コマンドパーサー ──────────────────────────────────────────────────────────

const LOT_RE = /(\d+\.?\d*)\s*lot/i;
const SL_RE = /SL[\s:]*(\d+)/i;
const PAIR_RE = /(XAUUSD|EURUSD|GBPUSD|USDJPY|AUDUSD)/i;

export function chihayaHandleCommand(content) {
  if (isChihayaHeld()) {
    if (!isChihayaDirectedMessage(content)) return null;
    return "📈 **ちはや** — 現在HOLD中です。再開: `!chihaya-start` または「ちはや再開」";
  }
  const c = content.toLowerCase();
  if (/^!?killzone|キルゾーン/.test(c)) return chihayaKillZone();
  if (/^!?ea|ea報告|ea状況/.test(c)) return chihayaEaReport();
  if (/^!?risk|リスク計算|何ロット/.test(c)) {
    const lot = parseFloat(LOT_RE.exec(content)?.[1] ?? "1.0");
    const sl = parseInt(SL_RE.exec(content)?.[1] ?? "20", 10);
    const pair = PAIR_RE.exec(content)?.[1] ?? "XAUUSD";
    return chihayaRiskCalc(lot, sl, pair);
  }
  return null;
}
