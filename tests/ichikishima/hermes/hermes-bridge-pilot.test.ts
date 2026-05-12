import { randomUUID } from "node:crypto";
import path from "node:path";
import { rmSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { routeHermesOperation } from "../../../src/main/ichikishima/hermes/hermes-bridge";
import { runHermesLocalPilotTask } from "../../../src/main/ichikishima/hermes/hermes-local-pilot";
import { runLocalPilotFullLoop } from "../../../src/main/ichikishima/pilot/local-pilot-full-loop";

describe("Hermes Bridge Pilot (no real Hermes)", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  it("classifies dependency / escalation / forbidden operations", () => {
    const dep = routeHermesOperation({
      kind: "dependency_install",
      detail: "add dev tool",
    });
    expect(dep.tier).toBe("bridge_requires_approval");

    const depBlocked = routeHermesOperation({
      kind: "dependency_install",
      disposition: "policy_blocked",
    });
    expect(depBlocked.tier).toBe("forbidden_boundary");
    if (depBlocked.tier === "forbidden_boundary") {
      expect(depBlocked.reasonCode).toBe("DEPENDENCY_INSTALL_POLICY_BLOCKED");
    }

    const esc = routeHermesOperation({
      kind: "external_ai_escalation",
      detail: "second opinion model",
    });
    expect(esc.tier).toBe("bridge_requires_approval");

    for (const op of [
      { kind: "memory_db_access" as const, detail: "sqlite" },
      { kind: "mt5_ea_access" as const, detail: "account" },
      { kind: "env_secret_read" as const, detail: ".env" },
    ]) {
      const r = routeHermesOperation(op);
      expect(r.tier).toBe("forbidden_boundary");
    }
  });

  it("routes read/write to zone APIs and blocks destructive ops to approval stubs", () => {
    const suffix = randomUUID();
    const approvalSd = `.vitest-bp-ap-${suffix}`;
    const auditSd = `.vitest-bp-au-${suffix}`;
    const dateUtc = "2099-06-01";
    const outRel = path.posix.join("output", `.bridge-pilot-${suffix}.txt`);

    try {
      const pilot = runHermesLocalPilotTask({
        projectRoot,
        zoneRoot,
        taskId: `bp_${suffix.slice(0, 8)}`,
        title: "bridge pilot matrix",
        description: "疑似操作リスト — 実Hermesなし",
        actor: "hermes",
        requestedOperations: [
          { kind: "zone_read", requestedPath: "sample/safe-sample.txt" },
          {
            kind: "zone_write",
            requestedPath: path.posix.join("tmp", `bp-write-${suffix}.txt`),
            content: "bridge pilot write probe",
          },
          {
            kind: "zone_delete",
            requestedPath: "output/pilot-delete-block.txt",
          },
          { kind: "execute_shell", command: "node", args: ["-e", "0"] },
          {
            kind: "network_http",
            url: "https://example.invalid/hermes-bridge-pilot",
          },
          { kind: "git_operation", operation: "status" },
          {
            kind: "dependency_install",
            detail: "npm add left-pad",
          },
          {
            kind: "external_ai_escalation",
            detail: "invoke cloud reviewer",
          },
        ],
        persistApprovals: true,
        persistAudits: true,
        approvalSubdirectory: approvalSd,
        auditSubdirectory: auditSd,
        dateUtc,
        sampleInputRelativePath: "sample/input.txt",
        outputRelativePath: outRel,
      });

      expect(pilot.requiresUserApproval).toBe(true);
      expect(pilot.autoExecutable).toBe(false);

      expect(
        pilot.operations.some(
          (o) =>
            o.operation.kind === "zone_read" &&
            o.summary.includes("extra read succeeded"),
        ),
      ).toBe(true);

      expect(
        pilot.operations.some(
          (o) =>
            o.operation.kind === "zone_write" &&
            "requestedPath" in o.operation &&
            String(o.operation.requestedPath).includes(`bp-write-${suffix}`) &&
            o.summary.includes("succeeded"),
        ),
      ).toBe(true);

      const okItems = pilot.approvalItems.filter((c) => c.ok);
      expect(okItems.length).toBeGreaterThanOrEqual(5);
      expect(
        okItems.every(
          (c) =>
            c.item.requiresUserApproval === true &&
            c.item.autoExecutable === false,
        ),
      ).toBe(true);

      const depItem = okItems.find(
        (c) => c.item.actionType === "dependency_install",
      );
      expect(depItem).toBeDefined();

      const escItem = okItems.find(
        (c) => c.item.actionType === "external_escalation",
      );
      expect(escItem).toBeDefined();

      expect(pilot.approvalReport).not.toBeNull();
      if (pilot.approvalReport) {
        expect(pilot.approvalReport.requiresUserApproval).toBe(true);
        expect(pilot.approvalReport.autoApproved).toBe(false);
      }
    } finally {
      rmSync(path.join(zoneRoot, approvalSd), { recursive: true, force: true });
      rmSync(path.join(zoneRoot, auditSd), { recursive: true, force: true });
    }
  });

  it("fails pilot early when dependency_install is policy_blocked or raw boundary ops appear", () => {
    const suffix = randomUUID();
    const blocked = runHermesLocalPilotTask({
      projectRoot,
      zoneRoot,
      taskId: `pol_${suffix.slice(0, 8)}`,
      title: "policy block",
      description: "",
      actor: "hermes",
      requestedOperations: [
        {
          kind: "dependency_install",
          disposition: "policy_blocked",
        },
      ],
      persistApprovals: false,
      persistAudits: false,
      dateUtc: "2099-07-01",
      outputRelativePath: path.posix.join("output", `.pol-${suffix}.txt`),
    });
    expect(blocked.status).toBe("failed");
    expect(blocked.forbiddenOperations).toHaveLength(1);

    const raw = runHermesLocalPilotTask({
      projectRoot,
      zoneRoot,
      taskId: `raw_${suffix.slice(0, 8)}`,
      title: "raw",
      description: "",
      actor: "hermes",
      requestedOperations: [{ kind: "memory_db_access" }],
      persistApprovals: false,
      persistAudits: false,
      dateUtc: "2099-07-01",
      outputRelativePath: path.posix.join("output", `.raw-${suffix}.txt`),
    });
    expect(raw.status).toBe("failed");
  });

  it("runLocalPilotFullLoop keeps shouldSpeak:false and readiness when pilot completes", () => {
    const suffix = randomUUID();
    const approvalSd = `.vitest-bp-loop-${suffix}`;
    const auditSd = `.vitest-bp-loop-au-${suffix}`;
    const dateUtc = "2099-08-01";

    try {
      const loop = runLocalPilotFullLoop({
        projectRoot,
        zoneRoot,
        taskId: `loop_${suffix.slice(0, 8)}`,
        title: "full loop probe",
        description: "",
        actor: "hermes",
        requestedOperations: [
          { kind: "zone_read", requestedPath: "sample/input.txt" },
        ],
        persistApprovals: false,
        persistAudits: false,
        approvalSubdirectory: approvalSd,
        auditSubdirectory: auditSd,
        dateUtc,
        outputRelativePath: path.posix.join("output", `.loop-${suffix}.txt`),
      });
      expect(loop.shouldSpeak).toBe(false);
      expect(loop.requiresUserApproval).toBe(true);
      expect(
        loop.readinessStatus === "READY_FOR_LOCAL_FULL_LOOP" ||
          loop.readinessStatus === "NOT_READY",
      ).toBe(true);
    } finally {
      rmSync(path.join(zoneRoot, approvalSd), { recursive: true, force: true });
      rmSync(path.join(zoneRoot, auditSd), { recursive: true, force: true });
    }
  });
});
