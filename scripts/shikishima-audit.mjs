/**
 * Shikishima Audit + Approval + Self-Evolution — B2/B3/B4
 * B2: 全エージェント行動をJSONLで記録 (audit-log.ts設計準拠)
 * B3: 破壊的操作の人間確認キュー (Approval Queue)
 * B4: 会話品質学習 → SYSTEM_CTX自動調整
 */

import { existsSync, appendFileSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { randomUUID } from "crypto";

const MEM_DIR    = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".shikishima-memory");
const AUDIT_DIR  = join(MEM_DIR, "audit");
const APPROVAL_FILE = join(MEM_DIR, "approval-queue.json");
const EVOLUTION_FILE = join(MEM_DIR, "self-evolution.json");

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function todayJST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// センシティブ文字列マスク (ichikishima audit-log.ts準拠)
const SENSITIVE_PATTERNS = [
  [/[A-Za-z0-9_-]{36,}/g,                        "[masked-key]"],
  [/authorization\s*:\s*bearer\s+\S+/gi,          "[masked-bearer]"],
  [/\.env/gi,                                     "[masked-path]"],
  [/api[\s_]?key/gi,                              "[masked-term]"],
  [/\btoken\b/gi,                                 "[masked-term]"],
];

export function maskSensitive(text) {
  return SENSITIVE_PATTERNS.reduce((s, [p, r]) => s.replace(p, r), text);
}

// ─── B2: Audit Log ────────────────────────────────────────────────────────────

/**
 * エージェント行動を記録
 * @param {object} opts
 *   kind: "message_received"|"tool_executed"|"task_created"|"task_done"|"gate_triggered"|"pipeline_run"|"alert_sent"|"stackchan_speak"|"mt5_alert"
 *   agent: agentId
 *   detail: string (maskedされる)
 *   riskLevel: "low"|"medium"|"high"|"critical"
 */
export function auditLog({ kind, agent, detail = "", riskLevel = "low", metadata = {} }) {
  ensureDir(AUDIT_DIR);
  const record = {
    eventId:   randomUUID(),
    timestamp: new Date().toISOString(),
    agent:     agent ?? "system",
    kind,
    riskLevel,
    detail:    maskSensitive(detail.slice(0, 200)),
    metadata:  Object.fromEntries(
      Object.entries(metadata).slice(0, 10).map(([k, v]) => [k, maskSensitive(String(v).slice(0, 100))])
    ),
    contentIncluded: false,
  };
  const line = JSON.stringify(record) + "\n";
  const logFile = join(AUDIT_DIR, `${todayJST()}.jsonl`);
  try { appendFileSync(logFile, line, "utf-8"); }
  catch { /* ignore write error */ }
}

export function readTodayAudit() {
  const logFile = join(AUDIT_DIR, `${todayJST()}.jsonl`);
  if (!existsSync(logFile)) return [];
  try {
    return readFileSync(logFile, "utf-8")
      .split("\n").filter(Boolean).map(l => JSON.parse(l));
  } catch { return []; }
}

export function buildAuditSummary() {
  const records = readTodayAudit();
  if (records.length === 0) return "";
  const byKind = {};
  for (const r of records) { byKind[r.kind] = (byKind[r.kind] ?? 0) + 1; }
  const top = Object.entries(byKind).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return `[監査ログ今日] ${records.length}件: ${top.map(([k, n]) => `${k}×${n}`).join(" / ")}`;
}

// ─── B3: Approval Queue ───────────────────────────────────────────────────────

function readApprovalQueue() {
  try { return existsSync(APPROVAL_FILE) ? JSON.parse(readFileSync(APPROVAL_FILE, "utf-8")) : []; }
  catch { return []; }
}

function writeApprovalQueue(queue) {
  ensureDir(MEM_DIR);
  writeFileSync(APPROVAL_FILE, JSON.stringify(queue, null, 2), "utf-8");
}

// 破壊的操作トリガー
const DESTRUCTIVE_PATTERNS = [
  { pattern: /外部.*送信|webhook.*post|discord.*send/i, label: "外部送信", riskLevel: "medium" },
  { pattern: /ファイル.*削除|delete.*file|rm\s/i,       label: "ファイル削除", riskLevel: "high" },
  { pattern: /git\s*(push|reset|clean)/i,               label: "Git操作", riskLevel: "high" },
  { pattern: /本番|production|deploy/i,                  label: "本番環境操作", riskLevel: "critical" },
  { pattern: /出金|送金|入金.*指示/i,                   label: "資金操作", riskLevel: "critical" },
  { pattern: /EA.*起動|自動売買.*開始/i,                 label: "自動売買制御", riskLevel: "high" },
];

export function checkNeedsApproval(content) {
  for (const { pattern, label, riskLevel } of DESTRUCTIVE_PATTERNS) {
    if (pattern.test(content)) return { needs: true, label, riskLevel };
  }
  return { needs: false };
}

export function createApprovalRequest(label, content, riskLevel, requestedBy) {
  const queue = readApprovalQueue();
  const item = {
    id: randomUUID().slice(0, 8),
    label,
    content: maskSensitive(content.slice(0, 200)),
    riskLevel,
    requestedBy,
    status: "pending",
    createdAt: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    resolvedAt: null,
  };
  queue.unshift(item);
  if (queue.length > 50) queue.pop();
  writeApprovalQueue(queue);
  auditLog({ kind: "gate_triggered", agent: "shizume", detail: label, riskLevel });
  return item;
}

