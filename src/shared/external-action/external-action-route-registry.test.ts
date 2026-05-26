import { describe, expect, it } from "vitest";
import {
  getExternalActionRoute,
  listExternalActionRoutes,
  classifyUnknownRoute,
  listRoutesByEffectType
} from "./external-action-route-registry";

function expectRoute(routeId: string) {
  const route = getExternalActionRoute(routeId);
  expect(route, `missing route ${routeId}`).toBeDefined();
  return route!;
}

describe("external action route registry", () => {
  it("is not empty", () => {
    expect(listExternalActionRoutes().length).toBeGreaterThan(0);
  });

  it("has unique route IDs", () => {
    const routeIds = listExternalActionRoutes().map((route) => route.routeId);
    expect(new Set(routeIds).size).toBe(routeIds.length);
  });

  it("returns DESIGN_HOLD for unknown routes", () => {
    const route = classifyUnknownRoute("new.unclassified.route");
    expect(route.effectType).toBe("unknown");
    expect(route.defaultActionMode).toBe("DESIGN_HOLD");
    expect(route.risk).toBe("high");
    expect(route.requiresPreflight).toBe(true);
    expect(route.requiresHumanGo).toBe(true);
  });

  it("keeps Discord send on SAFETY_HOLD with human GO", () => {
    const route = expectRoute("discord.send");
    expect(route.effectType).toBe("external_write");
    expect(route.defaultActionMode).toBe("SAFETY_HOLD");
    expect(route.requiresHumanGo).toBe(true);
    expect(route.requiresPreflight).toBe(true);
  });

  it("keeps Discord auto-reply NOT_APPROVED", () => {
    expect(expectRoute("discord.autoReply").defaultActionMode).toBe(
      "NOT_APPROVED"
    );
  });

  it("keeps StackChan voice/audio on SAFETY_HOLD", () => {
    const route = expectRoute("stackchan.voiceAudio");
    expect(route.effectType).toBe("device_audio");
    expect(route.defaultActionMode).toBe("SAFETY_HOLD");
  });

  it("keeps StackChan motion on SAFETY_HOLD", () => {
    const route = expectRoute("stackchan.motion");
    expect(route.effectType).toBe("device_motion");
    expect(route.defaultActionMode).toBe("SAFETY_HOLD");
  });

  it("keeps StackChan STT on SAFETY_HOLD", () => {
    const route = expectRoute("stackchan.sttMicrophone");
    expect(route.effectType).toBe("mic_stt");
    expect(route.defaultActionMode).toBe("SAFETY_HOLD");
  });

  it("keeps StackChan camera on SAFETY_HOLD", () => {
    const route = expectRoute("stackchan.camera");
    expect(route.effectType).toBe("camera");
    expect(route.defaultActionMode).toBe("SAFETY_HOLD");
  });

  it("keeps StackChan firmware upload NOT_APPROVED", () => {
    expect(expectRoute("stackchan.firmwareUpload").defaultActionMode).toBe(
      "NOT_APPROVED"
    );
  });

  it("keeps worker git push NOT_APPROVED", () => {
    expect(expectRoute("worker.gitPush").defaultActionMode).toBe("NOT_APPROVED");
  });

  it("keeps worker runtime start NOT_APPROVED", () => {
    expect(expectRoute("worker.runtimeStart").defaultActionMode).toBe(
      "NOT_APPROVED"
    );
  });

  it("keeps productionReady change NOT_APPROVED", () => {
    const route = expectRoute("productionReady.change");
    expect(route.effectType).toBe("production_gate");
    expect(route.defaultActionMode).toBe("NOT_APPROVED");
  });

  it("keeps execution enablement NOT_APPROVED", () => {
    const route = expectRoute("execution.enablement");
    expect(route.effectType).toBe("execution_gate");
    expect(route.defaultActionMode).toBe("NOT_APPROVED");
  });

  it("requires preflight for every external_write route", () => {
    for (const route of listRoutesByEffectType("external_write")) {
      expect(route.requiresPreflight, route.routeId).toBe(true);
    }
  });

  it("requires human GO for audio, motion, microphone, and camera routes", () => {
    for (const effectType of [
      "device_audio",
      "device_motion",
      "mic_stt",
      "camera"
    ] as const) {
      for (const route of listRoutesByEffectType(effectType)) {
        expect(route.requiresHumanGo, route.routeId).toBe(true);
      }
    }
  });

  it("keeps every unknown route on DESIGN_HOLD", () => {
    for (const route of listRoutesByEffectType("unknown")) {
      expect(route.defaultActionMode, route.routeId).toBe("DESIGN_HOLD");
    }
  });
});
