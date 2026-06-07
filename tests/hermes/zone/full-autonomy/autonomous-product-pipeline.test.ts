import { describe, expect, it, vi } from "vitest";
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  appendIdea,
  ensureIdeasFile,
  parseIdeaCommand,
  parseIdeasMarkdown,
  pickNextPendingIdea,
  readIdeas,
  updateIdeaStatus,
  IDEAS_DEFAULT_SEED,
} from "../../../../scripts/lib/ideas-md.mjs";
import {
  buildProductPipelineSteps,
  defaultPipelineState,
  loadPipelineState,
  runDevProductPipelineTick,
  savePipelineState,
} from "../../../../scripts/lib/dev-product-pipeline.mjs";
import {
  buildDefaultArtifacts,
  formatTeamReviewForDiscord,
  runTeamQualityReview,
} from "../../../../scripts/lib/team-quality-review.mjs";
import { saveNpmCheckState } from "../../../../scripts/lib/npm-check-state.mjs";

function makeRoot() {
  const root = mkdtempSync(join(tmpdir(), "dev-pipeline-"));
  const memoryDir = join(root, ".shikishima-memory");
  mkdirSync(memoryDir, { recursive: true });
  saveNpmCheckState(memoryDir, {
    ok: true,
    exitCode: 0,
    finishedAt: new Date().toISOString(),
    summary: "pass",
  });
  ensureIdeasFile(memoryDir);
  return { root, memoryDir };
}

describe("IDEAS.md", () => {
  it("seeds five initial ideas on first ensure", () => {
    const { memoryDir } = makeRoot();
    try {
      const { ideas } = readIdeas(memoryDir);
      expect(ideas.length).toBe(5);
      expect(ideas[0].title).toMatch(/PID/);
      expect(ideas.filter((i) => i.status === "pending").length).toBe(5);
    } finally {
      rmSync(join(memoryDir, ".."), { recursive: true, force: true });
    }
  });

  it("picks pending by priority (high before medium)", () => {
    const ideas = parseIdeasMarkdown(IDEAS_DEFAULT_SEED);
    const next = pickNextPendingIdea(ideas);
    expect(next?.priority).toBe("high");
    expect(next?.title).toMatch(/PID/);
  });

  it("parses and appends via !idea command", () => {
    const { memoryDir } = makeRoot();
    try {
      const parsed = parseIdeaCommand("!idea バックテスト自動分析 — Python + README + テスト");
      expect(parsed?.title).toBe("バックテスト自動分析");
      expect(parsed?.completionCriteria).toMatch(/Python/);
      const r = appendIdea(memoryDir, parsed!);
      expect(r.ok).toBe(true);
      const { ideas } = readIdeas(memoryDir);
      expect(ideas.some((i) => i.title === "バックテスト自動分析")).toBe(true);
    } finally {
      rmSync(join(memoryDir, ".."), { recursive: true, force: true });
    }
  });

  it("updates status to completed", () => {
    const { memoryDir } = makeRoot();
    try {
      const { ideas } = readIdeas(memoryDir);
      const title = ideas[0].title;
      updateIdeaStatus(memoryDir, title, "completed");
      const after = readIdeas(memoryDir).ideas.find((i) => i.title === title);
      expect(after?.status).toBe("completed");
    } finally {
      rmSync(join(memoryDir, ".."), { recursive: true, force: true });
    }
  });
});

describe("team quality review", () => {
  it("all PASS when artifacts meet criteria", () => {
    const idea = { title: "テストツール", completionCriteria: "README + テスト" };
    const artifacts = buildDefaultArtifacts("/tmp", idea, {
      hasCode: true,
      hasTests: true,
      hasReadme: true,
      checkGreen: true,
    });
    const result = runTeamQualityReview({ idea, artifacts, round: 1 });
    expect(result.allPass).toBe(true);
    expect(result.reviews.every((r) => r.verdict === "PASS")).toBe(true);
    const discord = formatTeamReviewForDiscord(result, idea.title);
    expect(discord).toMatch(/全員 PASS/);
  });

  it("NEEDS_WORK triggers retry summary", () => {
    const idea = { title: "テストツール" };
    const artifacts = buildDefaultArtifacts("/tmp", idea, {
      hasCode: true,
      hasTests: false,
      hasReadme: false,
      checkGreen: false,
    });
    const result = runTeamQualityReview({ idea, artifacts, round: 1 });
    expect(result.allPass).toBe(false);
    expect(result.needsWork.length).toBeGreaterThan(0);
  });
});

