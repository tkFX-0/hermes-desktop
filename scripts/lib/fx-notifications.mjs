/**
 * FX / ちはや通知プリファレンス（SideBot）
 * - chihaya-hold.json … ユーザー停止（ちはやコマンド・キルゾーン）
 * - fx-notifications.json … 市場速報など個別ON/OFF
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

const DEFAULT_PREFS = {
  killZoneAlerts: true,
  marketReports: true,
};

function holdPath(memoryDir) {
  return join(memoryDir, "chihaya-hold.json");
}

function prefsPath(memoryDir) {
  return join(memoryDir, "fx-notifications.json");
}

function readJsonSafe(path, fallback) {
  try {
    if (!existsSync(path)) return fallback;
    return { ...fallback, ...JSON.parse(readFileSync(path, "utf-8")) };
  } catch {
    return fallback;
  }
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

/** @param {string} memoryDir */
export function isChihayaHeld(memoryDir) {
  try {
    const data = readJsonSafe(holdPath(memoryDir), { hold: false });
    return data.hold === true;
  } catch {
    return false;
  }
}

/** @param {string} memoryDir */
export function getFxNotificationPrefs(memoryDir) {
  return readJsonSafe(prefsPath(memoryDir), { ...DEFAULT_PREFS });
}

/** @param {string} memoryDir */
export function getChihayaNotificationStatus(memoryDir) {
  const held = isChihayaHeld(memoryDir);
  const prefs = getFxNotificationPrefs(memoryDir);
  return {
    held,
    killZoneAlerts: !held && prefs.killZoneAlerts !== false,
    marketReports: !held && prefs.marketReports !== false,
    prefs,
    holdFile: holdPath(memoryDir),
  };
}

/**
 * @param {string} memoryDir
 * @param {boolean} hold
 * @param {string} [reason]
 */
export function setChihayaHold(memoryDir, hold, reason) {
  const now = new Date().toISOString();
  writeJson(holdPath(memoryDir), {
    hold,
    reason: reason ?? (hold ? "user_requested_stop" : "user_requested_resume"),
    updatedAt: now,
  });
  if (hold) {
    setFxNotificationPrefs(memoryDir, {
      killZoneAlerts: false,
      marketReports: false,
      stoppedVia: "chihaya_hold",
    });
  } else {
    setFxNotificationPrefs(memoryDir, {
      killZoneAlerts: true,
      marketReports: true,
      stoppedVia: null,
    });
  }
}

/**
 * @param {string} memoryDir
 * @param {Partial<{ killZoneAlerts: boolean, marketReports: boolean, stoppedVia: string | null }>} patch
 */
export function setFxNotificationPrefs(memoryDir, patch) {
  const prev = getFxNotificationPrefs(memoryDir);
  writeJson(prefsPath(memoryDir), {
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

/** @param {string} memoryDir */
export function setAllFxNotifications(memoryDir, enabled) {
  if (!enabled) {
    setChihayaHold(memoryDir, true, "fx_all_off");
    return;
  }
  setChihayaHold(memoryDir, false, "fx_all_on");
}

/** @param {string} memoryDir */
export function shouldSendKillZoneAlerts(memoryDir) {
  if (isChihayaHeld(memoryDir)) return false;
  const prefs = getFxNotificationPrefs(memoryDir);
  return prefs.killZoneAlerts !== false;
}

/** @param {string} memoryDir */
export function shouldSendMarketReports(memoryDir) {
  if (isChihayaHeld(memoryDir)) return false;
  const prefs = getFxNotificationPrefs(memoryDir);
  return prefs.marketReports !== false;
}

/** @param {string} memoryDir */
export function formatFxNotificationStatus(memoryDir) {
  const s = getChihayaNotificationStatus(memoryDir);
  const lines = [
    "📈 **FX通知の状態**",
    "",
    `ちはやHOLD: ${s.held ? "ON（停止中）" : "OFF（稼働）"}`,
    `キルゾーン15分前アラート: ${s.killZoneAlerts ? "ON" : "OFF"}`,
    `しるべ市場速報 (9/14/22 JST): ${s.marketReports ? "ON" : "OFF"}`,
    "",
    "停止: fx-off / chihaya-stop / 「ちはや停止」（Discord では先頭に !）",
    "再開: fx-on / chihaya-start / 「ちはや再開」",
    "状態確認: chihaya-status（同上）",
  ];
  return lines.join("\n");
}
