#!/usr/bin/env node
/**
 * Record constitutional 全てGO in gitignored local file.
 * Does not enable git push automation.
 */

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, ".shikishima-memory");
const path = join(dir, "constitutional-go.local.json");

const payload = {
  allGoAcknowledged: true,
  scopes: [
    "obsidian_write",
    "discord_read_live",
    "discord_send_one_shot",
    "hermes_subprocess",
    "shadow_stt",
    "stackchan_voice",
    "burn_in_wall_clock",
    "operational_release"
  ],
  activatedAtIso: new Date().toISOString(),
  humanGoNote: "全てGO / Discord-only UI",
  discordOnlyUi: true
};

if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
writeFileSync(path, JSON.stringify(payload, null, 2), "utf8");

const { resolveConstitutionalGo } = await import(
  "../src/main/shikishima-full-autonomy/constitutional-go-state.ts"
);

const state = resolveConstitutionalGo(root);
console.log(
  JSON.stringify(
    {
      written: path.replace(root, "."),
      active: state.active,
      scopeCount: state.scopes.length,
      source: state.source,
      humanGoNote: state.humanGoNote,
      gitPushAutomated: false
    },
    null,
    2
  )
);
