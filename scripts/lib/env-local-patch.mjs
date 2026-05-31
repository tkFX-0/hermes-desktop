/**
 * .env.local の特定キーのみ更新（他行・秘密はログに出さない）
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SENSITIVE = /KEY|TOKEN|SECRET|PASSWORD/i;

/**
 * @param {string} envPath
 * @param {Record<string, string>} patches
 */
export function patchEnvLocal(envPath, patches) {
  const lines = existsSync(envPath)
    ? readFileSync(envPath, "utf-8").split(/\r?\n/)
    : [];

  const keys = Object.keys(patches);
  const out = [];
  const done = new Set();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      out.push(line);
      continue;
    }
    const eq = line.indexOf("=");
    if (eq < 0) {
      out.push(line);
      continue;
    }
    const key = line.slice(0, eq).trim();
    if (keys.includes(key)) {
      out.push(`${key}=${patches[key]}`);
      done.add(key);
    } else {
      out.push(line);
    }
  }

  for (const key of keys) {
    if (!done.has(key)) {
      out.push(`${key}=${patches[key]}`);
    }
  }

  writeFileSync(envPath, `${out.join("\n").replace(/\n*$/, "")}\n`, "utf-8");

  return keys.map((k) => ({
    key: k,
    updated: true,
    sensitive: SENSITIVE.test(k),
  }));
}

/**
 * @param {string} projectRoot
 */
export function defaultEnvLocalPath(projectRoot) {
  return join(projectRoot, ".env.local");
}
