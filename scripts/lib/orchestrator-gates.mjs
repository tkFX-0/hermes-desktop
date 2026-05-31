/**
 * オーケストレータ／自律 tick が止まる理由の洗い出しと緩和判定
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { readOperationalRelease } from "./operational-release-read.mjs";
import { resolveExecutionScopePolicy, loadExecutionScopeGo } from "./execution-scope-policy.mjs";
import { readConstitutionalGo } from "./constitutional-go-read.mjs";
import {
  canRunAutonomousCycle,
  checkRouteCooldown,
  DEFAULT_CAPS,
  readRuntimeCounter
} from "./autonomous-runtime-caps.mjs";
import { isLiveApiTickAllowed } from "./billing-policy.mjs";

const ROOT = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop");

function truthy(v) {
  if (v == null || v === "") return false;
  return /^(1|true|yes|on)$/i.test(String(v).trim());
}

/** @param {((k: string) => string|undefined)|Record<string, string|undefined>|undefined} getEnv */
function normalizeGetEnv(getEnv) {
  if (typeof getEnv === "function") return getEnv;
  if (getEnv && typeof getEnv === "object") return (k) => getEnv[k];
  return (k) => process.env[k];
}

/**
 * @param {((k: string) => string|undefined)|Record<string, string|undefined>} [getEnv]
 * @param {string} [projectRoot]
 */
export function isOrchestratorRelaxed(getEnv, projectRoot = ROOT) {
  const env = normalizeGetEnv(getEnv);
  const g = (k) => String(env(k) ?? "").trim();
  const scope = resolveExecutionScopePolicy(env, projectRoot);
  if (scope.autonomousDev || scope.orchestratorRelaxed) return true;
  if (truthy(g("SHIKISHIMA_ORCHESTRATOR_RELAXED"))) return true;
  const file = loadExecutionScopeGo(projectRoot);
  return file?.scopes?.orchestratorRelaxed?.enabled === true;
}

/**
 * @param {string} [projectRoot]
 * @param {(k: string) => string|undefined} [getEnv]
 */
export function resolveOrchestratorRuntimeCaps(projectRoot = ROOT, getEnv) {
  const relaxed = isOrchestratorRelaxed(getEnv, projectRoot);
  if (!relaxed) return { ...DEFAULT_CAPS };
  return {
    maxCyclesPerHour: 60,
    maxCyclesPerDay: 200,
    minIntervalMs: 15_000,
    routeCooldownMs: 10_000,
    devAutonomousCooldownMs: 5_000
  };
}

/**
 * SideBot が orchestrator ループを起動してよいか
 */
export function mayStartOrchestratorLoop(projectRoot = ROOT, getEnv) {
  const release = readOperationalRelease(projectRoot);
  const relaxed = isOrchestratorRelaxed(getEnv, projectRoot);
  const reasons = [];
  if (!release.autonomousOrchestratorEnabled && !relaxed) {
    reasons.push("autonomous_orchestrator_disabled");
  }
  if (relaxed) return { allowed: true, reasons: [], relaxed: true, release };
  if (!release.autonomousOrchestratorEnabled) {
    return { allowed: false, reasons, relaxed: false, release };
  }
  return { allowed: true, reasons: [], relaxed: false, release };
}

/**
 * maintenance / dev.autonomous tick
 */
export function evaluateRouteGate(projectRoot, routeId, getEnv, nowMs = Date.now()) {
  const release = readOperationalRelease(projectRoot);
  const relaxed = isOrchestratorRelaxed(getEnv, projectRoot);
  const mem = join(projectRoot, ".shikishima-memory");
  const counter = readRuntimeCounter(mem);
  const caps = resolveOrchestratorRuntimeCaps(projectRoot, getEnv);
  const reasons = [];

  if (routeId === "dev.autonomous") {
    if (!relaxed && !resolveExecutionScopePolicy(getEnv, projectRoot).autonomousDev) {
      reasons.push("autonomous_dev_scope_hold");
    }
  }

  if (routeId === "autonomy.maintenance") {
    if (!relaxed && !release.activated) reasons.push("track_d_not_active");
  } else if (!relaxed && !release.activated) {
    reasons.push("track_d_not_active");
  }

  if (routeId === "autonomy.maintenance") {
    const cap = canRunAutonomousCycle(counter, nowMs, caps);
    if (!cap.allowed) reasons.push(...cap.reasons);
  }

  const cooldownMs =
    routeId === "dev.autonomous" ? caps.devAutonomousCooldownMs ?? caps.routeCooldownMs : caps.routeCooldownMs;
  const cooldown = checkRouteCooldown(mem, routeId, nowMs, cooldownMs);
  if (!cooldown.allowed) reasons.push(cooldown.reason ?? "scheduler_cooldown");

  if (routeId === "discord.read") {
    const ch = join(projectRoot, ".env.local");
    let channelOk = false;
    if (existsSync(ch)) {
      channelOk = /DISCORD_COMMAND_CHANNEL_ID=\S+/m.test(readFileSync(ch, "utf8"));
    }
    if (!channelOk) reasons.push("discord_channel_not_configured");
    const go = readConstitutionalGo(projectRoot);
    if (!go.active || !go.scopes.includes("discord_read_live")) {
      reasons.push("constitutional_scope_discord_read_missing");
    }
  }

  if (routeId === "stackchan.voice") {
    reasons.push("stackchan_voice_requires_explicit_permitted_go");
  }

  return {
    routeId,
    allowed: reasons.length === 0,
    reasons,
    relaxed,
    releaseActivated: release.activated,
    caps
  };
}

