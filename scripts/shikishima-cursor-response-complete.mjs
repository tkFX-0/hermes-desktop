#!/usr/bin/env node

/**

 * Cursor エージェント回答終了 → 意図別 StackChan 発話（HOLD 時はスキップ）

 *

 *   node scripts/shikishima-cursor-response-complete.mjs

 *   node scripts/shikishima-cursor-response-complete.mjs --dry-run

 *   node scripts/shikishima-cursor-response-complete.mjs --intent plan_selection_needed

 */



import { join, dirname } from "node:path";

import { fileURLToPath } from "node:url";

import {

  parseCursorHookNotifyIntent,

  speakOperatorNotify,

  resolveOperatorNotifyPhrase

} from "./lib/stackchan-operator-notify.mjs";



const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const dryRun = process.argv.includes("--dry-run");

const intentArgIdx = process.argv.indexOf("--intent");

const forcedIntent =

  intentArgIdx >= 0 ? process.argv[intentArgIdx + 1] : process.env.SHIKISHIMA_OPERATOR_NOTIFY_INTENT;



const { appendShirubeDailyLog } = await import("./lib/obsidian-shirube-write.mjs");



let hookPayload = {};

const payloadIdx = process.argv.indexOf("--payload-json");

if (payloadIdx >= 0) {

  try {

    hookPayload = JSON.parse(process.argv[payloadIdx + 1] ?? "{}");

  } catch {

    hookPayload = {};

  }

}



const intent =

  forcedIntent?.trim() ||

  parseCursorHookNotifyIntent(hookPayload, process.env);



const phrase = resolveOperatorNotifyPhrase(intent, process.env);



const voice = await speakOperatorNotify(intent, {

  projectRoot: root,

  dryRun,

  env: process.env

});



if (voice.skipped === "debounced") {

  console.log(`[cursor-notify] debounced intent=${intent}`);

  process.exit(0);

}



if (voice.skipped === "stackchan_hold" || voice.skipped === "intent_disabled") {

  console.log(`[cursor-notify] ${voice.skipped} intent=${intent}`);

  process.exit(0);

}



if (dryRun) {

  console.log(`[cursor-notify] dry-run intent=${intent} phrase=${phrase}`);

  process.exit(0);

}



if (voice.ok) {

  console.log(`[cursor-notify] ok intent=${intent}`);

} else {

  console.warn(`[cursor-notify] fail intent=${intent}`, voice.error ?? "");

}



appendShirubeDailyLog(root, `Cursor通知 [${intent}]: ${phrase}`, {

  title: "cursor-notify"

});



process.exit(voice.ok || voice.skipped ? 0 : 1);

