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

/**
 * Codex CLI 出力サニタイザー
 * --json モード(JSONL)を優先し、テキストモードへのフォールバックも持つ
 */
export function stripCodexCliNoise(raw) {
  const text = String(raw ?? "").replace(/\x1B\[[0-9;]*[mGKHF]/g, "");

  // --- JSONL モード (--json フラグ時) ---
  const jsonTexts = [];
  for (const line of text.split("\n")) {
    const l = line.trim();
    if (!l.startsWith("{")) continue;
    try {
      const ev = JSON.parse(l);
      // response.output_item.done / output_item 形式
      const item = ev?.item ?? ev?.output_item;
      if (item?.role === "assistant") {
        for (const c of (item.content ?? [])) {
          if (c?.type === "text" && c.text) jsonTexts.push(c.text);
        }
      }
      // 直接 text イベント
      if (ev?.type === "output_text" && ev.role === "assistant" && ev.content) {
        jsonTexts.push(String(ev.content));
      }
      if (ev?.role === "assistant" && ev?.content && typeof ev.content === "string") {
        jsonTexts.push(ev.content);
      }
    } catch { /* ignore */ }
  }
  if (jsonTexts.length > 0) return jsonTexts.join("\n").trim();

  // --- テキストモードフォールバック ---
  // 最後の "assistant" マーカー以降だけ抽出
  const lower = text.toLowerCase();
  const lastAssistant = lower.lastIndexOf("\nassistant\n");
  if (lastAssistant !== -1) {
    return text.slice(lastAssistant + "\nassistant\n".length)
      .replace(/^[-=]{10,}\s*$/gm, "")
      .trim();
  }
  // ヘッダーブロック除去
  return text
    .replace(/^OpenAI Codex v[^\n]*\n?/gm, "")
    .replace(/^Working directory:[^\n]*\n?/gm, "")
    .replace(/^Model:[^\n]*\n?/gm, "")
    .replace(/^Session(?: id)?:[^\n]*\n?/gim, "")
    .replace(/^[-=]{10,}\n?/gm, "")
    .replace(/^user\n[\s\S]*?(?=^assistant\n)/m, "")
    .trim();
}

/** bash エラー出力かどうか判定（スレッド記録スキップ用） */
export function isErrorOutput(text) {
  const t = String(text ?? "");
  return /^bash:\s/m.test(t)
    || /command not found/i.test(t)
    || /Is a directory/i.test(t)
    || /No such file or directory/i.test(t);
}

/** Claude/Groq が空のときのプレースホルダを失敗扱いにする */
export function isEmptyAgentText(text) {
  const t = String(text ?? "").trim();
  return !t || t === "(応答なし)" || /^応答なし$/i.test(t);
}
