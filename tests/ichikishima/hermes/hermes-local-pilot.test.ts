import { randomUUID } from "node:crypto";
import path from "node:path";
import { rmSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { routeHermesOperation } from "../../../src/main/ichikishima/hermes/hermes-bridge";
import { runHermesLocalPilotTask } from "../../../src/main/ichikishima/hermes/hermes-local-pilot";

describe("Hermes local pilot runner", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  const suffix = randomUUID();
  const approvalSd = `.vitest-hlp-ap-${suffix}`;
  const auditSd = `.vitest-hlp-au-${suffix}`;
  const dateUtc = "2099-05-10";
  const outRel = path.posix.join("output", `.result-${suffix}.txt`);

  it("runs dummy read/write, blocks destructive ops and journals approvals safely", () => {
    try {
      const pilot = runHermesLocalPilotTask({
        projectRoot,
        zoneRoot,
        taskId: `task_${suffix.slice(0, 8)}`,
        title: "dummy bridge pilot",
        description: "Hermes本体は起動せず Sandbox のみ評価",
        actor: "hermes",
        requestedOperations: [
          {
            kind: "zone_delete",
            requestedPath: "output/pilot-delete-block.txt",
          },
          { kind: "execute_shell", command: "node", args: ["-e", "0"] },
          {
            kind: "network_http",
            url: "https://example.invalid/hermes-local-pilot",
          },
          { kind: "git_operation", operation: "status" },
        ],
        persistApprovals: true,
        persistAudits: true,
        approvalSubdirectory: approvalSd,
        auditSubdirectory: auditSd,
        dateUtc,
        sampleInputRelativePath: "sample/input.txt",
        outputRelativePath: outRel,
      });

      expect(pilot.status).toBe("completed");
      expect(pilot.requiresUserApproval).toBe(true);
      expect(pilot.autoExecutable).toBe(false);

      const okEntries = pilot.approvalItems.filter((c) => c.ok);
      expect(okEntries.length).toBeGreaterThan(1);
      expect(
        okEntries.every(
          (c) => c.item.requiresUserApproval && !c.item.autoExecutable,
        ),
      ).toBe(true);

      expect(pilot.approvalReport).not.toBeNull();
      expect(
        pilot.auditRecords
          .map((record) => Buffer.from(JSON.stringify(record)).toString("utf8"))
          .join("|"),
      ).not.toMatch(/blocked pilot/i);

      const forbiddenPilot = runHermesLocalPilotTask({
        projectRoot,
        zoneRoot,
        taskId: `forbid_${suffix.slice(0, 8)}`,
        title: "forbidden tier",
        description: "",
        actor: "hermes",
        requestedOperations: [
          { kind: "raw_fs", detail: "fs.readFile shortcut" },
        ],
        persistApprovals: false,
        persistAudits: false,
        approvalSubdirectory: approvalSd,
        auditSubdirectory: auditSd,
        dateUtc,
        outputRelativePath: path.posix.join("output", `.forbid-${suffix}.txt`),
      });
      expect(forbiddenPilot.status).toBe("failed");
      expect(forbiddenPilot.forbiddenOperations).toHaveLength(1);
      expect(routeHermesOperation({ kind: "raw_fs" }).tier).toBe(
        "forbidden_boundary",
      );
    } finally {
      rmSync(path.join(zoneRoot, approvalSd), { recursive: true, force: true });
      rmSync(path.join(zoneRoot, auditSd), { recursive: true, force: true });
    }
  });
});
