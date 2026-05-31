/**
 * Shikishima Goals & Proactive Engine — Lv9+Lv10
 * Lv9: 24hサイクルモード / 自律リサーチループ
 * Lv10: 長期目標管理 / 先読み提案 / パターン学習
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const MEM_DIR = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".shikishima-memory");
const GOALS_FILE  = join(MEM_DIR, "goals.json");
const PREFS_FILE  = join(MEM_DIR, "prefs.json");  // Lv10-A 自己学習

function ensureDir() {
  if (!existsSync(MEM_DIR)) mkdirSync(MEM_DIR, { recursive: true });
}

function readJson(file, def) {
  try { return existsSync(file) ? JSON.parse(readFileSync(file, "utf-8")) : def; }
  catch { return def; }
}

function writeJson(file, data) {
  ensureDir();
  writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

function nowJST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ");
}

function todayJST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// ─── Lv9: 24h サイクルモード ──────────────────────────────────────────────────

/** @param {Date} [date] */
export function getJstHour(date = new Date()) {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).getUTCHours();
}

/**
 * JST 時刻帯 → モード（vitest 用に時刻を注入可能）
 * @param {number} h 0–23 JST
 * @returns {"night"|"morning_prep"|"morning_report"|"active"|"evening"}
 */
export function getCurrentModeForJstHour(h) {
  if (h >= 3 && h < 7) return "evening"; // 夜の整理モード 03:00–06:59
  if (h >= 0 && h < 3) return "night";
  if (h >= 21) return "night";
  if (h >= 7 && h < 8) return "morning_prep";
  if (h >= 8 && h < 9) return "morning_report";
  if (h >= 9 && h < 21) return "active";
  return "night";
}

/**
 * @returns {"night"|"morning_prep"|"morning_report"|"active"|"evening"}
 */
export function getCurrentMode() {
  return getCurrentModeForJstHour(getJstHour());
}

const MODE_LABELS = {
  night:          "🌙 夜間モード",
  morning_prep:   "🌅 朝準備モード",
  morning_report: "☀️ 朝報告モード",
  active:         "🏃 アクティブモード",
  evening:        "🌆 夜の整理モード",
};

export function getModeLabel() {
  return MODE_LABELS[getCurrentMode()] ?? "通常モード";
}

// モードに応じたポーリング間隔 (ms)
export function getPollInterval() {
  const mode = getCurrentMode();
  return mode === "night" || mode === "evening" ? 60_000 : 10_000;
}

// ─── Lv10-C: 長期目標管理 ─────────────────────────────────────────────────────

const DEFAULT_GOALS = [];

export function loadGoals() {
  return readJson(GOALS_FILE, DEFAULT_GOALS);
}

export function saveGoals(goals) {
  writeJson(GOALS_FILE, goals);
}

export function setGoalProgress(goalId, progress) {
  const goals = loadGoals();
  const g = goals.find(g => g.id === goalId);
  if (!g) return null;
  g.progress = Math.min(100, Math.max(0, progress));
  g.updatedAt = todayJST();
  if (g.progress >= 100) g.status = "completed";
  saveGoals(goals);
  return g;
}

export function completeMilestone(goalId, milestoneLabel) {
  const goals = loadGoals();
  const g = goals.find(g => g.id === goalId);
  if (!g) return null;
  const m = g.milestones.find(m => m.label === milestoneLabel);
  if (m) { m.done = true; m.doneAt = todayJST(); }
  const done = g.milestones.filter(m => m.done).length;
  g.progress = Math.round(done / g.milestones.length * 100);
  g.updatedAt = todayJST();
  saveGoals(goals);
  return g;
}

export function buildGoalContext() {
  const goals = loadGoals().filter(g => g.status !== "completed");
  if (goals.length === 0) return "";
  const lines = ["[長期目標]"];
  for (const g of goals.slice(0, 3)) {
    const nextMilestone = g.milestones.find(m => !m.done);
    lines.push(`  ${g.title}: ${g.progress}%`);
    if (nextMilestone) lines.push(`    次: ${nextMilestone.label}`);
  }
  return lines.join("\n");
}

