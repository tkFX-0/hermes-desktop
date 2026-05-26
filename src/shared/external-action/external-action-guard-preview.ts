import { createExternalActionGuard } from "./create-external-action-guard";
import type {
  ExternalActionGuardDecision,
  ExternalActionGuardRequest
} from "./external-action-types";

export type ExternalActionGuardPreviewRequest = ExternalActionGuardRequest;

export type ExternalActionGuardPreviewResult = {
  previewOnly: true;
  decision: ExternalActionGuardDecision;
};

export function previewExternalActionGuardDecision(
  request: ExternalActionGuardPreviewRequest
): ExternalActionGuardPreviewResult {
  return {
    previewOnly: true,
    decision: createExternalActionGuard(request)
  };
}

export function previewSelectedExternalActionGuardDecisions(
  actor: string
): ExternalActionGuardPreviewResult[] {
  return [
    previewExternalActionGuardDecision({
      routeId: "discord.send",
      actor,
      reason: "A5 selected guard preview"
    }),
    previewExternalActionGuardDecision({
      routeId: "worker.gitPush",
      actor,
      reason: "A5 selected guard preview"
    }),
    previewExternalActionGuardDecision({
      routeId: "unknown.route.preview",
      actor,
      reason: "A5 selected guard preview"
    })
  ];
}
