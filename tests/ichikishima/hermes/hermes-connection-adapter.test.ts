import { describe, expect, it } from "vitest";

import { HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1 } from "../../../src/main/ichikishima/hermes/hermes-bridge-payload";
import type { HermesBridgePayload } from "../../../src/main/ichikishima/hermes/hermes-bridge-payload";
import { HermesBridgeInMemoryReceiverQueue } from "../../../src/main/ichikishima/hermes/hermes-bridge-receiver-queue";
import {
  createInMemoryHermesConnectionAdapter,
  enqueueHermesInboundFromAcceptedAdapter,
  enqueueViaAdapterLanePipeline,
  normalizeHermesConnectionAdapterResult,
  rejectUnsupportedHermesConnectionAdapterKind,
  validateAdapterResultForReceiverQueue,
  validateHermesConnectionAdapterInput,
} from "../../../src/main/ichikishima/hermes/hermes-connection-adapter";

describe("Hermes Connection Adapter Stage 0", () => {
  it("rejectUnsupportedHermesConnectionAdapterKind denies non-memory", () => {
    expect(rejectUnsupportedHermesConnectionAdapterKind("socket")).toEqual({
      code: "UNSUPPORTED_ADAPTER_KIND",
      message: expect.stringContaining("socket"),
    });
    expect(rejectUnsupportedHermesConnectionAdapterKind("in_memory")).toBe(
      null,
    );
  });

  it("rejects obsolete flat payloadSchemaVersion via validation", () => {
    const r = validateHermesConnectionAdapterInput({
      kind: "in_memory",
      payloadWire: {
        payloadSchemaVersion: "v1",
        taskId: "z",
        title: "t",
        description: "d",
        actor: "hermes",
        requestedOperations: [],
      },
    });
    expect(r.status).toBe("rejected");
    if (r.status === "rejected")
      expect(
        r.errors.some((e) => e.code === "UNSUPPORTED_SCHEMA_VERSION"),
      ).toBe(true);
    const sj = JSON.stringify(r.summary);
    expect(sj).not.toContain("PASSWORD");
    expect(sj.length).toBeLessThan(2000);
  });

  it("accepted adapter summary rejects suspicious long description payload", () => {
    const longDesc = `${"x".repeat(5000)}\nPASSWORD=sekret`;
    const r = validateHermesConnectionAdapterInput({
      kind: "in_memory",
      payloadWire: {
        payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
        taskId: "task-a",
        title: "t",
        description: longDesc,
        actor: "hermes",
        requestedOperations: [
          {
            kind: "zone_read",
            requestedPath: "sample/input.txt",
          },
        ],
      },
    });

    expect(r.status).toBe("rejected");
    if (r.status === "rejected") {
      const sj = JSON.stringify(r.summary);
      expect(sj).not.toContain("sekret");
      expect(sj.length).toBeLessThan(4096);
    }
  });

  it("accepted path summary excludes path strings present in enqueuePayload", () => {
    const p: HermesBridgePayload = {
      payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
      taskId: "ok1",
      title: "t",
      description: "d",
      actor: "hermes",
      requestedOperations: [
        {
          kind: "zone_read",
          requestedPath: "sample/input.txt",
        },
      ],
    };
    const r = validateHermesConnectionAdapterInput({
      kind: "in_memory",
      payloadWire: p,
    });

    expect(r.status).toBe("accepted");
    if (r.status !== "accepted") throw new Error("unexpected");

    const sj = JSON.stringify(r.summary);
    expect(sj).not.toContain("sample/input.txt");
    expect(sj.length).toBeLessThan(2000);
  });

  it("enqueueViaAdapterLanePipeline rejects production lane+dry_run", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "production_fail_closed",
    });
    const pl: HermesBridgePayload = {
      payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
      taskId: `t-${Math.random().toString(36).slice(2, 10)}`,
      title: "t",
      description: "d",
      actor: "hermes",
      interactionMode: "dry_run",
      requestedOperations: [
        {
          kind: "zone_read",
          requestedPath: "sample/input.txt",
        },
      ],
    };
    const ar = validateHermesConnectionAdapterInput({
      kind: "in_memory",
      payloadWire: pl,
    });
    expect(ar.status).toBe("accepted");
    const out = enqueueViaAdapterLanePipeline({
      queue: q,
      nowUnixMs: 0,
      adapterResult: ar,
    });
    expect(out.outcome).toBe("rejected");
    if (out.outcome === "rejected") expect(out.reason).toBe("LANE_REJECTED");
  });

  it("enqueueVia dry_run_lab: dequeue has no raw wire field", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({ lane: "dry_run_lab" });
    const pl: HermesBridgePayload = {
      payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
      taskId: `tl-${Math.random().toString(36).slice(2, 8)}`,
      title: "t",
      description: "d",
      actor: "hermes",
      interactionMode: "dry_run",
      requestedOperations: [
        {
          kind: "zone_read",
          requestedPath: "sample/input.txt",
        },
      ],
    };

    const ar = validateHermesConnectionAdapterInput({
      kind: "in_memory",
      payloadWire: pl,
    });
    expect(ar.status).toBe("accepted");
    if (ar.status !== "accepted") throw new Error("unexpected");

    expect(validateAdapterResultForReceiverQueue(ar, q.getLane()).ok).toBe(
      true,
    );

    const sub = enqueueViaAdapterLanePipeline({
      queue: q,
      nowUnixMs: 0,
      adapterResult: ar,
    });
    expect(sub.outcome).toBe("accepted");
    expect(q.getActiveQueueDepth()).toBe(1);

    const d = q.dequeueOrUndefined(100)!;

    expect("rawInboundUtf8Payload" in d).toBe(false);
    q.acknowledgeHandled(d.itemId, 101, "completed_ok");
    q.pruneExpired(86400_000);
    expect(q.getActiveQueueDepth()).toBe(0);
  });

  it("enqueueHermesInboundFromAcceptedAdapter uses submitInbound semantics", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "production_fail_closed",
    });

    const pl: HermesBridgePayload = {
      payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
      taskId: `p-${Math.random().toString(36).slice(2, 10)}`,
      title: "t",
      description: "d",
      actor: "hermes",
      requestedOperations: [
        {
          kind: "zone_read",
          requestedPath: "sample/input.txt",
        },
      ],
    };

    const ar = validateHermesConnectionAdapterInput({
      kind: "in_memory",
      payloadWire: pl,
    });
    expect(ar.status).toBe("accepted");
    if (ar.status !== "accepted") throw new Error("unexpected");

    expect(
      enqueueHermesInboundFromAcceptedAdapter({
        queue: q,
        nowUnixMs: 1,
        accepted: ar,
      }).outcome,
    ).toBe("accepted");
  });

  it("normalizeHermesConnectionAdapterResult clones diagnostics", () => {
    const a = validateHermesConnectionAdapterInput({
      kind: "in_memory",
      payloadWire: { bad: true },
    });
    const b = normalizeHermesConnectionAdapterResult(a);
    if (a.status === "rejected" && b.status === "rejected") {
      expect(b.summary.diagnostics).not.toBe(a.summary.diagnostics);
    }
  });

  it("factory submit delegates to validator", () => {
    const ad = createInMemoryHermesConnectionAdapter();
    expect(ad.adapterKind).toBe("in_memory");
    const r = ad.submit("{}");
    expect(r.status === "accepted" || r.status === "rejected").toBe(true);
  });
});
