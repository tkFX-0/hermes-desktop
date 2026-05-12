import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { afterEach, describe, expect, it } from "vitest";

import { HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1 } from "../../../src/main/ichikishima/hermes/hermes-bridge-payload";
import { HermesBridgeInMemoryReceiverQueue } from "../../../src/main/ichikishima/hermes/hermes-bridge-receiver-queue";
import {
  HERMES_FILE_HANDOFF_MARKER_SCHEMA_V1,
  markHermesFileHandoffProcessed,
  processHermesFileHandoffPayload,
  readHermesPayloadFromSandboxFile,
  rejectHermesFileHandoffPayload,
  summarizeHermesFileHandoffResult,
  validateHermesFileHandoffPath,
} from "../../../src/main/ichikishima/hermes/hermes-file-handoff-adapter";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../");
const ZONE_ROOT = join(REPO_ROOT, "sandbox/hermes-autonomy-zone");

function uniqueHandoffDir(): string {
  return `tmp/handoff-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function setupInbox(
  zoneRoot: string,
  handDir: string,
  fname: string,
  body: string,
): string {
  const inbox = join(zoneRoot, handDir, "inbox");
  fs.mkdirSync(inbox, { recursive: true });
  const fp = join(inbox, fname);
  fs.writeFileSync(fp, body, "utf8");
  return fp;
}

describe("Hermes Stage 1 file handoff", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const d of dirs.splice(0, dirs.length)) {
      fs.rmSync(d, { recursive: true, force: true });
    }
  });

  const baseWire = (
    overrides?: Record<string, unknown>,
  ): Record<string, unknown> =>
    ({
      payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
      taskId: `tid-${Math.random().toString(36).slice(2, 10)}`,
      title: "t",
      description: "d",
      actor: "hermes",
      requestedOperations: [
        {
          kind: "zone_read",
          requestedPath: "sample/input.txt",
        },
      ],
      ...overrides,
    }) as Record<string, unknown>;

  it("validates flat inbox-only path", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fp = setupInbox(
      ZONE_ROOT,
      hd,
      "good.json",
      JSON.stringify(baseWire()),
    );
    expect(
      validateHermesFileHandoffPath({
        zoneRoot: ZONE_ROOT,
        handoffRelativeDir: hd,
        targetPath: fp,
      }).ok,
    ).toBe(true);
  });

  it("rejects nested inbox paths", () => {
    const hd = uniqueHandoffDir();
    const inbox = join(ZONE_ROOT, hd, "inbox", "nested");
    fs.mkdirSync(inbox, { recursive: true });
    dirs.push(join(ZONE_ROOT, hd));
    const fp = join(inbox, "x.json");
    fs.writeFileSync(fp, "{}");
    expect(
      validateHermesFileHandoffPath({
        zoneRoot: ZONE_ROOT,
        handoffRelativeDir: hd,
        targetPath: fp,
      }).ok,
    ).toBe(false);
  });

  it("rejects sandbox-outside targets", () => {
    expect(
      validateHermesFileHandoffPath({
        zoneRoot: ZONE_ROOT,
        handoffRelativeDir: "handoff",
        targetPath: join(REPO_ROOT, "package.json"),
      }).ok,
    ).toBe(false);
  });

  it("reads valid v1 JSON from inbox file", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fp = setupInbox(ZONE_ROOT, hd, "a.json", JSON.stringify(baseWire()));
    const r = readHermesPayloadFromSandboxFile({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
    });
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(r.wire.payloadSchemaVersion).toBe(
        HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
      );
  });

  it("rejects invalid JSON", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fp = setupInbox(ZONE_ROOT, hd, "bad.json", "{");
    const r = readHermesPayloadFromSandboxFile({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
    });
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(r.errors.some((e) => e.code === "HANDOFF_JSON_PARSE")).toBe(true);
  });

  it("rejects JSON array roots", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fp = setupInbox(ZONE_ROOT, hd, "arr.json", "[]");
    const r = readHermesPayloadFromSandboxFile({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]?.code).toBe("HANDOFF_JSON_NOT_OBJECT");
  });

  it("rejects non-json extension", () => {
    const hd = uniqueHandoffDir();
    const inbox = join(ZONE_ROOT, hd, "inbox");
    fs.mkdirSync(inbox, { recursive: true });
    dirs.push(join(ZONE_ROOT, hd));
    const fp = join(inbox, "x.txt");
    fs.writeFileSync(fp, "{}", "utf8");
    expect(
      validateHermesFileHandoffPath({
        zoneRoot: ZONE_ROOT,
        handoffRelativeDir: hd,
        targetPath: fp,
      }).ok,
    ).toBe(false);
  });

  it("rejects oversized files", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const big = `"${"z".repeat(70000)}"`;
    const fp = setupInbox(
      ZONE_ROOT,
      hd,
      "big.json",
      `{"payloadSchemaVersion":${JSON.stringify(
        HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
      )},"taskId":"z","title":"t","description":${big},"actor":"hermes","requestedOperations":[]}`,
    );
    const r = readHermesPayloadFromSandboxFile({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      maxPayloadUtf8Bytes: 8192,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]?.code).toBe("HANDOFF_FILE_TOO_LARGE");
  });

  it("rejects unknown schemaVersion", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const w = baseWire({
      payloadSchemaVersion: "hermes-bridge-payload/x",
    });
    const fp = setupInbox(ZONE_ROOT, hd, "u.json", JSON.stringify(w));
    const pr = processHermesFileHandoffPayload({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
    });
    expect(pr.status).toBe("rejected");
  });

  it("rejects secrets in description via bridge validation", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const w = baseWire({
      description: "OPENAI_API_KEY=sk_test",
    });
    const fp = setupInbox(ZONE_ROOT, hd, "s.json", JSON.stringify(w));
    const pr = processHermesFileHandoffPayload({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
    });
    expect(pr.status).toBe("rejected");
    if (pr.status === "rejected")
      expect(pr.errors.some((e) => e.code === "SUSPICIOUS_CONTENT")).toBe(true);
  });

  it("rejects missing schemaVersion", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const base = baseWire({});
    Reflect.deleteProperty(base, "payloadSchemaVersion");
    const fp = setupInbox(ZONE_ROOT, hd, "miss.json", JSON.stringify(base));
    const pr = processHermesFileHandoffPayload({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
    });
    expect(pr.status).toBe("rejected");
    if (pr.status === "rejected")
      expect(
        pr.errors.some((e) => e.code === "UNSUPPORTED_SCHEMA_VERSION"),
      ).toBe(true);
  });

  it("rejects denylist-ish path basename", () => {
    /** path api_key triggers denied substring along full relative path */
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fp = setupInbox(
      ZONE_ROOT,
      hd,
      "api_key.json",
      JSON.stringify(baseWire()),
    );
    expect(
      validateHermesFileHandoffPath({
        zoneRoot: ZONE_ROOT,
        handoffRelativeDir: hd,
        targetPath: fp,
      }).ok,
    ).toBe(false);
  });

  it("processHermes repeated with same inbox and clock does not overwrite markers", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fixed = 946684800000; /* 2000-01-01T00:00:00.000Z */
    const w = baseWire({
      interactionMode: "dry_run",
      taskId: `twice-${Math.random().toString(36).slice(2, 9)}`,
    });
    const fp = setupInbox(ZONE_ROOT, hd, "twice.json", JSON.stringify(w));
    const opt = {
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      writeMarkers: true,
      skipEnqueue: true,
      nowUnixMs: fixed,
    } as const;

    const a = processHermesFileHandoffPayload(opt);
    const b = processHermesFileHandoffPayload(opt);
    expect(a.status).toBe("accepted");
    expect(b.status).toBe("accepted");
    if (a.status !== "accepted" || b.status !== "accepted") return;
    expect(a.markerRelativePath).not.toBe(b.markerRelativePath);
    const procDir = join(ZONE_ROOT, hd, "processed");
    const names = fs
      .readdirSync(procDir)
      .filter((n) => n.endsWith(".marker.json"));
    expect(names).toHaveLength(2);
  });

  it("rejected markers do not overwrite on repeat", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fixed = 946684800000;
    const fp = setupInbox(
      ZONE_ROOT,
      hd,
      "bad2.json",
      JSON.stringify(baseWire({ payloadSchemaVersion: "v1" })),
    );
    const opt = {
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      writeMarkers: true,
      nowUnixMs: fixed,
    } as const;
    processHermesFileHandoffPayload(opt);
    processHermesFileHandoffPayload(opt);
    const rejDir = join(ZONE_ROOT, hd, "rejected");
    const names = fs
      .readdirSync(rejDir)
      .filter((n) => n.endsWith(".marker.json"));
    expect(names).toHaveLength(2);
    expect(
      names.some((n) =>
        /^bad2\.rejected\.\d{8}-\d{6}\.1\.marker\.json$/.test(n),
      ),
    ).toBe(true);
  });

  it("writes processed marker without raw payload and enqueues receiver queue", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const taskId = `q-${Math.random().toString(36).slice(2, 11)}`;
    const w = baseWire({
      taskId,
      interactionMode: "dry_run",
    });
    const fp = setupInbox(ZONE_ROOT, hd, "enqueue.json", JSON.stringify(w));

    const q = new HermesBridgeInMemoryReceiverQueue({ lane: "dry_run_lab" });
    const now = Date.now();
    const pr = processHermesFileHandoffPayload({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      writeMarkers: true,
      queue: q,
      nowUnixMs: now,
    });
    expect(pr.status).toBe("accepted");
    if (pr.status !== "accepted") return;

    expect(pr.enqueueOutcome?.outcome).toBe("accepted");

    expect(pr.markerRelativePath).toBeDefined();
    const markerAbs = join(ZONE_ROOT, pr.markerRelativePath!);
    const markerRaw = fs.readFileSync(markerAbs, "utf8");
    expect(markerRaw).not.toContain("sample/input.txt");
    expect(markerRaw).not.toContain('"requestedOperations"');
    expect(markerRaw).toContain(HERMES_FILE_HANDOFF_MARKER_SCHEMA_V1);

    expect(summarizeHermesFileHandoffResult(pr)).toContain(
      pr.summary.taskIdBrief ?? "",
    );
  });

  it("writes rejected marker for validation failure", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const w = baseWire({ payloadSchemaVersion: "v1" });
    const fp = setupInbox(ZONE_ROOT, hd, "badv.json", JSON.stringify(w));
    const pr = processHermesFileHandoffPayload({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      writeMarkers: true,
      nowUnixMs: 999,
    });
    expect(pr.status).toBe("rejected");
    if (pr.status !== "rejected") return;
    expect(pr.markerRelativePath).toContain("rejected/");
    const mk = fs.readFileSync(join(ZONE_ROOT, pr.markerRelativePath!), "utf8");
    const parsedMk = JSON.parse(mk) as {
      markerSchemaVersion: string;
      summary?: Record<string, unknown>;
      errors?: { code?: string }[];
    };
    expect(parsedMk.markerSchemaVersion).toBe(
      HERMES_FILE_HANDOFF_MARKER_SCHEMA_V1,
    );
    expect(parsedMk.summary).not.toHaveProperty("requestedOperations");
    expect(mk).not.toContain("sample/input.txt");
    expect(parsedMk.errors?.length ?? 0).toBeGreaterThan(0);

    expect(
      rejectHermesFileHandoffPayload({
        inboxBasename: "x.json",
        inboxZoneRelativePath: `${hd}/inbox/x.json`,
        errors: [{ code: "E", message: "m" }],
      }).markerRelativePath,
    ).toBeUndefined();
  });

  it("production_fail_closed rejects dry_run payloads on enqueue lane", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const fp = setupInbox(
      ZONE_ROOT,
      hd,
      "dry.json",
      JSON.stringify(
        baseWire({
          interactionMode: "dry_run",
        }),
      ),
    );

    const q = new HermesBridgeInMemoryReceiverQueue({
      lane: "production_fail_closed",
    });

    const pr = processHermesFileHandoffPayload({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      targetPath: fp,
      queue: q,
      nowUnixMs: 1,
    });
    expect(pr.status).toBe("accepted");
    if (pr.status !== "accepted") return;
    expect(pr.enqueueOutcome?.outcome).toBe("rejected");
    expect(pr.enqueueOutcome?.reason).toBe("LANE_REJECTED");
  });

  it("markHermesFileHandoffProcessed is marker-only helper", () => {
    const hd = uniqueHandoffDir();
    dirs.push(join(ZONE_ROOT, hd));
    const inbox = join(ZONE_ROOT, hd, "inbox");
    fs.mkdirSync(inbox, { recursive: true });
    fs.writeFileSync(join(inbox, "keep.json"), "{}", "utf8");
    const at = 0;
    const r1 = markHermesFileHandoffProcessed({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      inboxZoneRelativePath: `${hd}/inbox/keep.json`,
      inboxBasename: "keep.json",
      markerStatus: "accepted",
      summary: {
        inboxBasename: "keep.json",
        inboxZoneRelativePath: `${hd}/inbox/keep.json`,
        payloadSchemaVersionMatched: false,
        operationCount: 0,
        partialEligible: false,
        interactionModeLabel: "production_stub",
        tierSummaryLabel: "",
        diagnostics: ["ok"],
      },
      atUnixMs: at,
    });
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    const r2 = markHermesFileHandoffProcessed({
      zoneRoot: ZONE_ROOT,
      handoffRelativeDir: hd,
      inboxZoneRelativePath: `${hd}/inbox/keep.json`,
      inboxBasename: "keep.json",
      markerStatus: "accepted",
      summary: {
        inboxBasename: "keep.json",
        inboxZoneRelativePath: `${hd}/inbox/keep.json`,
        payloadSchemaVersionMatched: false,
        operationCount: 0,
        partialEligible: false,
        interactionModeLabel: "production_stub",
        tierSummaryLabel: "",
        diagnostics: ["ok"],
      },
      atUnixMs: at,
    });
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;

    expect(fs.existsSync(join(ZONE_ROOT, hd, "inbox", "keep.json"))).toBe(true);
    expect(r1.markerRelativePath).toMatch(
      /keep\.accepted\.\d{8}-\d{6}\.marker\.json$/,
    );
    expect(r2.markerRelativePath).toMatch(
      /keep\.accepted\.\d{8}-\d{6}\.1\.marker\.json$/,
    );
    const procDir = join(ZONE_ROOT, hd, "processed");
    expect(
      fs.readdirSync(procDir).filter((f) => f.endsWith(".json")),
    ).toHaveLength(2);
  });
});
