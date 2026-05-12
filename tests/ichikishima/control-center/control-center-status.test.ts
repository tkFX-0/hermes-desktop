import { randomUUID } from "node:crypto";
import path from "node:path";
import { rmSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { saveApprovalQueueItem } from "../../../src/main/ichikishima/approval";
import {
  ICHIKISHIMA_READONLY_DOC_PATHS,
  buildControlCenterReadonlyStatus,
} from "../../../src/main/ichikishima/control-center/control-center-status";
import { runLocalPilotFullLoop } from "../../../src/main/ichikishima/pilot";

describe("control center readonly status snapshot", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");
  const suffix = randomUUID();
  const approvalSd = `.vitest-cc-rs-${suffix}`;
  const auditSd = `.vitest-cc-au-${suffix}`;
  const dateUtc = "2099-05-20";

  it("surfaces READY_FOR_CONTROL_CENTER_V1_DESIGN when loop + approvals exist", () => {
    try {
      const loop = runLocalPilotFullLoop({
        projectRoot,
        zoneRoot,
        taskId: `cc_${suffix.slice(0, 8)}`,
        title: "control center hook",
        description: "read-only model only",
        actor: "hermes",
        requestedOperations: [
          {
            kind: "zone_delete",
            requestedPath: "output/pilot-delete-block.txt",
          },
        ],
        persistApprovals: true,
        persistAudits: true,
        approvalSubdirectory: approvalSd,
        auditSubdirectory: auditSd,
        dateUtc,
        outputRelativePath: path.posix.join("output", `.cc-loop-${suffix}.txt`),
      });

      expect(loop.readinessStatus).toBe("READY_FOR_LOCAL_FULL_LOOP");

      const orchestrationQueueEntry =
        loop.ichikishimaOrchestration.approvalQueueItems.find(
          (candidate) => candidate.ok,
        );
      expect(orchestrationQueueEntry?.ok).toBe(true);

      if (orchestrationQueueEntry?.ok) {
        const persistOrchestration = saveApprovalQueueItem(
          orchestrationQueueEntry.item,
          {
            projectRoot,
            zoneRoot,
            approvalSubdirectory: approvalSd,
            dateUtc,
          },
        );
        expect(persistOrchestration.ok).toBe(true);
      }

      const snapshot = buildControlCenterReadonlyStatus({
        projectRoot,
        zoneRoot,
        approvalSubdirectory: approvalSd,
        auditSubdirectory: auditSd,
        dateUtc,
        pilotLoop: loop,
      });

      expect(snapshot.cards).toContain("READY_FOR_LOCAL_FULL_LOOP");
      expect(snapshot.cards).toContain("CONTROL_CENTER_V1_DESIGN_READY");
      expect(snapshot.approvalQueueSnapCount ?? 0).toBeGreaterThan(0);
      expect(snapshot.cards.includes("BLOCKED")).toBe(false);

      expect(snapshot.bridgeFinalReviewHint).toBe(
        ICHIKISHIMA_READONLY_DOC_PATHS.bridgeFinalReview,
      );
      expect(snapshot.goalCompletionHint).toBe(
        ICHIKISHIMA_READONLY_DOC_PATHS.goalCompletion,
      );
      expect(snapshot.blockedOperationApproxCount ?? 0).toBeGreaterThanOrEqual(
        1,
      );
      expect(snapshot.riskSummaryLines.length).toBeGreaterThan(0);
      expect(snapshot.hermesOperationalLabel).toContain("full_loop_ok");
    } finally {
      rmSync(path.join(zoneRoot, approvalSd), { recursive: true, force: true });
      rmSync(path.join(zoneRoot, auditSd), { recursive: true, force: true });
    }
  });
});
