import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

import { getAuditLogSummary } from "../../../src/main/ichikishima/audit/audit-log-summary";

describe("audit-log-summary", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  const sampleLine = (): string =>
    JSON.stringify({
      eventId: randomUUID(),
      timestamp: "2099-01-01T00:00:00.000Z",
      agent: "system",
      source: "system_event",
      kind: "read_success",
      status: "success",
      actor: "system",
      contentIncluded: false,
      riskLevel: "low",
    });

  const lineApproval = (): string =>
    JSON.stringify({
      eventId: randomUUID(),
      timestamp: "2099-01-01T01:00:00.000Z",
      agent: "hermes",
      source: "approval_report",
      kind: "approval_queue_item_created",
      status: "success",
      actor: "hermes",
      contentIncluded: false,
      riskLevel: "critical",
      reasonCode: "x",
      reason: "masked reason blob would not be included in summary output",
    });

  it("aggregates kinds without returning record bodies", () => {
    const suffix = randomUUID();
    const auditSd = `.vitest-audit-sum-${suffix}`;
    const dir = path.join(zoneRoot, auditSd);
    const dateUtc = "2099-07-01";
    const file = path.join(dir, `audit-${dateUtc}.jsonl`);

    try {
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        file,
        [
          sampleLine(),
          lineApproval(),
          "not-json",
          JSON.stringify({ broken: true }),
          JSON.stringify({
            eventId: randomUUID(),
            timestamp: "2099-01-01T02:00:00.000Z",
            agent: "system",
            source: "system_event",
            kind: "read_success",
            status: "success",
            actor: "system",
            contentIncluded: true,
          }),
        ].join("\n"),
        "utf8",
      );

      const sum = getAuditLogSummary({
        projectRoot,
        zoneRoot,
        dateUtc,
        auditSubdirectory: auditSd,
      });

      if (!("total" in sum)) {
        throw new Error("expected summary object");
      }

      expect(sum.total).toBe(2);
      expect(sum.readEvents).toBe(1);
      expect(sum.approvalEvents).toBe(1);
      expect(sum.highRiskEvents).toBe(1);
      expect(sum.parseFailures).toBeGreaterThanOrEqual(2);
      expect(sum.latestTimestamp).toBe("2099-01-01T01:00:00.000Z");

      const raw = readFileSync(file, "utf8");
      expect(raw.length).toBeGreaterThan(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
