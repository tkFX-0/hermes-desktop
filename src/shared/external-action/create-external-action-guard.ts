import {
  classifyUnknownRoute,
  getExternalActionRoute
} from "./external-action-route-registry";
import type {
  ExternalActionGuardDecision,
  ExternalActionGuardRequest,
  ExternalActionMode,
  ExternalActionRouteRecord
} from "./external-action-types";

function buildRequiredEvidence(route: ExternalActionRouteRecord): string[] {
  const evidence = [
    "routeId",
    "actor",
    "effectType",
    "decision",
    "productionReady=false",
    "execution=disabled",
    "rawValuesReported=false"
  ];

  if (route.requiresHumanGo) {
    evidence.push("humanGoReference");
  }

  if (route.requiresPreflight) {
    evidence.push("preflightDecision");
  }

  if (route.defaultActionMode === "GO_ONE_SHOT") {
    evidence.push("allowedRunCount", "actualRunCount", "gateRestoredHold");
  }

  return evidence;
}

function canEffectRun(decision: ExternalActionMode, route: ExternalActionRouteRecord): boolean {
  return decision === "READ_ONLY" && !route.requiresHumanGo;
}

function buildReason(
  request: ExternalActionGuardRequest,
  route: ExternalActionRouteRecord,
  wasUnknownRoute: boolean
): string {
  const baseReason = wasUnknownRoute
    ? "Route is not in the external action registry and is classified as DESIGN_HOLD."
    : route.notes;
  const requestReason = request.reason ? ` Request reason: ${request.reason}` : "";
  const humanGoReference = request.humanGoReference
    ? " Human GO reference was recorded but does not enable execution in this goal."
    : "";

  return `${baseReason}${requestReason}${humanGoReference}`;
}

export function createExternalActionGuard(
  request: ExternalActionGuardRequest
): ExternalActionGuardDecision {
  const registryRoute = getExternalActionRoute(request.routeId);
  const route = registryRoute ?? classifyUnknownRoute(request.routeId);
  const wasUnknownRoute = registryRoute === undefined;
  const decision = route.defaultActionMode;

  return {
    routeId: request.routeId,
    decision,
    effectType: route.effectType,
    effectMayRun: canEffectRun(decision, route),
    requiresHumanGo: route.requiresHumanGo,
    requiresEvidence: route.requiresPreflight || route.requiresHumanGo,
    requiredEvidence: buildRequiredEvidence(route),
    reason: buildReason(request, route, wasUnknownRoute),
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false
  };
}
