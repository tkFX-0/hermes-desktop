import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const STATE_FILE = "npm-check-state.json";
const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * @param {string} memoryDir
 */
export function checkStatePath(memoryDir) {
  return join(memoryDir, STATE_FILE);
}

/**
 * @param {string} memoryDir
 */
export function loadNpmCheckState(memoryDir) {
  const path = checkStatePath(memoryDir);
  if (!existsSync(path)) {
    return { ok: false, exitCode: 1, finishedAt: null, summary: "not_run" };
  }
  try {
    const data = JSON.parse(readFileSync(path, "utf-8"));
    return {
      ok: Boolean(data.ok),
      exitCode: Number(data.exitCode ?? 1),
      finishedAt: data.finishedAt ?? null,
      summary: String(data.summary ?? ""),
    };
  } catch {
    return { ok: false, exitCode: 1, finishedAt: null, summary: "corrupt_state" };
  }
}

/**
 * @param {string} memoryDir
 * @param {object} state
 */
export function saveNpmCheckState(memoryDir, state) {
  mkdirSync(memoryDir, { recursive: true });
  writeFileSync(
    checkStatePath(memoryDir),
    JSON.stringify(
      {
        ok: Boolean(state.ok),
        exitCode: Number(state.exitCode ?? 1),
        finishedAt: state.finishedAt ?? new Date().toISOString(),
        summary: String(state.summary ?? "").slice(0, 500),
      },
      null,
      2
    ),
    "utf-8"
  );
}

/**
 * @param {string} memoryDir
 * @param {number} [maxAgeMs]
 */
export function isNpmCheckGreen(memoryDir, maxAgeMs = DEFAULT_MAX_AGE_MS) {
  const state = loadNpmCheckState(memoryDir);
  if (!state.ok || !state.finishedAt) return false;
  const age = Date.now() - Date.parse(state.finishedAt);
  return Number.isFinite(age) && age >= 0 && age <= maxAgeMs;
}

/**
 * @param {string} root
 * @param {string} memoryDir
 * @param {object} [opts]
 * @param {typeof spawnSync} [opts.spawnFn]
 */
export function runNpmCheckAndRecord(root, memoryDir, opts = {}) {
  const spawnFn = opts.spawnFn ?? spawnSync;
  const cmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const r = spawnFn(cmd, ["run", "check"], {
    cwd: root,
    encoding: "utf-8",
    shell: true,
    timeout: opts.timeoutMs ?? 600_000,
    env: { ...process.env, CI: "1" },
  });
  const out = `${r.stdout ?? ""}\n${r.stderr ?? ""}`.trim();
  const summary = out.split(/\r?\n/).slice(-8).join("\n").slice(0, 500);
  const state = {
    ok: r.status === 0,
    exitCode: r.status ?? 1,
    finishedAt: new Date().toISOString(),
    summary: r.status === 0 ? "npm run check: pass" : summary || `exit ${r.status ?? 1}`,
  };
  saveNpmCheckState(memoryDir, state);
  return state;
}
