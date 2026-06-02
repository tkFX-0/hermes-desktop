/**
 * Hermes backend client for the standalone SideBot (.mjs mirror of
 * src/main/shikishima-hermes-backend). Env-driven and drop-in:
 *  - leave env blank → disabled, SideBot keeps using Groq/Claude.
 *  - set SHIKISHIMA_HERMES_BACKEND_ENABLED=1 (+ transport env) → replies route
 *    through the Hermes agent (API server or WSL CLI), no code change.
 */

import * as http from "node:http";
import * as https from "node:https";
import { URL } from "node:url";

export const HERMES_DEFAULTS = {
  mode: "api",
  apiBase: "http://127.0.0.1:8080/v1",
  wslDistro: "Ubuntu",
  cliBin: "hermes",
  defaultModel: "anthropic/claude-sonnet-4.6",
  timeoutMs: 120_000
};

function truthy(v) {
  if (!v) return false;
  const s = String(v).trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

function pick(...vals) {
  for (const v of vals) {
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return "";
}

/**
 * @param {(name: string) => string | undefined} getEnv
 */
export function resolveHermesConfig(getEnv) {
  const g = (k) => getEnv(k);
  const mode = pick(g("SHIKISHIMA_HERMES_MODE")).toLowerCase() === "cli" ? "cli" : "api";
  const t = Number.parseInt(pick(g("SHIKISHIMA_HERMES_TIMEOUT_MS")), 10);
  return {
    enabled: truthy(g("SHIKISHIMA_HERMES_BACKEND_ENABLED")),
    mode,
    apiBase: pick(g("SHIKISHIMA_HERMES_API_BASE"), HERMES_DEFAULTS.apiBase),
    apiKey: pick(g("SHIKISHIMA_HERMES_API_KEY")),
    wslDistro: pick(g("SHIKISHIMA_HERMES_WSL_DISTRO"), HERMES_DEFAULTS.wslDistro),
    cliBin: pick(g("SHIKISHIMA_HERMES_CLI_BIN"), HERMES_DEFAULTS.cliBin),
    provider: pick(g("SHIKISHIMA_HERMES_PROVIDER")),
    defaultModel: pick(g("SHIKISHIMA_HERMES_MODEL"), HERMES_DEFAULTS.defaultModel),
    timeoutMs: Number.isFinite(t) && t > 0 ? t : HERMES_DEFAULTS.timeoutMs,
    dryRun: truthy(g("SHIKISHIMA_HERMES_DRY_RUN"))
  };
}

export function isHermesBackendEnabled(getEnv) {
  return resolveHermesConfig(getEnv).enabled;
}

function postJson(urlStr, apiKey, bodyObj, timeoutMs) {
  return new Promise((resolve) => {
    let url;
    try {
      url = new URL(urlStr);
    } catch {
      resolve({ status: 0, error: "bad_url" });
      return;
    }
    const body = JSON.stringify(bodyObj);
    const buf = Buffer.from(body, "utf8");
    const lib = url.protocol === "https:" ? https : http;
    const headers = {
      "Content-Type": "application/json",
      "Content-Length": buf.length
    };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const req = lib.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: url.pathname + url.search,
        method: "POST",
        headers,
        timeout: timeoutMs
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json;
          try {
            json = JSON.parse(text);
          } catch {
            json = undefined;
          }
          resolve({ status: res.statusCode ?? 0, json, text });
        });
      }
    );
    req.on("error", (e) => resolve({ status: 0, error: e.message }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 408, error: "timeout" });
    });
    req.write(buf);
    req.end();
  });
}

function extractOpenAiText(json) {
  const content = json?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content.trim() : "";
}

function runHermesCli({ model }) {
  return Promise.resolve({
    ok: false,
    stdout: "",
    error: "hermes_cli_full_auto_sealed_2026_06",
    model
  });
}

/**
 * @param {{ prompt: string, system?: string, model?: string, provider?: string }} request
 * @param {(name: string) => string | undefined} getEnv
 */
export async function hermesChat(request, getEnv) {
  const cfg = resolveHermesConfig(getEnv);
  const model = pick(request.model, cfg.defaultModel);

  if (!cfg.enabled) {
    return { ok: false, text: "", backend: "hermes-disabled", model, reason: "disabled" };
  }
  if (cfg.dryRun) {
    return {
      ok: true,
      text: `[hermes-dry-run] mode=${cfg.mode} model=${model}`,
      backend: "hermes-dry-run",
      model
    };
  }

  if (cfg.mode === "api") {
    const messages = request.system
      ? [
          { role: "system", content: request.system },
          { role: "user", content: request.prompt }
        ]
      : [{ role: "user", content: request.prompt }];
    const res = await postJson(
      `${cfg.apiBase.replace(/\/$/, "")}/chat/completions`,
      cfg.apiKey,
      { model, messages, stream: false },
      cfg.timeoutMs
    );
    if (res.status < 200 || res.status >= 300) {
      return { ok: false, text: "", backend: "hermes-api", model, reason: res.error ?? `http_${res.status}` };
    }
    const text = extractOpenAiText(res.json);
    return text
      ? { ok: true, text, backend: "hermes-api", model }
      : { ok: false, text: "", backend: "hermes-api", model, reason: "empty" };
  }

  const out = await runHermesCli({
    distro: cfg.wslDistro,
    bin: cfg.cliBin,
    prompt: request.system ? `${request.system}\n\n${request.prompt}` : request.prompt,
    model,
    provider: request.provider ?? cfg.provider,
    timeoutMs: cfg.timeoutMs
  });
  return out.ok && out.stdout
    ? { ok: true, text: out.stdout, backend: "hermes-cli", model }
    : { ok: false, text: "", backend: "hermes-cli", model, reason: out.error ?? "cli_empty" };
}
