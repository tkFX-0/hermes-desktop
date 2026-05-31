/**
 * Win32: stop other node.exe processes running shikishima-bot.mjs (duplicate SideBot).
 */

import { execFileSync } from "node:child_process";

const BOT_CMD_RE = /shikishima-bot\.mjs/i;

/**
 * @param {number} [keepPid] — do not kill this PID (usually process.pid)
 * @returns {number[]} PIDs that were targeted for kill
 */
export function killOtherShikishimaBots(keepPid = process.pid) {
  const ps = `
$keep = ${Number(keepPid) || 0}
$bots = Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'shikishima-bot\\.mjs' -and $_.ProcessId -ne $keep } |
  Select-Object -ExpandProperty ProcessId
@($bots) | ConvertTo-Json -Compress
`.trim();

  let pids = [];
  try {
    const raw = execFileSync(
      "powershell",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps],
      { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 },
    ).trim();
    if (!raw || raw === "null") pids = [];
    else {
      const parsed = JSON.parse(raw);
      pids = Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch {
    return [];
  }

  const stopped = [];
  for (const pid of pids) {
    const n = Number(pid);
    if (!Number.isFinite(n) || n <= 0) continue;
    try {
      execFileSync("taskkill", ["/PID", String(n), "/F", "/T"], { stdio: "ignore" });
      stopped.push(n);
    } catch {
      /* already exited */
    }
  }
  return stopped;
}
