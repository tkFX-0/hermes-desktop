/**
 * /goal コマンド — 目標管理エンジン
 * ストレージ: .shikishima-memory/goals/<id>.json
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

// ─── ストレージ ───────────────────────────────────────────────────────────────

export function goalsDir(memoryDir) {
  const d = join(memoryDir, "goals");
  mkdirSync(d, { recursive: true });
  return d;
}

export function createGoal(memoryDir, description) {
  const id = `goal-${Date.now()}`;
  const goal = {
    id,
    description,
    status: "active",
    steps: [],
    currentStep: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  writeFileSync(join(goalsDir(memoryDir), `${id}.json`), JSON.stringify(goal, null, 2), "utf8");
  return goal;
}

export function saveGoal(memoryDir, goal) {
  goal.updatedAt = new Date().toISOString();
  writeFileSync(join(goalsDir(memoryDir), `${goal.id}.json`), JSON.stringify(goal, null, 2), "utf8");
}

export function getActiveGoal(memoryDir) {
  const dir = goalsDir(memoryDir);
  const files = readdirSync(dir).filter(f => f.endsWith(".json")).sort().reverse();
  for (const f of files) {
    try {
      const g = JSON.parse(readFileSync(join(dir, f), "utf8"));
      if (g.status === "active" || g.status === "paused") return g;
    } catch { /* skip */ }
  }
  return null;
}

// ─── ステップパーサー ─────────────────────────────────────────────────────────

export function parseStepsFromLLM(text) {
  // JSON 配列を探す（コードブロック内も含む）
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\[[\s\S]*\])/);
  const raw = match ? (match[1] ?? match[0]) : text;
  try {
    const arr = JSON.parse(raw.trim());
    if (!Array.isArray(arr)) return null;
    return arr.map((s, i) => ({
      step: typeof s.step === "number" ? s.step : i + 1,
      description: String(s.description ?? s.task ?? s),
      agent: String(s.agent ?? "shikishima"),
      autonomyLevel: Number(s.autonomyLevel ?? s.level ?? 2),
      status: "pending",
      result: null,
    }));
  } catch {
    return null;
  }
}

// ─── フォーマット ─────────────────────────────────────────────────────────────

const STATUS_ICON = { completed: "✅", running: "⏳", failed: "❌", paused: "⏸", pending: "⬜" };

export function formatGoalStatus(goal) {
  const total = goal.steps.length;
  const done = goal.steps.filter(s => s.status === "completed").length;
  const lines = [
    `🎯 **目標**: ${goal.description}`,
    `状態: \`${goal.status}\` | 進捗: ${done}/${total} ステップ`,
  ];
  if (goal.steps.length === 0) {
    lines.push("（ステップ計画中…）");
  } else {
    lines.push("");
    for (const s of goal.steps) {
      const icon = STATUS_ICON[s.status] ?? "⬜";
      lines.push(`${icon} **Step ${s.step}** (L${s.autonomyLevel}・${s.agent}): ${s.description}`);
    }
  }
  return lines.join("\n").slice(0, 1900);
}

export function formatGoalPlanReady(goal) {
  const lines = [
    `🎯 **目標受領**: ${goal.description}`,
    `🧭 **はじめ** がタスク分解しました — ${goal.steps.length} ステップ:`,
    "",
  ];
  for (const s of goal.steps) {
    const auto = s.autonomyLevel <= 2 ? "自動" : `L${s.autonomyLevel}・要確認`;
    lines.push(`**Step ${s.step}** (${auto}・${s.agent}): ${s.description}`);
  }
  lines.push("");
  const autoCount = goal.steps.filter(s => s.autonomyLevel <= 2).length;
  const holdCount = goal.steps.length - autoCount;
  lines.push(`▶ 自動実行: ${autoCount} ステップ | ⏸ 確認待ち: ${holdCount} ステップ`);
  if (autoCount > 0) lines.push("最初のステップを自動で実行します…");
  return lines.join("\n").slice(0, 1900);
}

// ─── 自律レベル判定 ───────────────────────────────────────────────────────────

export const L3_HOLD_PROMPT = (step) =>
  `⏸ **L${step.autonomyLevel} 確認待ち** — Step ${step.step}: ${step.description}\n\n` +
  `**何を**: ${step.description}\n` +
  `**エージェント**: ${step.agent}\n` +
  `**リスク**: L${step.autonomyLevel} 操作（ファイル変更・外部操作を含む可能性）\n` +
  `**戻し方**: git revert または手動で元のファイルを復元\n\n` +
  `承認するなら \`/goal go\` を送ってください。スキップ: \`/goal cancel\``;
