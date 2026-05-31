import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("governance changelog (SideBot)", () => {
  let memoryDir: string;
  let prevMemory: string | undefined;

  beforeEach(async () => {
    memoryDir = mkdtempSync(join(tmpdir(), "shiki-gov-"));
    prevMemory = process.env.SHIKISHIMA_MEMORY_DIR;
    process.env.SHIKISHIMA_MEMORY_DIR = memoryDir;
  });

  afterEach(() => {
    if (prevMemory === undefined) delete process.env.SHIKISHIMA_MEMORY_DIR;
    else process.env.SHIKISHIMA_MEMORY_DIR = prevMemory;
    rmSync(memoryDir, { recursive: true, force: true });
  });

  it("recordGovernanceUpdate persists entries", async () => {
    const { recordGovernanceUpdate, getRecentGovernanceUpdates } = await import(
      "../../../../scripts/lib/governance-changelog.mjs"
    );
    recordGovernanceUpdate({ kind: "test", summary: "entry one", agentId: "shirube" });
    const rows = getRecentGovernanceUpdates(5);
    expect(rows.length).toBe(1);
    expect(rows[0].summary).toContain("entry one");
  });

  it("setGovernanceMetadata does not wipe entries", async () => {
    const {
      recordGovernanceUpdate,
      setGovernanceMetadata,
      getRecentGovernanceUpdates
    } = await import("../../../../scripts/lib/governance-changelog.mjs");
    recordGovernanceUpdate({ kind: "test", summary: "keep me", agentId: "shirube" });
    setGovernanceMetadata({ lastRegistryHash: "abc", lastRegistryVersion: "v-test" });
    const rows = getRecentGovernanceUpdates(5);
    expect(rows.length).toBe(1);
    expect(rows[0].summary).toContain("keep me");
  });
});