/**
 * agent-team tick（orchestrator 内）
 */
export function evaluateAgentTeamGate(projectRoot, getEnv, nowMs = Date.now()) {
  const release = readOperationalRelease(projectRoot);
  const relaxed = isOrchestratorRelaxed(getEnv, projectRoot);
  const reasons = [];

  if (!relaxed && !release.activated) reasons.push("track_d_not_active");
  if (!release.agentTeamTickEnabled && !relaxed) reasons.push("agent_team_tick_disabled");

  const statePath = join(projectRoot, ".shikishima-memory", "agent-team-tick-state.json");
  let lastRunAtIso = null;
  if (existsSync(statePath)) {
    try {
      lastRunAtIso = JSON.parse(readFileSync(statePath, "utf8")).lastRunAtIso;
    } catch {
      /* ignore */
    }
  }
  const intervalMin = relaxed
    ? Math.min(release.agentTeamTickIntervalMinutes ?? 360, 30)
    : release.agentTeamTickIntervalMinutes ?? 360;
  if (lastRunAtIso) {
    const lastMs = Date.parse(lastRunAtIso);
    if (!Number.isNaN(lastMs) && (nowMs - lastMs) / 60_000 < intervalMin) {
      reasons.push("interval_not_elapsed");
    }
  }

  const liveApiRequested = false;
  const liveApi = liveApiRequested && isLiveApiTickAllowed(getEnv);

  return {
    allowed: reasons.length === 0,
    reasons,
    relaxed,
    intervalMinutes: intervalMin,
    liveApiAllowed: isLiveApiTickAllowed(getEnv)
  };
}

/** @typedef {{ id: string, layer: string, condition: string, whenBlocked: string, relaxWhen?: string }} GateRow */

export const ORCHESTRATOR_GATE_CATALOG = [
  {
    id: "sidebot_loop_disabled",
    layer: "SideBot",
    condition: "!release.autonomousOrchestratorEnabled && !orchestratorRelaxed",
    whenBlocked: "startAutonomousOrchestratorLoop が return",
    relaxWhen: "execution-scope GO / SHIKISHIMA_ORCHESTRATOR_RELAXED=1"
  },
  {
    id: "track_d_not_active",
    layer: "operational-release.local.json",
    condition: "trackDGoAcknowledged+executionEnabled+productionReady が揃わない",
    whenBlocked: "maintenance tick / agent-team が拒否",
    relaxWhen: "orchestratorRelaxed（開発スコープ GO）で maintenance/dev は通過"
  },
  {
    id: "phase_go_orchestrator",
    layer: "phase-go-ack",
    condition: "autonomous_orchestrator 未 ack",
    whenBlocked: "operational-release に autonomousOrchestratorEnabled が立たない",
    relaxWhen: "orchestratorRelaxed で SideBot 起動可（ack 不要）"
  },
  {
    id: "autonomous_dev_scope_hold",
    layer: "execution-scope",
    condition: "SHIKISHIMA_AUTONOMOUS_DEV_GO 未設定",
    whenBlocked: "dev.autonomous / workflow 停止",
    relaxWhen: "execution-scope-go.local.json"
  },
  {
    id: "hourly_cap",
    layer: "autonomous-runtime-caps",
    condition: "maxCyclesPerHour 超過",
    whenBlocked: "autonomy.maintenance",
    relaxWhen: "relaxed caps（60/h）"
  },
  {
    id: "scheduler_cooldown",
    layer: "route cooldown",
    condition: "同一 route 60s 以内",
    whenBlocked: "全 capped route",
    relaxWhen: "dev.autonomous 5–10s"
  },
  {
    id: "agent_team_interval",
    layer: "agent-team",
    condition: "前回 tick から interval 未経過",
    whenBlocked: "6体 maintenance ping",
    relaxWhen: "relaxed 時 max 30分"
  },
  {
    id: "agent_team_disabled",
    layer: "operational-release",
    condition: "agentTeamTickEnabled=false",
    whenBlocked: "orchestrator 内 agent-team",
    relaxWhen: "relaxed 時は agent-team も許可"
  },
  {
    id: "live_api_blocked",
    layer: "billing-policy",
    condition: "SHIKISHIMA_ALLOW_PAID_API=0",
    whenBlocked: "--live-api",
    relaxWhen: "変更なし（local-only 継続）"
  },
  {
    id: "constitutional_discord_read",
    layer: "constitutional-go",
    condition: "discord_read_live スコープなし",
    whenBlocked: "discord.read route",
    relaxWhen: "変更なし（高リスク）"
  },
  {
    id: "stackchan_voice",
    layer: "constitution",
    condition: "explicit permitted GO なし",
    whenBlocked: "stackchan.voice route",
    relaxWhen: "変更なし"
  },
  {
    id: "dev_pipeline_disabled",
    layer: "env",
    condition: "SHIKISHIMA_DEV_PIPELINE_ENABLED=0",
    whenBlocked: "workflow dev 段階",
    relaxWhen: ".env.local で有効化"
  },
  {
    id: "workflow_queue_empty",
    layer: "workflow",
    condition: "キュー空",
    whenBlocked: "dev.autonomous processed=0",
    relaxWhen: "!workflow enqueue"
  },
  {
    id: "production_execute",
    layer: "安全不変",
    condition: "常時",
    whenBlocked: "本番 execute / ライブ売買 / git push",
    relaxWhen: "緩和対象外"
  }
];

