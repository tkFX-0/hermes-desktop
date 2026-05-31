/**
 * 同一Discordメッセージの二重処理防止（プロセス横断・原子的ロック）
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";

const MAX_IDS = 400;

function storePath(memoryDir) {
  return join(memoryDir, "discord-processed-ids.json");
}

function lockPath(memoryDir, messageId) {
  const safe = String(messageId).replace(/[^0-9]/g, "");
  return join(memoryDir, "locks", `in-${safe}.lock`);
}

function appendId(memoryDir, messageId) {
  const path = storePath(memoryDir);
  let data = { ids: [] };
  try {
    if (existsSync(path)) {
      data = JSON.parse(readFileSync(path, "utf-8"));
      if (!Array.isArray(data.ids)) data.ids = [];
    }
  } catch {
    data = { ids: [] };
  }
  if (!data.ids.includes(messageId)) {
    data.ids.push(messageId);
    if (data.ids.length > MAX_IDS) data.ids = data.ids.slice(-MAX_IDS);
    data.updatedAt = new Date().toISOString();
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
  }
}

/**
 * @param {string} memoryDir
 * @param {string} messageId
 * @returns {boolean} true = 初回クレーム成功（処理してよい）
 */
export function claimDiscordMessage(memoryDir, messageId) {
  if (!messageId) return false;

  const lp = lockPath(memoryDir, messageId);
  mkdirSync(dirname(lp), { recursive: true });

  if (existsSync(lp)) {
    try {
      const age = Date.now() - Number(readFileSync(lp, "utf-8").split("\n")[1] ?? "0");
      if (age < 24 * 60 * 60 * 1000) return false;
      unlinkSync(lp);
    } catch {
      return false;
    }
  }

  try {
    writeFileSync(lp, `${process.pid}\n${Date.now()}`, { flag: "wx" });
    appendId(memoryDir, messageId);
    return true;
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "EEXIST") return false;
    return false;
  }
}

/**
 * @param {string} memoryDir
 * @param {string} messageId
 */
export function releaseDiscordMessageClaim(memoryDir, messageId) {
  const lp = lockPath(memoryDir, messageId);
  try {
    if (existsSync(lp)) unlinkSync(lp);
  } catch {
    /* ignore */
  }
}
