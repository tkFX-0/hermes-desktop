#!/usr/bin/env node
/**
 * SideBot / Electron dev duplicate check — for Composer restart workflow.
 *
 *   node scripts/shikishima-process-preflight.mjs           # report (exit 1 if duplicates)
 *   node scripts/shikishima-process-preflight.mjs --json
 *   node scripts/shikishima-process-preflight.mjs --clean   # stop stale bots (needs human GO)
 *   node scripts/shikishima-process-preflight.mjs --clean --restart-dev
 */

import { execFileSync, spawn } from "node:child_process";
import { existsSync, openSync, readFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BOT_PID_FILE = join(root, ".shikishima-bot.pid");
const LEGACY_PID_FILE = join(root, ".shikishima.pid");

const args = new Set(process.argv.slice(2));
const asJson = args.has("--json");
const doClean = args.has("--clean");
const restartDev = args.has("--restart-dev");

function startStandaloneBot() {
  let logFd;
  try {
    logFd = openSync(join(root, "shikishima-bot.log"), "a");
  } catch {
    logFd = "ignore";
  }
  const child = spawn(process.execPath, ["scripts/shikishima-bot.mjs"], {
    cwd: root,
    detached: true,
    stdio: ["ignore", logFd, logFd],
    env: { ...process.env }
  });
  child.unref();
  return child.pid ?? null;
}

function readPidFile(path) {
  if (!existsSync(path)) return null;
  const n = parseInt(readFileSync(path, "utf8").trim(), 10);
  return Number.isFinite(n) ? n : null;
}

function isProcessAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function queryProcesses() {
  const ps = `
$bots = Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'shikishima-bot\\.mjs' } |
  Select-Object ProcessId, Name, CommandLine
$dev = Get-CimInstance Win32_Process |
  Where-Object {
    ($_.Name -eq 'node.exe' -and $_.CommandLine -match 'electron-vite') -or
    ($_.Name -eq 'electron.exe' -and $_.CommandLine -match 'hermes-desktop|shikishima-desktop')
  } |
  Select-Object ProcessId, Name, CommandLine
@{ bots = @($bots); dev = @($dev) } | ConvertTo-Json -Depth 4 -Compress
`.trim();

  const raw = execFileSync(
    "powershell",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps],
    { encoding: "utf8", maxBuffer: 4 * 1024 * 1024 }
  );
  const parsed = JSON.parse(raw || "{}");
  const norm = (arr) => {
    if (!arr) return [];
    return Array.isArray(arr) ? arr : [arr];
  };
  return {
    bots: norm(parsed.bots),
    dev: norm(parsed.dev)
  };
}

function shortenCmd(cmd) {
  if (!cmd) return "";
  const s = String(cmd).replace(/\s+/g, " ");
  return s.length > 140 ? `${s.slice(0, 140)}…` : s;
}

function stopPid(pid, label) {
  if (!isProcessAlive(pid)) return { pid, label, stopped: false, reason: "not_alive" };
  try {
    execFileSync("taskkill", ["/PID", String(pid), "/F", "/T"], { stdio: "ignore" });
    return { pid, label, stopped: true };
  } catch {
    return { pid, label, stopped: false, reason: "taskkill_failed" };
  }
}

function removePidFiles() {
  for (const f of [BOT_PID_FILE, LEGACY_PID_FILE]) {
    try {
      if (existsSync(f)) unlinkSync(f);
    } catch {
      /* ignore */
    }
  }
}

const pidBotFile = readPidFile(BOT_PID_FILE);
const pidLegacyFile = readPidFile(LEGACY_PID_FILE);
const scanned = queryProcesses();

const report = {
  ok: true,
  duplicateBots: scanned.bots.length > 1,
  botCount: scanned.bots.length,
  devProcessCount: scanned.dev.length,
  pidFiles: {
    bot: { path: ".shikishima-bot.pid", pid: pidBotFile, alive: isProcessAlive(pidBotFile) },
    legacy: { path: ".shikishima.pid", pid: pidLegacyFile, alive: isProcessAlive(pidLegacyFile) }
  },
  bots: scanned.bots.map((p) => ({
    pid: p.ProcessId,
    cmd: shortenCmd(p.CommandLine)
  })),
  dev: scanned.dev.map((p) => ({
    pid: p.ProcessId,
    name: p.Name,
    cmd: shortenCmd(p.CommandLine)
  })),
  actions: []
};

report.ok =
  !report.duplicateBots &&
  report.botCount <= 1 &&
  !(report.pidFiles.bot.alive && report.botCount === 0);

if (doClean) {
  const stopResults = [];
  for (const b of scanned.bots) {
    stopResults.push(stopPid(b.ProcessId, "shikishima-bot"));
  }
  if (pidBotFile && isProcessAlive(pidBotFile) && !scanned.bots.some((b) => b.ProcessId === pidBotFile)) {
    stopResults.push(stopPid(pidBotFile, "pid-file-bot"));
  }
  if (pidLegacyFile && isProcessAlive(pidLegacyFile)) {
    stopResults.push(stopPid(pidLegacyFile, "pid-file-legacy"));
  }
  removePidFiles();
  report.actions.push({ kind: "clean", stopResults });
  const after = queryProcesses();
  report.afterClean = { botCount: after.bots.length, devProcessCount: after.dev.length };
  report.botCount = after.bots.length;
  report.duplicateBots = after.bots.length > 1;
  report.ok = !report.duplicateBots && report.botCount <= 1;
}

if (restartDev) {
  if (!doClean) {
    console.error("--restart-dev requires --clean");
    process.exit(2);
  }
  const devRunning = (report.afterClean?.devProcessCount ?? report.devProcessCount) > 0;
  if (devRunning) {
    const pid = startStandaloneBot();
    report.actions.push({
      kind: "restart-bot-standalone",
      pid,
      reason: "electron-vite dev already running; started SideBot directly to avoid botCount=0"
    });
  } else {
    const child = spawn("npm", ["run", "dev"], {
      cwd: root,
      detached: true,
      stdio: "ignore",
      shell: true,
      env: { ...process.env }
    });
    child.unref();
    report.actions.push({ kind: "restart-dev", pid: child.pid ?? null });
  }
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("[preflight] SideBot processes:", report.botCount);
  if (report.duplicateBots) {
    console.log("[preflight] WARN: duplicate shikishima-bot detected");
  }
  for (const b of report.bots) {
    console.log(`  bot PID ${b.pid}`);
  }
  console.log("[preflight] Dev/Electron related:", report.devProcessCount);
  for (const d of report.dev) {
    console.log(`  ${d.name} PID ${d.pid}`);
  }
  console.log(
    `[preflight] PID files: .shikishima-bot.pid=${report.pidFiles.bot.pid} (alive=${report.pidFiles.bot.alive}), legacy=${report.pidFiles.legacy.pid} (alive=${report.pidFiles.legacy.alive})`
  );
  if (report.actions.length) {
    console.log("[preflight] actions:", JSON.stringify(report.actions, null, 2));
  }
  console.log(report.ok ? "[preflight] OK" : "[preflight] NEEDS_CLEAN");
}

const exitCode = report.ok ? 0 : restartDev && doClean ? 0 : doClean ? 0 : 1;
process.exit(exitCode);
