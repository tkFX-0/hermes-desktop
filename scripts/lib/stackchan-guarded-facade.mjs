/**
 * SC-013 Phase 2 — StackChan 単一 guarded facade（SideBot 本番入口）
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  isStackchanVoiceHold,
  resolveStackchanDiscordVoiceConfig
} from "./stackchan-voice-config.mjs";
import { hasConstitutionalScope } from "./constitutional-go-read.mjs";
import {
  stackchanSay as _say,
  stackchanFace as _face,
  stackchanSayAsAgent as _sayAgent,
  stackchanSayPreparedBatchItems,
  isStackchanVoiceBusy
} from "../shikishima-stackchan.mjs";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * @param {"say"|"face"|"say_agent"} kind
 * @param {{ requireConstitutionalVoice?: boolean }} [opts]
 */
export function evaluateStackchanFacadeGuard(kind, opts = {}) {
  const env = process.env;
  const cfg = resolveStackchanDiscordVoiceConfig(env);
  if (cfg.hold || isStackchanVoiceHold(env)) {
    return "stackchan_hold";
  }
  if (kind === "say" && cfg.primaryRoute === "disabled") {
    return "voice_route_disabled";
  }
  if (opts.requireConstitutionalVoice && !hasConstitutionalScope(projectRoot, "stackchan_voice")) {
    return "constitutional_stackchan_voice_required";
  }
  if (kind === "face" && isStackchanVoiceBusy()) {
    return "voice_busy";
  }
  return null;
}

/**
 * @param {string} text
 * @param {object} [opts]
 */
export async function guardedStackchanSay(text, opts = {}) {
  const reason = evaluateStackchanFacadeGuard("say", opts);
  if (reason) return { ok: true, skipped: reason };
  return _say(text, opts);
}

/**
 * @param {string} emotion
 * @param {object} [opts]
 */
export async function guardedStackchanFace(emotion, opts = {}) {
  const reason = evaluateStackchanFacadeGuard("face", opts);
  if (reason) return { ok: true, skipped: reason };
  return _face(emotion);
}

/**
 * @param {string} agentId
 * @param {string} text
 * @param {string} [mood]
 * @param {object} [opts]
 */
export async function guardedStackchanSayAsAgent(agentId, text, mood = "speak", opts = {}) {
  const reason = evaluateStackchanFacadeGuard("say_agent", opts);
  if (reason) return { ok: true, skipped: reason };
  return _sayAgent(agentId, text, mood);
}

export { stackchanSayPreparedBatchItems };
