#!/usr/bin/env node
/**
 * 調査ブリーフ起動（外部送信なし）— Obsidian + stdout
 *
 *   node scripts/shikishima-research-brief.mjs --topic chisiki
 *   node scripts/shikishima-research-brief.mjs --topic stackchan-discord
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { appendShirubeDailyLog, writeShirubeNote } from "./lib/obsidian-shirube-write.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const topic = process.argv.includes("--topic")
  ? process.argv[process.argv.indexOf("--topic") + 1]
  : "chisiki";

const TOPICS = {
  chisiki: {
    title: "Chisiki調査",
    docs: [
      "docs/shikishima/research/CHISIKI_PLAIN_LANGUAGE_BRIEF_2026-05-30.md",
      "docs/shikishima/research/CHISIKI_GASVAULT_ADOPTION_CANDIDATES.md",
      "docs/shikishima/research/CHISIKI_SHIZUME_SAFETY_GATE_2026-05-30.md",
      "docs/shikishima/research/CHISIKI_HAJIME_JARVIS_MAP_2026-05-30.md"
    ],
    agents: "しるべ・はじめ・しずめ"
  },
  "stackchan-discord": {
    title: "StackChan-Discord統合",
    docs: [
      "docs/shikishima/STACKCHAN_DISCORD_VOICE_UNIFICATION.md",
      "docs/shikishima/STACKCHAN_HOLD_2026-05-30.md"
    ],
    agents: "つむぎ・しるべ"
  }
};

const pack = TOPICS[topic];
if (!pack) {
  console.error(`Unknown topic: ${topic}. Use: ${Object.keys(TOPICS).join(", ")}`);
  process.exit(1);
}

console.log(`[ResearchBrief] topic=${topic} agents=${pack.agents}`);
const parts = [];
for (const rel of pack.docs) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    parts.push(`- missing: ${rel}`);
    continue;
  }
  const head = readFileSync(p, "utf8").split("\n").slice(0, 12).join("\n");
  parts.push(`## ${rel}\n${head}\n`);
  console.log(`  read: ${rel}`);
}

const body = [
  `# ${pack.title} — 調査サマリー`,
  `agents: ${pack.agents}`,
  `at: ${new Date().toISOString()}`,
  "",
  ...parts,
  "",
  "次: docs/shikishima/HUMAN_GO_QUESTIONNAIRE_2026-05-30.md"
].join("\n");

const obs = appendShirubeDailyLog(root, body, { title: pack.title });
if (obs.ok) console.log(`[ResearchBrief] Obsidian daily: ${obs.path}`);
else console.warn(`[ResearchBrief] Obsidian: ${obs.error}`);

const note = writeShirubeNote(`${pack.title}-snapshot`, body.slice(0, 4000), "research", root);
if (note.ok) console.log(`[ResearchBrief] Obsidian note: ${note.filename}`);

console.log("\n[ResearchBrief] done — no external network");
