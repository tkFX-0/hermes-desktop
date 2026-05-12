import path from "node:path";
import { rmSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

import { saveApprovalQueueItem } from "../../../src/main/ichikishima/approval";
import {
  buildControlCenterRoomsSnapshot,
  type ControlCenterRoomAction,
} from "../../../src/main/ichikishima/control-center/control-center-rooms";
import { getControlCenterReadonlyData } from "../../../src/main/ichikishima/control-center/control-center-data-provider";
import { buildHermesControlledPilotDashboardSummary } from "../../../src/main/ichikishima/hermes/hermes-controlled-pilot-summary";
import { runLocalPilotFullLoop } from "../../../src/main/ichikishima/pilot";

describe("control-center-rooms", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  it("builds snapshot with eight rooms and everything disabled", () => {
    const suffix = randomUUID().slice(0, 10);
    const approvalSd = `.vitest-cc-rooms-ap-${suffix}`;
    const auditSd = `.vitest-cc-rooms-au-${suffix}`;
    const dateUtc = "2099-09-09";

    const loop = runLocalPilotFullLoop({
      projectRoot,
      zoneRoot,
      taskId: `cc_room_${suffix}`,
      title: "room",
      description: "room",
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
      outputRelativePath: path.posix.join("output", `.cc-room-${suffix}.txt`),
    });

    const hit = loop.ichikishimaOrchestration.approvalQueueItems.find(
      (c) => c.ok,
    );
    if (hit?.ok) {
      const p = saveApprovalQueueItem(hit.item, {
        projectRoot,
        zoneRoot,
        approvalSubdirectory: approvalSd,
        dateUtc,
      });
      expect(p.ok).toBe(true);
    }

    const data = getControlCenterReadonlyData({
      projectRoot,
      zoneRoot,
      approvalSubdirectory: approvalSd,
      auditSubdirectory: auditSd,
      dateUtc,
      pilotLoop: loop,
    });

    const snap = buildControlCenterRoomsSnapshot({
      data,
      controlledPilotDashboard: buildHermesControlledPilotDashboardSummary(
        undefined,
        undefined,
      ),
      memoryCandidateApproxCount: null,
      nowUnixMs: 17_779_444_889_925,
    });

    expect(snap.rooms.length).toBe(8);
    expect(snap.rooms.map((r) => r.id)).toEqual([
      "hermes_room",
      "ichikishima_room",
      "approval_room",
      "audit_room",
      "memory_room",
      "controlled_pilot_room",
      "visualization_room",
      "system_room",
    ]);

    const actions = snap.rooms.flatMap((r) => [...r.actions]);
    expect(actions.length).toBeGreaterThan(5);
    for (const a of actions) {
      const act = a as ControlCenterRoomAction;
      expect(act.state).toBe("disabled");
      expect(act.disabledReason.length).toBeGreaterThan(4);
      expect(act.disabledReason).toContain(
        "read_only_foundation:no_execution:",
      );
    }

    rmIfExists(path.join(zoneRoot, approvalSd));
    rmIfExists(path.join(zoneRoot, auditSd));
  });
});

function rmIfExists(abs: string): void {
  try {
    rmSync(abs, { recursive: true, force: true });
  } catch {
    /* ignore cleanup */
  }
}
