import { describe, expect, it } from "vitest";
import { listExternalActionRoutes } from "./external-action-route-registry";
import { createExternalActionGuard } from "./create-external-action-guard";

function decisionFor(routeId: string) {
  return createExternalActionGuard({
    routeId,
    actor: "test"
  });
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

  it("includes immutable safety invariants in every decision", () => {
    for (const route of listExternalActionRoutes()) {
      const decision = decisionFor(route.routeId);

      expect(decision.productionReady, route.routeId).toBe(false);
      expect(decision.execution, route.routeId).toBe("disabled");
      expect(decision.rawValuesReported, route.routeId).toBe(false);
    }
  });
});
