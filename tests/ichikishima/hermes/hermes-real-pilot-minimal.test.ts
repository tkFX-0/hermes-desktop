import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

import { HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1 } from "../../../src/main/ichikishima/hermes/hermes-bridge-payload";
import { HermesBridgeInMemoryReceiverQueue } from "../../../src/main/ichikishima/hermes/hermes-bridge-receiver-queue";
import {
  createHermesRealPilotMinimalReportMeta,
  runHermesRealPilotMinimalFromFileHandoff,
  runHermesRealPilotMinimalFromValidatedPayload,
} from "../../../src/main/ichikishima/hermes/hermes-real-pilot-minimal";
import { buildHermesRealPilotControlCenterSummary } from "../../../src/main/ichikishima/hermes/hermes-real-pilot-summary";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../");
const ZONE_ROOT = join(REPO_ROOT, "sandbox/hermes-autonomy-zone");
const MINIMAL_TS = join(
  REPO_ROOT,
  "src/main/ichikishima/hermes/hermes-real-pilot-minimal.ts",
);

function uniqueHandoffDir(): string {
  return `tmp/real-min-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function mkInbox(
  zoneRoot: string,
  handDir: string,
  fname: string,
  wire: Record<string, unknown>,
): string {
  const inbox = join(zoneRoot, handDir, "inbox");
  fs.mkdirSync(inbox, { recursive: true });
  const fp = join(inbox, fname);
  fs.writeFileSync(fp, JSON.stringify(wire), "utf8");
  return fp;
}

describe("hermes-real-pilot-minimal", () => {
  const dirs: string[] = [];

  afterEach(() => {
    for (const d of dirs.splice(0, dirs.length)) {
      try {
        fs.rmSync(d, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    }
  });

  const baseProductionWire = (
    overrides?: Record<string, unknown>,
    taskSuffix?: string,
  ): Record<string, unknown> => ({
    payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
    taskId: `rmin-${taskSuffix ?? Math.random().toString(36).slice(2, 9)}`,
    title: "Real minimal pilot",
    description: "sandbox pipeline",
    actor: "hermes",
    interactionMode: "production_stub",
    requestedOperations: [
      { kind: "zone_read", requestedPath: "sample/input.txt" },
    ],
    ...overrides,
  });

  it("runs full pipeline from valid handoff and writes marker", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fp = mkInbox(ZONE_ROOT, hd, "ok.json", baseProductionWire());
    const appr = `${hd}-ap`;
    const aud = `${hd}-audit`;
    const outFile = `${hd}-out.txt`;
    const fixedDate = "2026-05-03";
    dirs.push(join(ZONE_ROOT, appr));
    dirs.push(join(ZONE_ROOT, aud));

    const r = runHermesRealPilotMinimalFromFileHandoff({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      pilotOutputRelativePath: outFile,
      dateUtc: fixedDate,
      approvalSubdirectory: appr,
      auditSubdirectory: aud,
    });

    expect(r.status).toBe("completed");
    expect(r.markerRelativePath).toBeTruthy();
    expect(r.receiverEnqueueExecuted).toBe(true);
    expect(r.requiresUserApproval).toBe(true);
    expect(r.autoExecutable).toBe(false);
    expect(r.shouldSpeak).toBe(false);
    const proc = fs.readFileSync(MINIMAL_TS, "utf8");
    expect(proc).not.toMatch(/\bspawn\s*\(/);
    expect(JSON.stringify(r)).not.toMatch(/PASSWORD|Bearer sk_/i);

    const cc = buildHermesRealPilotControlCenterSummary({
      projectRoot: REPO_ROOT,
      result: r,
    });
    expect(JSON.stringify(cc).toLowerCase()).not.toContain("allowedapis");
    expect(createHermesRealPilotMinimalReportMeta(r)?.generated).toBe(true);

    const processedGlob = join(ZONE_ROOT, hd, "processed");
    expect(fs.existsSync(processedGlob)).toBe(true);
    const markers = fs.readdirSync(processedGlob);
    expect(markers.some((x) => x.endsWith(".marker.json"))).toBe(true);
  });

  it("rejects invalid JSON at handoff ingress", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const inbox = join(ZONE_ROOT, hd, "inbox");
    fs.mkdirSync(inbox, { recursive: true });
    const fp = join(inbox, "bad.json");
    fs.writeFileSync(fp, "{", "utf8");
    const r = runHermesRealPilotMinimalFromFileHandoff({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      persistApprovals: false,
      persistAudits: false,
      dateUtc: "2026-05-03",
      writeHandoffMarkers: true,
    });
    expect(r.status).toBe("rejected_validation");
    const rej = join(ZONE_ROOT, hd, "rejected");
    expect(fs.existsSync(rej)).toBe(true);
  });

  it("rejects obsolete flat schema version", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fp = mkInbox(ZONE_ROOT, hd, "old.json", {
      payloadSchemaVersion: "v1",
      taskId: "z",
      title: "t",
      description: "d",
      actor: "hermes",
      requestedOperations: [],
    });
    const r = runHermesRealPilotMinimalFromFileHandoff({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      persistApprovals: false,
      persistAudits: false,
    });
    expect(r.status).toBe("rejected_validation");
  });

  it("rejects suspicious payload strings", () => {
    const r = runHermesRealPilotMinimalFromValidatedPayload({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      payloadWire: {
        payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
        taskId: "sec",
        title: "x",
        description: `y\nPASSWORD=sekretstuff`,
        actor: "hermes",
        interactionMode: "production_stub",
        requestedOperations: [],
      },
      persistApprovals: false,
      persistAudits: false,
    });
    expect(r.status).toBe("rejected_validation");
    expect(JSON.stringify(r).toLowerCase()).not.toContain("sekretstuff");
  });

  it("rejects receiver lane on dry_run payloads (production_fail_closed)", () => {
    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "production_fail_closed",
    });
    const r = runHermesRealPilotMinimalFromValidatedPayload({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      receiverQueue: q,
      payloadWire: {
        payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
        taskId: "dry",
        title: "d",
        description: "dry",
        actor: "ichikishima",
        interactionMode: "dry_run",
        requestedOperations: [
          {
            kind: "zone_read",
            requestedPath: "sample/input.txt",
          },
        ],
      },
      persistApprovals: false,
      persistAudits: false,
      skipReceiverEnqueue: false,
    });
    expect(r.status).toBe("rejected_receiver");
  });

  it("handles forbidden boundary memory_db as pilot failure marker rejected", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fp = mkInbox(
      ZONE_ROOT,
      hd,
      "forbid.json",
      baseProductionWire({
        requestedOperations: [{ kind: "memory_db_access", detail: "x" }],
      }),
    );

    const r = runHermesRealPilotMinimalFromFileHandoff({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      persistApprovals: false,
      persistAudits: false,
    });

    expect(r.status).toBe("failed");
    expect(r.counts.forbiddenOperations).toBeGreaterThan(0);
    expect(r.markerRelativePath).toBeTruthy();
    const rejDir = join(ZONE_ROOT, hd, "rejected");
    expect(fs.existsSync(rejDir)).toBe(true);
  });

  it("enqueues dependency_install and external_ai_escalation to approval queue stubs", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const appr = `${hd}-ap`;
    dirs.push(join(ZONE_ROOT, appr));
    const fp = mkInbox(
      ZONE_ROOT,
      hd,
      "deps.json",
      baseProductionWire(
        {
          requestedOperations: [
            { kind: "zone_read", requestedPath: "sample/input.txt" },
            {
              kind: "dependency_install",
              detail: "pnpm add left-pad (declared)",
            },
            {
              kind: "external_ai_escalation",
              detail: "summarize sandbox only",
            },
          ],
        },
        "deps",
      ),
    );

    const r = runHermesRealPilotMinimalFromFileHandoff({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      dateUtc: "2026-05-03",
      approvalSubdirectory: appr,
    });

    expect(r.status).not.toBe("rejected_receiver");
    expect(r.pilotResult?.approvalItems.length).toBeGreaterThanOrEqual(1);
    expect(r.counts.bridgeApprovalOperations).toBeGreaterThanOrEqual(2);
  });

  it("persisted approvals include blocked delete path", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const appr = `${hd}-ap`;
    dirs.push(join(ZONE_ROOT, appr));
    const fp = mkInbox(
      ZONE_ROOT,
      hd,
      "del.json",
      baseProductionWire({
        requestedOperations: [
          { kind: "zone_read", requestedPath: "sample/input.txt" },
          {
            kind: "zone_delete",
            requestedPath: "output/nonexistent-unused.txt",
          },
        ],
      }),
    );

    const r = runHermesRealPilotMinimalFromFileHandoff({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      dateUtc: "2026-05-03",
      approvalSubdirectory: appr,
    });

    expect(r.status).not.toBe("rejected_receiver");
    expect(r.counts.blockedSensitiveOperations).toBeGreaterThan(0);
  });

  it("validated payload helper performs without inbox marker path", () => {
    const r = runHermesRealPilotMinimalFromValidatedPayload({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      payloadWire: baseProductionWire({ taskId: "wire-only" }),
      persistApprovals: false,
      persistAudits: false,
      skipReceiverEnqueue: true,
    });
    expect(r.markerRelativePath).toBeUndefined();
    expect(["completed", "partial", "failed"]).toContain(r.status);
  });

  it("counts mt5/env_secret as forbidden tiers", () => {
    const p1 = runHermesRealPilotMinimalFromValidatedPayload({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      persistApprovals: false,
      persistAudits: false,
      skipReceiverEnqueue: true,
      payloadWire: {
        payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
        taskId: "m1",
        title: "m",
        description: "m",
        actor: "hermes",
        interactionMode: "production_stub",
        requestedOperations: [{ kind: "mt5_ea_access", detail: "x" }],
      },
    });
    expect(p1.counts.forbiddenOperations).toBe(1);

    const p2 = runHermesRealPilotMinimalFromValidatedPayload({
      projectRoot: REPO_ROOT,
      zoneRoot: ZONE_ROOT,
      persistApprovals: false,
      persistAudits: false,
      skipReceiverEnqueue: true,
      payloadWire: {
        payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
        taskId: "e1",
        title: "e",
        description: "e",
        actor: "hermes",
        interactionMode: "production_stub",
        requestedOperations: [{ kind: "env_secret_read", detail: "no" }],
      },
    });
    expect(p2.counts.forbiddenOperations).toBe(1);
  });
});
