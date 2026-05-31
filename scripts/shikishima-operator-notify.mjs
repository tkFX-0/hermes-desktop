#!/usr/bin/env node
/**
 * 意図別 StackChan オペレーター通知（外部送信なし）
 *
 *   node scripts/shikishima-operator-notify.mjs --intent human_judgment_needed
 *   node scripts/shikishima-operator-notify.mjs --intent cursor_answer_complete --dry-run
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  OPERATOR_NOTIFY_INTENTS,
  speakOperatorNotify,
  resolveOperatorNotifyPhrase
} from "./lib/stackchan-operator-notify.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");
const idx = process.argv.indexOf("--intent");
const intent = idx >= 0 ? process.argv[idx + 1] : "";

if (!intent || !OPERATOR_NOTIFY_INTENTS.includes(intent)) {
  console.error(`Usage: --intent <${OPERATOR_NOTIFY_INTENTS.join("|")}>`);
  process.exit(1);
}

console.log(`[operator-notify] intent=${intent} phrase=${resolveOperatorNotifyPhrase(intent)}`);
const r = await speakOperatorNotify(intent, { projectRoot: root, dryRun });
console.log(JSON.stringify(r, null, 2));
process.exit(r.ok || r.skipped ? 0 : 1);
