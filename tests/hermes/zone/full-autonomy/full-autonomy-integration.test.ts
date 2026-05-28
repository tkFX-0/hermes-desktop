import { describe, expect, it } from "vitest";
import { connectLedgerToUnifiedSnapshot } from "../../../../src/main/shikishima-full-autonomy/ledger-snapshot-bridge";
import { createDefaultGoalRegistry } from "../../../../src/main/shikishima-full-autonomy/goal-registry";
import { buildUnifiedOutputBundle } from "../../../../src/main/shikishima-full-autonomy/output-policy-integration";
import { generateProposalFromRegistry } from "../../../../src/main/shikishima-full-autonomy/proposal-registry-bridge";
import { runLocalWorkDryRun } from "../../../../src/main/shikishima-full-autonomy/local-work-dry-run";
import { runExternalEffectsDryRun } from "../../../../src/main/shikishima-full-autonomy/external-effects-dry-run";
import { planSecretaryWithoutEmbodiment } from "../../../../src/main/shikishima-full-autonomy/secretary-planner-only";
import { runFullAutonomyCyclePhases2Through7 } from "../../../../src/main/shikishima-full-autonomy/run-full-autonomy-cycle";

describe("Full Autonomy Phases 2-7 integration", () => {
  const registryOptions = { stackchanDeferred: true };
  const registry = createDefaultGoalRegistry(registryOptions);

  it("phase2 connects ledger lines to snapshot", () => {
    const conn = connectLedgerToUnifiedSnapshot({ registry, registryOptions });
    expect(conn.activeGoalId).toBe("shikishima.phase2.unified-state-snapshot");
    expect(conn.ledgerLines.some((l) => l.startsWith("active_goal:"))).toBe(true);
    expect(conn.snapshot.stackchan.holdReasons).toContain("stackchan_embodiment_deferred");
  });

  it("phase3 builds four-surface output bundle", () => {
    const conn = connectLedgerToUnifiedSnapshot({ registry, registryOptions });
    const bundle = buildUnifiedOutputBundle(conn.snapshot);
    expect(bundle.outputs).toHaveLength(4);
    expect(bundle.policyVersion).toBe("phase3-v1");
    expect(bundle.discordBody.length).toBeGreaterThan(0);
  });

  it("phase4 links proposal to registry active goal", () => {
    const conn = connectLedgerToUnifiedSnapshot({ registry, registryOptions });
    const bundle = buildUnifiedOutputBundle(conn.snapshot);
    const proposal = generateProposalFromRegistry(registry, conn.snapshot, registryOptions, bundle);
    expect(proposal.activeGoalId).toBe("shikishima.phase2.unified-state-snapshot");
    expect(proposal.execution).toBe("disabled");
    expect(proposal.nextRallyGoalId).toContain("phase3");
  });

  it("phase5 local work dry-run does not execute write", () => {
    const result = runLocalWorkDryRun({
      targetPath: "docs/shikishima/test.md",
      operation: "write",
      taskLabel: "test"
    });
    expect(result.execution).toBe("disabled");
    expect(result.wouldProceed).toBe(false);
  });

  it("phase6 external effects dry-run blocks actual execution", () => {
    const result = runExternalEffectsDryRun({
      humanGoApproved: false,
      oneShotDeclared: false,
      timeWindowActive: false,
      explicitPermittedGo: false,
      registryOptions
    });
    expect(result.allowsAnyActualExecution).toBe(false);
    expect(result.evaluations.length).toBeGreaterThan(0);
  });

  it("phase7 secretary planner never sends", () => {
    const conn = connectLedgerToUnifiedSnapshot({ registry, registryOptions });
    const plan = planSecretaryWithoutEmbodiment(conn.snapshot, {
      redactedStatusPreview: "status",
      registryOptions
    });
    expect(plan.actualSendPerformed).toBe(false);
    expect(plan.discordVoiceBlocked).toBe(true);
    expect(plan.blockReasons).toContain("stackchan_embodiment_deferred");
  });

  it("orchestrator runs phases 2-7 in order", () => {
    const cycle = runFullAutonomyCyclePhases2Through7({ stackchanDeferred: true });
    expect(cycle.steps.map((s) => s.phase)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(cycle.execution).toBe("disabled");
    expect(cycle.secretaryMode).toBe("planner_only");
    expect(cycle.steps.every((s) => s.ok)).toBe(true);
  });
});
