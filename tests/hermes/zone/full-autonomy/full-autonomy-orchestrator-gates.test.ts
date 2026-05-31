import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  auditOrchestratorGates,
  evaluateRouteGate,
  isOrchestratorRelaxed,
  mayStartOrchestratorLoop
} from "../../../../scripts/lib/orchestrator-gates.mjs";
import { recordUserExecutionScopeGo } from "../../../../scripts/lib/execution-scope-policy.mjs";
import { readOperationalRelease } from "../../../../scripts/lib/operational-release-read.mjs";

describe("orchestrator gates", () => {
  let root = "";

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "shiki-orch-gate-"));
    process.env.VITEST = "true";
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    delete process.env.VITEST;
  });

  it("relaxed mode allows loop without track D file", () => {
    recordUserExecutionScopeGo(root);
    expect(isOrchestratorRelaxed(undefined, root)).toBe(true);
    const loop = mayStartOrchestratorLoop(root);
    expect(loop.allowed).toBe(true);
    const dev = evaluateRouteGate(root, "dev.autonomous", undefined, Date.now());
    expect(dev.allowed).toBe(true);
  });

  it("audit returns catalog and routes", () => {
    recordUserExecutionScopeGo(root);
    const audit = auditOrchestratorGates(root);
    expect(audit.catalog.length).toBeGreaterThan(10);
    expect(audit.routes.length).toBe(4);
  });
});

describe("operational release vitest default", () => {
  it("default release is inactive in vitest", () => {
    process.env.VITEST = "true";
    const r = readOperationalRelease("/tmp");
    expect(r.activated).toBe(false);
    delete process.env.VITEST;
  });
});
