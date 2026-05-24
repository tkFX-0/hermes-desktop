// Breaking News Watcher — Lv3-A
// Grokクォータゼロ運用: Groq (llama-3.3-70b) でFX市場コメンタリーを生成
// 60分ごとに自動投稿 → 「頼んでいないのに情報が届く」= Lv3の核心

import { sendDiscordMessage, getDiscordChannelIds } from "./discord-intake";
import { groqChat } from "./groq-service";

const POLL_INTERVAL_MS = 60 * 60 * 1000; // 60分
const MAX_CACHE = 100;

let _watcherTimer: ReturnType<typeof setInterval> | null = null;
const _seenFingerprints = new Set<string>();
let _tickCount = 0;

// 速報性チェック (同じ内容の重複投稿防止)
function isNew(text: string): boolean {
  const fp = text.trim().slice(0, 100).replace(/\s+/g, " ");
  if (_seenFingerprints.has(fp)) return false;
  _seenFingerprints.add(fp);
  if (_seenFingerprints.size > MAX_CACHE) {
    const first = _seenFingerprints.values().next().value;
    if (first) _seenFingerprints.delete(first);
  }
  return true;
}

// Groqによるマーケットコメンタリー生成 (クォータゼロ)
async function generateMarketCommentary(): Promise<string | null> {
  // 時間帯に応じてクエリを変える
  const hourJST = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCHours();
  let focus = "XAUUSD gold の現在の相場環境と注目ポイント";
  if (hourJST >= 21 || hourJST < 3)  focus = "NYセッション中のXAUUSD gold 動向と注目ポイント";
  if (hourJST >= 15 && hourJST < 21) focus = "ロンドンセッションのFX gold 動向";
  if (hourJST >= 8  && hourJST < 15) focus = "東京セッションのドル円・gold 動向";

  const prompt =
    `FXプロップトレーダー向けに ${focus} を簡潔に教えて。` +
    `XAUUSD・ドル円・主要経済指標の観点で、今注意すべき点を3行以内で。` +
    `「しきしま速報」として自然な日本語で書いて。`;

  const result = await groqChat(prompt, "llama-3.3-70b-versatile");
  if (!result.success || !result.reply) return null;
  return result.reply.trim();
}

async function pollBreakingNews(): Promise<void> {
  _tickCount++;

  const commentary = await generateMarketCommentary();
  if (!commentary) {
    console.log("[NewsWatcher] Groq応答なし (スキップ)");
    return;
  }

  if (!isNew(commentary)) {
    console.log("[NewsWatcher] 前回と類似内容 (スキップ)");
    return;
  }

  const { reportChannelId } = getDiscordChannelIds();
  if (!reportChannelId) return;

  const timeStr = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  const msg = `🕯️ **しるべ** — 市場速報 ${timeStr}\n\n${commentary}`;

  await sendDiscordMessage(reportChannelId, msg.slice(0, 2000));
  console.log(`[NewsWatcher] 投稿完了 (tick #${_tickCount})`);
}

export function startNewsWatcher(): void {
  if (_watcherTimer) return;

  // 起動時に即座に1回実行
  pollBreakingNews().catch((e) => console.error("[NewsWatcher] init error:", e));

  _watcherTimer = setInterval(() => {
    pollBreakingNews().catch((e) => console.error("[NewsWatcher]", e));
  }, POLL_INTERVAL_MS);

  console.log("[NewsWatcher] 起動 — 60分ごとにGroqでFX速報 (Grokクォータゼロ)");
}

export function stopNewsWatcher(): void {
  if (_watcherTimer) {
    clearInterval(_watcherTimer);
    _watcherTimer = null;
  }
}
