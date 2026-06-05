import { describe, expect, it, afterEach } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  tryAcquireWorkflowTickLock,
  releaseWorkflowTickLock
} from "../../../../scripts/lib/workflow-tick-lock.mjs";

describe("workflow tick lock", () => {
  let dir = "";

  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  it("reclaims lock when holder pid is dead", () => {
    dir = mkdtempSync(join(tmpdir(), "wf-lock-"));
    const first = tryAcquireWorkflowTickLock(dir, "test");
    expect(first.acquired).toBe(true);
    releaseWorkflowTickLock(dir);

    const lp = join(dir, "locks", "workflow-tick.lock");
    mkdirSync(join(dir, "locks"), { recursive: true });
    writeFileSync(lp, `999999999\n${Date.now()}\nstale-bot\n`, "utf8");

    const second = tryAcquireWorkflowTickLock(dir, "test2");
    expect(second.acquired).toBe(true);
    releaseWorkflowTickLock(dir);
  });
});
