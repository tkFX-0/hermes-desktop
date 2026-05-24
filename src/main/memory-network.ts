/**
 * Shikishima Memory Network — 4層記憶システム
 *
 * 短期記憶 (Short-term)  : 現在の会話 (5ターン) ← conversation-context.ts
 * 中期記憶 (Medium-term) : 直近30セッション要約 (JSON、自動更新)
 * 長期記憶 (Long-term)   : 重要な事実・設定・マイルストーン (JSON、永続)
 * 永続記憶 (Persistent)  : しきしまの魂・ルール・エージェント定義 (固定)
 *
 * 全エージェントがプロンプト生成時に参照する。
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { app } from "electron";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionSummary {
  date: string;         // ISO日付
  topic: string;        // セッションの主なトピック (100字以内)
  agentsUsed: string[]; // 使用したエージェント
  outcome: string;      // 結果・決定事項 (100字以内)
}

export interface LongTermFact {
  category: "user" | "project" | "preference" | "milestone" | "rule";
  key: string;
  value: string;
  updatedAt: string;
}

export interface MediumTermMemory {
  sessions: SessionSummary[];   // 最大30件
  lastUpdated: string;
}

export interface LongTermMemory {
  facts: LongTermFact[];
  lastUpdated: string;
}

// ─── Paths ────────────────────────────────────────────────────────────────────

function getMemoryDir(): string {
  const dir = join(app.getPath("userData"), "shikishima-memory");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

const MEDIUM_FILE = () => join(getMemoryDir(), "medium-term.json");
const LONG_FILE   = () => join(getMemoryDir(), "long-term.json");

// ─── Persistent Memory (永続記憶) — 変わらないしきしまの核心 ──────────────────

const PERSISTENT_CONTEXT = `
[しきしまシステム 永続記憶]
あなたはしきしま — 5人組AIチームの管制塔です。

チーム構成:
  しきしま(しき): 全体管制・ユーザー窓口・GO/HOLD判断
  しずめ(しず):   安全ゲート・HOLD判定・ブレーキ役
  つむぎ(つむ):   実装・ClaudeCode/Codex Worker接続
  はじめ(はじ):   計画・設計・最初の一歩
  しるべ:         記録・検索・Obsidian・引き継ぎ

安全ルール (変更不可):
  - productionReady: false (人間GOなしで変えない)
  - execution: disabled (自動実行しない)
  - git push: 人間GO必要
  - rawValues/token: 絶対に出力しない

ユーザー情報:
  - プロップトレーダー (ATFunded Pro $150K×2口座)
  - EA: NY Kill Zone / Silver Bullet (XAUUSD)
  - StackChan CoreS3 (ws://<STACKCHAN_HOST>:8080) で音声出力
  - 開発環境: Windows 11 + WSL Ubuntu + Electron

会話スタイル:
  - 落ち着いた、でも役割は明確
  - 日本語メイン
  - 話題が変わっても直前の文脈を保持する
  - 「あっち行ったりこっち行ったり」しない
`.trim();

export function getPersistentContext(): string {
  return PERSISTENT_CONTEXT;
}

// ─── Long-term Memory (長期記憶) ──────────────────────────────────────────────

const DEFAULT_LONG_TERM: LongTermMemory = {
  facts: [
    { category: "user", key: "role", value: "プロップトレーダー (ATFunded Pro)", updatedAt: "2026-05-22" },
    { category: "project", key: "ea_main", value: "NY Kill Zone + Silver Bullet (XAUUSD M5)", updatedAt: "2026-05-22" },
    { category: "project", key: "stackchan_ip", value: "<STACKCHAN_HOST>:8080 (pet-fw v0.1.0)", updatedAt: "2026-05-22" },
    { category: "project", key: "agents_implemented", value: "5エージェント実装済み (2026-05-22)", updatedAt: "2026-05-22" },
    { category: "milestone", key: "discord_bot", value: "Discord Botアクティブ (2026-05-21 GO)", updatedAt: "2026-05-22" },
    { category: "preference", key: "model_main", value: "しきしま=grok-4.3, はじめ=gemini-2.5, つむぎ=claude-sonnet-4-6", updatedAt: "2026-05-22" },
    { category: "rule", key: "news_watcher", value: "HOLD (Grokクォータ節約 + StackChan安定化待ち)", updatedAt: "2026-05-22" },
    { category: "rule", key: "local_llm", value: "使用しない (品質・速度・リアルタイム性で劣る)", updatedAt: "2026-05-22" },
  ],
  lastUpdated: "2026-05-22",
};

export function loadLongTermMemory(): LongTermMemory {
  try {
    const path = LONG_FILE();
    if (!existsSync(path)) {
      saveLongTermMemory(DEFAULT_LONG_TERM);
      return DEFAULT_LONG_TERM;
    }
    return JSON.parse(readFileSync(path, "utf-8")) as LongTermMemory;
  } catch {
    return DEFAULT_LONG_TERM;
  }
}

export function saveLongTermMemory(mem: LongTermMemory): void {
  try {
    writeFileSync(LONG_FILE(), JSON.stringify(mem, null, 2), "utf-8");
  } catch { /* ignore */ }
}

