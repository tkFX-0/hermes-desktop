import { describe, expect, it } from "vitest";
import { listExternalActionRoutes } from "./external-action-route-registry";
import { createExternalActionGuard } from "./create-external-action-guard";
import type {
  ExternalActionGuardDecision,
  ExternalEffectType
} from "./external-action-types";

function decisionFor(routeId: string) {
  return createExternalActionGuard({
    routeId,
    actor: "test"
  });
}

const dangerousEffectTypes: ExternalEffectType[] = [
  "external_write",
  "local_file_write",
  "repo_write",
  "shell_exec",
  "runtime_start",
  "device_audio",
  "device_motion",
  "mic_stt",
  "camera",
  "production_gate",
  "execution_gate"
];

function expectCompleteDecision(decision: ExternalActionGuardDecision) {
  expect(typeof decision.routeId).toBe("string");
  expect(typeof decision.effectType).toBe("string");
  expect(typeof decision.decision).toBe("string");
  expect(typeof decision.effectMayRun).toBe("boolean");
  expect(typeof decision.requiresHumanGo).toBe("boolean");
  expect(typeof decision.requiresEvidence).toBe("boolean");
  expect(Array.isArray(decision.requiredEvidence)).toBe(true);
  expect(decision.requiredEvidence).toContain("routeId");
  expect(decision.requiredEvidence).toContain("actor");
  expect(decision.requiredEvidence).toContain("effectType");
  expect(decision.requiredEvidence).toContain("decision");
  expect(typeof decision.reason).toBe("string");
  expect(decision.reason.length).toBeGreaterThan(0);
  expect(decision.productionReady).toBe(false);
  expect(decision.execution).toBe("disabled");
  expect(decision.rawValuesReported).toBe(false);
}

