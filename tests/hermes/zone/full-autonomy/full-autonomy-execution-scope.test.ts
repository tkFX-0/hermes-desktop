import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  enqueueWorkflow,
  loadWorkflowQueue,
  runAutonomousWorkflowTick
} from "../../../../scripts/lib/autonomous-workflow-engine.mjs";
import {
  isScopedExecutionAllowed,
  recordUserExecutionScopeGo,
  resolveExecutionScopePolicy
} from "../../../../scripts/lib/execution-scope-policy.mjs";

describe("execution scope policy", () => {
  let root = "";

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "shiki-scope-"));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("records user GO for mt5 backtest and autonomous dev", () => {
    recordUserExecutionScopeGo(root);
    expect(isScopedExecutionAllowed("mt5_backtest", undefined, root)).toBe(true);
    expect(isScopedExecutionAllowed("autonomous_dev", undefined, root)).toBe(true);
    expect(isScopedExecutionAllowed("live_trading", undefined, root)).toBe(false);
    expect(isScopedExecutionAllowed("git_push", undefined, root)).toBe(false);
    const p = resolveExecutionScopePolicy(undefined, root);
    expect(p.globalDecision).toBe("HOLD");
    expect(p.autonomousDevAutoLoop).toBe(true);
  });

  it("workflow advances one stage when autonomous dev GO", async () => {
    recordUserExecutionScopeGo(root);
    enqueueWorkflow(root, "vitest workflow smoke");
    const q0 = loadWorkflowQueue(root);
    expect(q0.items[0].stage).toBe("instruction");

    const tick = await runAutonomousWorkflowTick(root, {
      SHIKISHIMA_DEV_PIPELINE_ENABLED: "0"
    });
    expect(tick.allowed).toBe(true);
    expect(tick.processed).toBeGreaterThanOrEqual(1);

    const q1 = loadWorkflowQueue(root);
    expect(q1.items[0].stage).not.toBe("instruction");
  });
});
