/**
 * Hermes backend client — turns a prompt into a reply via the Hermes agent,
 * either through its OpenAI-compatible API server or the WSL `hermes` CLI.
 *
 * Transport side effects (HTTP / subprocess) are injected so the planning and
 * formatting logic stays unit-testable with no real network or WSL.
 */

import {
  evaluateHermesBackendReadiness,
  resolveHermesBackendConfig,
  type HermesBackendConfig,
  type HermesBackendEnvSource
} from "./hermes-backend-config";

export interface HermesChatRequest {
  prompt: string;
  /** Optional system prompt prepended for "api" mode. */
  system?: string;
  /** Override the configured default model (e.g. per-agent model). */
  model?: string;
  /** Override provider (cli mode). */
  provider?: string;
}

export interface HermesChatResult {
  ok: boolean;
  text: string;
  backend: "hermes-api" | "hermes-cli" | "hermes-disabled" | "hermes-dry-run";
  model: string;
  reason?: string;
}

/** Injected HTTP transport (api mode). */
export type HermesHttpFn = (args: {
  url: string;
  apiKey: string;
  body: unknown;
  timeoutMs: number;
}) => Promise<{ status: number; json?: unknown; text?: string }>;

/** Injected subprocess transport (cli mode). */
export type HermesCliFn = (args: {
  distro: string;
  bin: string;
  prompt: string;
  model: string;
  provider: string;
  timeoutMs: number;
}) => Promise<{ ok: boolean; stdout: string; error?: string }>;

export interface HermesBackendDeps {
  http?: HermesHttpFn;
  cli?: HermesCliFn;
  env?: HermesBackendEnvSource;
  config?: HermesBackendConfig;
}

function extractOpenAiText(json: unknown): string {
  if (!json || typeof json !== "object") return "";
  const choices = (json as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return "";
  const msg = (choices[0] as { message?: { content?: unknown } }).message;
  const content = msg?.content;
  return typeof content === "string" ? content.trim() : "";
}

export async function hermesChat(
  request: HermesChatRequest,
  deps: HermesBackendDeps = {}
): Promise<HermesChatResult> {
  const config = deps.config ?? resolveHermesBackendConfig(deps.env);
  const readiness = evaluateHermesBackendReadiness(config);
  const model = (request.model && request.model.trim()) || config.defaultModel;

  if (!config.enabled) {
    return {
      ok: false,
      text: "",
      backend: "hermes-disabled",
      model,
      reason: "backend_disabled"
    };
  }

  if (!readiness.ready) {
    return {
      ok: false,
      text: "",
      backend: config.mode === "api" ? "hermes-api" : "hermes-cli",
      model,
      reason: `not_ready:${readiness.missing.join(",")}`
    };
  }

  if (config.dryRun) {
    return {
      ok: true,
      text: `[hermes-dry-run] mode=${config.mode} model=${model}`,
      backend: "hermes-dry-run",
      model,
      reason: "dry_run"
    };
  }

  if (config.mode === "api") {
    if (!deps.http) {
      return { ok: false, text: "", backend: "hermes-api", model, reason: "no_http_transport" };
    }
    const messages = request.system
      ? [
          { role: "system", content: request.system },
          { role: "user", content: request.prompt }
        ]
      : [{ role: "user", content: request.prompt }];

    try {
      const res = await deps.http({
        url: `${config.apiBase.replace(/\/$/, "")}/chat/completions`,
        apiKey: config.apiKey,
        body: { model, messages, stream: false },
        timeoutMs: config.timeoutMs
      });
      if (res.status < 200 || res.status >= 300) {
        return {
          ok: false,
          text: "",
          backend: "hermes-api",
          model,
          reason: `http_${res.status}`
        };
      }
      const text = extractOpenAiText(res.json);
      return text
        ? { ok: true, text, backend: "hermes-api", model }
        : { ok: false, text: "", backend: "hermes-api", model, reason: "empty_response" };
    } catch (e) {
      return {
        ok: false,
        text: "",
        backend: "hermes-api",
        model,
        reason: e instanceof Error ? e.message : "http_error"
      };
    }
  }

  // cli mode
  if (!deps.cli) {
    return { ok: false, text: "", backend: "hermes-cli", model, reason: "no_cli_transport" };
  }
  try {
    const out = await deps.cli({
      distro: config.wslDistro,
      bin: config.cliBin,
      prompt: request.system ? `${request.system}\n\n${request.prompt}` : request.prompt,
      model,
      provider: request.provider ?? config.provider,
      timeoutMs: config.timeoutMs
    });
    const text = (out.stdout ?? "").trim();
    return out.ok && text
      ? { ok: true, text, backend: "hermes-cli", model }
      : {
          ok: false,
          text: "",
          backend: "hermes-cli",
          model,
          reason: out.error ?? "cli_empty"
        };
  } catch (e) {
    return {
      ok: false,
      text: "",
      backend: "hermes-cli",
      model,
      reason: e instanceof Error ? e.message : "cli_error"
    };
  }
}
