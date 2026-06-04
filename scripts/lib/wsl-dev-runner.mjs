/**
 * WSL development runner — composer (Hermes/SDK) → claude → codex.
 */

import {
  resolveDevBackendChain,
  resolveDevPipelineConfig,
  loadWslPreflight
} from "./dev-pipeline-router.mjs";
import { wslBash, wslBashStdin } from "./wsl-exec.mjs";
import { execWindowsAgent } from "./win-agent-exec.mjs";

const WSL_ASCII_WORKDIR = "/mnt/c/dev/hermes";
const CODEX_DEV_MODEL = process.env.SHIKISHIMA_CODEX_DEV_MODEL ?? "gpt-5.4";
const SUBSCRIPTION_ENV_UNSET =
  "unset OPENAI_API_KEY OPENAI_ORG_ID OPENAI_PROJECT ANTHROPIC_API_KEY CURSOR_API_KEY XAI_API_KEY; ";

function shQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function subscriptionDevEnv() {
  const env = { ...process.env };
  for (const key of [
    "OPENAI_API_KEY",
    "OPENAI_ORG_ID",
    "OPENAI_PROJECT",
    "ANTHROPIC_API_KEY",
    "CURSOR_API_KEY",
    "XAI_API_KEY"
  ]) {
    delete env[key];
  }
  return env;
}

function windowsPromptArg(prompt) {
  return String(prompt ?? "").replace(/\r?\n/g, "\\n");
}

function envGetter(env) {
  const src = env ?? process.env;
  return (k) => src?.[k];
}

async function wslExec(_distro, script, timeoutMs = 180_000) {
  const r = await wslBash(script, { timeoutMs });
  const text = String(r.stdout ?? "")
    .replace(/\x1B\[[0-9;]*[mGKHF]/g, "")
    .split("\n")
    .filter((l) => !l.match(/^(session_id:|Session:|Duration:|Messages:|Resume|Initializing|────)/))
    .join("\n")
    .trim();
  return {
    ok: r.ok && text.length > 0,
    text: text || String(r.stderr ?? r.error ?? ""),
    error: r.error
  };
}

function sanitizeWslCliOutput(raw) {
  return String(raw ?? "")
    .replace(/\x1B\[[0-9;]*[mGKHF]/g, "")
    .split("\n")
    .filter((l) => !l.match(/^(session_id:|Session:|Duration:|Messages:|Resume|Initializing|────)/))
    .join("\n")
    .trim();
}

async function wslExecStdin(_distro, script, input, timeoutMs = 180_000) {
  const r = await wslBashStdin(script, input, { timeoutMs });
  const text = sanitizeWslCliOutput(r.stdout || r.stderr);
  return {
    ok: r.ok && text.length > 0,
    text: text || String(r.stderr ?? r.error ?? ""),
    error: r.error
  };
}

async function runHermesDev(_prompt, cfg) {
  return {
    ok: false,
    text: "Hermes brain 経路は封印中です（全自動承認経路の暴走停止）。Claude/Codex へフォールバックします。",
    backend: "hermes-brain-sealed",
    model: cfg.hermesModel,
    lane: "開発",
    reason: "hermes_full_auto_sealed_2026_06"
  };
}

async function runClaudeDev(prompt, cfg) {
  const cmd = `${SUBSCRIPTION_ENV_UNSET}claude --model ${shQuote(cfg.claudeModel)} --output-format text 2>&1`;
  const r = await wslExecStdin(cfg.wslDistro, cmd, prompt);
  return {
    ok: r.ok,
    text: r.text,
    backend: "claude-cli",
    model: cfg.claudeModel,
    lane: "開発"
  };
}

/** Codex CLI — ChatGPT Plus session (`codex login`). Subscription leg; no OpenAI API key. */
async function runCodexDev(prompt, cfg) {
  const cmd =
    `if [ -d ${shQuote(WSL_ASCII_WORKDIR)} ]; then cd ${shQuote(WSL_ASCII_WORKDIR)}; fi; ` +
    SUBSCRIPTION_ENV_UNSET +
    `codex exec --sandbox workspace-write --skip-git-repo-check --ephemeral ` +
    `-C ${shQuote(WSL_ASCII_WORKDIR)} --model ${shQuote(CODEX_DEV_MODEL)} - 2>&1`;
  const r = await wslExecStdin(cfg.wslDistro, cmd, prompt, 300_000);
  return {
    ok: r.ok,
    text: r.text?.slice(0, 12_000) ?? "",
    backend: "codex-cli",
    model: CODEX_DEV_MODEL,
    lane: "開発"
  };
}

/** Cursor Pro — `agent` CLI (Composer pool, login session). */
async function runAgentCliDev(prompt, cfg, cwd) {
  const preflight = loadWslPreflight();
  const bin = preflight?.windows?.agent?.path?.trim() || cfg.agentCliBin;
  const args = [
    "--print",
    "--output-format",
    "text",
    "--model",
    cfg.composerModel,
    "--workspace",
    cwd,
    "--trust",
    "-f",
    windowsPromptArg(prompt)
  ];
  const r = await execWindowsAgent(bin, args, { cwd, timeoutMs: 300_000, env: subscriptionDevEnv() });
  return {
    ok: r.ok,
    text: r.text,
    backend: "cursor-agent-cli",
    model: cfg.composerModel,
    lane: "開発",
    error: r.error
  };
}

async function runWslAgentCliDev(prompt, cfg) {
  const cmd = `${SUBSCRIPTION_ENV_UNSET}agent -p - --model ${shQuote(cfg.composerModel)} 2>&1`;
  const r = await wslExecStdin(cfg.wslDistro, cmd, prompt);
  return {
    ok: r.ok,
    text: r.text,
    backend: "cursor-agent-cli",
    model: cfg.composerModel,
    lane: "開発"
  };
}

async function runComposerSdkDev(prompt) {
  try {
    const dynamicImport = new Function("specifier", "return import(specifier)");
    const { Agent } = await dynamicImport("@cursor/sdk");
    const getEnv = envGetter();
    const apiKey = getEnv("CURSOR_API_KEY");
    if (!apiKey) {
      return { ok: false, text: "", backend: "cursor-sdk", model: "composer-2.5", lane: "開発", reason: "no_cursor_api_key" };
    }
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: "composer-2.5" },
      local: { cwd: process.cwd() }
    });
    const text = String(result?.result ?? "").trim();
    return {
      ok: Boolean(text),
      text,
      backend: "cursor-sdk",
      model: "composer-2.5",
      lane: "開発"
    };
  } catch (e) {
    const msg = e?.code === "ERR_MODULE_NOT_FOUND" ? "cursor_sdk_not_installed" : e?.message ?? "sdk_error";
    return { ok: false, text: "", backend: "cursor-sdk", model: "composer-2.5", lane: "開発", reason: msg };
  }
}