describe("dev-product-pipeline tick", () => {
  it("starts /goal from pending idea", async () => {
    const { root, memoryDir } = makeRoot();
    try {
      const notifications: string[] = [];
      const startGoalFromIdea = vi.fn(async () => ({ ok: true, goalId: "goal-test-1" }));
      const result = await runDevProductPipelineTick(memoryDir, root, {
        notify: async (text: string) => {
          notifications.push(text);
        },
        startGoalFromIdea,
        getActiveGoal: () => null,
        config: { maxRounds: 3, maxIdeaMs: 86400000, tickMs: 60000 },
      });
      expect(result.action).toBe("started");
      expect(startGoalFromIdea).toHaveBeenCalledOnce();
      const state = loadPipelineState(memoryDir);
      expect(state.phase).toBe("goal_running");
      expect(state.goalId).toBe("goal-test-1");
      const inProgress = readIdeas(memoryDir).ideas.find((i) => i.status === "in_progress");
      expect(inProgress).toBeTruthy();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("holds on shizume HOLD after goal completes", async () => {
    const { root, memoryDir } = makeRoot();
    try {
      const { ideas } = readIdeas(memoryDir);
      const title = ideas[0].title;
      updateIdeaStatus(memoryDir, title, "in_progress");
      savePipelineState(memoryDir, {
        ...defaultPipelineState(),
        phase: "goal_running",
        activeIdeaTitle: title,
        goalId: "goal-hold",
        startedAt: new Date().toISOString(),
      });
      const notifications: string[] = [];
      const result = await runDevProductPipelineTick(memoryDir, root, {
        notify: async (text: string) => {
          notifications.push(text);
        },
        getGoal: () => ({ id: "goal-hold", status: "completed", steps: [] }),
        evaluateShizumeGate: () => ({ go: false, reason: "しずめ HOLD" }),
        config: { maxRounds: 3, maxIdeaMs: 86400000, tickMs: 60000 },
      });
      expect(result.action).toBe("hold_shizume");
      const held = readIdeas(memoryDir).ideas.find((i) => i.title === title);
      expect(held?.status).toBe("hold");
      expect(notifications.some((n) => n.includes("⏸"))).toBe(true);
      expect(loadPipelineState(memoryDir).phase).toBe("idle");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("retries on NEEDS_WORK then completes on all PASS", async () => {
    const { root, memoryDir } = makeRoot();
    try {
      const { ideas } = readIdeas(memoryDir);
      const idea = ideas[0];
      updateIdeaStatus(memoryDir, idea.title, "review");
      savePipelineState(memoryDir, {
        ...defaultPipelineState(),
        phase: "team_review",
        activeIdeaTitle: idea.title,
        goalId: "goal-done",
        round: 1,
        startedAt: new Date().toISOString(),
      });
      const notifications: string[] = [];
      const startGoalFromIdea = vi.fn(async () => ({ ok: true, goalId: "goal-retry" }));

      const tick1 = await runDevProductPipelineTick(memoryDir, root, {
        notify: async (text: string) => {
          notifications.push(text);
        },
        startGoalFromIdea,
        scanArtifacts: () =>
          buildDefaultArtifacts(root, idea, {
            hasCode: true,
            hasTests: false,
            hasReadme: false,
            checkGreen: false,
          }),
        isCheckGreen: () => true,
        config: { maxRounds: 3, maxIdeaMs: 86400000, tickMs: 60000 },
      });
      expect(tick1.action).toBe("retry");
      expect(notifications.some((n) => n.includes("ラウンド2"))).toBe(true);

      savePipelineState(memoryDir, {
        ...loadPipelineState(memoryDir),
        phase: "team_review",
        round: 2,
      });
      const tick2 = await runDevProductPipelineTick(memoryDir, root, {
        notify: async (text: string) => {
          notifications.push(text);
        },
        scanArtifacts: () =>
          buildDefaultArtifacts(root, idea, {
            hasCode: true,
            hasTests: true,
            hasReadme: true,
            checkGreen: true,
          }),
        isCheckGreen: () => true,
        config: { maxRounds: 3, maxIdeaMs: 86400000, tickMs: 60000 },
      });
      expect(tick2.action).toBe("completed");
      expect(tick2.outputPath).toMatch(/^outputs\//);
      const completed = readIdeas(memoryDir).ideas.find((i) => i.title === idea.title);
      expect(completed?.status).toBe("completed");
      expect(notifications.some((n) => n.includes("✅"))).toBe(true);
      const stateMd = readFileSync(join(memoryDir, "STATE.md"), "utf-8");
      expect(stateMd).toMatch(/完成品/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("holds after 3 review rounds without PASS", async () => {
    const { root, memoryDir } = makeRoot();
    try {
      const { ideas } = readIdeas(memoryDir);
      const idea = ideas[1];
      updateIdeaStatus(memoryDir, idea.title, "review");
      savePipelineState(memoryDir, {
        ...defaultPipelineState(),
        phase: "team_review",
        activeIdeaTitle: idea.title,
        round: 3,
        startedAt: new Date().toISOString(),
      });
      const notifications: string[] = [];
      const result = await runDevProductPipelineTick(memoryDir, root, {
        notify: async (text: string) => {
          notifications.push(text);
        },
        scanArtifacts: () =>
          buildDefaultArtifacts(root, idea, {
            hasCode: false,
            hasTests: false,
            hasReadme: false,
            checkGreen: false,
          }),
        config: { maxRounds: 3, maxIdeaMs: 86400000, tickMs: 60000 },
      });
      expect(result.action).toBe("hold_max_rounds");
      expect(readIdeas(memoryDir).ideas.find((i) => i.title === idea.title)?.status).toBe("hold");
      expect(notifications.some((n) => n.includes("3ラウンド未達"))).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("product pipeline steps", () => {
  it("builds full team goal steps", () => {
    const steps = buildProductPipelineSteps({
      idea: { title: "サンプル", completionCriteria: "README" },
      feedback: ["しるべ: README 不足"],
    });
    expect(steps).toHaveLength(5);
    expect(steps.map((s) => s.agent)).toEqual(["hajime", "shirube", "tsumugi", "shizume", "shirube"]);
    expect(steps[0].description).toMatch(/改善フィードバック/);
  });
});
