import { describe, expect, it } from "vitest";
import {
  HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
  type HermesBridgePayload,
} from "../../../src/main/ichikishima/hermes/hermes-bridge-payload";
import {
  HermesBridgeInMemoryReceiverQueue,
  readInboundPayloadSchemaHint,
} from "../../../src/main/ichikishima/hermes/hermes-bridge-receiver-queue";

const ZONE_READ_SAMPLE = {
  kind: "zone_read" as const,
  requestedPath: "sample/input.txt",
};

function jsonPayload(
  overrides: Partial<HermesBridgePayload> & { taskId?: string } = {},
): string {
  const {
    payloadSchemaVersion,
    requestedOperations: ovOps,
    taskId: ovTaskId,
    title: ovTitle,
    description: ovDesc,
    actor: ovActor,
    ...rest
  } = overrides;
  void payloadSchemaVersion;

  const merged: HermesBridgePayload = {
    payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
    taskId: ovTaskId ?? `t-${Math.random().toString(36).slice(2, 10)}`,
    title: ovTitle ?? "t",
    description: ovDesc ?? "d",
    actor: ovActor ?? "hermes",
    requestedOperations: ovOps ?? [ZONE_READ_SAMPLE],
    ...rest,
  };
  return JSON.stringify(merged);
}

describe("HermesBridgeInMemoryReceiverQueue", () => {
  it("rejects flat v1 literal as unsupported schema version (before full validation semantics)", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "production_fail_closed",
    });
    const r = q.submitInbound(
      '{"payloadSchemaVersion":"v1","taskId":"a","title":"x","description":"y","actor":"hermes","requestedOperations":[]}',
      0,
    );
    expect(r.outcome).toBe("rejected");
    if (r.outcome === "rejected")
      expect(r.reason).toBe("UNSUPPORTED_SCHEMA_VERSION");
  });

  it("reject reasons use stable codes for invalid JSON", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "production_fail_closed",
    });
    const r = q.submitInbound("{", 0);
    expect(r.outcome).toBe("rejected");
    if (r.outcome === "rejected") expect(r.reason).toBe("MALFORMED_OR_PARSE");
  });

  it("rejects DUPLICATE_TASK_ID_ACTIVE while prior item is pending or in_flight", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({ lane: "dry_run_lab" });
    const pl = jsonPayload({
      taskId: "same",
      interactionMode: "dry_run",
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    expect(q.submitInbound(pl, 0).outcome).toBe("accepted");
    const second = q.submitInbound(pl, 1);
    expect(second.outcome).toBe("rejected");
    if (second.outcome === "rejected")
      expect(second.reason).toBe("DUPLICATE_TASK_ID_ACTIVE");
  });

  it("releases taskId duplicate guard after acknowledge completed_ok", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({ lane: "dry_run_lab" });
    const pl = jsonPayload({
      taskId: "reuse",
      interactionMode: "dry_run",
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    expect(q.submitInbound(pl, 0).outcome).toBe("accepted");
    const d = q.dequeueOrUndefined(100)!;
    expect(q.submitInbound(pl, 100).outcome).toBe("rejected");
    q.acknowledgeHandled(d.itemId, 101, "completed_ok");
    expect(q.submitInbound(pl, 200).outcome).toBe("accepted");
  });

  it("rejects QUEUE_CAPACITY when pending+in_flight reach maxQueueItems", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "dry_run_lab",
      limits: { maxQueueItems: 2 },
    });
    const a = jsonPayload({
      taskId: "a",
      interactionMode: "dry_run",
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    const b = jsonPayload({
      taskId: "b",
      interactionMode: "dry_run",
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    expect(q.submitInbound(a, 0).outcome).toBe("accepted");
    expect(q.submitInbound(b, 0).outcome).toBe("accepted");
    const third = jsonPayload({
      taskId: "c",
      interactionMode: "dry_run",
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    expect(q.submitInbound(third, 0).outcome).toBe("rejected");
  });

  it("production_fail_closed forbids interactionMode=dry_run", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "production_fail_closed",
    });
    const pl = jsonPayload({
      interactionMode: "dry_run",
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    const r = q.submitInbound(pl, 0);
    expect(r.outcome).toBe("rejected");
    if (r.outcome === "rejected") expect(r.reason).toBe("LANE_REJECTED");
  });

  it("production_fail_closed forbids partial/dry-run continuation knobs even on production_stub", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "production_fail_closed",
    });
    const pl = jsonPayload({
      allowPartialOnForbidden: true,
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    const r = q.submitInbound(pl, 0);
    expect(r.outcome).toBe("rejected");
    if (r.outcome === "rejected") expect(r.reason).toBe("LANE_REJECTED");
  });

  it("dry_run_lab requires interactionMode=dry_run", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({ lane: "dry_run_lab" });
    const pl = jsonPayload({
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    const r = q.submitInbound(pl, 0);
    expect(r.outcome).toBe("rejected");
    if (r.outcome === "rejected") expect(r.reason).toBe("LANE_REJECTED");
  });

  it("pruneExpired removes pending messages past TTL", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "dry_run_lab",
      limits: { messageTtlMs: 1_000 },
    });
    const pl = jsonPayload({
      interactionMode: "dry_run",
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    q.submitInbound(pl, 0);
    expect(q.getActiveQueueDepth()).toBe(1);
    q.pruneExpired(2_001);
    expect(q.getActiveQueueDepth()).toBe(0);
  });

  it("transient_retry exhausts attempts and yields dead_exhausted", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "dry_run_lab",
      limits: { maxProcessingAttemptsBeforeDead: 2 },
    });
    const pl = jsonPayload({
      interactionMode: "dry_run",
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    q.submitInbound(pl, 0);
    const one = q.dequeueOrUndefined(100)!;
    expect(one.processingAttemptNumber).toBe(1);
    expect(q.acknowledgeHandled(one.itemId, 101, "transient_retry")).toBe("ok");
    const two = q.dequeueOrUndefined(200)!;
    expect(two.processingAttemptNumber).toBe(2);
    expect(q.acknowledgeHandled(two.itemId, 201, "transient_retry")).toBe(
      "dead_exhausted",
    );
    expect(q.getActiveQueueDepth()).toBe(0);
  });

  it("stored messages expose only validated envelope after dequeue — no parallel raw retention", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({ lane: "dry_run_lab" });
    const pl = jsonPayload({
      interactionMode: "dry_run",
      requestedOperations: [ZONE_READ_SAMPLE],
    });
    q.submitInbound(pl, 0);
    const d = q.dequeueOrUndefined(0)!;
    expect(d.validated.normalizedPayload).toBeTruthy();
    expect("rawInboundUtf8Payload" in d).toBe(false);
    q.acknowledgeHandled(d.itemId, 1, "completed_ok");
  });

  it("readInboundPayloadSchemaHint returns trimmed payloadSchemaVersion when present", () => {
    expect(
      readInboundPayloadSchemaHint({
        payloadSchemaVersion: `  ${HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1}  `,
      }),
    ).toBe(HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1);
  });
});
