#!/usr/bin/env node
/**
 * Record one burn-in wall-clock tick (plain Node, no .ts import).
 * Safe: does not enable execution or send Discord.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, ".shikishima-memory", "burn-in-wall-clock.json");
const route = process.argv[2] ?? "autonomy.maintenance";

function readStore() {
  if (!existsSync(path)) {
    return {
      version: 1,
      startedAtIso: new Date().toISOString(),
      lastTickAtIso: null,
      tickCount: 0,
      humanGoAcknowledged: false,
      events: []
    };
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {
      version: 1,
      startedAtIso: new Date().toISOString(),
      lastTickAtIso: null,
      tickCount: 0,
      humanGoAcknowledged: false,
      events: []
    };
  }
}

const store = readStore();
const atIso = new Date().toISOString();
store.lastTickAtIso = atIso;
store.tickCount = (store.tickCount ?? 0) + 1;
store.events = [{ atIso, kind: "manual_tick", routeId: route }, ...(store.events ?? [])].slice(
  0,
  200
);

mkdirSync(dirname(path), { recursive: true });
writeFileSync(path, JSON.stringify(store, null, 2), "utf8");

console.log(
  JSON.stringify(
    {
      ok: true,
      tickCount: store.tickCount,
      humanGoAcknowledged: store.humanGoAcknowledged === true,
      note:
        store.tickCount >= 3
          ? "3+ ticks: set humanGoAcknowledged true in burn-in-wall-clock.json after your review"
          : `run ${3 - store.tickCount} more: node scripts/shikishima-burn-in-tick-once.mjs`
    },
    null,
    2
  )
);
