/**
 * STATE.md — 完成品の自動反映
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * @param {string} memoryDir
 * @param {{ title: string }} idea
 * @param {string} outputPath
 * @param {string} [summary]
 */
export function appendCompletedIdeaToState(memoryDir, idea, outputPath, summary = "") {
  const statePath = join(memoryDir, "STATE.md");
  const header = "# STATE\n";
  let content = existsSync(statePath) ? readFileSync(statePath, "utf8") : header;
  if (!content.startsWith("#")) content = header + content;
  const marker = `## 完成品: ${idea.title}`;
  if (content.includes(marker)) return { ok: true, updated: false };
  const at = new Date().toISOString();
  const block = [
    "",
    marker,
    `- 配置: ${outputPath}`,
    `- 完了: ${at}`,
    summary ? `- サマリー: ${summary.slice(0, 200)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  writeFileSync(statePath, content.trimEnd() + block + "\n", "utf8");
  return { ok: true, updated: true };
}
