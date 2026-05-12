import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { saveApprovalQueueItem } from "../../../src/main/ichikishima/approval";
import {
  CONTROL_CENTER_V1_DISABLED_ACTION_IDS,
  extractNextGoalsFromMarkdown,
  getControlCenterReadonlyData,
} from "../../../src/main/ichikishima/control-center/control-center-data-provider";
import { getHermesBridgePilotReadiness } from "../../../src/main/ichikishima/hermes/hermes-bridge-readiness";
import { runLocalPilotFullLoop } from "../../../src/main/ichikishima/pilot";

describe("control-center-data-provider", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  it("extracts goal headings only", () => {
    const md = ["## ignore", "### Goal 01 — Alpha", "### Goal 02 — Beta"].join(
      "\n",
    );
    const goals = extractNextGoalsFromMarkdown(md);
    expect(goals.map((g) => g.title)).toEqual(["Alpha", "Beta"]);
  });

  it("bundles readonly data without executable actions", () => {
    const suffix = randomUUID().slice(0, 12);
    const approvalSd = `.vitest-cc-dp-ap-${suffix}`;
    const auditSd = `.vitest-cc-dp-au-${suffix}`;
    const dateUtc = "2099-08-09";

    const loop = runLocalPilotFullLoop({
      projectRoot,
      zoneRoot,
      taskId: `cc_bundle_${suffix}`,
      title: "bundle",
      description: "bundle",
      actor: "hermes",
      requestedOperations: [
        { kind: "zone_delete", requestedPath: "output/pilot-delete-block.txt" },
      ],
      persistApprovals: true,
      persistAudits: true,
      approvalSubdirectory: approvalSd,
      auditSubdirectory: auditSd,
      dateUtc,
      outputRelativePath: path.posix.join("output", `.cc-bundle-${suffix}.txt`),
    });

    const orchestrationHit =
      loop.ichikishimaOrchestration.approvalQueueItems.find(
        (candidate) => candidate.ok,
      );
    expect(orchestrationHit?.ok).toBe(true);

    if (orchestrationHit?.ok) {
      const persistOrchestration = saveApprovalQueueItem(
        orchestrationHit.item,
        {
          projectRoot,
          zoneRoot,
          approvalSubdirectory: approvalSd,
          dateUtc,
        },
      );
      expect(persistOrchestration.ok).toBe(true);
    }

    try {
      const bundle = getControlCenterReadonlyData({
        projectRoot,
        zoneRoot,
        approvalSubdirectory: approvalSd,
        auditSubdirectory: auditSd,
        dateUtc,
        pilotLoop: loop,
      });

      expect(bundle.requiresUserApproval).toBe(true);
      expect(bundle.canExecuteDangerousActions).toBe(false);
      expect(bundle.ipcBinding.rpcLogicalName).toBe(
        "controlCenter.readonly.getAppSnapshot",
      );
      expect(bundle.ipcBinding.payloadSchemaVersion).toBe("v1");
      expect(bundle.disabledActions).toEqual([
        ...CONTROL_CENTER_V1_DISABLED_ACTION_IDS,
      ]);
      expect(bundle.statusCards.includes("READY_FOR_LOCAL_FULL_LOOP")).toBe(
        true,
      );

      expect("total" in bundle.approvalQueueSummary).toBe(true);
      if ("total" in bundle.approvalQueueSummary) {
        expect(bundle.approvalQueueSummary.total).toBeGreaterThanOrEqual(1);
      }

      expect("total" in bundle.auditLogSummary).toBe(true);
      expect(bundle.nextGoals.length).toBeGreaterThan(0);
      expect(
        bundle.latestReports.docRelativePaths.morningReview.endsWith(".md"),
      ).toBe(true);

      expect(JSON.stringify(bundle)).not.toMatch(/SUPER_SECRET|PRIVATE_KEY/);

      const bridgeDup = getHermesBridgePilotReadiness({ projectRoot });
      expect(bundle.readiness.hermesBridgePilot.ready).toBe(bridgeDup.ready);
      expect(bundle.readiness.localFullLoopReady).toBe(true);
      expect(bundle.readiness.controlCenterDesignReady).toBe(true);

      expect(
        bundle.latestReports.latestApprovalReportId?.length ?? 0,
      ).toBeGreaterThan(0);
      expect(bundle.riskSummary.length).toBeGreaterThan(0);
    } finally {
      rmSync(path.join(zoneRoot, approvalSd), { recursive: true, force: true });
      rmSync(path.join(zoneRoot, auditSd), { recursive: true, force: true });
    }
  });
});