export function addLongTermFact(fact: Omit<LongTermFact, "updatedAt">): void {
  const mem = loadLongTermMemory();
  const existing = mem.facts.findIndex((f) => f.key === fact.key && f.category === fact.category);
  const entry: LongTermFact = { ...fact, updatedAt: new Date().toISOString().slice(0, 10) };
  if (existing >= 0) mem.facts[existing] = entry;
  else mem.facts.push(entry);
  mem.lastUpdated = new Date().toISOString().slice(0, 10);
  saveLongTermMemory(mem);
}

function buildLongTermContext(mem: LongTermMemory): string {
  if (mem.facts.length === 0) return "";
  const lines = ["[長期記憶 - 重要な事実・設定]"];
  for (const fact of mem.facts) {
    lines.push(`  ${fact.category}/${fact.key}: ${fact.value}`);
  }
  return lines.join("\n");
}

// ─── Medium-term Memory (中期記憶) ────────────────────────────────────────────

const DEFAULT_MEDIUM: MediumTermMemory = { sessions: [], lastUpdated: "2026-05-22" };
const MAX_SESSIONS = 30;

export function loadMediumTermMemory(): MediumTermMemory {
  try {
    const path = MEDIUM_FILE();
    if (!existsSync(path)) return DEFAULT_MEDIUM;
    return JSON.parse(readFileSync(path, "utf-8")) as MediumTermMemory;
  } catch {
    return DEFAULT_MEDIUM;
  }
}

export function saveMediumTermMemory(mem: MediumTermMemory): void {
  try {
    writeFileSync(MEDIUM_FILE(), JSON.stringify(mem, null, 2), "utf-8");
  } catch { /* ignore */ }
}

export function addSessionSummary(summary: Omit<SessionSummary, "date">): void {
  const mem = loadMediumTermMemory();
  mem.sessions.unshift({ ...summary, date: new Date().toISOString().slice(0, 10) });
  if (mem.sessions.length > MAX_SESSIONS) mem.sessions = mem.sessions.slice(0, MAX_SESSIONS);
  mem.lastUpdated = new Date().toISOString().slice(0, 10);
  saveMediumTermMemory(mem);
}

function buildMediumTermContext(mem: MediumTermMemory): string {
  const recent = mem.sessions.slice(0, 5); // 直近5件のみ
  if (recent.length === 0) return "";
  const lines = ["[中期記憶 - 最近のセッション]"];
  for (const s of recent) {
    lines.push(`  ${s.date}: ${s.topic} → ${s.outcome}`);
  }
  return lines.join("\n");
}

// ─── Unified Memory Context (全層統合) ────────────────────────────────────────

/**
 * 全4層の記憶を統合したコンテキスト文字列を返す
 * エージェントのプロンプトプレフィックスとして使用
 */
export function buildFullMemoryContext(shortTermContext: string): string {
  const longMem  = loadLongTermMemory();
  const medMem   = loadMediumTermMemory();

  const parts = [
    getPersistentContext(),
    buildLongTermContext(longMem),
    buildMediumTermContext(medMem),
  ].filter(Boolean);

  if (shortTermContext) parts.push(shortTermContext);

  return parts.join("\n\n");
}

// ─── Session auto-summarize (セッション終了時に中期記憶へ追加) ─────────────────

let _sessionTopics: string[] = [];
const _sessionAgents = new Set<string>();

export function trackSessionTopic(topic: string, agentId: string): void {
  if (_sessionTopics.length < 5) _sessionTopics.push(topic.slice(0, 50));
  _sessionAgents.add(agentId);
}

export function flushSessionToMediumMemory(): void {
  if (_sessionTopics.length === 0) return;
  addSessionSummary({
    topic: _sessionTopics.join(" / "),
    agentsUsed: Array.from(_sessionAgents),
    outcome: "会話セッション完了",
  });
  _sessionTopics = [];
  _sessionAgents.clear();
}
