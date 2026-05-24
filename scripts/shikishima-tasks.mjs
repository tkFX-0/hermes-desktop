/**
 * Shikishima Task Manager — Lv5
 * はじめ担当: タスクキュー管理・進捗トラッキング・Gate管理・積み残し可視化
 * JSON ファイルベース (.shikishima-memory/tasks.json)
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const MEM_DIR = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".shikishima-memory");
const TASKS_FILE = join(MEM_DIR, "tasks.json");

function ensureDir() {
  if (!existsSync(MEM_DIR)) mkdirSync(MEM_DIR, { recursive: true });
}

function readTasks() {
  try {
    return existsSync(TASKS_FILE) ? JSON.parse(readFileSync(TASKS_FILE, "utf-8")) : [];
  } catch { return []; }
}

function writeTasks(tasks) {
  ensureDir();
  writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

function nowJST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ");
}

function todayJST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// ─── タスク作成 ────────────────────────────────────────────────────────────────

let _nextId = null;

function getNextId(tasks) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map(t => t.id)) + 1;
}

/**
 * タスクを1件作成
 * @param {string} title - タスクタイトル
 * @param {object} opts - { priority: "high"|"medium"|"low", agent: "hajime"|..., dueDate: "YYYY-MM-DD", note: string }
 */
export function createTask(title, opts = {}) {
  const tasks = readTasks();
  const task = {
    id: getNextId(tasks),
    title,
    status: "pending",           // pending | in_progress | done | hold | cancelled
    priority: opts.priority ?? "medium",
    agent: opts.agent ?? "hajime",
    gateStatus: opts.gate ? "hold" : null,  // null | "hold" | "go"
    dueDate: opts.dueDate ?? null,
    note: opts.note ?? null,
    createdAt: nowJST(),
    updatedAt: nowJST(),
    doneAt: null,
    weekTag: getWeekTag(),
  };
  tasks.push(task);
  writeTasks(tasks);
  console.log(`[Tasks] 作成: #${task.id} ${title}`);
  return task;
}

/**
 * 複数タスクを一括作成 (はじめがLLM分解結果を受け取る用)
 * @param {Array<{title:string, priority?:string}>} items
 */
export function createTasksBulk(items, baseOpts = {}) {
  return items.map(item =>
    createTask(item.title, { ...baseOpts, priority: item.priority ?? "medium" })
  );
}

// ─── タスク一覧・検索 ──────────────────────────────────────────────────────────

export function listTasks(filter = {}) {
  let tasks = readTasks();
  if (filter.status) tasks = tasks.filter(t => t.status === filter.status);
  if (filter.agent)  tasks = tasks.filter(t => t.agent === filter.agent);
  if (filter.week)   tasks = tasks.filter(t => t.weekTag === filter.week);
  if (filter.gate)   tasks = tasks.filter(t => t.gateStatus === "hold");
  return tasks;
}

export function getOpenTasks() {
  return readTasks().filter(t => t.status === "pending" || t.status === "in_progress");
}

export function getHoldTasks() {
  return readTasks().filter(t => t.gateStatus === "hold" && t.status !== "done" && t.status !== "cancelled");
}

export function getLastWeekPending() {
  const lastWeek = getPrevWeekTag();
  return readTasks().filter(t => t.weekTag === lastWeek && (t.status === "pending" || t.status === "in_progress"));
}

// ─── タスク更新 ────────────────────────────────────────────────────────────────

export function updateTask(id, patch) {
  const tasks = readTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx < 0) return null;
  tasks[idx] = { ...tasks[idx], ...patch, updatedAt: nowJST() };
  if (patch.status === "done" && !tasks[idx].doneAt) {
    tasks[idx].doneAt = nowJST();
  }
  writeTasks(tasks);
  return tasks[idx];
}

export function markDone(id) {
  return updateTask(id, { status: "done" });
}

export function markGo(id) {
  return updateTask(id, { gateStatus: "go", status: "in_progress" });
}

export function markHold(id, reason) {
  return updateTask(id, { gateStatus: "hold", status: "hold", note: reason ?? "Gate中" });
}