// ─── Lv10-A: パターン学習 (好まれた返答を記憶) ───────────────────────────────

export function learnFromFeedback(responsePattern, wasPositive) {
  const prefs = readJson(PREFS_FILE, { liked: [], disliked: [], totalFeedback: 0 });
  prefs.totalFeedback++;
  const pattern = responsePattern.slice(0, 60);
  if (wasPositive) {
    prefs.liked.unshift(pattern);
    if (prefs.liked.length > 20) prefs.liked.pop();
  } else {
    prefs.disliked.unshift(pattern);
    if (prefs.disliked.length > 20) prefs.disliked.pop();
  }
  writeJson(PREFS_FILE, prefs);
}

export function buildPreferencesContext() {
  const prefs = readJson(PREFS_FILE, { liked: [], disliked: [], totalFeedback: 0 });
  if (prefs.totalFeedback < 5) return "";
  const top = prefs.liked.slice(0, 3).join(" / ");
  return top ? `[好まれた返答パターン] ${top}` : "";
}

// ─── Lv10-B: 先読み提案 ──────────────────────────────────────────────────────

// 過去のメッセージパターンからプロアクティブな提案を生成
export async function generateProactiveSuggestion(callGroq, { openTasks = [], recentTopics = [] } = {}) {
  const goals = loadGoals().filter(g => g.status !== "completed");
  if (goals.length === 0 && openTasks.length === 0) return null;

  const goalSummary = goals.map(g => `${g.title} (${g.progress}%)`).join(", ");
  const taskSummary = openTasks.slice(0, 3).map(t => t.title).join(", ");

  const prompt =
    `しきしまとして、ユーザーに対してプロアクティブな提案を1件考えてください。\n` +
    `長期目標: ${goalSummary || "なし"}\n` +
    `未完了タスク: ${taskSummary || "なし"}\n` +
    `最近の話題: ${recentTopics.slice(0, 3).join(", ") || "なし"}\n\n` +
    `今日の日付: ${todayJST()}\n` +
    `形式: 「今〇〇が〜です。〜しませんか？」のように自然な1〜2文で。`;

  const result = await callGroq(prompt);
  return result.ok ? result.text : null;
}

// ─── Lv9-B: 自律リサーチループ ───────────────────────────────────────────────

let _lastAutoResearchDate = "";

export async function runAutoResearch(callGroq, sendFn) {
  const today = todayJST();
  if (_lastAutoResearchDate === today) return; // 1日1回

  const mode = getCurrentMode();
  if (mode !== "active") return; // アクティブモード中のみ

  _lastAutoResearchDate = today;

  const prompt =
    `FXプロップトレーダー向けに、今日注目すべき情報を自発的にリサーチして報告してください。\n` +
    `XAUUSD・ATFunded・プロップトレーディング業界の最新情報を3点、簡潔に。\n` +
    `「しきしまより」として自然な日本語で。`;

  const result = await callGroq(prompt);
  if (!result.ok) return;

  await sendFn("shirube", `🕯️ **しるべ** — 本日の自律リサーチ (${todayJST()})\n\n${result.text}`);
  console.log("[AutoResearch] 自律リサーチ送信完了");
}

// ─── Lv10-C: 週次目標進捗レポート ────────────────────────────────────────────

export function buildWeeklyGoalReport() {
  const goals = loadGoals();
  if (goals.length === 0) return "目標は未設定です。";
  const lines = ["**週次目標進捗レポート**", ""];
  for (const g of goals) {
    const bar = "█".repeat(Math.floor(g.progress / 10)) + "░".repeat(10 - Math.floor(g.progress / 10));
    lines.push(`**${g.title}**`);
    lines.push(`  進捗: [${bar}] ${g.progress}%`);
    const done   = g.milestones.filter(m => m.done).length;
    const total  = g.milestones.length;
    lines.push(`  マイルストーン: ${done}/${total}完了`);
    const next = g.milestones.find(m => !m.done);
    if (next) lines.push(`  次のステップ: ${next.label}`);
    lines.push("");
  }
  return lines.join("\n").trim();
}
