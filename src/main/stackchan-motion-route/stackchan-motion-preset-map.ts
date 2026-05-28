import type { StackChanMotionIntent } from "../../shared/stackchan-motion-preview/stackchan-motion-preview-types";
import { createStackChanMotionPreview } from "../../shared/stackchan-motion-preview/stackchan-motion-preview";

export type MotionPresetMapResult =
  | { ok: true; presetAction: string }
  | { ok: false; reason: string };

export function mapMotionIntentToPresetAction(intent: StackChanMotionIntent): MotionPresetMapResult {
  const preview = createStackChanMotionPreview(intent);
  if (!preview.presetAction.trim()) {
    return { ok: false, reason: "empty_preset_action" };
  }
  return { ok: true, presetAction: preview.presetAction };
}
