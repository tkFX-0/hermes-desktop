import { describe, expect, it } from "vitest";
import {
  buildRuntimeSkillsCatalogContext,
  buildRuntimeSkillsContextForPrompt,
  detectActiveRuntimeSkillIds,
  RUNTIME_SKILL_CATALOG,
  SKILLS_BOUNDARY_BLOCK
} from "../../../../scripts/lib/shikishima-runtime-skills.mjs";
import {
  appendThreadMessage,
  rebuildPerAgentThreadsFromShared,
  syncConversationSummaryFromThread
} from "../../../../scripts/lib/discord-agent-thread-store.mjs";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("shikishima runtime skills", () => {
  it("catalog has 4 skills from conversation log", () => {
    expect(RUNTIME_SKILL_CATALOG).toHaveLength(4);
    expect(RUNTIME_SKILL_CATALOG.map((s) => s.id)).toContain("shikishima-code-reviewer");
  });

  it("boundary block forbids EA skill confusion", () => {
    expect(SKILLS_BOUNDARY_BLOCK).toMatch(/MT5\/EA/);
    expect(SKILLS_BOUNDARY_BLOCK).toMatch(/ではない/);
  });

  it("detects skill from user line", () => {
    const ids = detectActiveRuntimeSkillIds("コードレビューして !kaihatu レビュー");
    expect(ids).toContain("shikishima-code-reviewer");
  });

  it("injects catalog when user mentions スキル", () => {
    const ctx = buildRuntimeSkillsContextForPrompt("shikishima", "Skills 全部取り入れて");
    expect(ctx).toMatch(/shikishima-code-reviewer/);
    expect(ctx).toMatch(/境界/);
  });

  it("catalog context within prompt budget", () => {
    expect(buildRuntimeSkillsCatalogContext().length).toBeLessThanOrEqual(520);
  });
});

describe("rebuild per-agent threads", () => {
  let memRoot = "";
  const channelId = "test-rebuild-ch";

  beforeEach(() => {
    memRoot = mkdtempSync(join(tmpdir(), "shiki-rebuild-"));
    process.env.SHIKISHIMA_THREAD_MEM_OVERRIDE = memRoot;
  });

  afterEach(() => {
    rmSync(memRoot, { recursive: true, force: true });
    delete process.env.SHIKISHIMA_THREAD_MEM_OVERRIDE;
  });

  it("hydrates tsumugi agent thread from shared assistant rows", () => {
    appendThreadMessage(channelId, {
      role: "user",
      content: "user says hi",
      threadAgentId: "shikishima"
    });
    appendThreadMessage(channelId, {
      role: "assistant",
      agentId: "tsumugi",
      content: "tsumugi reply"
    });
    rebuildPerAgentThreadsFromShared(channelId);
    const ctx = appendThreadMessage(channelId, { role: "user", content: "x" });
    expect(ctx).toBeTruthy();
    syncConversationSummaryFromThread(channelId);
    const summaryPath = join(memRoot, "conversation-summary.json");
    expect(existsSync(summaryPath)).toBe(true);
    const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
    expect(summary.source).toMatch(/discord-thread/);
    expect(summary.summary.length).toBeGreaterThan(0);
  });
});
