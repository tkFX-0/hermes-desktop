/**
 * オペレーター向け StackChan 発話 — 意図（intent）ごとに別フレーズ・別デバウンス
 *
 *   node scripts/shikishima-operator-notify.mjs --intent human_judgment_needed
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/** @typedef {typeof OPERATOR_NOTIFY_INTENTS[number]} OperatorNotifyIntent */

export const OPERATOR_NOTIFY_INTENTS = [
  "cursor_answer_complete",
  "codex_answer_complete",
  "codex_operator_question",
  "codex_selection_needed",
  "plan_selection_needed",
  "human_judgment_needed",
  "operator_question",
  "workflow_human_gate",
  "kaihatu_review_hold"
];

const DEFAULT_PHRASES = {
  codex_answer_complete: "Codexの回答が完了しました。確認してください。",
  codex_operator_question: "Codexから質問があります。確認してください。",
  codex_selection_needed: "Codexが返答の選択を待っています。確認してください。",
  cursor_answer_complete: "Cursorの作業が完了しました。",
  plan_selection_needed: "プランの選択が必要です。画面を確認してください。",
  human_judgment_needed: "ご判断をお願いします。Discordを確認してください。",
  operator_question: "質問があります。Cursorを開いてください。",
  workflow_human_gate: "ワークフローが人間確認待ちです。",
  kaihatu_review_hold: "開発レビューで確認が必要です。"
};

/** intent ごとの最小間隔（ms） */
const DEFAULT_DEBOUNCE_MS = {
  cursor_answer_complete: 45_000,
  codex_answer_complete: 45_000,
  codex_operator_question: 60_000,
  codex_selection_needed: 90_000,
  plan_selection_needed: 120_000,
  human_judgment_needed: 90_000,
  operator_question: 60_000,
  workflow_human_gate: 120_000,
  kaihatu_review_hold: 90_000
};

/**
 * @param {string} intent
 * @param {NodeJS.ProcessEnv} [env]
 */
export function isOperatorNotifyIntent(intent, env = process.env) {
  if (!OPERATOR_NOTIFY_INTENTS.includes(intent)) return false;
  const allOff = env.SHIKISHIMA_OPERATOR_NOTIFY?.trim().toLowerCase();
  if (allOff === "0" || allOff === "off" || allOff === "false") return false;
  const key = `SHIKISHIMA_OPERATOR_NOTIFY_${intent.toUpperCase()}`;
  const per = env[key]?.trim().toLowerCase();
  if (per === "0" || per === "off" || per === "false") return false;
  return true;
}

/**
 * @param {string} intent
 * @param {NodeJS.ProcessEnv} [env]
 */
export function resolveOperatorNotifyPhrase(intent, env = process.env) {
  const key = `SHIKISHIMA_NOTIFY_PHRASE_${intent.toUpperCase()}`;
  const custom = env[key]?.trim();
  if (custom) return custom.slice(0, 120);
  return DEFAULT_PHRASES[intent] ?? DEFAULT_PHRASES.human_judgment_needed;
}

/**
 * @param {string} intent
 * @param {NodeJS.ProcessEnv} [env]
 */
export function debounceMsForIntent(intent, env = process.env) {
  const key = `SHIKISHIMA_NOTIFY_DEBOUNCE_MS_${intent.toUpperCase()}`;
  const raw = env[key]?.trim();
  if (raw && /^\d+$/.test(raw)) return Number(raw);
  return DEFAULT_DEBOUNCE_MS[intent] ?? 60_000;
}

/**
 * @param {string} memoryDir
 */
function debouncePath(memoryDir) {
  return join(memoryDir, "operator-notify-debounce.json");
}

/**
 * @param {string} memoryDir
 * @param {string} intent
 * @param {number} windowMs
 */
export function shouldDebounceOperatorNotify(memoryDir, intent, windowMs) {
  const path = debouncePath(memoryDir);
  try {
    if (!existsSync(path)) return false;
    const data = JSON.parse(readFileSync(path, "utf8"));
    const t = Number(data[intent] ?? 0);
    return Date.now() - t < windowMs;
  } catch {
    return false;
  }
}

/**
 * @param {string} memoryDir
 * @param {string} intent
 */
