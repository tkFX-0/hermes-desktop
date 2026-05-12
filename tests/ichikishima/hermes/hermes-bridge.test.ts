import { describe, expect, it } from "vitest";

import {
  createHermesBridgeReport,
  createHermesBridgeTask,
  routeHermesOperation,
  type HermesBridgeOperation,
} from "../../../src/main/ichikishima/hermes/hermes-bridge";

describe("Hermes bridge contract surface", () => {
  const safeReads: HermesBridgeOperation[] = [
    { kind: "zone_read", requestedPath: "sample/input.txt" },
    {
      kind: "zone_write",
      requestedPath: "output/result.txt",
      content: "pilot-write",
    },
  ];

  it("routes read/write operations as autonomy zone candidates", () => {
    for (const op of safeReads) {
      expect(routeHermesOperation(op).tier).toBe("allowed_zone_candidate");
    }
  });

  it("routes dangerous zone-adjacent calls to blocked stubs", () => {
    expect(
      routeHermesOperation({
        kind: "zone_delete",
        requestedPath: "output/x.txt",
      }).tier,
    ).toBe("blocked_zone_sensitive");
    expect(
      routeHermesOperation({
        kind: "execute_shell",
        command: "node",
      }).tier,
    ).toBe("blocked_zone_sensitive");
    expect(
      routeHermesOperation({
        kind: "network_http",
        url: "https://example.invalid",
      }).tier,
    ).toBe("blocked_zone_sensitive");
    expect(
      routeHermesOperation({ kind: "git_operation", operation: "status" }).tier,
    ).toBe("blocked_zone_sensitive");
  });

  it("rejects forbidden raw / secret / EA / MT5 style operations", () => {
    expect(routeHermesOperation({ kind: "raw_fs" }).tier).toBe(
      "forbidden_boundary",
    );
    expect(routeHermesOperation({ kind: "raw_child_process" }).tier).toBe(
      "forbidden_boundary",
    );
    expect(routeHermesOperation({ kind: "raw_network" }).tier).toBe(
      "forbidden_boundary",
    );
    expect(routeHermesOperation({ kind: "raw_git" }).tier).toBe(
      "forbidden_boundary",
    );
    expect(routeHermesOperation({ kind: "memory_db_access" }).tier).toBe(
      "forbidden_boundary",
    );
    expect(routeHermesOperation({ kind: "mt5_ea_access" }).tier).toBe(
      "forbidden_boundary",
    );
    expect(routeHermesOperation({ kind: "env_secret_read" }).tier).toBe(
      "forbidden_boundary",
    );
    expect(
      routeHermesOperation({
        kind: "production_config_write",
      }).tier,
    ).toBe("forbidden_boundary");
  });

  it("builds a bridge report labeling each requested operation tier", () => {
    const task = createHermesBridgeTask({
      taskId: "t_bridge",
      title: "bridge smoke",
      description: "Hermes が呼べるスタブのみ",
      requestedOperations: [
        safeReads[0],
        {
          kind: "zone_delete",
          requestedPath: "output/a.txt",
        },
        {
          kind: "raw_fs",
          detail: "must never pass",
        },
      ],
    });
    expect(task.requestedOperations).toHaveLength(3);

    const report = createHermesBridgeReport(task);
    expect(report.requiresUserApproval).toBe(true);
    expect(report.tierLabels.join(",")).toContain("allowed:");
    expect(report.tierLabels.join(",")).toContain("blocked_sensitive:");
    expect(report.tierLabels.join(",")).toContain("forbidden:");
  });
});
