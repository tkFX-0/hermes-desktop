/**
 * はじめ SKILLS — 計画参謀
 * SK-HAJ-01: plan / SK-HAJ-03: prioritize / SK-HAJ-06: sprint_plan
 */

import type { SkillInput, SkillOutput, AgentContext } from "./skill-types";
import { claudeCodeTask } from "../claude-code-service";
import { geminiChat, checkGeminiAvailability } from "../gemini-service";
import { withPersona } from "../agent-persona";

// ─── SK-HAJ-01: plan ─────────────────────────────────────────────────────────

const PLAN_FORMAT = `
以下の形式で出力してください:

## ゴール
(1〜2行でゴールを再定義)

## タスク一覧
| # | タスク | 見積 | 依存 |
|---|---|---|---|
(番号付き、見積もり時間、依存タスク番号)

## 推奨実施順序
(依存関係を考慮した番号順)

## リスク・注意点
(箇条書き)

## 最初の一手
(今すぐできる具体的なアクション1つ)
`;

export async function skillPlan(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start    = Date.now();
  const horizon  = (input.params?.horizon as string) ?? "week";
  const prompt   = withPersona("hajime",
    `期間: ${horizon}\n\nゴール: ${input.raw}\n${PLAN_FORMAT}`
  );

  const geminiAvail = checkGeminiAvailability();
  if (geminiAvail.available) {
    const g = await geminiChat(prompt, "gemini-2.5-pro");
    if (g.success) {
      return { success: true, result: `[plan]\n${g.reply}`, durationMs: Date.now() - start };
    }
  }

  const claude = await claudeCodeTask(prompt, "claude-sonnet-4-6");
  return {
    success: claude.success,
    result: `[plan]\n${claude.output || "(失敗)"}`,
    durationMs: Date.now() - start,
  };
}

// ─── SK-HAJ-03: prioritize ───────────────────────────────────────────────────

export async function skillPrioritize(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start  = Date.now();
  const prompt = withPersona("hajime",
    `以下のタスクリストを優先度順にソートしてください。\n` +
    `評価基準: インパクト × 緊急度 × 実現可能性\n` +
    `各タスクに [高/中/低] のラベルと1行の理由を付けてください。\n` +
    `最後に「今日やるべき1件」を明示してください。\n\n` +
    input.raw
  );

  const claude = await claudeCodeTask(prompt, "claude-haiku-4");
  return {
    success: claude.success,
    result: `[prioritize]\n${claude.output || "(失敗)"}`,
    durationMs: Date.now() - start,
  };
}

// ─── SK-HAJ-06: sprint_plan ──────────────────────────────────────────────────

function todayDateJst(): string {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

function dayOfWeekJst(): string {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const d    = new Date(Date.now() + 9 * 3600 * 1000);
  return days[d.getUTCDay()];
}

export async function skillSprintPlan(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start    = Date.now();
  const dateStr  = todayDateJst();
  const dayStr   = dayOfWeekJst();
  const scope    = (input.params?.scope as string) ?? "today";

  const prompt = withPersona("hajime",
    `${dateStr}(${dayStr}) の${scope === "week" ? "今週" : "今日"}のスプリント計画を作成してください。\n\n` +
    `追加コンテキスト: ${input.raw || "なし"}\n\n` +
    `出力形式:\n` +
    `## 今日のゴール (1〜2行)\n` +
    `## タスクリスト (優先順、各3行以内)\n` +
    `## ブロッカー (あれば)\n` +
    `## 終了判定 (何が完了したら今日は成功か)`
  );

  const geminiAvail = checkGeminiAvailability();
  if (geminiAvail.available) {
    const g = await geminiChat(prompt, "gemini-2.5-flash");
    if (g.success) {
      return { success: true, result: `[sprint_plan] ${dateStr}\n${g.reply}`, durationMs: Date.now() - start };
    }
  }

  const claude = await claudeCodeTask(prompt, "claude-haiku-4");
  return {
    success: claude.success,
    result: `[sprint_plan] ${dateStr}\n${claude.output || "(失敗)"}`,
    durationMs: Date.now() - start,
  };
}
