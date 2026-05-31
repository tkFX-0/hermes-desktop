/**
 * Persistent Discord intake cursor.
 *
 * Problem solved: the bot used to seed `lastMessageId` to the channel's newest
 * message on every startup. Frequent restarts therefore skipped user messages
 * that arrived just before a restart, so replies never came.
 *
 * This module persists the last *handled* user message id per channel, so the
 * bot resumes from where it left off across restarts. A staleness guard keeps
 * the bot from replying to an ancient backlog (cursor advances without reply).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

const STORE_PATH = join(
  homedir(),
  "Desktop",
  "プロジェクトファイル",
  "hermes-desktop",
  ".shikishima-memory",
  "discord-intake-cursor.json"
);

/** Messages older than this are not auto-replied on resume (cursor only). */
export const STALE_REPLY_MS = 30 * 60 * 1000;

function readStore() {
  try {
    if (!existsSync(STORE_PATH)) return {};
    return JSON.parse(readFileSync(STORE_PATH, "utf-8")) ?? {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    mkdirSync(dirname(STORE_PATH), { recursive: true });
    writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    /* best-effort persistence */
  }
}

/** @returns {string|null} last handled user-message id for the channel */
export function loadIntakeCursor(channelId) {
  const store = readStore();
  const v = store?.[channelId]?.lastHandledId;
  return typeof v === "string" && v.length > 0 ? v : null;
}

export function saveIntakeCursor(channelId, messageId) {
  if (!channelId || !messageId) return;
  const store = readStore();
  store[channelId] = {
    lastHandledId: String(messageId),
    updatedAt: new Date().toISOString()
  };
  writeStore(store);
}

/**
 * Should we actually reply to this message, or just advance the cursor?
 * @param {string|undefined} isoTimestamp Discord message timestamp
 * @param {number} nowMs
 */
export function isFreshEnoughToReply(isoTimestamp, nowMs = Date.now()) {
  if (!isoTimestamp) return true;
  const t = Date.parse(isoTimestamp);
  if (Number.isNaN(t)) return true;
  return nowMs - t <= STALE_REPLY_MS;
}
