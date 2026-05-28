import type { StackChanDisplayFaceMood } from "../../shared/stackchan-display-preview/stackchan-display-preview-types";

export type StackChanDeviceFaceMode = "happy" | "normal" | "thinking" | "surprised";

const FACE_MOOD_TO_DEVICE_MODE: Record<StackChanDisplayFaceMood, StackChanDeviceFaceMode> = {
  happy: "happy",
  calm: "normal",
  neutral: "normal",
  caution: "thinking",
  alert: "surprised",
  waiting: "normal"
};

export type FaceModeMapResult =
  | { ok: true; faceMode: StackChanDeviceFaceMode }
  | { ok: false; reason: "face_mood_unmapped" };

export function mapFaceMoodToDeviceFaceMode(mood: StackChanDisplayFaceMood): FaceModeMapResult {
  const faceMode = FACE_MOOD_TO_DEVICE_MODE[mood];
  if (!faceMode) {
    return { ok: false, reason: "face_mood_unmapped" };
  }
  return { ok: true, faceMode };
}
