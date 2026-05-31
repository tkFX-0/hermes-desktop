/**
 * Development pipeline router — subscription-first, fixed order:
 *   composer → claude → codex
 *
 * "Composer" on WSL: Cursor `agent` CLI if present; else Hermes brain (orchestration);
 * optional @cursor/sdk on Windows when user installs + CURSOR_API_KEY (Pro pool).
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const PREFLIGHT_PATH = join(
  homedir(),
  "Desktop",
  "プロジェクトファイル",
  "hermes-desktop",
  ".shikishima-memory",
  "wsl-dev-preflight.json"
);

export const DEV_CHAIN = ["composer", "claude", "codex"];

function truthy(v) {
  if (!v) return false;
  const s = String(v).trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

export function loadWslPreflight() {
  try {
    if (!existsSync(PREFLIGHT_PATH)) return null;
    return JSON.parse(readFileSync(PREFLIGHT_PATH, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * @param {(k: string) => string|undefined} getEnv
 */
export function resolveDevPipelineConfig(getEnv = process.env) {
  const g = typeof getEnv === "function" ? getEnv : (k) => getEnv?.[k];
  const composerMode = (g("SHIKISHIMA_COMPOSER_MODE") ?? "agent_cli").toLowerCase();
  return {
    enabled: truthy(g("SHIKISHIMA_DEV_PIPELINE_ENABLED")),
    subscriptionOnly:
      g("SHIKISHIMA_BILLING_MODE") === "subscription_only" || truthy(g("SHIKISHIMA_SUBSCRIPTION_ONLY")),
    primary: (g("SHIKISHIMA_DEV_PRIMARY") ?? "composer").toLowerCase(),
    composerMode,
    composerModel: g("SHIKISHIMA_COMPOSER_MODEL") ?? "composer-2.5",
    agentCliBin: g("SHIKISHIMA_AGENT_CLI_BIN") ?? "agent",
    hermesBrain: truthy(g("SHIKISHIMA_HERMES_BRAIN_ENABLED") ?? "1"),
    hermesModel: g("SHIKISHIMA_HERMES_DEV_MODEL") ?? "anthropic/claude-sonnet-4-6",
    hermesProvider: g("SHIKISHIMA_HERMES_DEV_PROVIDER") ?? "anthropic",
    claudeModel: g("SHIKISHIMA_CLAUDE_DEV_MODEL") ?? "claude-sonnet-4-6",
    cursorApiKeySet: Boolean((g("CURSOR_API_KEY") ?? "").trim()),
    allowOpenAiApi: truthy(g("SHIKISHIMA_ALLOW_OPENAI_API")),
    wslDistro: g("SHIKISHIMA_WSL_DISTRO") ?? "Ubuntu"
  };
}

/**
 * Pick first available backend in composer → claude → codex order.
 * @param {ReturnType<typeof resolveDevPipelineConfig>} cfg
 * @param {object|null} preflight
 */
export function resolveDevBackendChain(cfg, preflight = loadWslPreflight()) {
  const tools = preflight?.tools ?? {};
  const winAgent = preflight?.windows?.agent?.present === true;
  const chain = [];

  const composerOk =
    winAgent ||
    tools.agent?.present ||
    (cfg.composerMode === "sdk" && cfg.cursorApiKeySet) ||
    tools.hermes?.present;

  if (composerOk) {
    let via = "hermes-brain";
    if (cfg.composerMode === "agent_cli" && winAgent) via = "cursor-agent-cli-win";
    else if (cfg.composerMode === "agent_cli" && tools.agent?.present) via = "cursor-agent-cli-wsl";
    else if (cfg.composerMode === "sdk" && cfg.cursorApiKeySet) via = "cursor-sdk";
    else if (tools.hermes?.present) via = "hermes-brain";
    chain.push({ id: "composer", via });
  }

  if (tools.claude?.present) {
    chain.push({ id: "claude", via: "wsl-claude-cli" });
  }

  const codexCli =
    tools.codex?.present === true || preflight?.subscriptionLane?.codex?.wslCodexCli === true;
  if (codexCli || cfg.allowOpenAiApi) {
    chain.push({
      id: "codex",
      via: codexCli ? "wsl-codex-cli" : "openai-api"
    });
  }

  return chain;
}

export function formatDevPipelineStatus(cfg, preflight = loadWslPreflight()) {
  const chain = resolveDevBackendChain(cfg, preflight);
  const win = preflight?.windows?.agent;
  const lines = [
    "🔧 **開発パイプライン** (subscription-first)",
    `有効: ${cfg.enabled ? "ON" : "OFF"} / 課金方針: ${cfg.subscriptionOnly ? "サブスクのみ" : "mixed"}`,
    `優先: ${cfg.primary} → ${DEV_CHAIN.join(" → ")}`,
    `Composer: mode=${cfg.composerMode} model=${cfg.composerModel}`,
    `Windows agent CLI: ${win?.present ? "あり" : "なし（要 install: irm cursor.com/install?win32=true | iex）"}`,
    `Hermes脳: ${cfg.hermesBrain ? "ON" : "OFF"} (${cfg.hermesModel})`,
    "",
    "**利用可能チェーン:**"
  ];
  if (!chain.length) lines.push("- （なし — `node scripts/shikishima-wsl-dev-preflight.mjs` を実行）");
  else chain.forEach((c, i) => lines.push(`${i + 1}. ${c.id} (${c.via})`));

  const login = preflight?.login;
  if (login || preflight?.windows?.agentLogin) {
    lines.push("", "**ログイン状態:**");
    if (preflight?.windows?.agentLogin) {
      lines.push(
        `- Windows agent: ${preflight.windows.agentLogin.loggedIn ? "OK" : "要 login"} (${preflight.windows.agentLogin.hint})`
      );
    }
    if (login?.claude) {
      lines.push(`- WSL claude: ${login.claude.loggedIn ? "OK" : "要 login"} (${login.claude.hint})`);
    }
    const tools = preflight?.tools ?? {};
    if (login?.codex || tools.codex?.present) {
      const codexInstalled = tools.codex?.present === true;
      lines.push(
        `- WSL codex: ${login?.codex?.loggedIn ? "OK" : codexInstalled ? "要 login" : "未導入"} (${login?.codex?.hint ?? "preflight refresh"})`
      );
    }
  }

  return lines.join("\n");
}
