/** Claude CLI ノイズ除去 — Discord 返信に混ざらないようにする */

export function stripClaudeCliNoise(text) {
  return String(text ?? "")
    .replace(/\x1B\[[0-9;]*[mGKHF]/g, "")
    .replace(/Warning: no stdin data received[^\n]*/gi, "")
    .replace(/proceeding without it\.[^\n]*/gi, "")
    .replace(/< \/dev\/null[^\n]*/gi, "")
    .replace(/If piping from a slow command[^\n]*/gi, "")
    .trim();
}

/** Claude/Groq が空のときのプレースホルダを失敗扱いにする */
export function isEmptyAgentText(text) {
  const t = String(text ?? "").trim();
  return !t || t === "(応答なし)" || /^応答なし$/i.test(t);
}
