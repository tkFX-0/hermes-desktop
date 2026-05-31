/**
 * Discord Bot 向けランタイム Skills（会話ログで確認済みの4種 + 境界説明）
 * 出典: skills/shikishima-* （karaage ai-assistant-workspace 改変）
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const PROJECT_ROOT = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop");

/** 会話ログ・導入実績のある Skills（Cursor 正本 + Bot 要約） */
export const RUNTIME_SKILL_CATALOG = [
  {
    id: "shikishima-code-reviewer",
    label: "コードレビュー",
    triggers:
      /コードレビュー|変更点をレビュー|!kaihatu\s*レビュー|kaihatu\s*レビュー|PRレビュー|レビューして/i,
    discordHint: "!kaihatu 後の自動レビュー・vitest zone・HOLD 維持"
  },
  {
    id: "shikishima-multi-agent",
    label: "マルチエージェント",
    triggers: /みんなで|マルチエージェント|エージェントチーム|複数.*AI|!agent-test|順番での回答/i,
    discordHint: "6体順番・!kaihatu・スレッド記憶・役割分担"
  },
  {
    id: "shikishima-kaizen-rca",
    label: "なぜなぜ・原因調査",
    triggers: /なぜなぜ|原因調べ|根本原因|再発防止|横展開|会話ログ|挙動.*審査/i,
    discordHint: "audit・!部屋状況・discord-threads 証拠"
  },
  {
    id: "shikishima-github-analyzer",
    label: "GitHub分析",
    triggers: /リポジトリ分析|github\.com\/|gh repo|リポジトリ見て/i,
    discordHint: "読取のみ・clone/push は人間 GO"
  }
];

export const SKILLS_BOUNDARY_BLOCK = `[Skills 境界 — 必ず守る]
- 「Skills」= PC の Cursor/Claude Code 用 \`skills/shikishima-*\` と、Discord Bot の \`!コマンド\`+スレッド記憶の両方がある。
- Cursor Skills は MT5/EA の自動売買スキルではない。つむぎが「EA用スキルを追加した」とは言わない。
- Discord での開発は \`!kaihatu\` / \`!kaihatuslot\`。レビューは \`!kaihatu-test\` または自動レビュー後のしずめ報告。
- decision=HOLD / execution=disabled。本番 GO は人間承認のみ。`;

function parseSkillDescription(skillMd) {
  const m = skillMd.match(/^---[\s\S]*?description:\s*(.+?)\n[\s\S]*?---/m);
  if (m) return m[1].trim().slice(0, 200);
  const h = skillMd.match(/^#\s+(.+)/m);
  return h ? h[1].trim() : "";
}

/**
 * @param {string} skillId
 */
export function loadSkillSummaryLine(skillId) {
  const p = join(PROJECT_ROOT, "skills", skillId, "SKILL.md");
  if (!existsSync(p)) return "";
  try {
    const desc = parseSkillDescription(readFileSync(p, "utf8"));
    const entry = RUNTIME_SKILL_CATALOG.find((s) => s.id === skillId);
    return `• ${skillId} (${entry?.label ?? skillId}): ${desc || entry?.discordHint || ""}`.slice(
      0,
      140
    );
  } catch {
    return "";
  }
}

/**
 * P2: 全導入 Skills の短い要約（プロンプト用・約400字）
 * @param {{ includeBoundary?: boolean }} [opts]
 */
export function buildRuntimeSkillsCatalogContext(opts = {}) {
  const includeBoundary = opts.includeBoundary !== false;
  const lines = includeBoundary ? [SKILLS_BOUNDARY_BLOCK, ""] : [];
  lines.push("[導入済み Runtime Skills 要約]");
  for (const s of RUNTIME_SKILL_CATALOG) {
    const line = loadSkillSummaryLine(s.id);
    lines.push(line || `• ${s.label}: ${s.discordHint}`);
  }
  lines.push("", "詳細: docs/shikishima/REFERENCE_SKILLS_KARAAGE.md");
  return lines.join("\n").slice(0, 520);
}

/**
 * @param {string} agentId
 * @param {string} userLine
 */
export function buildRuntimeSkillsContextForPrompt(agentId, userLine) {
  const text = String(userLine ?? "");
  const parts = [SKILLS_BOUNDARY_BLOCK];

  const matched = RUNTIME_SKILL_CATALOG.filter((s) => s.triggers.test(text));
  if (matched.length) {
    parts.push("", "[今回の発話に関連する Skill]");
    for (const s of matched) {
      parts.push(loadSkillSummaryLine(s.id) || `• ${s.label}: ${s.discordHint}`);
      parts.push(`  Discord: ${s.discordHint}`);
    }
  }

  if (agentId === "shikishima" || /skill|スキル/i.test(text)) {
    parts.push("", buildRuntimeSkillsCatalogContext({ includeBoundary: false }));
  }

  if (agentId === "shizume" && /レビュー|review|kaihatu/i.test(text)) {
    parts.push("", "しずめ: 自動レビューは HOLD 判定。ブロッカーがあれば必ず HOLD。");
  }

  if (agentId === "tsumugi" && /skill|スキル|kaihatu|コード/i.test(text)) {
    parts.push("", "つむぎ: Cursor Skills ファイルの実装は PC 側。Discord では !kaihatu レーンで開発。");
  }

  return parts.join("\n").slice(0, 900);
}

/**
 * @param {string} userLine
 */
export function detectActiveRuntimeSkillIds(userLine) {
  return RUNTIME_SKILL_CATALOG.filter((s) => s.triggers.test(String(userLine ?? ""))).map(
    (s) => s.id
  );
}
