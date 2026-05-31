import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  enqueueWorkflow,
  loadWorkflowQueue,
  saveWorkflowQueue,
  healWorkflowEvalBacklog,
  setWorkflowPaused,
  completeWorkflowHuman,
  continueWorkflowDevLoop,
  runAutonomousWorkflowTick
} from "../../../../scripts/lib/autonomous-workflow-engine.mjs";
import { shouldNotifyWorkflowProgress } from "../../../../scripts/lib/workflow-discord-notify.mjs";
import {
  checkpointWorkflows,
  ensureWorkflowFromHandoff,
  healStaleRunningItems
} from "../../../../scripts/lib/workflow-resume.mjs";
import { recordUserExecutionScopeGo } from "../../../../scripts/lib/execution-scope-policy.mjs";

describe("workflow resume", () => {
  let root = "";

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "shiki-wf-resume-"));
    recordUserExecutionScopeGo(root);
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("checkpoint marks active items interrupted", () => {
    enqueueWorkflow(root, "EA研究テスト");
    const q = loadWorkflowQueue(root);
    q.items[0].running = true;
    q.items[0].stage = "dev";
    saveWorkflowQueue(root, q);
    const n = checkpointWorkflows(root);
    expect(n).toBeGreaterThan(0);
    const after = loadWorkflowQueue(root);
    expect(after.items[0].interrupted).toBe(true);
    expect(after.items[0].running).toBe(false);
  });

  it("handoff enqueues when queue empty", () => {
    mkdirSync(join(root, ".shikishima-memory"), { recursive: true });
    writeFileSync(
      join(root, ".shikishima-memory", "handoff.json"),
      JSON.stringify({ topics: ["@しきしま EA研究 2万円"] }),
      "utf8"
    );
    const r = ensureWorkflowFromHandoff(root);
    expect(r.action).toBe("enqueued");
    expect(loadWorkflowQueue(root).items.length).toBe(1);
  });

  it("heals stale running flag", () => {
    enqueueWorkflow(root, "test");
    const q = loadWorkflowQueue(root);
    q.items[0].running = true;
    q.items[0].heartbeatAt = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    saveWorkflowQueue(root, q);
    expect(healStaleRunningItems(root)).toBe(1);
  });

  it("healWorkflowEvalBacklog moves eval+devFails to human", () => {
    enqueueWorkflow(root, "EA backlog");
    const q = loadWorkflowQueue(root);
    q.items[0].stage = "eval";
    q.items[0].devFailCount = 2;
    q.items[0].cycle = 2;
    saveWorkflowQueue(root, q);
    expect(healWorkflowEvalBacklog(root)).toBe(1);
    expect(loadWorkflowQueue(root).items[0].stage).toBe("human");
  });

  it("shouldNotifyWorkflowProgress suppresses research/record spam", () => {
    expect(shouldNotifyWorkflowProgress("research", "record")).toBe(false);
    expect(shouldNotifyWorkflowProgress("record", "eval")).toBe(true);
    expect(shouldNotifyWorkflowProgress("dev", "research")).toBe(true);
    expect(shouldNotifyWorkflowProgress("eval", "human", { paused: true })).toBe(false);
  });

  it("setWorkflowPaused marks active items", () => {
    enqueueWorkflow(root, "pause me");
    expect(setWorkflowPaused(root, true)).toBe(1);
    expect(loadWorkflowQueue(root).items[0].paused).toBe(true);
  });

  it("tick does not auto-complete human stage to done", async () => {
    enqueueWorkflow(root, "human gate hold");
    const q = loadWorkflowQueue(root);
    q.items[0].stage = "human";
    saveWorkflowQueue(root, q);
    await runAutonomousWorkflowTick(root, process.env);
    expect(loadWorkflowQueue(root).items[0].stage).toBe("human");
  });

  it("completeWorkflowHuman ack moves human to done", () => {
    enqueueWorkflow(root, "operator ack");
    const q = loadWorkflowQueue(root);
    q.items[0].stage = "human";
    saveWorkflowQueue(root, q);
    expect(completeWorkflowHuman(root)).toBe(1);
    expect(loadWorkflowQueue(root).items[0].stage).toBe("done");
    expect(loadWorkflowQueue(root).items[0].humanAckAt).toBeTruthy();
  });

  it("continueWorkflowDevLoop reopens done to dev with next cycle", () => {
    enqueueWorkflow(root, "EA cycle 2");
    const q = loadWorkflowQueue(root);
    q.items[0].stage = "done";
    q.items[0].cycle = 1;
    saveWorkflowQueue(root, q);
    const c = continueWorkflowDevLoop(root);
    expect(c.n).toBe(1);
    expect(loadWorkflowQueue(root).items[0].stage).toBe("dev");
    expect(loadWorkflowQueue(root).items[0].cycle).toBe(2);
  });
});
