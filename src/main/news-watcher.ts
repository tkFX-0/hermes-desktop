// Breaking News Watcher — 速報検知
// Polls X via Hermes x_search every N minutes.
// Sends immediately to Discord if new headlines detected.
// Topics: Japan/world trending news + FX/gold market alerts.

import { runHermesResearch } from "./hermes-research-runner";
import { sendDiscordMessage, getDiscordChannelIds } from "./discord-intake";

const POLL_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const MAX_CACHE = 200; // headline fingerprints to remember

const BREAKING_QUERIES = [
  "x_searchで今日の日本と世界のトレンドニュースを5件確認して、新しい重要ニュースがあれば教えて",
  "x_searchで XAUUSD gold 相場 急変動 breaking 2026 最新情報を教えて",
  "x_searchで FX prop firm 規約変更 重要お知らせ 2026 最新情報を教えて",
];

let _watcherTimer: ReturnType<typeof setInterval> | null = null;
let _seenFingerprints = new Set<string>();
let _queryIndex = 0;

function fingerprint(text: string): string {
  // Simple hash of first 120 chars to detect new content
  return text.trim().slice(0, 120).replace(/\s+/g, " ");
}

function isNew(content: string): boolean {
  const fp = fingerprint(content);
  if (_seenFingerprints.has(fp)) return false;
  _seenFingerprints.add(fp);
  if (_seenFingerprints.size > MAX_CACHE) {
    // evict oldest (Set preserves insertion order)
    const first = _seenFingerprints.values().next().value;
    if (first) _seenFingerprints.delete(first);
  }
  return true;
}

async function pollBreakingNews(): Promise<void> {
  const query = BREAKING_QUERIES[_queryIndex % BREAKING_QUERIES.length];
  _queryIndex++;

  const result = await runHermesResearch(query);
  if (!result.success || !result.content) return;

  // Split response into paragraphs and check each for novelty
  const paragraphs = result.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40);

  const newItems = paragraphs.filter(isNew);
  if (newItems.length === 0) return;

  const { reportChannelId } = getDiscordChannelIds();
  const targetChannelId = reportChannelId;
  if (!targetChannelId) return;

  const body = newItems.slice(0, 3).join("\n\n");
  const msg = `**[しきしま速報]** ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}\n\n${body}`;

  await sendDiscordMessage(targetChannelId, msg.slice(0, 2000));
}

export function startNewsWatcher(): void {
  if (_watcherTimer) return;
  _watcherTimer = setInterval(() => {
    pollBreakingNews().catch((e) => console.error("[NewsWatcher]", e));
  }, POLL_INTERVAL_MS);
  console.log("[NewsWatcher] started — polling every 15min");
}

export function stopNewsWatcher(): void {
  if (_watcherTimer) {
    clearInterval(_watcherTimer);
    _watcherTimer = null;
  }
}
