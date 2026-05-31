/**
 * Capped autonomous tick — plain Node (no Discord send / no device I/O).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { readOperationalRelease } from "./operational-release-read.mjs";
import { hasConstitutionalScope } from "./constitutional-go-read.mjs";
import { buildHumanGoReadinessReport } from "./human-go-readiness-report.mjs";
import {
  canRunAutonomousCycle,
  checkRouteCooldown,
  readRuntimeCounter,
  recordAutonomousCycle,
  recordRouteCooldown,
  writeRuntimeCounter,
} from "./autonomous-runtime-caps.mjs";
import {
  appendDiscordReadAudit,
  fetchDiscordChannelMessagesRedacted,
} from "./discord-read-intake.mjs";
import { runAutonomousWorkflowTick } from "./autonomous-workflow-engine.mjs";
import {
  evaluateRouteGate,
  isOrchestratorRelaxed,
  resolveOrchestratorRuntimeCaps
} from "./orchestrator-gates.mjs";

export const CAPPED_ROUTES = [
  "autonomy.maintenance",
  "discord.read",
  "stackchan.voice",
  "dev.autonomous"
];

function memoryDir(projectRoot) {
  return join(projectRoot, ".shikishima-memory");
}

function envChannelConfigured(projectRoot) {
  const path = join(projectRoot, ".env.local");
  if (!existsSync(path)) return false;
  try {
    const text = readFileSync(path, "utf-8");
    return /DISCORD_COMMAND_CHANNEL_ID=\S+/m.test(text);
  } catch {
    return false;
  }
}

function usesCycleCap(routeId) {
  return routeId === "autonomy.maintenance";
}

/**
 * @param {string} projectRoot
 * @param {string} routeId
 * @param {number} [nowMs]
 * @param {{ discordReadLimit?: number, performDiscordRead?: boolean }} [opts]
 */
export async function runCappedAutonomousTickMjs(projectRoot, routeId, nowMs = Date.now(), opts = {}) {
  if (!CAPPED_ROUTES.includes(routeId)) {
    return {
      ok: false,
      routeId,
      allowed: false,
      reasons: ["unknown_route"],
    };
  }

  const mem = memoryDir(projectRoot);
  const release = readOperationalRelease(projectRoot);
  const counter = readRuntimeCounter(mem);
  const caps = resolveOrchestratorRuntimeCaps(projectRoot);
  const gate = evaluateRouteGate(projectRoot, routeId, undefined, nowMs);
  const reasons = [...gate.reasons];
  const scopedDev = routeId === "dev.autonomous";
  const relaxed = isOrchestratorRelaxed(undefined, projectRoot);

  if (usesCycleCap(routeId)) {
    const cap = canRunAutonomousCycle(counter, nowMs, caps);
    if (!cap.allowed) reasons.push(...cap.reasons);
  }

  if (reasons.length > 0) {
    return {
      ok: true,
      routeId,
      allowed: false,
      reasons,
      execution: "disabled",
      productionReady: false,
    };
  }

  const cooldownMs =
    routeId === "dev.autonomous"
      ? caps.devAutonomousCooldownMs ?? caps.routeCooldownMs
      : caps.routeCooldownMs;
  recordRouteCooldown(mem, routeId, nowMs, cooldownMs);

  let maintenance = null;
  let discordReadPlan = null;
  let workflow = null;

  if (routeId === "dev.autonomous") {
    workflow = await runAutonomousWorkflowTick(projectRoot, process.env);
  }

  if (routeId === "autonomy.maintenance") {
    recordAutonomousCycle(counter, nowMs);
    writeRuntimeCounter(mem, counter);
    const readiness = buildHumanGoReadinessReport(projectRoot);
    maintenance = {
      allowed: true,
      reasons: [],
      pipeline: {
        decisionForAutomation: readiness.decisionForAutomation,
        openGaps: readiness.openGaps,
        level8Ready: readiness.decisionForAutomation === "GO_PREPARED",
        constitutionalActive: readiness.constitutionalActive,
        operationalActivated: readiness.operationalActivated,
      },
    };
  }

  if (routeId === "discord.read") {
    const channelConfigured = envChannelConfigured(projectRoot);
    const scopeOk = hasConstitutionalScope(projectRoot, "discord_read_live");
    const decision = !channelConfigured
      ? "BLOCKED"
      : scopeOk
        ? "ALLOW_PLAN"
        : "BLOCKED";
    const planReasons = [];
    if (!channelConfigured) planReasons.push("channel_not_configured");
    if (!scopeOk) planReasons.push("constitutional_scope_missing");
    discordReadPlan = {
      decision,
      reasons: planReasons,
      targetSummaryRedacted: channelConfigured ? "channel_configured" : "none",
    };
    if (decision === "BLOCKED") {
      return {
        ok: true,
        routeId,
        allowed: false,
        reasons: planReasons,
        discordReadPlan,
        execution: "disabled",
        productionReady: false,
      };
    }

    if (opts.performDiscordRead !== false) {
      try {
        const read = await fetchDiscordChannelMessagesRedacted(projectRoot, {
          limit: opts.discordReadLimit ?? 10,
        });
        discordReadPlan.readResult = {
          ok: read.ok,
          readCount: read.readCount,
          error: read.error ?? null,
        };
        appendDiscordReadAudit(projectRoot, {
          readCount: read.readCount,
          ok: read.ok,
          error: read.error ?? null,
          messageIdsTail: (read.messages ?? []).map((m) => m.id),
        });
        if (!read.ok) {
          return {
            ok: true,
            routeId,
            allowed: false,
            reasons: [read.error ?? "discord_read_failed"],
            discordReadPlan,
            execution: "disabled",
            productionReady: false,
          };
        }
      } catch (e) {
        return {
          ok: true,
          routeId,
          allowed: false,
          reasons: [`discord_read_error:${e.message}`],
          discordReadPlan,
          execution: "disabled",
          productionReady: false,
        };
      }
    }
  }

  if (routeId === "stackchan.voice") {
    const scopeOk = hasConstitutionalScope(projectRoot, "stackchan_voice");
    if (!scopeOk) {
      return {
        ok: true,
        routeId,
        allowed: false,
        reasons: ["stackchan_voice_requires_explicit_permitted_go"],
        execution: "disabled",
        productionReady: false,
      };
    }
  }

  return {
    ok: true,
    routeId,
    allowed: true,
    reasons: ["capped_tick_ok_no_external_send"],
    maintenance,
    discordReadPlan,
    workflow,
    execution: scopedDev ? "scoped_dev" : "disabled",
    productionReady: false
  };
}