/**
 * @param {string} [projectRoot]
 * @param {(k: string) => string|undefined} [getEnv]
 */
export function auditOrchestratorGates(projectRoot = ROOT, getEnv) {
  const nowMs = Date.now();
  const loop = mayStartOrchestratorLoop(projectRoot, getEnv);
  const routes = ["autonomy.maintenance", "dev.autonomous", "discord.read", "stackchan.voice"].map(
    (r) => evaluateRouteGate(projectRoot, r, getEnv, nowMs)
  );
  const team = evaluateAgentTeamGate(projectRoot, getEnv, nowMs);
  const release = readOperationalRelease(projectRoot);
  const scope = resolveExecutionScopePolicy(getEnv, projectRoot);

  return {
    at: new Date().toISOString(),
    orchestratorLoop: loop,
    routes,
    agentTeam: team,
    release: {
      activated: release.activated,
      autonomousOrchestratorEnabled: release.autonomousOrchestratorEnabled,
      agentTeamTickEnabled: release.agentTeamTickEnabled,
      intervalMinutes: release.autonomousOrchestratorIntervalMinutes
    },
    scope,
    orchestratorRelaxed: isOrchestratorRelaxed(getEnv, projectRoot),
    catalog: ORCHESTRATOR_GATE_CATALOG
  };
}

/**
 * @param {ReturnType<typeof auditOrchestratorGates>} audit
 */
export function formatOrchestratorGatesReport(audit) {
  const lines = [
    "🔍 **オーケストレータ制限 洗い出し**",
    `時刻: ${audit.at.slice(0, 19)}`,
    `緩和モード: **${audit.orchestratorRelaxed ? "ON" : "OFF"}**`,
    "",
    "**SideBot ループ**",
    `起動: ${audit.orchestratorLoop.allowed ? "可" : "止"}` +
      (audit.orchestratorLoop.reasons.length ? ` — ${audit.orchestratorLoop.reasons.join(", ")}` : ""),
    "",
    "**ルート別**"
  ];
  for (const r of audit.routes) {
    lines.push(
      `• \`${r.routeId}\`: ${r.allowed ? "OK" : "BLOCK"}${r.reasons.length ? ` (${r.reasons.join(", ")})` : ""}`
    );
  }
  lines.push(
    "",
    "**Agent team**",
    `• ${audit.agentTeam.allowed ? "OK" : "BLOCK"}${audit.agentTeam.reasons.length ? ` (${audit.agentTeam.reasons.join(", ")})` : ""}`,
    "",
    "**緩和しても HOLD のまま**",
    "• ライブ売買・git push・本番 execute",
    "• discord.read（憲法スコープ）",
    "• stackchan.voice",
    "",
    "詳細: `docs/shikishima/ORCHESTRATOR_GATES_AUDIT_2026-05-30.md`"
  );
  return lines.join("\n").slice(0, 1900);
}
