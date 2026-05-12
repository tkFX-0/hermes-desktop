import { randomUUID } from "node:crypto";
import path from "node:path";
import { rmSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { renderApprovalReportMarkdown } from "../../../src/main/ichikishima/approval";
import { runLocalPilotFullLoop } from "../../../src/main/ichikishima/pilot";

describe("Local pilot full loop", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");
  const suffix = randomUUID();
  const approvalSd = `.vitest-lpfl-ap-${suffix}`;
  const auditSd = `.vitest-lpfl-au-${suffix}`;
  const dateUtc = "2099-05-15";
  const outRel = path.posix.join("output", `.loop-${suffix}.txt`);

  it("chains Hermes Pilot and Ichikishima orchestration with readiness tagging", () => {
    try {
      const outcome = runLocalPilotFullLoop({
        projectRoot,
        zoneRoot,
        taskId: `loop_${suffix.slice(0, 8)}`,
        title: "full loop sandbox",
        description: "read/write と危険操作ブロックのみ",
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
        outputRelativePath: outRel,
      });

      expect(outcome.requiresUserApproval).toBe(true);
      expect(outcome.shouldSpeak).toBe(false);

      expect(outcome.readinessStatus === "READY_FOR_LOCAL_FULL_LOOP").toBe(
        true,
      );
      expect(outcome.hermesPilotResult.status).toBe("completed");
      expect(outcome.finalUserSummary.length).toBeGreaterThan(2);
      expect(outcome.readinessReasons).toHaveLength(0);

      expect(outcome.ichikishimaOrchestration.finalDecision.shouldSpeak).toBe(
        false,
      );
      expect(outcome.hermesPilotResult.forbiddenOperations).toHaveLength(0);

      expect(outcome.hermesPilotResult.autoExecutable).toBe(false);

      expect(
        outcome.ichikishimaOrchestration.approvalReport.requiresUserApproval,
      ).toBe(true);
      expect(
        renderApprovalReportMarkdown(
          outcome.ichikishimaOrchestration.approvalReport,
        ).length,
      ).toBeGreaterThan(80);
    } finally {
      rmSync(path.join(zoneRoot, approvalSd), { recursive: true, force: true });
      rmSync(path.join(zoneRoot, auditSd), { recursive: true, force: true });
    }
  });

  it("marks readiness as NOT_READY when Pilot fails forbidden classification", () => {
    try {
      const denied = runLocalPilotFullLoop({
        projectRoot,
        zoneRoot,
        taskId: `loop_fail_${suffix.slice(0, 8)}`,
        title: "forbidden expectation",
        description: "",
        actor: "hermes",
        requestedOperations: [{ kind: "memory_db_access" }],
        persistApprovals: false,
        persistAudits: false,
        approvalSubdirectory: approvalSd,
        auditSubdirectory: auditSd,
        dateUtc,
        outputRelativePath: path.posix.join(
          "output",
          `.loop_fail-${suffix}.txt`,
        ),
      });
      expect(denied.readinessStatus).toBe("NOT_READY");
      expect(denied.readinessReasons.length > 0).toBe(true);
    } finally {
      rmSync(path.join(zoneRoot, approvalSd), { recursive: true, force: true });
      rmSync(path.join(zoneRoot, auditSd), { recursive: true, force: true });
    }
  });
});
