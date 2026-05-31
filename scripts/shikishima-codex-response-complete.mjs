#!/usr/bin/env node

/**
 * Codex answer / question / selection-needed notification -> StackChan speech.
 *
 *   node scripts/shikishima-codex-response-complete.mjs --dry-run
 *   node scripts/shikishima-codex-response-complete.mjs --intent codex_operator_question
 *   node scripts/shikishima-codex-response-complete.mjs --payload-json "{\"status\":\"needs_input\"}"
 */

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  OPERATOR_NOTIFY_INTENTS,
  parseCodexHookNotifyIntent,
  resolveOperatorNotifyPhrase,
  speakOperatorNotify
} from "./lib/stackchan-operator-notify.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");
const skipDebounce = process.argv.includes("--skip-debounce");

const intentArgIdx = process.argv.indexOf("--intent");
const forcedIntent =
  intentArgIdx >= 0 ? process.argv[intentArgIdx + 1] : process.env.SHIKISHIMA_CODEX_NOTIFY_INTENT;

function readJoinedOptionValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx < 0) return null;
  const parts = [];
  for (let i = idx + 1; i < process.argv.length; i++) {
    if (process.argv[i]?.startsWith("--")) break;
    parts.push(process.argv[i]);
  }
  return parts.length ? parts.join(" ") : null;
}

let hookPayload = {};
const payloadJson = readJoinedOptionValue("--payload-json");
if (payloadJson) {
  try {
    hookPayload = JSON.parse(payloadJson);
  } catch {
    hookPayload = {};
  }
}

const parsedIntent = parseCodexHookNotifyIntent(hookPayload, process.env);
const intent = forcedIntent?.trim() || parsedIntent;

if (!OPERATOR_NOTIFY_INTENTS.includes(intent)) {
  console.warn(`[codex-notify] unknown intent=${intent}`);
  process.exit(2);
}

const phrase = resolveOperatorNotifyPhrase(intent, process.env);
const voice = await speakOperatorNotify(intent, {
  projectRoot: root,
  dryRun,
  skipDebounce,
  env: process.env
});

if (voice.skipped === "debounced") {
  console.log(`[codex-notify] debounced intent=${intent}`);
  process.exit(0);
}

if (voice.skipped === "stackchan_hold" || voice.skipped === "intent_disabled") {
  console.log(`[codex-notify] ${voice.skipped} intent=${intent}`);
  process.exit(0);
}

if (dryRun) {
  console.log(`[codex-notify] dry-run intent=${intent} phrase=${phrase}`);
  process.exit(0);
}

if (voice.ok) {
  console.log(`[codex-notify] ok intent=${intent}`);
} else {
  console.warn(`[codex-notify] fail intent=${intent}`, voice.error ?? "");
}

process.exit(voice.ok || voice.skipped ? 0 : 1);
