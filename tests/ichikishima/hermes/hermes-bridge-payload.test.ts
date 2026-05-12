import { describe, expect, it } from "vitest";

import {
  classifyHermesPayloadOperation,
  HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
  pilotInputToHermesBridgePayload,
  validateHermesBridgePayload,
} from "../../../src/main/ichikishima/hermes/hermes-bridge-payload";

const basePayloadFields = (): Record<string, unknown> => ({
  payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
  taskId: "task_demo_01",
  title: "t",
  description: "desc",
  actor: "hermes",
  requestedOperations: [] as unknown[],
});

describe("validateHermesBridgePayload", () => {
  it("accepts minimal safe Hermes-authored payload", () => {
    const r = validateHermesBridgePayload({
      ...basePayloadFields(),
      title: "read sample",
      description: "Hermes は接続しないテストのみ",
      requestedOperations: [
        {
          kind: "zone_read",
          requestedPath: "sample/input.txt",
        },
      ],
    });
    expect(r.ok).toBe(true);
    expect(r.partialEligible).toBe(false);
  });

  it("accepts a valid mixed-shape operations list without executing", () => {
    const r = validateHermesBridgePayload({
      ...basePayloadFields(),
      requestedOperations: [
        { kind: "zone_delete", requestedPath: "output/pilot-delete-block.txt" },
        {
          kind: "dependency_install",
          disposition: "approval_queue",
          detail: "declared_only",
        },
      ],
    });
    expect(r.ok).toBe(true);
  });

  it("rejects unknown operation kinds", () => {
    const r = validateHermesBridgePayload({
      ...basePayloadFields(),
      requestedOperations: [{ kind: "zone_chmod", requestedPath: "x.txt" }],
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "UNKNOWN_OPERATION_KIND")).toBe(
      true,
    );
  });

  it("rejects malformed root", () => {
    expect(
      validateHermesBridgePayload([1]).errors.some(
        (e) => e.code === "MALFORMED_PAYLOAD",
      ),
    ).toBe(true);
  });

  it("rejects invalid JSON strings", () => {
    expect(
      validateHermesBridgePayload("{not-json").errors.some(
        (e) => e.code === "MALFORMED_PAYLOAD",
      ),
    ).toBe(true);
  });

  it("accepts normalized JSON-string payloads", () => {
    const r = validateHermesBridgePayload(
      JSON.stringify({
        ...basePayloadFields(),
        requestedOperations: [],
      }),
    );
    expect(r.ok).toBe(true);
  });

  it("rejects missing title", () => {
    const p = basePayloadFields();
    delete (p as { title?: unknown }).title;
    const r = validateHermesBridgePayload(p);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "MISSING_REQUIRED_FIELD")).toBe(
      true,
    );
  });

  it("rejects operations that are not arrays", () => {
    const r = validateHermesBridgePayload({
      ...basePayloadFields(),
      requestedOperations: { kind: "zone_read", requestedPath: "x.txt" },
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "INVALID_FIELD_TYPE")).toBe(true);
  });

  it("rejects operation count exceeding limit", () => {
    const ops = Array.from({ length: 33 }, (_, i) => ({
      kind: "zone_read",
      requestedPath: `sample/input.txt#${i}`,
    }));
    const r = validateHermesBridgePayload({
      ...basePayloadFields(),
      requestedOperations: ops,
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "OPERATIONS_LIMIT_EXCEEDED")).toBe(
      true,
    );
  });

  it("respects custom maxOperations", () => {
    const ops = Array.from({ length: 6 }, (_, i) => ({
      kind: "zone_read",
      requestedPath: `sample/input.txt?u=${i}`,
    }));
    const r = validateHermesBridgePayload(
      {
        ...basePayloadFields(),
        requestedOperations: ops,
      },
      { maxOperations: 5 },
    );
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "OPERATIONS_LIMIT_EXCEEDED")).toBe(
      true,
    );
  });

  it("rejects payloads above UTF-8 size limit", () => {
    const padding = "x".repeat(70000);
    const r = validateHermesBridgePayload({
      ...basePayloadFields(),
      description: padding,
      requestedOperations: [],
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "PAYLOAD_SIZE_LIMIT_EXCEEDED")).toBe(
      true,
    );
  });

  it("rejects suspicious embedded secrets", () => {
    const r = validateHermesBridgePayload({
      ...basePayloadFields(),
      description: "OPENAI_API_KEY=abc",
      requestedOperations: [],
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "SUSPICIOUS_CONTENT")).toBe(true);
  });

  it("rejects PASSWORD=key style embedded secrets", () => {
    const r = validateHermesBridgePayload({
      ...basePayloadFields(),
      description: `${"x".repeat(100)}\nPASSWORD=sek`,
      requestedOperations: [],
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "SUSPICIOUS_CONTENT")).toBe(true);
  });

  it("rejects relative paths with traversal", () => {
    const r = validateHermesBridgePayload({
      ...basePayloadFields(),
      requestedOperations: [
        { kind: "zone_read", requestedPath: "sample/../../etc/passwd" },
      ],
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "INVALID_OPERATION_SHAPE")).toBe(
      true,
    );
  });

  it("flags policy_blocked dependency_install but payload shape ok", () => {
    const r = validateHermesBridgePayload({
      ...basePayloadFields(),
      requestedOperations: [
        {
          kind: "dependency_install",
          disposition: "policy_blocked",
          detail: "[test]",
        },
      ],
    });
    expect(r.ok).toBe(true);
  });

  it("rejects obsolete flat v1 literal", () => {
    const r = validateHermesBridgePayload({
      payloadSchemaVersion: "v1",
      taskId: "x",
      title: "t",
      description: "d",
      actor: "hermes",
      requestedOperations: [],
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "UNSUPPORTED_SCHEMA_VERSION")).toBe(
      true,
    );
  });

  it("records partialEligible=false for production_stub even when allowPartial toggled", () => {
    const r = validateHermesBridgePayload({
      payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
      taskId: "p2",
      title: "t",
      description: "d",
      actor: "hermes",
      interactionMode: "production_stub",
      allowPartialOnForbidden: true,
      requestedOperations: [
        { kind: "memory_db_access", detail: "forbidden-shape" },
      ],
    });
    expect(r.ok).toBe(true);
    expect(r.partialEligible).toBe(false);
  });

  it("denies partial for hard forbids unless mixed_forbidden_audit", () => {
    const validated = normalizeDryRunPayload([
      {
        kind: "memory_db_access",
        detail: "x",
      },
    ]);
    expect(validated.partialEligible).toBe(false);

    const allowed = normalizeDryRunPayload(
      [{ kind: "memory_db_access", detail: "x" }],
      true,
    );
    expect(allowed.partialEligible).toBe(true);
  });

  it("gates policy_blocked forbidden behind mixed_forbidden_audit for partialEligible", () => {
    const envelope = normalizeDryRunPayload([
      {
        kind: "dependency_install",
        disposition: "policy_blocked",
        detail: "x",
      },
    ]);
    expect(envelope.partialEligible).toBe(false);
    const envelopeMixed = normalizeDryRunPayload(
      [
        {
          kind: "dependency_install",
          disposition: "policy_blocked",
          detail: "x",
        },
      ],
      true,
    );
    expect(envelopeMixed.partialEligible).toBe(true);
  });
});