/**
 * Run development task through subscription-first chain.
 * @param {{ prompt: string, agentId?: string }} input
 * @param {NodeJS.ProcessEnv} [env]
 */
export async function runDevPipeline(input, env = process.env) {
  const getEnv = envGetter(env);
  const cfg = resolveDevPipelineConfig(getEnv);
  if (!cfg.enabled) {
    return { ok: false, reason: "dev_pipeline_disabled", lane: "開発" };
  }

  const chain = resolveDevBackendChain(cfg);
  const prompt = `[dev-task/${input.agentId ?? "tsumugi"}]\n${input.prompt}`;
  const attempts = [];

  const projectRoot = process.cwd();

  for (const step of chain) {
    if (step.id === "composer") {
      if (step.via === "cursor-agent-cli-win" || step.via === "cursor-agent-cli-wsl") {
        const r =
          step.via === "cursor-agent-cli-win"
            ? await runAgentCliDev(prompt, cfg, projectRoot)
            : await runWslAgentCliDev(prompt, cfg);
        attempts.push({ ...r, via: step.via });
        if (r.ok) return { ...r, attempts };
      }
      if (step.via === "cursor-sdk") {
        const r = await runComposerSdkDev(prompt);
        attempts.push(r);
        if (r.ok) return { ...r, attempts };
      }
      if (step.via === "hermes-brain") {
        const r = await runHermesDev(prompt, cfg);
        attempts.push({ ...r, via: step.via });
        if (r.ok) return { ...r, backend: "hermes-brain", attempts };
      }
    }
    if (step.id === "claude") {
      const r = await runClaudeDev(prompt, cfg);
      attempts.push(r);
      if (r.ok) return { ...r, attempts };
    }
    if (step.id === "codex" && step.via === "wsl-codex-cli") {
      const r = await runCodexDev(prompt, cfg);
      attempts.push({ ...r, via: step.via });
      if (r.ok) return { ...r, attempts };
    }
  }

  return {
    ok: false,
    text: "",
    lane: "開発",
    reason: "all_dev_backends_failed",
    attempts
  };
}

export function formatDevTraceLine(result) {
  if (!result?.ok) return `[開発] 失敗 (${result?.reason ?? "unknown"})`;
  return `[開発] ${result.backend} / ${result.model}`;
}
