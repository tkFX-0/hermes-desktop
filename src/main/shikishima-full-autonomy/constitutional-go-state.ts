/**
 * Constitutional GO — human blanket approval (e.g. 全てGO).
 * Persisted in gitignored local file or env; never logs raw secrets.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const CONSTITUTIONAL_GO_SCOPES = [
  "obsidian_write",
  "discord_read_live",
  "discord_send_one_shot",
  "hermes_subprocess",
  "shadow_stt",
  "stackchan_voice",
  "burn_in_wall_clock",
  "operational_release",
  "git_push"
] as const;

export type ConstitutionalGoScope = (typeof CONSTITUTIONAL_GO_SCOPES)[number];

const LOCAL_REL = join(".shikishima-memory", "constitutional-go.local.json");

export interface ConstitutionalGoState {
  active: boolean;
  scopes: readonly ConstitutionalGoScope[];
  source: "default" | "env" | "local_file";
  activatedAtIso: string | null;
  humanGoNote: string | null;
}

const ROUTE_SCOPE_MAP: Record<string, ConstitutionalGoScope> = {
  "obsidian.write": "obsidian_write",
  "discord.read": "discord_read_live",
  "discord.send": "discord_send_one_shot",
  "hermes.daemon": "hermes_subprocess",
  "shadow.stt": "shadow_stt",
  "stackchan.voice": "stackchan_voice",
  "git.push": "git_push"
};

function defaultState(): ConstitutionalGoState {
  return {
    active: false,
    scopes: [],
    source: "default",
    activatedAtIso: null,
    humanGoNote: null
  };
}

function readLocal(projectRoot: string): {
  allGoAcknowledged?: boolean;
  scopes?: ConstitutionalGoScope[];
  activatedAtIso?: string;
  humanGoNote?: string;
} | null {
  const path = join(projectRoot, LOCAL_REL);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as NonNullable<ReturnType<typeof readLocal>>;
  } catch {
    return null;
  }
}

function envScopes(): ConstitutionalGoScope[] | null {
  if (process.env.SHIKISHIMA_CONSTITUTIONAL_ALL_GO !== "1") return null;
  const raw = process.env.SHIKISHIMA_CONSTITUTIONAL_GO_SCOPES;
  if (!raw?.trim()) return [...CONSTITUTIONAL_GO_SCOPES];
  return raw.split(",").map((s) => s.trim()) as ConstitutionalGoScope[];
}

export function resolveConstitutionalGo(projectRoot = process.cwd()): ConstitutionalGoState {
  if (process.env.VITEST === "true" && process.env.SHIKISHIMA_TEST_CONSTITUTIONAL_GO !== "1") {
    return defaultState();
  }

  const env = envScopes();
  if (env) {
    return {
      active: true,
      scopes: env,
      source: "env",
      activatedAtIso: new Date().toISOString(),
      humanGoNote: process.env.SHIKISHIMA_CONSTITUTIONAL_GO_NOTE ?? "env_all_go"
    };
  }

  const local = readLocal(projectRoot);
  if (local?.allGoAcknowledged === true) {
    const scopes =
      local.scopes?.length && local.scopes.length > 0
        ? local.scopes
        : [...CONSTITUTIONAL_GO_SCOPES];
    return {
      active: true,
      scopes,
      source: "local_file",
      activatedAtIso: local.activatedAtIso ?? null,
      humanGoNote: local.humanGoNote ?? null
    };
  }

  return defaultState();
}

export function hasConstitutionalGoScope(
  scope: ConstitutionalGoScope,
  projectRoot = process.cwd()
): boolean {
  const state = resolveConstitutionalGo(projectRoot);
  return state.active && state.scopes.includes(scope);
}

export function hasConstitutionalGoForRoute(
  routeId: string,
  projectRoot = process.cwd()
): boolean {
  const scope = ROUTE_SCOPE_MAP[routeId];
  if (!scope) return false;
  return hasConstitutionalGoScope(scope, projectRoot);
}

export function constitutionalGoEffectOverrides(projectRoot = process.cwd()): {
  humanGoApproved: boolean;
  explicitPermittedGo: boolean;
  oneShotDeclared: boolean;
} {
  const state = resolveConstitutionalGo(projectRoot);
  return {
    humanGoApproved: state.active,
    explicitPermittedGo: state.active,
    oneShotDeclared: state.active
  };
}