describe("computeHermesBridgePartialEligible helpers", () => {
  it("classifyHermesPayloadOperation rejects malformed shapes", () => {
    expect(classifyHermesPayloadOperation(null).ok).toBe(false);
    expect(classifyHermesPayloadOperation({ kind: "unknown" }).ok).toBe(false);
  });

  it("pilotInputToHermesBridgePayload maps dry-run fields", () => {
    const p = pilotInputToHermesBridgePayload({
      taskId: "t1",
      title: "",
      description: "",
      actor: "ichikishima",
      requestedOperations: [],
      interactionMode: "dry_run",
      allowPartialOnForbidden: true,
      dryRunContinuationMode: "mixed_forbidden_audit",
    });
    expect(p.payloadSchemaVersion).toBe(
      HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
    );
    expect(p.interactionMode).toBe("dry_run");
  });
});

/** dry-run-ish normalized payloads for eligibility checks */
function normalizeDryRunPayload(
  ops: Array<Record<string, unknown>>,
  continuation?: boolean,
): ReturnType<typeof validateHermesBridgePayload> {
  return validateHermesBridgePayload({
    payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
    taskId: "partial_check",
    title: "partial",
    description: "Hermes は接続しない",
    actor: "ichikishima",
    interactionMode: "dry_run",
    allowPartialOnForbidden: true,
    dryRunContinuationMode: continuation ? "mixed_forbidden_audit" : undefined,
    requestedOperations: ops,
  });
}
