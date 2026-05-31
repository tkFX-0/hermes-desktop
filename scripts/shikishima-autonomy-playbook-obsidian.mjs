#!/usr/bin/env node
/**
 * 完全自律 55→100 プレイブックを Obsidian（しるべ）へ書く + Daily 追記
 *   node scripts/shikishima-autonomy-playbook-obsidian.mjs
 *   node scripts/shikishima-autonomy-playbook-obsidian.mjs --json
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { appendShirubeDailyLog, writeShirubeNote } from "./lib/obsidian-shirube-write.mjs";
import { resolveProjectRoot } from "./lib/project-root.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolveProjectRoot();
const asJson = process.argv.includes("--json");
const playbookPath = join(root, "docs/shikishima/AUTONOMY_55_TO_100_CURSOR_PLAYBOOK_2026-05-31.md");

const title = "完全自律55-100の進め方-CursorとDiscord";
let body = existsSync(playbookPath)
  ? readFileSync(playbookPath, "utf8")
  : "# playbook missing\n\nRun Cursor task to create AUTONOMY_55_TO_100_CURSOR_PLAYBOOK_2026-05-31.md first.\n";

const obsLinks = [
  "",
  "## リポジトリ正本",
  "- docs/shikishima/AUTONOMY_55_TO_100_CURSOR_PLAYBOOK_2026-05-31.md",
  "- docs/shikishima/FULL_AUTONOMY_MASTER_DESIGN_2026-05-31.md",
  "- docs/shikishima/POST_RESTART_CHECKLIST_2026-05-31.md",
  "- docs/shikishima/AUTONOMY_STOP_INVESTIGATION_2026-05-30.md"
].join("\n");

body = body + obsLinks;

const note = writeShirubeNote(title, body, "inbox", root);
const daily = appendShirubeDailyLog(
  root,
  `完全自律プレイブックを Obsidian に記録。\n\n- ノート: ${note.ok ? note.path : note.error}\n- 要点: 55%は加重進捗、100%≠execute解禁、Cursor=実装、Discord=キュー/tick、W5=M-07 preflight+DEV_PIPELINE_ENABLED`,
  { title }
);

const report = { playbookPath, note, daily };
if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("[playbook-obsidian]", note.ok ? note.path : note.error);
  console.log("[daily]", daily.ok ? daily.path : daily.error);
}
process.exit(note.ok && daily.ok ? 0 : 1);
