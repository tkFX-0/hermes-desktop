/**
 * SideBot Service — manages shikishima-bot.mjs as a child process.
 * Electron spawns the standalone bot on startup, restarts on crash,
 * and stops cleanly on app quit.
 *
 * Why: standalone bot has full personality, Groq/Claude routing, memory,
 * StackChan integration, and event-driven Discord (discord.js).
 * Electron app provides the GUI only.
 */

import { spawn } from "child_process";
import type { ChildProcess } from "child_process";
import { join } from "path";
import { existsSync } from "fs";
import { app } from "electron";

const MAX_RESTARTS = 10;
const BASE_COOLDOWN_MS = 5_000;
const SIDEBOT_HOLD = true;

let _proc: ChildProcess | null = null;
let _restartCount = 0;
let _stopped = false;

function getBotPath(): string {
  const base = app.isPackaged ? process.resourcesPath : app.getAppPath();
  return join(base, "scripts", "shikishima-bot.mjs");
}

function getProjectRoot(): string {
  return app.isPackaged ? process.resourcesPath : app.getAppPath();
}

function spawnBot(): void {
  if (_stopped) return;

  const botPath = getBotPath();
  if (!existsSync(botPath)) {
    console.warn("[SideBot] shikishima-bot.mjs not found:", botPath);
    return;
  }

  console.log(`[SideBot] Starting (attempt ${_restartCount + 1})...`);

  _proc = spawn("node", [botPath], {
    cwd: getProjectRoot(),
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env },
  });

  _proc.stdout?.on("data", (data: Buffer) => {
    for (const line of data.toString().split("\n").filter(Boolean)) {
      process.stdout.write(`[SideBot] ${line}\n`);
    }
  });

  _proc.stderr?.on("data", (data: Buffer) => {
    for (const line of data.toString().split("\n").filter(Boolean)) {
      process.stderr.write(`[SideBot] ERR: ${line}\n`);
    }
  });

  _proc.on("exit", (code) => {
    _proc = null;
    if (_stopped) return;

    console.warn(`[SideBot] Exited (code=${code})`);

    if (_restartCount >= MAX_RESTARTS) {
      console.error("[SideBot] Max restarts reached — giving up");
      return;
    }

    const cooldown = _restartCount > 2 ? BASE_COOLDOWN_MS * 2 : BASE_COOLDOWN_MS;
    _restartCount++;
    console.log(`[SideBot] Restarting in ${cooldown / 1000}s (${_restartCount}/${MAX_RESTARTS})...`);
    setTimeout(spawnBot, cooldown);
  });
}

export function startSideBot(): void {
  if (SIDEBOT_HOLD) {
    console.log("[SideBot] HOLD until explicit human GO");
    return;
  }
  _stopped = false;
  _restartCount = 0;
  spawnBot();
}

export function stopSideBot(): void {
  _stopped = true;
  if (_proc && !_proc.killed) {
    console.log("[SideBot] Stopping...");
    _proc.kill("SIGTERM");
    _proc = null;
  }
}

export function isSideBotRunning(): boolean {
  return _proc !== null && !_proc.killed;
}