export function markOperatorNotifyDebounce(memoryDir, intent) {
  mkdirSync(memoryDir, { recursive: true });
  const path = debouncePath(memoryDir);
  let data = {};
  try {
    if (existsSync(path)) data = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    data = {};
  }
  data[intent] = Date.now();
  writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Cursor stop フック JSON から intent を推定
 * @param {object} [payload]
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {OperatorNotifyIntent}
 */
export function parseCursorHookNotifyIntent(payload = {}, env = process.env) {
  const forced = env.SHIKISHIMA_CURSOR_NOTIFY_INTENT?.trim();
  if (forced && OPERATOR_NOTIFY_INTENTS.includes(forced)) return forced;

  const blob = JSON.stringify(payload).toLowerCase();
  const mode = String(
    payload.mode ?? payload.agent_mode ?? payload.composer_mode ?? payload.subagent_mode ?? ""
  ).toLowerCase();

  if (
    mode.includes("plan") ||
    /"plan"|awaiting_plan|plan_mode|needs_plan/.test(blob)
  ) {
    return "plan_selection_needed";
  }
  if (
    /question|ask_user|needs.?input|clarif|user_input|follow.?up/.test(blob) ||
    mode.includes("ask")
  ) {
    return "operator_question";
  }
  if (
    /approval|human|judgment|confirm|選択|choose|decision_required/.test(blob) ||
    payload.status === "awaiting_approval"
  ) {
    return "human_judgment_needed";
  }
  return "cursor_answer_complete";
}

/**
 * Codex stop/status payload JSON から StackChan 通知 intent を推定する。
 * @param {object} [payload]
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {OperatorNotifyIntent}
 */
export function parseCodexHookNotifyIntent(payload = {}, env = process.env) {
  const forced = env.SHIKISHIMA_CODEX_NOTIFY_INTENT?.trim();
  if (forced && OPERATOR_NOTIFY_INTENTS.includes(forced)) return forced;

  const blob = JSON.stringify(payload).toLowerCase();
  const mode = String(
    payload.mode ?? payload.agent_mode ?? payload.codex_mode ?? payload.status ?? ""
  ).toLowerCase();

  if (
    /choose|selection|select_response|pick|option|decision_required|選択/.test(blob) ||
    mode.includes("choose") ||
    mode.includes("selection")
  ) {
    return "codex_selection_needed";
  }
  if (
    /question|ask_user|needs.?input|clarif|user_input|follow.?up|質問/.test(blob) ||
    mode.includes("ask")
  ) {
    return "codex_operator_question";
  }
  return "codex_answer_complete";
}

/**
 * ワークフロー stage 遷移 → intent
 * @param {string} stageBefore
 * @param {string} stageAfter
 */
export function workflowStageToNotifyIntent(stageBefore, stageAfter) {
  if (stageAfter === "human") return "workflow_human_gate";
  if (stageAfter === "eval" && stageBefore === "record") return null;
  return null;
}

/**
 * @param {string} intent
 * @param {object} [opts]
 * @param {string} [opts.projectRoot]
 * @param {boolean} [opts.dryRun]
 * @param {boolean} [opts.skipDebounce]
 * @param {NodeJS.ProcessEnv} [opts.env]
 */
export async function speakOperatorNotify(intent, opts = {}) {
  const env = opts.env ?? process.env;
  const root = opts.projectRoot ?? process.cwd();
  const memoryDir = join(root, ".shikishima-memory");

  if (!OPERATOR_NOTIFY_INTENTS.includes(intent)) {
    return { ok: false, skipped: "unknown_intent", intent };
  }
  if (!isOperatorNotifyIntent(intent, env)) {
    return { ok: true, skipped: "intent_disabled", intent };
  }

  const windowMs = debounceMsForIntent(intent, env);
  if (
    !opts.skipDebounce &&
    shouldDebounceOperatorNotify(memoryDir, intent, windowMs)
  ) {
    return { ok: true, skipped: "debounced", intent };
  }

  const phrase = resolveOperatorNotifyPhrase(intent, env);

  process.env.SHIKISHIMA_PROJECT_ROOT = root;
  const {
    isStackchanVoiceHold,
    stackchanSay,
    isDiscordSpeechDigestActive,
    shouldDeferOperatorNotifyDuringDiscord,
    operatorNotifyDeferModeDuringDiscord,
    pushDeferredOperatorNotify,
  } = await import("../shikishima-stackchan.mjs");

  if (
    !opts.bypassDigestDefer &&
    shouldDeferOperatorNotifyDuringDiscord(env) &&
    isDiscordSpeechDigestActive()
  ) {
    const mode = operatorNotifyDeferModeDuringDiscord(env);
    if (mode === "skip") {
      console.log(`[StackChanVoice] operator notify skipped (discord_digest_active): ${intent}`);
      return { ok: true, skipped: "discord_digest_active", intent, phrase };
    }
    pushDeferredOperatorNotify(intent);
    console.log(`[StackChanVoice] operator notify deferred until discord digest ends: ${intent}`);
    return { ok: true, skipped: "discord_digest_deferred", intent, phrase };
  }

  if (isStackchanVoiceHold()) {
    return { ok: true, skipped: "stackchan_hold", intent, phrase };
  }

  if (opts.dryRun) {
    return { ok: true, dryRun: true, intent, phrase };
  }

  if (!opts.skipDebounce) markOperatorNotifyDebounce(memoryDir, intent);

  const voice = await stackchanSay(phrase, {
    skipMilestone: true,
    skipMotion: true,
    maxSpeechChars: 100,
    queueLabel: `notify:${intent}`
  });

  if (voice.skipped === "stackchan_hold") {
    return { ok: true, skipped: "stackchan_hold", intent, phrase };
  }
  return {
    ok: Boolean(voice.ok),
    intent,
    phrase,
    error: voice.error ?? null
  };
}
