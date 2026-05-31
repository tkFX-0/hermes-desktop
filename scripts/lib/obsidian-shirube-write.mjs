/**
 * しるべ — Obsidian への実ファイル書き込み（README の OB-01 証跡庫とは別: ユーザー Vault）
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { resolveObsidianVaultPath } from "./obsidian-vault-path.mjs";
import { resolveProjectRoot } from "./project-root.mjs";

function todayJst() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function timestampJst() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ");
}

/**
 * @param {string} [projectRoot]
 */
export function shirubeObsidianBase(projectRoot = resolveProjectRoot()) {
  return join(resolveObsidianVaultPath(projectRoot), "しきしま");
}

/**
 * Daily/Projects 等を含めて作成
 * @param {string} subdir — "Daily" | "inbox" | "Projects" など
 * @param {string} [projectRoot]
 */
export function ensureShirubeSubdir(subdir, projectRoot = resolveProjectRoot()) {
  const dir = join(shirubeObsidianBase(projectRoot), subdir);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * @param {string} projectRoot
 * @param {string} body
 * @param {{ title?: string }} [opts]
 */
export function appendShirubeDailyLog(projectRoot, body, opts = {}) {
  const dir = ensureShirubeSubdir("Daily", projectRoot);
  const today = todayJst();
  const filePath = join(dir, `${today}.md`);
  const ts = timestampJst();
  const title = opts.title ?? today;
  const entry = `\n\n---\n**${ts}**${opts.title ? ` — ${opts.title}` : ""}\n\n${body.trim()}\n`;

  try {
    if (existsSync(filePath)) {
      writeFileSync(filePath, readFileSync(filePath, "utf-8") + entry, "utf8");
    } else {
      writeFileSync(filePath, `# ${title}\n${entry}`, "utf8");
    }
    console.log(`[しるべ/Obsidian] daily append: ${filePath}`);
    return { ok: true, path: filePath, mode: "append" };
  } catch (e) {
    console.error("[しるべ/Obsidian] daily append failed:", e.message);
    return { ok: false, error: e.message };
  }
}

/**
 * @param {string} title
 * @param {string} content
 * @param {string} [subdir] — vault/しきしま/{subdir}/
 * @param {string} [projectRoot]
 */
export function writeShirubeNote(title, content, subdir = "inbox", projectRoot = resolveProjectRoot()) {
  try {
    const dir = ensureShirubeSubdir(subdir, projectRoot);
    const date = todayJst();
    const safeTitle = String(title).replace(/[<>:"/\\|?*\x00-\x1f]/g, "-").slice(0, 60);
    const filename = `${date}-${safeTitle}.md`;
    const filePath = join(dir, filename);
    const frontmatter = ["---", `title: ${title}`, `date: ${date}`, `tags: [しきしま, shirube, auto]`, "---", ""].join(
      "\n"
    );
    writeFileSync(filePath, frontmatter + content, "utf8");
    console.log(`[しるべ/Obsidian] note: ${filePath}`);
    return { ok: true, path: filePath, filename };
  } catch (e) {
    console.error("[しるべ/Obsidian] note failed:", e.message);
    return { ok: false, error: e.message };
  }
}
