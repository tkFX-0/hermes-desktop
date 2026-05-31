/**
 * WSL development runner — composer (Hermes/SDK) → claude → codex.
 */

import { execFile } from "node:child_process";
import { resolveDevBackendChain, resolveDevPipelineConfig } from "./dev-pipeline-router.mjs";
import { wslBash } from "./wsl-exec.mjs";

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

async function runHermesDev(prompt, cfg) {
  const q = JSON.stringify(prompt);
  const cmd = `~/.local/bin/hermes chat -Q -q ${q} -m ${cfg.hermesModel} --provider ${cfg.hermesProvider} --yolo 2>&1`;
  const r = await wslExec(cfg.wslDistro, cmd);
  return {
    ok: r.ok,
    text: r.text,
    backend: "hermes-brain",
    model: cfg.hermesModel,
    lane: "開発"
  };
}

async function runClaudeDev(prompt, cfg) {
  const q = JSON.stringify(prompt);
  const cmd = `claude -p ${q} --model ${cfg.claudeModel} --output-format text 2>&1`;
  const r = await wslExec(cfg.wslDistro, cmd);
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
  const q = JSON.stringify(prompt);
  const cmd =
    `codex exec --sandbox workspace-write --ephemeral ${q} 2>&1`;
  const r = await wslExec(cfg.wslDistro, cmd, 300_000);
  return {
    ok: r.ok,
    text: r.text?.slice(0, 12_000) ?? "",
    backend: "codex-cli",
    model: "codex",
    lane: "開発"
  };
}

function winExec(bin, args, cwd, timeoutMs = 300_000) {
  return new Promise((resolve) => {
    execFile(
      bin,
      args,
      { cwd, timeout: timeoutMs, maxBuffer: 8 * 1024 * 1024, shell: false },
      (err, stdout, stderr) => {
        const text = String(stdout ?? stderr ?? "")
          .replace(/\x1B\[[0-9;]*[mGKHF]/g, "")
          .trim();
        resolve({ ok: !err && text.length > 0, text, error: err?.message });
      }
    );
  });
}

/** Cursor Pro — `agent` CLI (Composer pool, login session). */
async function runAgentCliDev(prompt, cfg, cwd) {
  const args = ["-p", prompt, "--model", cfg.composerModel];
  const r = await winExec(cfg.agentCliBin, args, cwd);
  return {
    ok: r.ok,
    text: r.text,
    backend: "cursor-agent-cli",
    model: cfg.composerModel,
    lane: "開発"
  };
}

async function runWslAgentCliDev(prompt, cfg) {
  const q = JSON.stringify(prompt);
  const cmd = `agent -p ${q} --model ${cfg.composerModel} 2>&1`;
  const r = await wslExec(cfg.wslDistro, cmd);
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
  const prompt = `[開発タスク/${input.agentId ?? "tsumugi"}]\n${input.prompt}`;
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
