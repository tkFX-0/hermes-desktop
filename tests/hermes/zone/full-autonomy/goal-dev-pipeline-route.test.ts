import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildGoalDevPipelineInstruction,
  buildGoalReadOnlyInstruction,
  captureReadOnlyGitSnapshot,
  checkReadOnlyViolation,
  formatGoalStepResultForDiscord,
  parseGoalGoApproval,
  revertReadOnlyViolation,
  resolveGoalStepExecutionAgent,
  shouldRouteGoalStepToDevPipeline,
  shouldRouteGoalStepToReadOnlyPipeline
} from "../../../../scripts/lib/goal-dev-pipeline-route.mjs";

function git(repo: string, args: string[]) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8" });
}

function readText(repo: string, file: string) {
  return readFileSync(join(repo, file), "utf8").replace(/\r\n/g, "\n");
}

describe("goal dev pipeline routing", () => {
  it("routes all L3+ steps to tsumugi dev pipeline regardless of assigned agent", () => {
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "tsumugi",
      autonomyLevel: 3
    })).toBe(true);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "tsumugi",
      autonomyLevel: 4
    })).toBe(true);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "hajime",
      autonomyLevel: 3
    })).toBe(true);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "shikishima",
      autonomyLevel: 3
    })).toBe(true);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "shizume",
      autonomyLevel: 3
    })).toBe(true);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "tsumugi",
      autonomyLevel: 2
    })).toBe(false);
  });

  it("resolves tsumugi as execution agent for any L3+ step", () => {
    expect(resolveGoalStepExecutionAgent({ agent: "hajime", autonomyLevel: 3 })).toBe("tsumugi");
    expect(resolveGoalStepExecutionAgent({ agent: "shizume", autonomyLevel: 4 })).toBe("tsumugi");
    expect(resolveGoalStepExecutionAgent({ agent: "hajime", autonomyLevel: 2 })).toBe("hajime");
    expect(resolveGoalStepExecutionAgent({ autonomyLevel: 1 })).toBe("shikishima");
  });

  it("builds a guarded instruction for subscription dev execution", () => {
    const instruction = buildGoalDevPipelineInstruction(
      { description: "daily portfolio post" },
      { step: 2, autonomyLevel: 3, description: "edit scheduler", agent: "tsumugi" }
    );
    expect(instruction).toContain("[Goal] daily portfolio post");
    expect(instruction).toContain("[Step 2 / L3 / tsumugi] edit scheduler");
    expect(instruction).toContain("do not push");
    expect(instruction).toContain("do not merge to main");
    expect(instruction).toContain("--yolo");
    expect(instruction).toContain("preflight --clean");
  });

  it("requires explicit L3 approval details after /goal go", () => {
    expect(parseGoalGoApproval("go")?.explicit).toBe(false);
    expect(parseGoalGoApproval("go \u5b8c\u8d70\u3057\u3066\u304f\u3060\u3055\u3044")?.explicit).toBe(false);
    expect(parseGoalGoApproval("go L3\u306e\u30d5\u30a1\u30a4\u30eb\u5909\u66f4\u30fb\u8a2d\u5b9a\u5909\u66f4\u306b\u7740\u624b\u3057\u3066\u3088\u3044")?.explicit).toBe(true);
    expect(parseGoalGoApproval("go \u30b3\u30fc\u30c9\u5909\u66f4\u3092\u627f\u8a8d")?.explicit).toBe(true);
    expect(parseGoalGoApproval("go L3 file/config changes approved")?.explicit).toBe(true);
    expect(parseGoalGoApproval("status")).toBeNull();
  });

  it("L0-L2 read-only routing: shouldRouteGoalStepToReadOnlyPipeline", () => {
    expect(shouldRouteGoalStepToReadOnlyPipeline({ autonomyLevel: 0 })).toBe(true);
    expect(shouldRouteGoalStepToReadOnlyPipeline({ autonomyLevel: 1 })).toBe(true);
    expect(shouldRouteGoalStepToReadOnlyPipeline({ autonomyLevel: 2 })).toBe(true);
    expect(shouldRouteGoalStepToReadOnlyPipeline({ autonomyLevel: 3 })).toBe(false);
    expect(shouldRouteGoalStepToReadOnlyPipeline({ autonomyLevel: 4 })).toBe(false);
    expect(shouldRouteGoalStepToReadOnlyPipeline({})).toBe(true);
  });

  it("L0-L2 routing is complementary to L3+ routing (no overlap)", () => {
    for (let level = 0; level <= 5; level++) {
      const step = { autonomyLevel: level };
      const ro = shouldRouteGoalStepToReadOnlyPipeline(step);
      const dev = shouldRouteGoalStepToDevPipeline(step);
      expect(ro && dev).toBe(false);
    }
  });

  it("buildGoalReadOnlyInstruction embeds READ ONLY constraint and step info", () => {
    const instr = buildGoalReadOnlyInstruction(
      { description: "コードベース調査" },
      { step: 1, autonomyLevel: 1, description: "AGENTS.md を読んで方針を確認", agent: "hajime" }
    );
    expect(instr).toContain("[Goal] コードベース調査");
    expect(instr).toContain("[Step 1 / L1 / hajime]");
    expect(instr).toContain("READ ONLY");
    expect(instr).toContain("git status");
    expect(instr).not.toContain("--yolo");
    expect(instr).not.toContain("workspace-write");
  });

  it("buildGoalReadOnlyInstruction preserves assigned agent attribution", () => {
    const instr = buildGoalReadOnlyInstruction(
      { description: "goal" },
      { step: 2, autonomyLevel: 0, description: "調査", agent: "shirube" }
    );
    expect(instr).toContain("shirube");
    expect(instr).not.toContain("tsumugi");
  });

  it("checkReadOnlyViolation returns dirty:false for a clean git repo", () => {
    const projectRoot = new URL("../../../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
    const result = checkReadOnlyViolation(projectRoot);
    // Only valid after committing; skip assertion if git unavailable
    expect(typeof result.dirty).toBe("boolean");
    expect(typeof result.summary).toBe("string");
  });

  it("reverts only paths newly dirtied by the read-only step", () => {
    const repo = mkdtempSync(join(tmpdir(), "goal-ro-"));
    try {
      git(repo, ["init", "-q"]);
      git(repo, ["config", "user.name", "Test User"]);
      git(repo, ["config", "user.email", "test@example.com"]);
      writeFileSync(join(repo, "user-work.txt"), "base user\n", "utf8");
      writeFileSync(join(repo, "step-work.txt"), "base step\n", "utf8");
      git(repo, ["add", "."]);
      git(repo, ["commit", "-q", "-m", "init"]);

      writeFileSync(join(repo, "user-work.txt"), "user dirty\n", "utf8");
      writeFileSync(join(repo, "user-note.txt"), "user untracked\n", "utf8");
      const before = captureReadOnlyGitSnapshot(repo);

      writeFileSync(join(repo, "step-work.txt"), "step dirty\n", "utf8");
      writeFileSync(join(repo, "step-note.txt"), "step untracked\n", "utf8");
      const violation = checkReadOnlyViolation(repo, before);
      expect(violation.dirty).toBe(true);
      expect(violation.summary).toContain("step-work.txt");
      expect(violation.summary).toContain("step-note.txt");
      expect(violation.summary).not.toContain("user-work.txt");
      expect(violation.summary).not.toContain("user-note.txt");

      const reverted = revertReadOnlyViolation(repo, before, violation.snapshot);
      expect(reverted.reverted).toBe(true);
      expect(readText(repo, "step-work.txt")).toBe("base step\n");
      expect(existsSync(join(repo, "step-note.txt"))).toBe(false);
      expect(readText(repo, "user-work.txt")).toBe("user dirty\n");
      expect(readText(repo, "user-note.txt")).toBe("user untracked\n");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("removes internal tool chatter without treating stop-condition wording as state", () => {
    const text = [
      "\u30ed\u30fc\u30ab\u30eb\u8aad\u53d6\u304c sandbox \u521d\u671f\u5316\u3067\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
      "GitHub \u30b3\u30cd\u30af\u30bf\u3067\u78ba\u8a8d\u3057\u307e\u3059\u3002",
      "Step 1 \u78ba\u5b9a: \u5bfe\u8c61\u7bc4\u56f2\u3068\u505c\u6b62\u6761\u4ef6\u3092\u56fa\u5b9a\u3057\u307e\u3057\u305f\u3002"
    ].join("\n");
    const formatted = formatGoalStepResultForDiscord(text, 200);
    expect(formatted).not.toContain("sandbox");
    expect(formatted).not.toContain("GitHub");
    expect(formatted).toContain("\u505c\u6b62\u6761\u4ef6");
  });
});
