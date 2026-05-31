#!/usr/bin/env node
/**
 * WSL development pipeline preflight — subscription-oriented tool probe.
 * No secrets printed. Read-only checks.
 *
 *   node scripts/shikishima-wsl-dev-preflight.mjs
 */

import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { wslBash, WSL_DISTRO } from "./lib/wsl-exec.mjs";
import { execWindowsAgentStatus } from "./lib/win-agent-exec.mjs";

const MEMORY_DIR = join(
  homedir(),
  "Desktop",
  "プロジェクトファイル",
  "hermes-desktop",
  ".shikishima-memory"
);
const OUT_PATH = join(MEMORY_DIR, "wsl-dev-preflight.json");

const TOOL_NAMES = ["claude", "hermes", "cursor", "agent", "codex", "openai", "node", "npm"];

async function probeTool(name) {
  const r = await wslBash(`command -v ${name} 2>/dev/null || true`);
  const path = r.stdout.split("\n")[0]?.trim() ?? "";
  if (!path) return { present: false };
  const ver = await wslBash(`${name} --version 2>/dev/null | head -1 || true`, { timeoutMs: 25_000 });
  return { present: true, path, version: ver.stdout.slice(0, 80) };
}

function probeWindowsAgent() {
  try {
    const out = execFileSync("where.exe", ["agent"], { encoding: "utf8", timeout: 10_000 });
    const path = out.split(/\r?\n/).find((l) => l.trim())?.trim() ?? "";
    if (!path) return { present: false };
    let version = "";
    try {
      version = execFileSync("agent", ["--version"], { encoding: "utf8", timeout: 10_000 }).trim();
    } catch {
      version = "";
    }
    return { present: true, path, version: version.slice(0, 80) };
  } catch {
    return { present: false };
  }
}

function detectAgentLoggedIn(statusOutput) {
  const out = String(statusOutput ?? "").trim();
  return (
    /logged\s+in\s+as\s+\S+/i.test(out) ||
    (/logged\s+in|authenticated/i.test(out) && !/not\s+logged|login\s+required/i.test(out))
  );
}

async function probeWindowsAgentLogin(agentPresent, agentPath) {
  if (!agentPresent) {
    return { loggedIn: false, hint: "install: irm cursor.com/install?win32=true | iex" };
  }
  const bin = (agentPath || "agent").trim();
  try {
    if (process.platform === "win32" && /\.(cmd|bat)$/i.test(bin)) {
      const r = await execWindowsAgentStatus(bin);
      const loggedIn = detectAgentLoggedIn(r.text);
      return {
        loggedIn,
        hint: loggedIn ? "cursor_agent_session_ok" : "run in PowerShell: agent login"
      };
    }
    const out = execFileSync(bin, ["status"], { encoding: "utf8", timeout: 15_000, windowsHide: true }).trim();
    const loggedIn = detectAgentLoggedIn(out);
    return {
      loggedIn,
      hint: loggedIn ? "cursor_agent_session_ok" : "run in PowerShell: agent login"
    };
  } catch {
    return { loggedIn: false, hint: "run in PowerShell: agent login" };
  }
}

async function probeClaudeLogin() {
  const r = await wslBash(
    `if command -v claude >/dev/null 2>&1; then claude auth status 2>&1 | head -5; else echo __missing__; fi`
  );
  if (r.stdout.includes("__missing__")) {
    return { loggedIn: false, hint: "install claude CLI in WSL" };
  }
  let loggedIn =
    /logged in|authenticated|valid/i.test(r.stdout) && !/not logged|login required/i.test(r.stdout);
  if (!loggedIn && r.stdout.includes('"loggedIn"')) {
    try {
      const j = JSON.parse(r.stdout);
      loggedIn = j.loggedIn === true;
    } catch {
      loggedIn = /"loggedIn"\s*:\s*true/.test(r.stdout);
    }
  }
  return {
    loggedIn,
    hint: loggedIn ? "wsl_claude_session_ok" : "run in WSL: claude login"
  };
}

async function probeCodexLogin() {
  const r = await wslBash(
    `if command -v codex >/dev/null 2>&1; then codex login status 2>&1 | head -5 || true; else echo __missing__; fi`
  );
  if (r.stdout.includes("__missing__")) {
    return { loggedIn: false, hint: "codex CLI not installed (optional leg)" };
  }
  const loggedIn =
    /logged in|authenticated/i.test(r.stdout) && !/not logged|login required/i.test(r.stdout);
  return {
    loggedIn,
    hint: loggedIn ? "wsl_codex_session_ok" : "optional: codex login in WSL"
  };
}

async function main() {
  const ping = await wslBash("echo wsl_ok");

  const tools = {};
  let parseError = null;
  if (ping.ok) {
    for (const name of TOOL_NAMES) {
      tools[name] = await probeTool(name);
    }
  }

  const winAgent = probeWindowsAgent();
  const windows = {
    agent: winAgent,
    agentLogin: await probeWindowsAgentLogin(winAgent.present, winAgent.path)
  };

  const login = ping.ok
    ? {
        claude: await probeClaudeLogin(),
        codex: await probeCodexLogin()
      }
    : { claude: { loggedIn: false, hint: "wsl_unreachable" }, codex: { loggedIn: false, hint: "wsl_unreachable" } };

  const report = {
    at: new Date().toISOString(),
    distro: WSL_DISTRO,
    wslReachable: ping.ok && ping.stdout === "wsl_ok",
    probeOk: ping.ok,
    probeError: ping.error ?? null,
    parseError,
    tools,
    windows,
    login,
    subscriptionLane: {
      composer: {
        note: "Cursor Pro: `agent` CLI + login = Composer pool (https://cursor.com/docs/cli/installation). CURSOR_API_KEY empty recommended.",
        winAgentCli: Boolean(windows?.agent?.present),
        wslAgentCli: Boolean(tools?.agent?.present),
        wslCursorCli: Boolean(tools?.cursor?.present)
      },
      claude: {
        note: "Claude Pro: WSL `claude` CLI login (subscription session)",
        wslClaudeCli: Boolean(tools?.claude?.present)
      },
      codex: {
        note: "ChatGPT/Codex: `codex` CLI or OPENAI — Plus does not include pay-as-you-go API by default",
        wslCodexCli: Boolean(tools?.codex?.present)
      },
      hermes: {
        note: "Hermes brain: WSL `hermes` CLI — orchestration / multi-provider (Grok xai-oauth etc.)",
        wslHermesCli: Boolean(tools?.hermes?.present)
      }
    },
    recommendedDevOrder: ["composer", "claude", "codex"],
    stderr: null
  };

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
