/**
 * Discord 受信フィルタ — Bot 自身の投稿・エコーを再処理しない
 */

/** 全 `<@id>` を除去（先頭だけでなく文中も） */
export function stripAllDiscordMentions(content) {
  return String(content ?? "")
    .replace(/<@!?\d+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const BOT_ECHO_PATTERNS = [
  /^[🏯🛡️🪡🧭🕯️📈]/,
  /^\*\*(しきしま|しずめ|つむぎ|はじめ|しるべ)\*\*/,
  /人間GO 一括確認リスト/,
  /Human GO — 現在ステータス/,
  /統制・アップデート記録（直近）/,
  /しきしまがこの内容を認識済み/,
  /詳細は `!governance`/,
  /FX通知の状態/,
  /ちはやHOLD:\s*ON/,
  /ちはやのステータス/,
  /現在状態\s*:\s*HOLD/,
  /完全休眠中/,
  /エージェント\s*:\s*ちはや/i,
  /停止日\s*:/,
  /local-human-check/,
  /\[返答\]\s*claude/i,
  /Warning: no stdin data received/i,
  /API課金なし/,
  /起動テスト\s*\(\d+\/5\)/,
  /🕯️\s*\*\*しるべ\*\*\s*市場速報/,
  /コード変更提案.*HOLD/,
];

/**
 * メンション・返信引用を除いた本文
 * @param {string} content
 */
export function normalizeDiscordUserContent(content) {
  let t = String(content ?? "").trim();
  t = t.replace(/\u3000/g, " ").trim();
  t = t.replace(/＠/g, "@");
  t = stripAllDiscordMentions(t);
  t = t.replace(/^<#\d+>\s*/g, "").trim();
  return t;
}

/** ちはや／FX 向けメッセージか（HOLD 時の横取り防止） */
export function isChihayaDirectedMessage(content) {
  const t = normalizeDiscordUserContent(content);
  return /ちはや|chihaya|killzone|キルゾーン|!fx-|!chihaya|mt5|xauusd|ea報告|ea状況|何ロット|リスク計算/i.test(
    t,
  );
}

/**
 * @param {string} content
 */
export function isBotOutboundEcho(content) {
  const t = String(content ?? "").trim();
  if (!t) return false;
  return BOT_ECHO_PATTERNS.some((re) => re.test(t));
}

/**
 * ユーザーが送ったはずの ! コマンドか（Bot エコーではない）
 * @param {string} content
 */
export function isUserOpsSlashCommand(content) {
  const t = normalizeDiscordUserContent(content);
  return /^![a-z0-9_-]+/i.test(t) && !isBotOutboundEcho(t);
}

/** Ops 早取り対象外 — poll 後段（StackChan 等）で処理する ! コマンド */
const LATER_HANDLED_SLASH_RE = /^!(sc|music|remember|memory|agent-test)(?:\s|$)/i;

export function isLaterHandledSlashCommand(content) {
  const t = normalizeDiscordUserContent(content);
  if (LATER_HANDLED_SLASH_RE.test(t)) return true;
  return /^!(なかよし|仲良し|famili)\b/i.test(t);
}

const OPS_COMMAND_RE =
  /^!(dev-pipeline|human-go|governance|reply-status|obsidian-status)\b/i;

/**
 * @param {string} content
 */
export function matchOpsCommand(content) {
  const t = normalizeDiscordUserContent(content);
  if (/^dev-pipeline$/i.test(t)) return t;
  const m = t.match(OPS_COMMAND_RE);
  return m ? m[0] : null;
}