export function resolveApproval(id, decision) {
  const queue = readApprovalQueue();
  const item = queue.find(q => q.id === id || q.id.startsWith(id));
  if (!item) return null;
  item.status = decision === "go" ? "approved" : "rejected";
  item.resolvedAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  writeApprovalQueue(queue);
  auditLog({ kind: "gate_triggered", agent: "shizume", detail: `${item.label} → ${item.status}`, riskLevel: item.riskLevel });
  return item;
}

export function getPendingApprovals() {
  return readApprovalQueue().filter(q => q.status === "pending");
}

// "GO abc123" / "HOLD abc123" コマンド検出
export function detectApprovalCommand(content) {
  const goM   = content.match(/^(?:go|ゴー)\s+([a-f0-9]{6,8})/i);
  const holdM = content.match(/^(?:hold|ホールド)\s+([a-f0-9]{6,8})/i);
  if (goM)   return { type: "approve", id: goM[1] };
  if (holdM) return { type: "reject",  id: holdM[1] };

  // 単純 "GO" → 最初の pending を承認
  if (/^(?:go|ゴー)$/i.test(content.trim())) return { type: "approve", id: null };
  return null;
}

export function formatApprovalRequest(item) {
  const riskIcon = { low: "🟢", medium: "🟡", high: "🔴", critical: "⛔" }[item.riskLevel] ?? "❓";
  return [
    `🛡️ **しずめ** — 承認リクエスト #${item.id}`,
    `${riskIcon} **${item.label}** (リスク: ${item.riskLevel})`,
    `内容: ${item.content}`,
    ``,
    `承認する場合: \`GO ${item.id}\``,
    `却下する場合: \`HOLD ${item.id}\``,
  ].join("\n");
}

// ─── B4: 自己進化 — 会話品質学習 ─────────────────────────────────────────────

function readEvolution() {
  try { return existsSync(EVOLUTION_FILE) ? JSON.parse(readFileSync(EVOLUTION_FILE, "utf-8")) : { sessions: 0, goodPatterns: [], badPatterns: [], systemPromptVersion: 0, customHints: [] }; }
  catch { return { sessions: 0, goodPatterns: [], badPatterns: [], systemPromptVersion: 0, customHints: [] }; }
}

function writeEvolution(data) {
  ensureDir(MEM_DIR);
  writeFileSync(EVOLUTION_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ユーザーの肯定/否定フィードバックを記録
export function learnFromResponse(userMessage, agentReply, feedback) {
  const ev = readEvolution();
  const pattern = {
    userSnippet:  userMessage.slice(0, 40),
    replySnippet: agentReply.slice(0, 60),
    feedback,
    date: todayJST(),
  };
  if (feedback === "positive") {
    ev.goodPatterns.unshift(pattern);
    if (ev.goodPatterns.length > 30) ev.goodPatterns.pop();
  } else {
    ev.badPatterns.unshift(pattern);
    if (ev.badPatterns.length > 20) ev.badPatterns.pop();
  }
  ev.sessions++;
  writeEvolution(ev);
}

// 蓄積した好みからシステムプロンプトヒントを生成
export function buildEvolutionHints() {
  const ev = readEvolution();
  if (ev.goodPatterns.length < 5) return "";
  const hints = ev.customHints.slice(0, 3);
  if (hints.length === 0) return "";
  return `[学習済み傾向] ${hints.join(" / ")}`;
}

// 週次: 好みパターンを分析してhintを更新 (Groqを使う)
export async function updateEvolutionHints(callGroq) {
  const ev = readEvolution();
  if (ev.goodPatterns.length < 10) return;

  const prompt =
    `以下はユーザーが好んだ返答パターンです。共通する傾向を3点、10字以内の箇条書きで抽出してください:\n` +
    ev.goodPatterns.slice(0, 15).map(p => `- ${p.replySnippet}`).join("\n");

  const result = await callGroq(prompt);
  if (!result.ok) return;

  // 箇条書きを解析してhintリストに変換
  const hints = result.text.split("\n")
    .map(l => l.replace(/^[・\-\*\d\.]+\s*/, "").trim())
    .filter(l => l.length > 0 && l.length < 30)
    .slice(0, 3);

  if (hints.length > 0) {
    ev.customHints = hints;
    ev.systemPromptVersion++;
    writeEvolution(ev);
    console.log(`[Evolution] システムプロンプトヒント更新: ${hints.join(" / ")}`);
  }
}

// 月曜日に一週間分の学習を処理
export function startEvolutionCycle(callGroq) {
  let lastUpdatedWeek = "";
  setInterval(async () => {
    const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);
    if (nowJST.getUTCDay() === 1 && nowJST.getUTCHours() === 10) {
      const weekKey = nowJST.toISOString().slice(0, 10);
      if (lastUpdatedWeek !== weekKey) {
        lastUpdatedWeek = weekKey;
        await updateEvolutionHints(callGroq).catch(e => console.error("[Evolution]", e.message));
      }
    }
  }, 60_000);
  console.log("🧠 自己進化サイクル起動 — 毎週月曜10:00 JSTにヒント更新");
}