// ─── Gate管理 (しずめ) ─────────────────────────────────────────────────────────

// キーワードからHOLDが必要なタスクか判定
const GATE_TRIGGERS = [
  /外部.*送信|push|デプロイ|本番/i,
  /削除|drop|消す|リセット/i,
  /出金|入金|送金/i,
  /API.*公開|公開鍵/i,
  /自動売買.*開始|EA.*起動/i,
];

export function needsGate(taskTitle) {
  return GATE_TRIGGERS.some(p => p.test(taskTitle));
}

// ─── タスクコンテキスト構築 (プロンプト注入用) ────────────────────────────────

export function buildTaskContext() {
  const open = getOpenTasks();
  if (open.length === 0) return "";
  const lines = ["[タスクリスト]"];
  for (const t of open.slice(0, 5)) {
    const gate = t.gateStatus === "hold" ? " [HOLD]" : "";
    const pri  = t.priority === "high" ? "⚡" : t.priority === "low" ? "▽" : "→";
    lines.push(`  ${pri} #${t.id} ${t.title}${gate} (${t.status})`);
  }
  if (open.length > 5) lines.push(`  ...他${open.length - 5}件`);
  return lines.join("\n");
}

// ─── Discord表示用フォーマット ─────────────────────────────────────────────────

export function formatTaskList(tasks, header = "タスクリスト") {
  if (tasks.length === 0) return `**${header}**\n現在タスクはありません。`;
  const lines = [`**${header}** (${tasks.length}件)`];
  for (const t of tasks) {
    const statusMark = { pending: "⬜", in_progress: "🔄", done: "✅", hold: "🔒", cancelled: "❌" }[t.status] ?? "❓";
    const priMark    = { high: "⚡", medium: "→", low: "▽" }[t.priority] ?? "→";
    const gate       = t.gateStatus === "hold" ? " 🔒**[HOLD]**" : t.gateStatus === "go" ? " ✅[GO]" : "";
    lines.push(`${statusMark} ${priMark} **#${t.id}** ${t.title}${gate}`);
    if (t.dueDate)  lines.push(`　　期限: ${t.dueDate}`);
  }
  return lines.join("\n");
}

export function formatBacklog(tasks) {
  if (tasks.length === 0) return "先週の積み残しはありません。";
  return [
    `**先週の積み残し — ${tasks.length}件**`,
    ...tasks.map(t => `• **#${t.id}** ${t.title} (${t.status})`),
    "",
    "今週中に対応をご確認ください。",
  ].join("\n");
}

// ─── 週タグ計算 ────────────────────────────────────────────────────────────────

function getWeekTag() {
  const d = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const mon = new Date(d);
  mon.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return mon.toISOString().slice(0, 10);
}

function getPrevWeekTag() {
  const d = new Date(Date.now() + 9 * 60 * 60 * 1000);
  d.setUTCDate(d.getUTCDate() - 7);
  const mon = new Date(d);
  mon.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return mon.toISOString().slice(0, 10);
}

// ─── LLMレスポンスからタスク抽出 ──────────────────────────────────────────────

/**
 * LLMが返したタスクリスト文字列をパース
 * 期待フォーマット:
 *   1. タスクA [high]
 *   2. タスクB [medium]
 * または JSON配列
 */
export function parseTasksFromLLM(text) {
  // JSON配列チェック
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try {
      const arr = JSON.parse(jsonMatch[0]);
      if (Array.isArray(arr)) {
        return arr.map(item =>
          typeof item === "string"
            ? { title: item.trim(), priority: "medium" }
            : { title: String(item.title ?? item).trim(), priority: item.priority ?? "medium" }
        ).filter(t => t.title);
      }
    } catch { /* fallthrough */ }
  }

  // 番号付きリストチェック
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const items = [];
  for (const line of lines) {
    const m = line.match(/^[\d\-\*•]+[\.\)]\s*(.+?)(?:\s*\[(high|medium|low)\])?$/i);
    if (m) {
      items.push({ title: m[1].trim(), priority: (m[2] ?? "medium").toLowerCase() });
    }
  }
  return items;
}
