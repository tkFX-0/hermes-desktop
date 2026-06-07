import { describe, expect, it } from "vitest";
import {
  assertTkOperator,
  executeOperatorDevCommand,
  parseOperatorDevCommand,
} from "../../../../scripts/lib/discord-operator-commands.mjs";
import { saveNpmCheckState } from "../../../../scripts/lib/npm-check-state.mjs";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const TK = "111111111111111111";
const OTHER = "222222222222222222";

function makeRoot() {
  const root = mkdtempSync(join(tmpdir(), "operator-cmd-"));
  const memoryDir = join(root, ".shikishima-memory");
  mkdirSync(memoryDir, { recursive: true });
  saveNpmCheckState(memoryDir, {
    ok: true,
    exitCode: 0,
    finishedAt: new Date().toISOString(),
    summary: "pass",
  });
  return { root, memoryDir };
}

describe("discord operator dev commands", () => {
  it("parses operator commands", () => {
    expect(parseOperatorDevCommand("!merge feat/foo")).toEqual({
      type: "merge",
      branch: "feat/foo",
    });
    expect(parseOperatorDevCommand("!push")?.type).toBe("push");
    expect(parseOperatorDevCommand("!check")?.type).toBe("check");
    expect(parseOperatorDevCommand("!restart")?.type).toBe("restart");
    expect(parseOperatorDevCommand("!log 15")).toEqual({ type: "log", lines: 15 });
  });

  it("rejects non-tk user for !merge", () => {
    const { root, memoryDir } = makeRoot();
    try {
      const result = executeOperatorDevCommand(
        { type: "merge", branch: "feat/x" },
        { root, memoryDir, authorId: OTHER, operatorUserId: TK }
      );
      expect(result.ok).toBe(false);
      expect(result.error).toBe("operator_only");
      expect(result.text).toMatch(/tk/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("allows !merge when shizume GO and check green", () => {
    const { root, memoryDir } = makeRoot();
    try {
      const result = executeOperatorDevCommand(
        { type: "merge", branch: "feat/ok" },
        {
          root,
          memoryDir,
          authorId: TK,
          operatorUserId: TK,
          evaluateMergeGate: () => ({
            ok: true,
            reason: "mock gate",
            structuredVerdict: { verdict: "GO", reason: "ok", risk: [], action: [] },
          }),
          spawnFn: (cmd, args) => {
            if (args[0] === "checkout") return { status: 0, stdout: "", stderr: "" };
            if (args[0] === "merge") return { status: 0, stdout: "merged", stderr: "" };
            if (args[0] === "branch") return { status: 0, stdout: "main", stderr: "" };
            return { status: 0, stdout: "", stderr: "" };
          },
        }
      );
      expect(result.ok).toBe(true);
      expect(result.text).toMatch(/merge/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("blocks !merge when shizume HOLD", () => {
    const { root, memoryDir } = makeRoot();
    try {
      const result = executeOperatorDevCommand(
        { type: "merge", branch: "feat/bad" },
        {
          root,
          memoryDir,
          authorId: TK,
          operatorUserId: TK,
          evaluateMergeGate: () => ({
            ok: false,
            reason: "しずめ HOLD",
            structuredVerdict: { verdict: "HOLD", reason: "vitest", risk: ["x"], action: [] },
          }),
        }
      );
      expect(result.ok).toBe(false);
      expect(result.error).toBe("merge_gate_hold");
      expect(result.text).toMatch(/HOLD/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("assertTkOperator requires configured operator id", () => {
    expect(assertTkOperator(TK, "").ok).toBe(false);
    expect(assertTkOperator(TK, TK).ok).toBe(true);
  });
});
