/**
 * Shikishima Memory Module — Lv4
 * 長期記憶・ユーザープロファイル・重要イベント・引き継ぎノート
 * JSON ファイルベース (Electron不要・standalone bot対応)
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const MEM_DIR = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".shikishima-memory");

function ensureDir() {
  if (!existsSync(MEM_DIR)) mkdirSync(MEM_DIR, { recursive: true });
}

function readJson(file, defaultVal) {
  try {
    const p = join(MEM_DIR, file);
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : defaultVal;
  } catch { return defaultVal; }
}

function writeJson(file, data) {
  ensureDir();
  try { writeFileSync(join(MEM_DIR, file), JSON.stringify(data, null, 2), "utf-8"); }
  catch { /* ignore */ }
}

// ─── 長期記憶 (long-term.json) ────────────────────────────────────────────────

const DEFAULT_LONG_TERM = {
  updatedAt: "2026-05-23",
  facts: [
    { category: "preference", key: "response_style", value: "簡潔・日本語・要点先出し" },
  ],
  events: [],
};

export function loadLongTermMemory() {
  return readJson("long-term.json", DEFAULT_LONG_TERM);
}

export function saveLongTermMemory(mem) {
  mem.updatedAt = new Date().toISOString().slice(0, 10);
  writeJson("long-term.json", mem);
}

export function addFact(category, key, value) {
  const mem = loadLongTermMemory();
  const idx = mem.facts.findIndex(f => f.key === key && f.category === category);
  const fact = { category, key, value, updatedAt: new Date().toISOString().slice(0, 10) };
  if (idx >= 0) mem.facts[idx] = fact;
  else mem.facts.push(fact);
  saveLongTermMemory(mem);
}

export function addEvent(label, detail) {
  const mem = loadLongTermMemory();
  mem.events.unshift({
    date: new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }),
    label,
    detail,
  });
  if (mem.events.length > 50) mem.events = mem.events.slice(0, 50);
  saveLongTermMemory(mem);
  console.log(`[Memory] 重要イベント記録: ${label}`);
}

// 記憶をプロンプト用文字列に変換 (300字以内)
export function buildLongTermContext() {
  const mem = loadLongTermMemory();
  const lines = ["[長期記憶]"];

  for (const f of mem.facts.slice(0, 6)) {
    lines.push(`  ${f.key}: ${f.value}`);
  }

  // 最近の重要イベント (最大3件)
  if (mem.events.length > 0) {
    lines.push("[最近の出来事]");
    for (const e of mem.events.slice(0, 3)) {
      lines.push(`  ${e.date}: ${e.label}`);
    }
  }
  return lines.join("\n").slice(0, 350);
}

// ─── ユーザープロファイル (profile.json) ──────────────────────────────────────

const DEFAULT_PROFILE = {
  updatedAt: "2026-05-22",
  activeHours: {},       // { "8": 3, "22": 5, ... } 時間帯ごとの発言数
  avgMessageLen: 0,
  totalMessages: 0,
  topKeywords: {},       // { "FX": 12, "EA": 8, ... }
  prefersConcise: true,  // 簡潔な返答を好むか (メッセージ長から推定)
};

export function loadProfile() {
  return readJson("profile.json", DEFAULT_PROFILE);
}

export function updateProfile(userMessage) {
  const profile = loadProfile();
  const hourJST = String(new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCHours());

  // 活動時間帯
  profile.activeHours[hourJST] = (profile.activeHours[hourJST] ?? 0) + 1;

  // 平均メッセージ長
  profile.totalMessages++;
  profile.avgMessageLen = Math.round(
    (profile.avgMessageLen * (profile.totalMessages - 1) + userMessage.length) / profile.totalMessages
  );

  // 簡潔派判定 (平均30字以下 = 簡潔派)
  profile.prefersConcise = profile.avgMessageLen < 40;

  // キーワード追跡
  const keywords = ["FX", "EA", "XAUUSD", "gold", "ATFunded", "ロット", "DD", "チャレンジ", "StackChan", "しきしま"];
  for (const kw of keywords) {
    if (userMessage.includes(kw)) {
      profile.topKeywords[kw] = (profile.topKeywords[kw] ?? 0) + 1;
    }
  }
  profile.updatedAt = new Date().toISOString().slice(0, 10);
  writeJson("profile.json", profile);
}

