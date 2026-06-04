/**
 * WSL exec helpers — Hermes/Codex toolchain lives under root on this machine.
 */

import { execFile, spawn } from "node:child_process";

export const WSL_DISTRO = process.env.SHIKISHIMA_WSL_DISTRO ?? "Ubuntu";

/** Default root: codex/hermes npm globals are under /root/.hermes/node/bin */
export const WSL_DEV_USER = process.env.SHIKISHIMA_WSL_DEV_USER ?? "root";

/** /root/.local/bin/node must precede hermes node (tk-owned binary may deny root). */
export const WSL_PATH_PREFIX =
  'export PATH="/root/.local/bin:/root/.hermes/node/bin:$PATH"; ';

/**
 * @param {string} script
 * @param {{ timeoutMs?: number, user?: string }} [opts]
 */
export function wslBash(script, opts = {}) {
  const user = opts.user ?? WSL_DEV_USER;
  const timeoutMs = opts.timeoutMs ?? 25_000;
  return new Promise((resolve) => {
    execFile(
      "wsl",
      ["-d", WSL_DISTRO, "-u", user, "--", "bash", "--login", "-lc", WSL_PATH_PREFIX + script],
      { timeout: timeoutMs, maxBuffer: 8 * 1024 * 1024 },
      (err, stdout, stderr) => {
        resolve({
          ok: !err,
          stdout: String(stdout ?? "").trim(),
          stderr: String(stderr ?? "").trim(),
          error: err?.message
        });
      }
    );
  });
}

/**
 * WSL bash with stdin prompt (claude/codex/agent `-` style).
 * @param {string} script
 * @param {string} input
 * @param {{ timeoutMs?: number, user?: string }} [opts]
 */
export function wslBashStdin(script, input, opts = {}) {
  const user = opts.user ?? WSL_DEV_USER;
  const timeoutMs = opts.timeoutMs ?? 180_000;
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(
        "wsl",
        ["-d", WSL_DISTRO, "-u", user, "--", "bash", "--login", "-lc", WSL_PATH_PREFIX + script],
        { windowsHide: true, stdio: ["pipe", "pipe", "pipe"] }
      );
    } catch (e) {
      resolve({
        ok: false,
        stdout: "",
        stderr: e?.message ?? "spawn failed",
        error: e?.message
      });
      return;
    }

    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      try { child.kill(); } catch { /* ignore */ }
      resolve({
        ok: false,
        stdout: stdout.trim(),
        stderr: stderr.trim() || "wsl timeout",
        error: "timeout"
      });
    }, timeoutMs);

    child.stdout?.on("data", (c) => { stdout += c; });
    child.stderr?.on("data", (c) => { stderr += c; });
    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({
        ok: false,
        stdout: stdout.trim(),
        stderr: stderr.trim() || err.message,
        error: err.message
      });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        ok: code === 0,
        stdout: String(stdout ?? "").trim(),
        stderr: String(stderr ?? "").trim(),
        error: code !== 0 ? `exit_${code}` : undefined
      });
    });

    child.stdin.write(input, "utf8");
    child.stdin.end();
  });
}
