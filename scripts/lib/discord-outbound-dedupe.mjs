/**
 * Discord 送信の二重防止（プロセス横断・トークン節約）
 * - スケジュール枠: 排他 lock ファイル（市場速報 9/14/22 など）
 * - 本文: 直近ウィンドウ内の同一 fingerprint をブロック
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { createHash } from "crypto";

const DEFAULT_OUTBOUND_WINDOW_MS = 120_000; // 2分 — 類似二重投稿を抑止
const MAX_RECENT = 80;

function locksDir(memoryDir) {
  return join(memoryDir, "locks");
}

function recentPath(memoryDir) {
  return join(memoryDir, "discord-outbound-recent.json");
}

function normalizeForFingerprint(text) {
  return String(text ?? "")
    .replace(/\d{4}[/-]\d{1,2}[/-]\d{1,2}[^\n]*/g, "<DATE>")
    .replace(/\d{1,2}:\d{2}(:\d{2})?/g, "<TIME>")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}

function fingerprint(agentId, text) {
  const payload = `${agentId}|${normalizeForFingerprint(text)}`;
  return createHash("sha256").update(payload, "utf8").digest("hex").slice(0, 24);
}

function readRecent(memoryDir) {
  const path = recentPath(memoryDir);
  try {
    if (!existsSync(path)) return { entries: [] };
    const data = JSON.parse(readFileSync(path, "utf-8"));
    return Array.isArray(data.entries) ? data : { entries: [] };
  } catch {
    return { entries: [] };
  }
}

function writeRecent(memoryDir, data) {
  const path = recentPath(memoryDir);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * 定期送信枠を先に確保（Groq/API 呼び出し前に呼ぶ）
 * @param {string} memoryDir
 * @param {string} slotId 例: market-report-2026-05-29-22
 * @param {number} [ttlMs]
 * @returns {boolean} true = このプロセスが送信してよい
 */
export function claimScheduledOutboundSlot(memoryDir, slotId, ttlMs = 6 * 60 * 60 * 1000) {
  const safe = slotId.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const dir = locksDir(memoryDir);
  mkdirSync(dir, { recursive: true });
  const lockPath = join(dir, `sched-${safe}.lock`);

  if (existsSync(lockPath)) {
    try {
      const raw = readFileSync(lockPath, "utf-8");
      const at = Number(raw.split("\n")[1] ?? "0");
      if (at && Date.now() - at < ttlMs) return false;
      unlinkSync(lockPath);
    } catch {
      try {
        unlinkSync(lockPath);
      } catch {
        /* ignore */
      }
    }
  }

  try {
    writeFileSync(lockPath, `${process.pid}\n${Date.now()}`, { flag: "wx" });
    return true;
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "EEXIST") return false;
    return false;
  }
}

/**
 * @param {string} memoryDir
 * @param {string} agentId
 * @param {string} text
 * @param {number} [windowMs]
 * @returns {{ skip: boolean, reason?: string, fp?: string }}
 */
export function peekOutboundDuplicate(memoryDir, agentId, text, windowMs = DEFAULT_OUTBOUND_WINDOW_MS) {
  const fp = fingerprint(agentId, text);
  const now = Date.now();
  const store = readRecent(memoryDir);
  const hit = store.entries.find((e) => e.fp === fp && now - (e.at ?? 0) < windowMs);
  if (hit) {
    return { skip: true, reason: "duplicate_outbound", fp };
  }
  return { skip: false, fp };
}

/** 送信成功後に呼ぶ */
export function recordOutboundSent(memoryDir, agentId, text) {
  const fp = fingerprint(agentId, text);
  const now = Date.now();
  const store = readRecent(memoryDir);
  store.entries = store.entries.filter((e) => e.fp !== fp);
  store.entries.push({ fp, agentId, at: now, head: normalizeForFingerprint(text).slice(0, 80) });
  store.entries = store.entries
    .filter((e) => now - (e.at ?? 0) < 24 * 60 * 60 * 1000)
    .slice(-MAX_RECENT);
  writeRecent(memoryDir, store);
}