export function buildProfileContext() {
  const p = loadProfile();
  if (p.totalMessages < 3) return ""; // データ不足時はスキップ
  const style = p.prefersConcise ? "簡潔な返答を好む (短い質問が多い)" : "詳しい説明を好む";
  const topHour = Object.entries(p.activeHours).sort((a,b) => b[1]-a[1])[0];
  const topKw = Object.entries(p.topKeywords).sort((a,b) => b[1]-a[1]).slice(0,3).map(e=>e[0]).join("・");
  return [
    `[ユーザープロファイル]`,
    `  返答スタイル: ${style}`,
    topHour ? `  よく話す時間: ${topHour[0]}時台` : "",
    topKw ? `  関心キーワード: ${topKw}` : "",
  ].filter(Boolean).join("\n");
}

// ─── 重要イベント自動検出 (Lv4-C) ────────────────────────────────────────────

const EVENT_TRIGGERS = [
  { pattern: /合格|パスした|クリアした|通った/,   label: "ATFundedチャレンジ関連" },
  { pattern: /失敗|リセット|負けた|DDに引っかかった/, label: "チャレンジ結果" },
  { pattern: /設定(を|した|変えた)|パラメータ/,   label: "EA設定変更" },
  { pattern: /出金した|出金|入金/,              label: "資金移動" },
  { pattern: /決めた|決定した|方針/,            label: "重要な決定" },
  { pattern: /達成した|目標|$[0-9]/,           label: "目標・達成" },
];

export function detectAndSaveEvent(userMessage) {
  for (const trigger of EVENT_TRIGGERS) {
    if (trigger.pattern.test(userMessage)) {
      addEvent(trigger.label, userMessage.slice(0, 80));
      return trigger.label;
    }
  }
  return null;
}

// ─── 引き継ぎノート (handoff.json) ────────────────────────────────────────────

export function loadHandoff() {
  return readJson("handoff.json", { date: "", topics: [], unresolved: [] });
}

export function saveHandoff(topics, unresolved) {
  writeJson("handoff.json", {
    date: new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }),
    topics: topics.slice(0, 5),
    unresolved: unresolved.slice(0, 3),
  });
}

export function buildHandoffContext() {
  const h = loadHandoff();
  if (!h.topics?.length) return "";
  return [
    `[昨日の続き]`,
    ...h.topics.map(t => `  話題: ${t}`),
    ...(h.unresolved.length ? h.unresolved.map(u => `  未解決: ${u}`) : []),
  ].join("\n");
}

// ─── エージェント別決定ログ (agent-log.json) ─────────────────────────────────

export function logAgentDecision(agentId, decision, context = "") {
  const log = readJson("agent-log.json", {});
  if (!log[agentId]) log[agentId] = [];
  log[agentId].unshift({
    at: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    decision: decision.slice(0, 120),
    context: context.slice(0, 60),
  });
  log[agentId] = log[agentId].slice(0, 10); // 各エージェント最大10件
  writeJson("agent-log.json", log);
}

export function buildAgentLogContext() {
  const log = readJson("agent-log.json", {});
  const lines = [];
  const NAMES = { shikishima:"しきしま", shizume:"しずめ", tsumugi:"つむぎ", hajime:"はじめ", shirube:"しるべ" };
  for (const [id, entries] of Object.entries(log)) {
    if (!entries.length) continue;
    const latest = entries[0];
    lines.push(`  ${NAMES[id]??id}: ${latest.at} — ${latest.decision}`);
  }
  if (!lines.length) return "";
  return "[エージェント最近の決定]\n" + lines.join("\n");
}

// ─── 会話サマリー (conversation-summary.json) ────────────────────────────────
// 引き継ぎノートをより詳細に保持

export function saveConversationSummary(summaryText, agentDecisions = {}) {
  writeJson("conversation-summary.json", {
    date: new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }),
    summary: summaryText.slice(0, 500),
    agentDecisions,  // { shikishima: "...", tsumugi: "..." }
    savedAt: new Date().toISOString(),
  });
}

export function buildConversationSummaryContext() {
  const s = readJson("conversation-summary.json", {});
  if (!s.summary) return "";
  const lines = [`[前回セッション (${s.date})]`, `  ${s.summary}`];
  if (s.agentDecisions && Object.keys(s.agentDecisions).length) {
    const NAMES = { shikishima:"しきしま", shizume:"しずめ", tsumugi:"つむぎ", hajime:"はじめ", shirube:"しるべ" };
    for (const [id, dec] of Object.entries(s.agentDecisions)) {
      lines.push(`  ${NAMES[id]??id}の担当: ${dec}`);
    }
  }
  return lines.join("\n");
}

// ─── 統合: 全記憶コンテキスト構築 ────────────────────────────────────────────

export function buildFullContext() {
  const parts = [
    buildLongTermContext(),
    buildProfileContext(),
    buildHandoffContext(),
    buildConversationSummaryContext(),
    buildAgentLogContext(),
  ].filter(Boolean);
  return parts.join("\n\n").slice(0, 700);
}
