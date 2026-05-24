/**
 * しるべ SKILLS — 記録・知識
 * SK-SHI-R03: log_to_obsidian / SK-SHI-R04: recall / SK-SHI-R05: handoff_note
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { SkillInput, SkillOutput, AgentContext } from "./skill-types";
import { claudeCodeTask } from "../claude-code-service";
import { withPersona } from "../agent-persona";

const OBSIDIAN_BASE = join(homedir(), "Documents", "Obsidian", "しきしま");
const MEMORY_BASE   = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".shikishima-memory");

function todayStr(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// ─── SK-SHI-R03: log_to_obsidian ─────────────────────────────────────────────

const CATEGORY_DIRS: Record<string, string> = {
  daily:     "Daily",
  project:   "Projects",
  decision:  "Decisions",
  milestone: "Milestones",
  default:   "Daily",
};

export async function skillLogToObsidian(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start    = Date.now();
  const category = (input.params?.category as string) ?? "default";
  const dir      = join(OBSIDIAN_BASE, CATEGORY_DIRS[category] ?? "Daily");

  try {
    ensureDir(dir);
    const today    = todayStr();
    const filePath = join(dir, `${today}.md`);

    const timestamp = new Date(Date.now() + 9 * 3600 * 1000)
      .toISOString().slice(0, 16).replace("T", " ");

    const entry = `\n\n---\n**${timestamp}**\n\n${input.raw}\n`;

    if (existsSync(filePath)) {
      writeFileSync(filePath, readFileSync(filePath, "utf-8") + entry, "utf-8");
    } else {
      writeFileSync(filePath, `# ${today}\n${entry}`, "utf-8");
    }

    return {
      success: true,
      result:  `[log_to_obsidian] 記録完了: ${filePath.replace(homedir(), "~")}`,
      data:    { filePath, category, today },
      sideEffects: [`Obsidian に記録: ${category}/${today}`],
      durationMs: Date.now() - start,
    };
  } catch (e) {
    return {
      success: false,
      result:  `[log_to_obsidian] 記録失敗: ${(e as Error).message}`,
      durationMs: Date.now() - start,
    };
  }
}

// ─── SK-SHI-R04: recall ──────────────────────────────────────────────────────

export async function skillRecall(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const topic = input.raw.trim();
  const hits:  Array<{ source: string; excerpt: string }> = [];

  // Obsidian ファイルを横断検索
  for (const subdir of ["Daily", "Projects", "Decisions", "Milestones"]) {
    const dir = join(OBSIDIAN_BASE, subdir);
    if (!existsSync(dir)) continue;

    for (const fname of readdirSync(dir).slice(-30)) {  // 最新30ファイル
      if (!fname.endsWith(".md")) continue;
      const content = readFileSync(join(dir, fname), "utf-8");
      if (content.toLowerCase().includes(topic.toLowerCase())) {
        const lines = content.split("\n");
        const idx   = lines.findIndex((l) => l.toLowerCase().includes(topic.toLowerCase()));
        const excerpt = lines.slice(Math.max(0, idx - 1), idx + 3).join("\n").trim();
        hits.push({ source: `${subdir}/${fname}`, excerpt: excerpt.slice(0, 200) });
        if (hits.length >= 5) break;
      }
    }
    if (hits.length >= 5) break;
  }

  // メモリファイルも検索
  for (const fname of ["conversation_summary.json", "relationship.json"]) {
    const fpath = join(MEMORY_BASE, fname);
    if (!existsSync(fpath)) continue;
    const content = readFileSync(fpath, "utf-8");
    if (content.toLowerCase().includes(topic.toLowerCase())) {
      hits.push({ source: `memory/${fname}`, excerpt: content.slice(0, 150) });
    }
  }

  if (hits.length === 0) {
    return {
      success: true,
      result: `[recall] "${topic}" に関する記録は見つかりませんでした`,
      durationMs: Date.now() - start,
    };
  }

  const lines = [
    `[recall] "${topic}" — ${hits.length}件の関連記録`,
    ``,
    ...hits.map((h, i) => `${i + 1}. ${h.source}\n   ${h.excerpt}`),
  ];

  return {
    success: true,
    result: lines.join("\n"),
    data: hits,
    durationMs: Date.now() - start,
  };
}

// ─── SK-SHI-R05: handoff_note ────────────────────────────────────────────────

export async function skillHandoffNote(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const scope = (input.params?.scope as string) ?? "session";

  // 最近のログを収集
  let context = "";
  const today = todayStr();
  const dailyLog = join(OBSIDIAN_BASE, "Daily", `${today}.md`);
  if (existsSync(dailyLog)) {
    context += `\n\n## 今日の記録:\n${readFileSync(dailyLog, "utf-8").slice(0, 600)}`;
  }

  const prompt = withPersona("shirube",
    `以下のコンテキストを元に、次のチャットセッション用の引き継ぎメモを生成してください。\n\n` +
    `スコープ: ${scope}\n追加情報: ${input.raw || "なし"}\n${context}\n\n` +
    `出力フォーマット:\n` +
    `## 前回の状態\n## 完了したこと\n## 積み残し・継続タスク\n## 重要な決定事項\n## 次セッションで最初にすること`
  );

  const claude = await claudeCodeTask(prompt, "claude-sonnet-4-6");
  const note   = claude.success ? claude.output : "(生成失敗)";

  // Obsidian に自動保存
  if (claude.success) {
    const handoffDir = join(OBSIDIAN_BASE, "Handoffs");
    ensureDir(handoffDir);
    const fname = join(handoffDir, `handoff-${today}.md`);
    writeFileSync(fname, `# 引き継ぎメモ ${today}\n\n${note}`, "utf-8");
  }

  return {
    success: claude.success,
    result: `[handoff_note]\n${note}`,
    sideEffects: claude.success ? [`Obsidian に保存: Handoffs/handoff-${today}.md`] : [],
    durationMs: Date.now() - start,
  };
}
