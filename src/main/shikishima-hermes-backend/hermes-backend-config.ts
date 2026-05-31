/**
 * Hermes backend — env-driven configuration (drop-in).
 *
 * Design goals:
 *  - しきしま arrangement: respects the agent model registry + safety stance.
 *  - Drop-in: leave env blank → backend stays OFF and existing Groq/Claude
 *    paths are used. Fill env later → Hermes becomes the reply backend with
 *    no code change.
 *  - Two transports: Hermes OpenAI-compatible API server ("api") or the WSL
 *    `hermes` CLI ("cli").
 */

export type HermesBackendMode = "api" | "cli";

export interface HermesBackendConfig {
  enabled: boolean;
  mode: HermesBackendMode;
  /** API mode */
  apiBase: string;
  apiKey: string;
  /** CLI mode */
  wslDistro: string;
  cliBin: string;
  provider: string;
  /** Shared */
  defaultModel: string;
  timeoutMs: number;
  /** When true, only build plans / never actually call out (safety dry-run). */
  dryRun: boolean;
}

export interface HermesBackendEnvSource {
  [key: string]: string | undefined;
}

const ENV_KEYS = {
  enabled: "SHIKISHIMA_HERMES_BACKEND_ENABLED",
  mode: "SHIKISHIMA_HERMES_MODE",
  apiBase: "SHIKISHIMA_HERMES_API_BASE",
  apiKey: "SHIKISHIMA_HERMES_API_KEY",
  wslDistro: "SHIKISHIMA_HERMES_WSL_DISTRO",
  cliBin: "SHIKISHIMA_HERMES_CLI_BIN",
  provider: "SHIKISHIMA_HERMES_PROVIDER",
  model: "SHIKISHIMA_HERMES_MODEL",
  timeoutMs: "SHIKISHIMA_HERMES_TIMEOUT_MS",
  dryRun: "SHIKISHIMA_HERMES_DRY_RUN"
} as const;

function truthy(v: string | undefined): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

function firstNonEmpty(...vals: Array<string | undefined>): string {
  for (const v of vals) {
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return "";
}

export const HERMES_BACKEND_DEFAULTS = {
  mode: "api" as HermesBackendMode,
  apiBase: "http://127.0.0.1:8080/v1",
  wslDistro: "Ubuntu",
  cliBin: "hermes",
  defaultModel: "anthropic/claude-sonnet-4.6",
  timeoutMs: 120_000
} as const;

export function resolveHermesBackendConfig(
  env: HermesBackendEnvSource = process.env
): HermesBackendConfig {
  const modeRaw = firstNonEmpty(env[ENV_KEYS.mode]).toLowerCase();
  const mode: HermesBackendMode = modeRaw === "cli" ? "cli" : "api";

  const timeoutParsed = Number.parseInt(firstNonEmpty(env[ENV_KEYS.timeoutMs]), 10);
  const timeoutMs =
    Number.isFinite(timeoutParsed) && timeoutParsed > 0
      ? timeoutParsed
      : HERMES_BACKEND_DEFAULTS.timeoutMs;

  return {
    enabled: truthy(env[ENV_KEYS.enabled]),
    mode,
    apiBase: firstNonEmpty(env[ENV_KEYS.apiBase], HERMES_BACKEND_DEFAULTS.apiBase),
    apiKey: firstNonEmpty(env[ENV_KEYS.apiKey]),
    wslDistro: firstNonEmpty(env[ENV_KEYS.wslDistro], HERMES_BACKEND_DEFAULTS.wslDistro),
    cliBin: firstNonEmpty(env[ENV_KEYS.cliBin], HERMES_BACKEND_DEFAULTS.cliBin),
    provider: firstNonEmpty(env[ENV_KEYS.provider]),
    defaultModel: firstNonEmpty(env[ENV_KEYS.model], HERMES_BACKEND_DEFAULTS.defaultModel),
    timeoutMs,
    dryRun: truthy(env[ENV_KEYS.dryRun])
  };
}

export interface HermesBackendReadiness {
  enabled: boolean;
  mode: HermesBackendMode;
  ready: boolean;
  missing: readonly string[];
  /** Redacted human-readable summary; never includes key values. */
  summary: string;
}

/**
 * Reports whether the backend is configured well enough to attempt a call.
 * Never returns secret values — only key NAMES that still need filling.
 */
export function evaluateHermesBackendReadiness(
  config: HermesBackendConfig
): HermesBackendReadiness {
  const missing: string[] = [];

  if (!config.enabled) {
    return {
      enabled: false,
      mode: config.mode,
      ready: false,
      missing: [ENV_KEYS.enabled],
      summary: "Hermes backend OFF (既定 Groq/Claude を使用)。有効化は SHIKISHIMA_HERMES_BACKEND_ENABLED=1"
    };
  }

  if (config.mode === "api") {
    if (!config.apiBase) missing.push(ENV_KEYS.apiBase);
    if (!config.defaultModel) missing.push(ENV_KEYS.model);
  } else {
    if (!config.cliBin) missing.push(ENV_KEYS.cliBin);
    if (!config.wslDistro) missing.push(ENV_KEYS.wslDistro);
    if (!config.defaultModel) missing.push(ENV_KEYS.model);
  }

  const ready = missing.length === 0;
  const summary = ready
    ? `Hermes backend READY (mode=${config.mode}, model=${config.defaultModel})`
    : `Hermes backend 未完了: ${missing.join(", ")} を設定してください`;

  return { enabled: true, mode: config.mode, ready, missing, summary };
}

export { ENV_KEYS as HERMES_BACKEND_ENV_KEYS };