describe("createExternalActionGuard", () => {
  it("returns a structured READ_ONLY decision for known read-only routes", () => {
    const decision = decisionFor("worker.readOnlyInspection");

    expect(decision.decision).toBe("READ_ONLY");
    expect(decision.effectType).toBe("local_file_read");
    expect(decision.effectMayRun).toBe(true);
    expect(decision.productionReady).toBe(false);
    expect(decision.execution).toBe("disabled");
    expect(decision.rawValuesReported).toBe(false);
  });

  it("returns DESIGN_HOLD for unknown routes", () => {
    const decision = decisionFor("new.unclassified.route");

    expect(decision.decision).toBe("DESIGN_HOLD");
    expect(decision.effectType).toBe("unknown");
    expect(decision.effectMayRun).toBe(false);
    expect(decision.requiresHumanGo).toBe(true);
  });

  it("returns complete decision fields for every registered route", () => {
    for (const route of listExternalActionRoutes()) {
      expectCompleteDecision(decisionFor(route.routeId));
    }
  });

  it("returns complete decision fields for unknown routes", () => {
    expectCompleteDecision(decisionFor("new.unclassified.route"));
  });

  it("records human GO references without enabling execution", () => {
    const decision = createExternalActionGuard({
      routeId: "discord.send",
      actor: "test",
      humanGoReference: "GO-EXAMPLE"
    });

    expect(decision.decision).toBe("SAFETY_HOLD");
    expect(decision.effectMayRun).toBe(false);
    expect(decision.reason).toContain("does not enable execution");
  });

  it("does not allow requestedRunCount to enable execution", () => {
    const decision = createExternalActionGuard({
      routeId: "discord.send",
      actor: "test",
      humanGoReference: "GO-EXAMPLE",
      requestedRunCount: 1,
      reason: "coverage hardening"
    });

    expect(decision.decision).toBe("SAFETY_HOLD");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps Discord send on SAFETY_HOLD", () => {
    const decision = decisionFor("discord.send");

    expect(decision.decision).toBe("SAFETY_HOLD");
    expect(decision.effectType).toBe("external_write");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps Discord auto-reply NOT_APPROVED", () => {
    const decision = decisionFor("discord.autoReply");

    expect(decision.decision).toBe("NOT_APPROVED");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps StackChan voice on SAFETY_HOLD", () => {
    const decision = decisionFor("stackchan.voiceAudio");

    expect(decision.decision).toBe("SAFETY_HOLD");
    expect(decision.effectType).toBe("device_audio");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps StackChan motion on SAFETY_HOLD", () => {
    const decision = decisionFor("stackchan.motion");

    expect(decision.decision).toBe("SAFETY_HOLD");
    expect(decision.effectType).toBe("device_motion");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps StackChan STT on SAFETY_HOLD", () => {
    const decision = decisionFor("stackchan.sttMicrophone");

    expect(decision.decision).toBe("SAFETY_HOLD");
    expect(decision.effectType).toBe("mic_stt");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps StackChan camera on SAFETY_HOLD", () => {
    const decision = decisionFor("stackchan.camera");

    expect(decision.decision).toBe("SAFETY_HOLD");
    expect(decision.effectType).toBe("camera");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps StackChan firmware upload NOT_APPROVED", () => {
    const decision = decisionFor("stackchan.firmwareUpload");

    expect(decision.decision).toBe("NOT_APPROVED");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps worker git push NOT_APPROVED", () => {
    const decision = decisionFor("worker.gitPush");

    expect(decision.decision).toBe("NOT_APPROVED");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps worker runtime start NOT_APPROVED", () => {
    const decision = decisionFor("worker.runtimeStart");

    expect(decision.decision).toBe("NOT_APPROVED");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps productionReady changes NOT_APPROVED", () => {
    const decision = decisionFor("productionReady.change");

    expect(decision.decision).toBe("NOT_APPROVED");
    expect(decision.effectType).toBe("production_gate");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps execution enablement NOT_APPROVED", () => {
    const decision = decisionFor("execution.enablement");

    expect(decision.decision).toBe("NOT_APPROVED");
    expect(decision.effectType).toBe("execution_gate");
    expect(decision.effectMayRun).toBe(false);
  });

  it("keeps every NOT_APPROVED route effectMayRun false", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (decision.decision === "NOT_APPROVED") {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("keeps every SAFETY_HOLD route effectMayRun false", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (decision.decision === "SAFETY_HOLD") {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("keeps every DESIGN_HOLD route effectMayRun false", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (decision.decision === "DESIGN_HOLD") {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("keeps every dangerous effect type effectMayRun false", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (dangerousEffectTypes.includes(route.effectType)) {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("keeps external_write routes blocked", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (route.effectType === "external_write") {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("keeps local_file_write routes blocked unless explicitly draft/read-only by design", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (
        route.effectType === "local_file_write" &&
        !["DRAFT_ONLY", "READ_ONLY"].includes(route.defaultActionMode)
      ) {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("keeps repo_write routes blocked", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (route.effectType === "repo_write") {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("keeps shell_exec routes blocked", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (route.effectType === "shell_exec") {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("keeps runtime_start routes blocked", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (route.effectType === "runtime_start") {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("keeps device audio, motion, mic, and camera routes blocked", () => {
    const deviceEffectTypes: ExternalEffectType[] = [
      "device_audio",
      "device_motion",
      "mic_stt",
      "camera"
    ];

    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (deviceEffectTypes.includes(route.effectType)) {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("keeps production and execution gates blocked", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);
      if (["production_gate", "execution_gate"].includes(route.effectType)) {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("does not implement one-shot execution enablement", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = createExternalActionGuard({
        routeId: route.routeId,
        actor: "test",
        humanGoReference: "GO-EXAMPLE",
        requestedRunCount: 1
      });

      if (route.defaultActionMode !== "READ_ONLY" || route.requiresHumanGo) {
        expect(decision.effectMayRun, route.routeId).toBe(false);
      }
    }
  });

  it("includes immutable safety invariants in every decision", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);

      expect(decision.productionReady, route.routeId).toBe(false);
      expect(decision.execution, route.routeId).toBe("disabled");
      expect(decision.rawValuesReported, route.routeId).toBe(false);
    }
  });
});
