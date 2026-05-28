#!/usr/bin/env node
/**
 * One-shot voice via legacy stackchanSay (loads .env.local internally).
 * Usage: node scripts/shikishima-voice-pilot-once.mjs [phrase]
 */
import { stackchanSay } from "./shikishima-stackchan.mjs";

process.env.STACKCHAN_VOICEVOX_VOLUME ??= "1.6";

const phrase = process.argv[2] ?? "よろしく。";
const result = await stackchanSay(phrase, { skipMilestone: true, skipMotion: true });
console.log(
  JSON.stringify({
    ok: result.ok,
    skipped: result.skipped ?? false,
    blocked: result.blockedReason ?? null
  })
);
process.exit(result.ok ? 0 : 1);
