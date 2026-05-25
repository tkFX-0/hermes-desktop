import { existsSync, statSync } from "fs";
import { basename, extname } from "path";
import type { HumanGoTicket } from "./action-gate-kernel";
import {
  createSecretaryStillImageCommentDraft,
  type SecretaryStillImageCommentDraft,
} from "./secretary-camera-comment-policy";

export interface SecretaryStillImageIntakeInput {
  commentId: string;
  imagePath: string;
  userPrivacyConfirmed: boolean;
  visiblePeople: boolean;
  privateDataVisible: boolean;
  requestedQuestion: string;
  humanGoTicket?: HumanGoTicket;
}

export interface SecretaryStillImageIntakeResult {
  ok: boolean;
  reason: string;
  imageSummary?: string;
  retentionByDefault: false;
  externalUpload: false;
  identityRecognition: false;
  draft?: SecretaryStillImageCommentDraft;
}

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function createSecretaryStillImageIntake(
  input: SecretaryStillImageIntakeInput,
): SecretaryStillImageIntakeResult {
  if (!input.userPrivacyConfirmed) {
    return {
      ok: false,
      reason: "privacy_confirmation_required",
      retentionByDefault: false,
      externalUpload: false,
      identityRecognition: false,
    };
  }
  const extension = extname(input.imagePath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return {
      ok: false,
      reason: "unsupported_image_extension",
      retentionByDefault: false,
      externalUpload: false,
      identityRecognition: false,
    };
  }
  if (!existsSync(input.imagePath)) {
    return {
      ok: false,
      reason: "image_missing",
      retentionByDefault: false,
      externalUpload: false,
      identityRecognition: false,
    };
  }
  const stat = statSync(input.imagePath);
  if (!stat.isFile() || stat.size <= 0 || stat.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      reason: "image_size_not_allowed",
      retentionByDefault: false,
      externalUpload: false,
      identityRecognition: false,
    };
  }
  if (input.visiblePeople || input.privateDataVisible) {
    return {
      ok: false,
      reason: "image_privacy_risk",
      retentionByDefault: false,
      externalUpload: false,
      identityRecognition: false,
    };
  }

  const imageSummary = `${basename(input.imagePath)} (${stat.size} bytes)`;
  return {
    ok: true,
    reason: "still_image_intake_ready",
    imageSummary,
    retentionByDefault: false,
    externalUpload: false,
    identityRecognition: false,
    draft: createSecretaryStillImageCommentDraft({
      commentId: input.commentId,
      imageSourceSummary: imageSummary,
      userPrivacyConfirmed: input.userPrivacyConfirmed,
      visiblePeople: input.visiblePeople,
      privateDataVisible: input.privateDataVisible,
      requestedQuestion: input.requestedQuestion,
      humanGoTicket: input.humanGoTicket,
    }),
  };
}

