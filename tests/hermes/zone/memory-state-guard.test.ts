import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import {
  approveMemoryProposal,
  formatMemoryProposal,
  proposalPath,
  rejectMemoryProposal,
  reviewMemoryTurns,
} from "../../../scripts/lib/memory-dreaming.mjs";

const tempRoots: string[] = [];

function makeMemoryDir(): string {
  const root = mkdtempSync(join(tmpdir(), "shikishima-memory-state-guard-"));
  tempRoots.push(root);
  mkdirSync(root, { recursive: true });
  writeFileSync(join(root, "SOUL.md"), "# SOUL.md\nIdentity and safety core.\n", "utf-8");
  writeFileSync(join(root, "USER.md"), "# USER.md\n", "utf-8");
  writeFileSync(join(root, "STATE.md"), "# STATE.md\nDreaming propose-only is implemented.\n", "utf-8");
  return root;
}

function writePendingUserProposal(memoryDir: string, id: string): void {
  const candidate = {
    section: "response_style",
    proposedLine: "- tk prefers concise, answer-first Japanese reports.",
    destination: "USER.md > response_style",
    why: "User stated a stable response preference.",
    evidence: "tk prefers concise, answer-first reports.",
  };
  writeFileSync(
    proposalPath(memoryDir, id),
    formatMemoryProposal({
      id,
      candidate,
      createdAt: "2026-06-07T00:00:00.000Z",
    }),
    "utf-8",
  );
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("STATE core memory guard", () => {
  it("does not rewrite STATE during Dreaming review", () => {
    const memoryDir = makeMemoryDir();
    const stateBefore = readFileSync(join(memoryDir, "STATE.md"), "utf-8");

    reviewMemoryTurns(
      memoryDir,
      [{ content: "tk prefers concise, answer-first reports." }],
      { now: new Date("2026-06-07T00:00:00.000Z") },
    );

    expect(readFileSync(join(memoryDir, "STATE.md"), "utf-8")).toBe(stateBefore);
  });

  it("applies approved proposals to USER without touching STATE", () => {
    const memoryDir = makeMemoryDir();
    const stateBefore = readFileSync(join(memoryDir, "STATE.md"), "utf-8");
    const id = "mem-2026-06-07T00-00-00-000Z-01";
    writePendingUserProposal(memoryDir, id);

    const approved = approveMemoryProposal(memoryDir, id);

    expect(approved.ok).toBe(true);
    expect(readFileSync(join(memoryDir, "USER.md"), "utf-8")).toContain(`memory-proposal:${id}`);
    expect(readFileSync(join(memoryDir, "STATE.md"), "utf-8")).toBe(stateBefore);
  });

  it("rejects proposals without touching STATE", () => {
    const memoryDir = makeMemoryDir();
    const stateBefore = readFileSync(join(memoryDir, "STATE.md"), "utf-8");
    const id = "mem-2026-06-07T00-00-01-000Z-01";
    writePendingUserProposal(memoryDir, id);

    const rejected = rejectMemoryProposal(memoryDir, id);

    expect(rejected.ok).toBe(true);
    expect(readFileSync(join(memoryDir, "STATE.md"), "utf-8")).toBe(stateBefore);
  });
});
