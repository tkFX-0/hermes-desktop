/**
 * shikishima-coding-hold.mjs
 * エージェント主導のコード変更提案 — HOLD実行モード
 *
 * フロー:
 *   エージェントが変更を提案 → Discordに差分プレビュー投稿
 *   → "コード承認" / "ok" → ファイル書き込み実行
 *   → "コード却下" / "no" → キャンセル
 *   → 10分タイムアウト → 自動キャンセル
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { execFile } from "child_process";

const CODING_TIMEOUT_MS = 10 * 60 * 1000;  // 10分
const codeQueue = [];
let _notifyCb = null;

export function setCodingNotifyCallback(fn) { _notifyCb = fn; }

// ─── コード変更の種類 ──────────────────────────────────────────────────────────
// "patch"  : 既存ファイルの一部を変更 (oldStr → newStr)
// "append" : ファイル末尾に追記
// "create" : 新規ファイル作成

/**
 * コード変更提案をHOLDキューに追加
 * @param {string} agentId - 提案エージェント
 * @param {string} filePath - 変更対象ファイル (絶対パス)
 * @param {string} description - 変更の説明
 * @param {object} change - { type:"patch"|"append"|"create", oldStr?, newStr?, content? }
 */
export async function proposeCodeChange(agentId, filePath, description, change) {
  // 既存の保留中提案があればスキップ
  if (codeQueue.some(p => p.agentId === agentId && p.status === "pending")) {
    return { ok: false, reason: "already_pending" };
  }

  // ファイル存在チェック (create / slot以外)
  if (change.type !== "create" && change.type !== "slot" && !existsSync(filePath)) {
    return { ok: false, reason: `file_not_found: ${filePath}` };
  }

  // 差分プレビュー生成
  let preview = "";
  if (change.type === "patch") {
    preview = `--- 変更前 ---\n${(change.oldStr ?? "").slice(0, 200)}\n+++ 変更後 +++\n${(change.newStr ?? "").slice(0, 200)}`;
  } else if (change.type === "append") {
    preview = `--- 追記内容 ---\n${(change.content ?? "").slice(0, 300)}`;
  } else if (change.type === "create") {
    preview = `--- 新規ファイル ---\n${(change.content ?? "").slice(0, 300)}`;
  }

  const proposal = {
    id: `code-${Date.now()}`,
    agentId,
    filePath,
    description,
    change,
    preview,
    proposedAt: Date.now(),
    status: "pending",
    timeoutHandle: null,
  };

  proposal.timeoutHandle = setTimeout(() => {
    if (proposal.status === "pending") {
      proposal.status = "timeout";
      console.log(`[Coding-HOLD] タイムアウト: ${proposal.id}`);
    }
  }, CODING_TIMEOUT_MS);

  codeQueue.push(proposal);

  if (_notifyCb) await _notifyCb(agentId, proposal);
  console.log(`[Coding-HOLD] 提案: ${agentId} → ${filePath} (${change.type})`);
  return { ok: true, proposalId: proposal.id };
}

/**
 * 提案を承認・実行
 */
export async function approveCodeChange(proposalId) {
  const p = codeQueue.find(p => p.id === proposalId && p.status === "pending");
  if (!p) return { ok: false, reason: "not_found_or_not_pending" };

  clearTimeout(p.timeoutHandle);

  try {
    if (p.change.type === "patch") {
      const current = readFileSync(p.filePath, "utf-8");
      if (!current.includes(p.change.oldStr)) {
        p.status = "error";
        return { ok: false, reason: "patch_target_not_found" };
      }
      const updated = current.replace(p.change.oldStr, p.change.newStr);
      writeFileSync(p.filePath, updated, "utf-8");

    } else if (p.change.type === "append") {
      const current = existsSync(p.filePath) ? readFileSync(p.filePath, "utf-8") : "";
      writeFileSync(p.filePath, current + "\n" + p.change.content, "utf-8");

    } else if (p.change.type === "create") {
      writeFileSync(p.filePath, p.change.content, "utf-8");
    }

    p.status = "approved";
    console.log(`[Coding-HOLD] 実行完了: ${p.filePath} (${p.change.type})`);
    return { ok: true, filePath: p.filePath, type: p.change.type };

  } catch (e) {
    p.status = "error";
    return { ok: false, reason: e.message };
  }
}

export function rejectCodeChange(proposalId) {
  const p = codeQueue.find(p => p.id === proposalId && p.status === "pending");
  if (!p) return { ok: false };
  clearTimeout(p.timeoutHandle);
  p.status = "rejected";
  console.log(`[Coding-HOLD] 却下: ${p.id}`);
  return { ok: true };
}

export function getLatestPendingCode() {
  return codeQueue.filter(p => p.status === "pending").at(-1) ?? null;
}

export function getPendingCodeChanges() {
  return codeQueue.filter(p => p.status === "pending");
}

// ─── Claudeを使ってコード変更を自動生成 ──────────────────────────────────────

/**
 * エージェントが自然言語でコード変更を依頼 → Claudeが実装 → HOLD提案
 */
export function generateAndProposeChange(agentId, filePath, instruction) {
  return new Promise(resolve => {
    let currentCode = "";
    try {
      currentCode = existsSync(filePath) ? readFileSync(filePath, "utf-8").slice(0, 3000) : "";
    } catch { /* ignore */ }

    const prompt =
      `あなたはつむぎ(コードエージェント)です。以下の指示に従ってコードを変更してください。\n` +
      `\nファイル: ${filePath}\n` +
      `指示: ${instruction}\n` +
      `\n現在のコード(一部):\n\`\`\`\n${currentCode}\n\`\`\`\n` +
      `\n以下の形式でJSONのみ返答してください(説明なし):\n` +
      `{"type":"patch","oldStr":"変更前の文字列(20行以内)","newStr":"変更後の文字列","description":"変更の説明(日本語30字以内)"}`;

    execFile("wsl", ["-d", "Ubuntu", "--", "bash", "--login", "-c",
      `claude -p ${JSON.stringify(prompt)} --model claude-haiku-4-5-20251001 --output-format text 2>&1`],
      { timeout: 60_000, maxBuffer: 2 * 1024 * 1024 },
      async (err, stdout) => {
        if (err) { resolve({ ok: false, reason: err.message }); return; }
        const clean = stdout.replace(/\x1B\[[0-9;]*[mGKHF]/g, "").trim();
        // JSON部分を抽出
        const jsonMatch = clean.match(/\{[\s\S]*\}/);
        if (!jsonMatch) { resolve({ ok: false, reason: "parse_error", raw: clean.slice(0,200) }); return; }
        try {
          const change = JSON.parse(jsonMatch[0]);
          const result = await proposeCodeChange(agentId, filePath, change.description ?? instruction, {
            type: change.type ?? "patch",
            oldStr: change.oldStr,
            newStr: change.newStr,
            content: change.content,
          });
          resolve(result);
        } catch (e) {
          resolve({ ok: false, reason: "json_parse_error: " + e.message });
        }
      });
  });
}
