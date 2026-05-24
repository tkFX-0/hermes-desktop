/**
 * しきしま SKILLS — 管制塔
 * SK-SHI-01: orchestrate / SK-SHI-02: session_brief / SK-SHI-03: mood_read
 */

import type { SkillInput, SkillOutput, AgentContext } from "./skill-types";
import { claudeCodeTask } from "../claude-code-service";
import { grokChat } from "../shikishima-grok-chat";
import { buildContextPrefix } from "../conversation-context";
import { buildFullMemoryContext } from "../memory-network";
import type { AgentId } from "../agent-definitions";

// ─── SK-SHI-01: orchestrate ──────────────────────────────────────────────────

const ORCHESTRATE_PROMPT = `あなたはしきしまシステムの管制エンジンです。
以下のタスクを分析して、最適な担当エージェントと実行計画を出力してください。

エージェント一覧:
- しずめ: 安全確認・GO/HOLD/REJECT判定
- つむぎ: コード実装・デバッグ・レビュー
- はじめ: 計画立案・タスク分解・優先度付け
- しるべ: 情報収集・記録・引き継ぎ
- ちはや: FX分析・EA監視・プロップファーム管理

回答フォーマット (JSON):
{
  "mainAgent": "エージェントID",
  "subAgents": ["必要なら補助エージェント"],
  "steps": ["実行ステップ1", "ステップ2", ...],
  "reasoning": "なぜそのエージェントか",
  "firstAction": "最初にすること"
}

タスク:
`;

export async function skillOrchestrate(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();

  const result = await grokChat(ORCHESTRATE_PROMPT + input.raw, "grok-4.3");
  if (!result.success) {
    return { success: false, result: `[orchestrate] 失敗: ${result.error}`, durationMs: Date.now() - start };
  }

  // JSON抽出試行
  let parsed: Record<string, unknown> | null = null;
  try {
    const jsonMatch = result.reply.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  } catch { /* テキストそのまま返す */ }

  const reply = parsed
    ? [
        `[orchestrate] 担当: ${parsed["mainAgent"]}`,
        `理由: ${parsed["reasoning"]}`,
        ``,
        `実行ステップ:`,
        ...((parsed["steps"] as string[]) ?? []).map((s, i) => `  ${i + 1}. ${s}`),
        ``,
        `最初のアクション: ${parsed["firstAction"]}`,
      ].join("\n")
    : `[orchestrate]\n${result.reply}`;

  return {
    success: true,
    result: reply,
    data: parsed ?? { raw: result.reply },
    durationMs: Date.now() - start,
  };
}

// ─── SK-SHI-02: session_brief ────────────────────────────────────────────────

export async function skillSessionBrief(_input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();

  const shortTerm = buildContextPrefix();
  const fullCtx   = buildFullMemoryContext(shortTerm);

  if (!fullCtx || fullCtx.trim().length < 10) {
    return {
      success: true,
      result: "[session_brief] セッション情報なし — 新しいセッションです",
      durationMs: Date.now() - start,
    };
  }

  const prompt =
    `以下のコンテキストから、現在のセッション状態を簡潔にまとめてください:\n` +
    `- 今日の進捗 (完了したこと)\n` +
    `- 積み残し (未完了のこと)\n` +
    `- 次のアクション (最優先1件)\n\n` +
    fullCtx.slice(0, 800);

  const result = await claudeCodeTask(prompt, "claude-haiku-4");
  return {
    success: result.success,
    result: `[session_brief]\n${result.output || "(情報取得失敗)"}`,
    durationMs: Date.now() - start,
  };
}

// ─── SK-SHI-03: mood_read ────────────────────────────────────────────────────

const MOOD_CATEGORIES = {
  frustrated:  ["困った", "うまくいかない", "ムカ", "最悪", "疲れた", "もうやだ", "苦しい", "辛い"],
  excited:     ["やった", "いけた", "完璧", "最高", "すごい", "よし", "うれしい", "楽しい"],
  focused:     ["集中", "やるぞ", "一気に", "今すぐ", "急いで", "すぐ"],
  tired:       ["眠い", "疲", "ちょっと休", "夜遅", "もう少し"],
  uncertain:   ["どうしよう", "迷", "わからない", "難しい", "困", "悩"],
};

export async function skillMoodRead(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const text  = input.raw;

  let detectedMood = "neutral";
  let tiredLevel   = 0;

  for (const [mood, keywords] of Object.entries(MOOD_CATEGORIES)) {
    if (keywords.some((kw) => text.includes(kw))) {
      detectedMood = mood;
      break;
    }
  }

  // 疲労レベル (0-3)
  const tiredKw = ["疲", "眠い", "夜", "遅い", "もうやだ", "ちょっと休"];
  tiredLevel = tiredKw.filter((kw) => text.includes(kw)).length;

  const responseMap: Record<string, string> = {
    frustrated: "少し立ち止まって整理しましょう。何が一番の詰まりポイントですか？",
    excited:    "いい調子ですね！その勢いで次のステップに進みましょう。",
    focused:    "集中モードですね。邪魔せず進めます。",
    tired:      "少し疲れているようです。短い休憩を取ってから続けることをお勧めします。",
    uncertain:  "迷っているときは、はじめに相談してタスクを整理しましょう。",
    neutral:    "了解しました。",
  };

  return {
    success: true,
    result: `[mood_read] 感情: ${detectedMood} / 疲労: ${tiredLevel}/3\n→ ${responseMap[detectedMood]}`,
    data: {
      mood: detectedMood as AgentId | string,
      tiredLevel,
      recommendation: tiredLevel >= 2 ? "rest" : detectedMood === "frustrated" ? "break_down" : "continue",
    },
    durationMs: Date.now() - start,
  };
}
