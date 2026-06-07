import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadChannelThreads } from "./discord-agent-thread-store.mjs";
import { isMemorySlashCommand, reviewMemoryTurns } from "./memory-dreaming.mjs";

const STATE_FILE = "memory-dreaming-schedule.json";
const DEFAULT_INTERVAL_MS = 24 * 60 * 60 * 1000;
const DEFAULT_MESSAGE_THRESHOLD = 50;
const DEFAULT_REVIEW_WINDOW = 30;
const DEFAULT_TICK_MS = 60_000;

/**
 * @param {string | undefined} value
 * @param {boolean} defaultValue
 */
function envTruthy(value, defaultValue) {
  if (value === undefined || value === "") return defaultValue;
  const v = String(value).trim().toLowerCase();
  if (v === "0" || v === "false" || v === "off" || v === "no") return false;
  if (v === "1" || v === "true" || v === "on" || v === "yes") return true;
  return defaultValue;
}

/**
 * @param {(key: string) => string | undefined} [getEnv]
 */
export function resolveDreamingScheduleConfig(getEnv = (key) => process.env[key]) {
  const intervalHours = Number(getEnv("SHIKISHIMA_DREAMING_INTERVAL_HOURS") ?? "24");
  const messageThreshold = Number(getEnv("SHIKISHIMA_DREAMING_MESSAGE_THRESHOLD") ?? String(DEFAULT_MESSAGE_THRESHOLD));
  const reviewWindow = Number(getEnv("SHIKISHIMA_DREAMING_REVIEW_WINDOW") ?? String(DEFAULT_REVIEW_WINDOW));
  const tickMs = Number(getEnv("SHIKISHIMA_DREAMING_TICK_MS") ?? String(DEFAULT_TICK_MS));

  return {
    enabled: envTruthy(getEnv("SHIKISHIMA_DREAMING_SCHEDULE_ENABLED"), true),
    intervalMs: Number.isFinite(intervalHours) && intervalHours > 0
      ? intervalHours * 60 * 60 * 1000
      : DEFAULT_INTERVAL_MS,
    messageThreshold: Number.isFinite(messageThreshold) && messageThreshold > 0
      ? Math.floor(messageThreshold)
      : DEFAULT_MESSAGE_THRESHOLD,
    reviewWindow: Number.isFinite(reviewWindow) && reviewWindow > 0
      ? Math.floor(reviewWindow)
      : DEFAULT_REVIEW_WINDOW,
    tickMs: Number.isFinite(tickMs) && tickMs >= 10_000 ? Math.floor(tickMs) : DEFAULT_TICK_MS,
  };
}

function statePath(memoryDir) {
  return join(memoryDir, STATE_FILE);
}

export function defaultDreamingScheduleState() {
  return {
    lastReviewAt: null,
    userMessagesSinceReview: 0,
    lastReviewReason: null,
    lastCreatedCount: 0,
  };
}

/**
 * @param {string} memoryDir
 */
export function loadDreamingScheduleState(memoryDir) {
  mkdirSync(memoryDir, { recursive: true });
  const path = statePath(memoryDir);
  if (!existsSync(path)) return defaultDreamingScheduleState();
  try {
    const data = JSON.parse(readFileSync(path, "utf-8"));
    return {
      ...defaultDreamingScheduleState(),
      ...data,
      userMessagesSinceReview: Number(data.userMessagesSinceReview ?? 0) || 0,
      lastCreatedCount: Number(data.lastCreatedCount ?? 0) || 0,
    };
  } catch {
    return defaultDreamingScheduleState();
  }
}

/**
 * @param {string} memoryDir
 * @param {ReturnType<typeof defaultDreamingScheduleState>} state
 */
export function saveDreamingScheduleState(memoryDir, state) {
  mkdirSync(memoryDir, { recursive: true });
  writeFileSync(statePath(memoryDir), JSON.stringify(state, null, 2), "utf-8");
}

/**
 * @param {string} memoryDir
 * @param {object} [patch]
 */
export function recordDreamingUserMessage(memoryDir, patch = {}) {
  const state = loadDreamingScheduleState(memoryDir);
  state.userMessagesSinceReview += 1;
  if (patch.channelId) state.lastChannelId = String(patch.channelId);
  saveDreamingScheduleState(memoryDir, state);
  return state;
}

