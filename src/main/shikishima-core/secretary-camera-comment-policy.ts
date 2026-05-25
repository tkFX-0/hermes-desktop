import { createActionPreflight, type PreflightResult } from "./preflight-factory";
import type { HumanGoTicket } from "./action-gate-kernel";

export interface SecretaryStillImageCommentInput {
  commentId: string;
  imageSourceSummary: string;
  userPrivacyConfirmed: boolean;
  visiblePeople: boolean;
  privateDataVisible: boolean;
  requestedQuestion: string;
  humanGoTicket?: HumanGoTicket;
}

export interface SecretaryStillImageCommentDraft {
  commentId: string;
  imageSourceSummary: string;
  prompt: string;
  identityRecognitionAllowed: false;
  continuousMonitoring: false;
  retentionByDefault: false;
  canExecuteNow: boolean;
  preflight: PreflightResult;
  blockedReason?: string;
}

export function createSecretaryStillImageCommentDraft(
  input: SecretaryStillImageCommentInput,
): SecretaryStillImageCommentDraft {
  const privacyPass = input.userPrivacyConfirmed && !input.visiblePeople && !input.privateDataVisible;
  const preflight = createActionPreflight({
    actionId: input.commentId,
    actionKind: "stackchan_camera",
    actor: "shizume",
    source: "human",
    targetSummary: "StackChan one still image comment",
    evidencePath: "docs/shikishima/SC_CAM_01_CAMERA_COMMENT_ONE_SHOT_EVIDENCE.md",
    requestedEffects: ["one_still_image_comment"],
    allowedRunCount: 1,
    humanGoTicket: input.humanGoTicket,
  });

  const approved = preflight.gate.decision === "APPROVED_ONE_SHOT" && privacyPass;
  const blockedReason = !privacyPass
    ? "privacy_confirmation_or_image_safety_failed"
    : preflight.gate.decision === "APPROVED_ONE_SHOT"
      ? undefined
      : "human_go_required";

  return {
    commentId: input.commentId,
    imageSourceSummary: input.imageSourceSummary,
    prompt: [
      input.requestedQuestion,
      "個人情報や人物特定はしない。",
      "画像の一般的な雰囲気だけを一文で述べる。",
    ].join("\n"),
    identityRecognitionAllowed: false,
    continuousMonitoring: false,
    retentionByDefault: false,
    canExecuteNow: approved,
    preflight,
    blockedReason,
  };
}

