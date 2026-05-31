/**
 * Windows Cursor `agent` CLI spawn — avoids DEP0190 (shell + args concat).
 */

import { spawn } from "node:child_process";

/**
 * @param {string} bin
 * @param {string[]} args
 * @param {{ cwd?: string, timeoutMs?: number }} [opts]
 */
export function execWindowsAgent(bin, args, opts = {}) {
  const timeoutMs = opts.timeoutMs ?? 300_000;
  const cwd = opts.cwd;

  return new Promise((resolve) => {
    const isCmd = process.platform === "win32" && /\.(cmd|bat)$/i.test(bin);
    const spawnFile = isCmd ? process.env.ComSpec || "cmd.exe" : bin;
    const spawnArgs = isCmd ? ["/d", "/s", "/c", bin, ...args] : args;

    const child = spawn(spawnFile, spawnArgs, {
      cwd,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (c) => {
      stdout += c;
    });
    child.stderr?.on("data", (c) => {
      stderr += c;
    });

    const timer = setTimeout(() => {
      child.kill();
      resolve({
        ok: false,
        text: stdout.trim() || stderr.trim(),
        error: "timeout"
      });
    }, timeoutMs);

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ ok: false, text: "", error: err.message });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      const text = String(stdout || stderr)
        .replace(/\x1B\[[0-9;]*[mGKHF]/g, "")
        .trim();
      resolve({
        ok: code === 0 && text.length > 0,
        text,
        error: code !== 0 ? `exit_${code}` : undefined
      });
    });
  });
}

/**
 * @param {string} bin
 */
export function execWindowsAgentStatus(bin) {
  return execWindowsAgent(bin, ["status"], { timeoutMs: 15_000 });
}