/**
 * @param {string} memoryDir
 * @param {object} [opts]
 * @param {string} [opts.reason]
 * @param {number} [opts.createdCount]
 */
export function markMemoryDreamingReviewCompleted(memoryDir, opts = {}) {
  const state = loadDreamingScheduleState(memoryDir);
  state.lastReviewAt = new Date().toISOString();
  state.userMessagesSinceReview = 0;
  state.lastReviewReason = opts.reason ?? state.lastReviewReason ?? "manual";
  state.lastCreatedCount = Number(opts.createdCount ?? 0) || 0;
  saveDreamingScheduleState(memoryDir, state);
  return state;
}

/**
 * @param {ReturnType<typeof loadDreamingScheduleState>} state
 * @param {ReturnType<typeof resolveDreamingScheduleConfig>} config
 * @param {number} [nowMs]
 */
export function shouldRunScheduledMemoryReview(state, config, nowMs = Date.now()) {
  if (!config.enabled) return { due: false, reason: "disabled" };
  if (!state.lastReviewAt) {
    return { due: true, reason: "bootstrap" };
  }
  const elapsed = nowMs - Date.parse(state.lastReviewAt);
  if (Number.isFinite(elapsed) && elapsed >= config.intervalMs) {
    return { due: true, reason: "interval" };
  }
  if (state.userMessagesSinceReview >= config.messageThreshold) {
    return { due: true, reason: "message_count" };
  }
  return { due: false, reason: "not_due" };
}

/**
 * @param {Array<{ role?: string, content?: string, at?: string }>} sharedLog
 * @param {string | null | undefined} sinceAt
 */
export function selectDreamingReviewTurns(sharedLog, sinceAt, reviewWindow = DEFAULT_REVIEW_WINDOW) {
  const userTurns = (sharedLog ?? []).filter((row) => {
    if (row?.role !== "user") return false;
    const text = String(row.content ?? "");
    if (!text || isMemorySlashCommand(text)) return false;
    if (sinceAt && row.at && String(row.at) <= String(sinceAt)) return false;
    return true;
  });
  return userTurns.slice(-reviewWindow);
}

/**
 * @param {string} memoryDir
 * @param {string} channelId
 * @param {object} [opts]
 * @param {ReturnType<typeof resolveDreamingScheduleConfig>} [opts.config]
 * @param {Date} [opts.now]
 */
export function runScheduledMemoryDreamingReview(memoryDir, channelId, opts = {}) {
  const config = opts.config ?? resolveDreamingScheduleConfig();
  const state = loadDreamingScheduleState(memoryDir);
  const due = shouldRunScheduledMemoryReview(state, config, opts.now?.getTime());
  if (!due.due) {
    return { ran: false, due: false, reason: due.reason, created: [], notifyText: null };
  }

  const targetChannelId = state.lastChannelId || channelId;
  const threadState = loadChannelThreads(targetChannelId);
  const turns = selectDreamingReviewTurns(
    threadState.sharedLog,
    state.lastReviewAt,
    config.reviewWindow
  );
  const result = reviewMemoryTurns(memoryDir, turns, { now: opts.now ?? new Date() });
  markMemoryDreamingReviewCompleted(memoryDir, {
    reason: due.reason,
    createdCount: result.created.length,
  });

  const notifyText = result.created.length
    ? buildDreamingProposalNotifyText(result.created.length, result.autoApplied?.length ?? 0)
    : null;

  return {
    ran: true,
    due: true,
    reason: due.reason,
    created: result.created,
    autoApplied: result.autoApplied ?? [],
    heldForTk: result.heldForTk ?? [],
    skipped: result.skipped,
    notifyText,
  };
}

/**
 * @param {number} count
 */
export function buildDreamingProposalNotifyText(count, autoApplied = 0) {
  const n = Number(count) || 0;
  if (n <= 0) return null;
  const autoN = Number(autoApplied) || 0;
  return [
    "🧠 **Dreaming** — 記憶候補を処理しました。",
    autoN > 0
      ? `✅ 汚染フィルタ通過 ${autoN} 件を USER.md に自動反映しました。`
      : `${n} 件を proposals/ に作成しました。`,
    autoN < n ? "⏸ 残りは tk 承認待ち。`/memory review` または `/memory list` で確認。" : "",
    "SOUL.md は自動変更しません。",
  ]
    .filter(Boolean)
    .join("\n");
}
