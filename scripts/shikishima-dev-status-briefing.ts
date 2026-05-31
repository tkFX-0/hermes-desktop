#!/usr/bin/env node
/**
 * Phase A — print redacted dev status briefing (read-only, no secrets).
 * Run: npx tsx scripts/shikishima-dev-status-briefing.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { buildDevStatusBriefing } from "../src/main/shikishima-full-autonomy/dev-status-briefing";
import { resolveProjectRoot } from "./lib/project-root.mjs";
import { isHermesBackendEnabled } from "./lib/hermes-backend.mjs";

const root = resolveProjectRoot();

function readStackchanHold(env: NodeJS.ProcessEnv): boolean {
  const v = env.SHIKISHIMA_STACKCHAN_HOLD;
  return v === "1" || v === "true";
}

function readMaintenanceTicks(): number | undefined {
  const p = join(root, ".shikishima-memory", "autonomous-runtime-counters.json");
  if (!existsSync(p)) return undefined;
  try {
    const j = JSON.parse(readFileSync(p, "utf8")) as Record<string, unknown>;
    const maint = j.maintenance as { countToday?: number } | undefined;
    const n = maint?.countToday ?? (j.maintenanceCountToday as number | undefined);
    return typeof n === "number" ? n : undefined;
  } catch {
    return undefined;
  }
}

function main(): void {
  const env = process.env;
  const briefing = buildDevStatusBriefing({
    stackchanHold: readStackchanHold(env),
    orchestratorDecision: "GO_PREPARED",
    maintenanceTicksToday: readMaintenanceTicks(),
    discordReadOnly: true,
    hermesBackendEnabled: isHermesBackendEnabled((k) => env[k]),
    zoneTests: "unknown",
    phaseLabel: "A"
  });

  console.log(JSON.stringify({ ok: true, ...briefing }, null, 2));
}

main();
