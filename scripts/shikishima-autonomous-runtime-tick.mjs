#!/usr/bin/env node
/**
 * One capped autonomous tick (plain Node — no .ts import).
 * Does not send Discord / StackChan / enable execution.
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

import { runCappedAutonomousTickMjs, CAPPED_ROUTES } from "./lib/autonomous-tick-runner.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const route = process.argv[2] ?? "autonomy.maintenance";

if (!CAPPED_ROUTES.includes(route)) {
  console.error(`Unknown route: ${route}. Use one of: ${CAPPED_ROUTES.join(", ")}`);
  process.exit(1);
}

const tick = await runCappedAutonomousTickMjs(root, route, Date.now(), {
  performDiscordRead: route === "discord.read",
});

const burnPath = join(root, ".shikishima-memory", "burn-in-wall-clock.json");
let store = {
  version: 1,
  startedAtIso: new Date().toISOString(),
  lastTickAtIso: null,
  tickCount: 0,
  humanGoAcknowledged: false,
  events: [],
};
if (existsSync(burnPath)) {
  try {
    store = JSON.parse(readFileSync(burnPath, "utf-8"));
  } catch {
    /* keep default */
  }
}
const atIso = new Date().toISOString();
store.lastTickAtIso = atIso;
store.tickCount = (store.tickCount ?? 0) + 1;
store.events = [{ atIso, kind: "autonomous_tick", routeId: route }, ...(store.events ?? [])].slice(
  0,
  200,
);
mkdirSync(join(root, ".shikishima-memory"), { recursive: true });
writeFileSync(burnPath, JSON.stringify(store, null, 2), "utf-8");

console.log(
  JSON.stringify(
    {
      routeId: tick.routeId,
      allowed: tick.allowed,
      reasons: tick.reasons,
      tickCount: store.tickCount,
      level8Ready: tick.maintenance?.pipeline?.level8Ready ?? null,
      decisionForAutomation: tick.maintenance?.pipeline?.decisionForAutomation ?? null,
      discordDecision: tick.discordReadPlan?.decision ?? null,
      discordTargetSummaryRedacted: tick.discordReadPlan?.targetSummaryRedacted ?? null,
      discordReadCount: tick.discordReadPlan?.readResult?.readCount ?? null,
    },
    null,
    2,
  ),
);

process.exit(tick.allowed ? 0 : 2);
