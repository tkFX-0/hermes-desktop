/**
 * SC-013 Phase 3 — Electron guarded StackChan voice (constitutional + HOLD).
 */

import { hasConstitutionalGoScope } from "./shikishima-full-autonomy/constitutional-go-state";
import { stackchanSayLocal } from "./stackchan-local-service";

export type GuardedStackchanSayResult = {
  ok: boolean;
  error?: string;
  skipped?: string;
};

function isStackchanHoldEnv(): boolean {
  const v = String(process.env.SHIKISHIMA_STACKCHAN_HOLD ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/**
 * Single Electron entry for local PCM voice — mirrors Bot guarded facade gates.
 */
export async function guardedStackchanSayLocal(
  text: string,
  projectRoot: string
): Promise<GuardedStackchanSayResult> {
  if (isStackchanHoldEnv()) {
    return { ok: true, skipped: "stackchan_hold" };
  }
  if (!hasConstitutionalGoScope("stackchan_voice", projectRoot)) {
    return { ok: false, error: "constitutional_stackchan_voice_required" };
  }
  const slice = String(text ?? "").slice(0, 300);
  if (!slice.trim()) {
    return { ok: false, error: "empty_text" };
  }
  return stackchanSayLocal(slice);
}
