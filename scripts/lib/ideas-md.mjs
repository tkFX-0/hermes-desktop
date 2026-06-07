/**
 * IDEAS.md — tk のアイデア / 研究目標ストア (.shikishima-memory/IDEAS.md)
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const IDEAS_FILENAME = "IDEAS.md";

export const IDEA_STATUSES = ["pending", "in_progress", "review", "completed", "hold"];
export const IDEA_PRIORITIES = ["high", "medium", "low"];

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

export const IDEAS_DEFAULT_SEED = `# IDEAS — しきしま自律開発キュー

tk がアイデアを書く場所。Discord \`!idea\` でも追記可能。
dev-scheduler が pending を優先度順に拾い、/goal パイプラインを自動起動します。

## アイデア: PID重複・再起動ループ解消
完成条件: 原因特定 + 修正コード + テスト + 再発防止策ドキュメント
優先度: high
状態: pending

## アイデア: Discord bot自己診断Skill
完成条件: SKILL.md + 自動ログ分析 + 問題検出レポート生成 + README
優先度: high
状態: pending

## アイデア: リサーチ君web検索能力
完成条件: web検索ツール統合 + 検索→要約パイプライン + テスト + README
優先度: high
状態: pending

## アイデア: note.com記事作成Skill
完成条件: SKILL.md + 記事テンプレ + SEO/構成ガイド + サンプル記事 + README
優先度: medium
状態: pending

## アイデア: バックテスト結果自動分析ツール
完成条件: 分析スクリプト + 統計サマリー出力 + グラフ生成 + テスト + README
優先度: medium
状態: pending
`;

/**
 * @param {string} content
 */
export function parseIdeasMarkdown(content) {
  const ideas = [];
  const blocks = String(content ?? "").split(/^##\s+アイデア:\s*/m).slice(1);
  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    const title = lines[0]?.trim() ?? "";
    if (!title) continue;
    let completionCriteria = "";
    let priority = "medium";
    let status = "pending";
    for (const line of lines.slice(1)) {
      const criteria = line.match(/^完成条件:\s*(.+)$/);
      if (criteria) completionCriteria = criteria[1].trim();
      const pri = line.match(/^優先度:\s*(high|medium|low)$/i);
      if (pri) priority = pri[1].toLowerCase();
      const st = line.match(/^状態:\s*(pending|in_progress|review|completed|hold)$/i);
      if (st) status = st[1].toLowerCase();
    }
    ideas.push({ title, completionCriteria, priority, status });
  }
  return ideas;
}

/**
 * @param {Array<{ title: string, completionCriteria: string, priority: string, status: string }>} ideas
 */
export function serializeIdeasMarkdown(ideas, header = IDEAS_DEFAULT_SEED.split("\n\n")[0]) {
  const lines = [header, ""];
  for (const idea of ideas) {
    lines.push(`## アイデア: ${idea.title}`);
    lines.push(`完成条件: ${idea.completionCriteria}`);
    lines.push(`優先度: ${idea.priority}`);
    lines.push(`状態: ${idea.status}`);
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

export function ideasPath(memoryDir) {
  return join(memoryDir, IDEAS_FILENAME);
}

export function ensureIdeasFile(memoryDir) {
  mkdirSync(memoryDir, { recursive: true });
  const path = ideasPath(memoryDir);
  if (!existsSync(path)) {
    writeFileSync(path, IDEAS_DEFAULT_SEED, "utf8");
  }
  return path;
}

export function readIdeas(memoryDir) {
  ensureIdeasFile(memoryDir);
  const content = readFileSync(ideasPath(memoryDir), "utf8");
  return { content, ideas: parseIdeasMarkdown(content) };
}

export function writeIdeas(memoryDir, ideas) {
  ensureIdeasFile(memoryDir);
  const { content } = readIdeas(memoryDir);
  const header = content.split(/^##\s+アイデア:/m)[0].trimEnd();
  writeFileSync(ideasPath(memoryDir), serializeIdeasMarkdown(ideas, header), "utf8");
}

/**
 * @param {Array<{ title: string, completionCriteria: string, priority: string, status: string }>} ideas
 */
export function pickNextPendingIdea(ideas) {
  const pending = ideas.filter((i) => i.status === "pending");
  pending.sort((a, b) => {
    const pr = (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9);
    if (pr !== 0) return pr;
    return ideas.indexOf(a) - ideas.indexOf(b);
  });
  return pending[0] ?? null;
}

/**
 * @param {string} memoryDir
 * @param {{ title: string, completionCriteria?: string, priority?: string }} input
 */
export function appendIdea(memoryDir, input) {
  const { ideas } = readIdeas(memoryDir);
  const title = String(input.title ?? "").trim();
  if (!title) return { ok: false, error: "empty_title" };
  if (ideas.some((i) => i.title === title)) {
    return { ok: false, error: "duplicate_title", title };
  }
  const idea = {
    title,
    completionCriteria: String(input.completionCriteria ?? "README + テスト + 動作するコード").trim(),
    priority: IDEA_PRIORITIES.includes(input.priority) ? input.priority : "medium",
    status: "pending",
  };
  ideas.push(idea);
  writeIdeas(memoryDir, ideas);
  return { ok: true, idea };
}

/**
 * @param {string} memoryDir
 * @param {string} title
 * @param {string} status
 */
export function updateIdeaStatus(memoryDir, title, status) {
  if (!IDEA_STATUSES.includes(status)) return { ok: false, error: "invalid_status" };
  const { ideas } = readIdeas(memoryDir);
  const idx = ideas.findIndex((i) => i.title === title);
  if (idx < 0) return { ok: false, error: "not_found" };
  ideas[idx].status = status;
  writeIdeas(memoryDir, ideas);
  return { ok: true, idea: ideas[idx] };
}

/**
 * @param {string} text
 */
export function parseIdeaCommand(text) {
  const t = String(text ?? "").trim();
  const m = t.match(/^!idea\s+(.+)$/i);
  if (!m) return null;
  const body = m[1].trim();
  const split = body.split(/\s*[—|｜]\s*/);
  if (split.length >= 2) {
    return {
      title: split[0].trim(),
      completionCriteria: split.slice(1).join(" — ").trim(),
    };
  }
  return { title: body, completionCriteria: "README + テスト + 動作するコード" };
}

/**
 * @param {string} title
 */
export function slugifyIdeaTitle(title) {
  return String(title ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "product";
}
