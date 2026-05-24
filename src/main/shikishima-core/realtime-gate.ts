import type { OperationActionKind } from "./operation-ledger-types";

export type RealtimeMode =
  | "READ_ONLY"
  | "DRAFT"
  | "ONE_SHOT_EXTERNAL"
  | "CONTINUOUS"
  | "HARD_HOLD";

export interface RealtimeSourcePolicy {
  sourceId: string;
  mode: RealtimeMode;
  allowedActionKinds: readonly OperationActionKind[];
  requiresHumanGo: boolean;
  privacyConfirmationRequired: boolean;
  maxRunCount: number;
}

export function classifyRealtimeSource(sourceId: string): RealtimeSourcePolicy {
  switch (sourceId) {
    case "x_search":
      return {
        sourceId,
        mode: "READ_ONLY",
        allowedActionKinds: ["x_search"],
        requiresHumanGo: true,
        privacyConfirmationRequired: false,
        maxRunCount: 1,
      };
    case "stackchan_voice":
      return {
        sourceId,
        mode: "ONE_SHOT_EXTERNAL",
        allowedActionKinds: ["stackchan_say"],
        requiresHumanGo: true,
        privacyConfirmationRequired: false,
        maxRunCount: 1,
      };
    case "stackchan_camera":
      return {
        sourceId,
        mode: "ONE_SHOT_EXTERNAL",
        allowedActionKinds: ["stackchan_camera"],
        requiresHumanGo: true,
        privacyConfirmationRequired: true,
        maxRunCount: 1,
      };
    case "stackchan_mic_loop":
    case "camera_monitoring":
      return {
        sourceId,
        mode: "HARD_HOLD",
        allowedActionKinds: [],
        requiresHumanGo: true,
        privacyConfirmationRequired: true,
        maxRunCount: 0,
      };
    default:
      return {
        sourceId,
        mode: "DRAFT",
        allowedActionKinds: ["local_draft"],
        requiresHumanGo: false,
        privacyConfirmationRequired: false,
        maxRunCount: 0,
      };
  }
}
