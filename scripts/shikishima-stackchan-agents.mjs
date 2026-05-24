/**
 * shikishima-stackchan-agents.mjs
 * エージェント別 StackChan 動作モード管理 — 直接実行モード
 *
 * フロー:
 *   エージェント返答 → 感情判定 → resolveMode() → stackchanFace() 直接実行
 *   (HOLD/承認フローは廃止: bot.mjs が直接 stackchanFace を呼ぶ)
 */

// ─── エージェント別 感情→モード マッピング ─────────────────────────────────────
// face: faces_data.h の name ("ノーマル","笑顔","撫でられてうれしい","焦り","頑張るぞ","zzz","あっかんべー","あっかんべー2","dvdモード")

export const AGENT_PERSONA = {
  shikishima: {
    label: "しきしま",
    emoji: "🏯",
    defaultFace: "normal",
    modeMap: {
      normal:    "normal",
      happy:     "smile",
      excited:   "ganbaru",
      calm:      "normal",
      proud:     "happy",
      thinking:  "normal",
    },
  },
  shizume: {
    label: "しずめ",
    emoji: "🛡️",
    defaultFace: "normal",
    modeMap: {
      normal:    "normal",
      calm:      "sleepy",     // zzzモード
      alert:     "normal",
      concerned: "panic",
      rest:      "sleepy",
      thinking:  "normal",
    },
  },
  tsumugi: {
    label: "つむぎ",
    emoji: "🪡",
    defaultFace: "smile",
    modeMap: {
      normal:    "smile",
      happy:     "smile",
      excited:   "ganbaru",
      creative:  "ganbaru",
      playful:   "tongue",
      proud:     "happy",
    },
  },
  hajime: {
    label: "はじめ",
    emoji: "🧭",
    defaultFace: "normal",
    modeMap: {
      normal:    "normal",
      focused:   "ganbaru",
      planning:  "ganbaru",
      error:     "panic",
      success:   "smile",
      serious:   "normal",
    },
  },
  shirube: {
    label: "しるべ",
    emoji: "🕯️",
    defaultFace: "normal",
    modeMap: {
      normal:    "normal",
      curious:   "tongue",
      found:     "smile",
      analyzing: "normal",
      success:   "smile",
      excited:   "ganbaru",
    },
  },
};

// ─── 感情検出 ─────────────────────────────────────────────────────────────────
const EMOTION_PATTERNS = [
  { emotion: "excited",  patterns: [/嬉しい|最高|やった|完璧|素晴らしい|おめでとう|!+|！+/] },
  { emotion: "happy",    patterns: [/よかった|ありがとう|助かり|良い感じ|いい感じ|ほっ/] },
  { emotion: "proud",    patterns: [/成功|達成|クリア|完了|合格/] },
  { emotion: "excited",  patterns: [/面白い|興味深い|なるほど|すごい/] },
  { emotion: "focused",  patterns: [/確認|分析|調査|検討|設計|計画/] },
  { emotion: "planning", patterns: [/次のステップ|手順|プラン|ロードマップ/] },
  { emotion: "creative", patterns: [/実装|コード|書き|修正|デバッグ/] },
  { emotion: "curious",  patterns: [/調べ|検索|探|発見|みつかり/] },
  { emotion: "concerned",patterns: [/注意|リスク|危険|問題|エラー|失敗/] },
  { emotion: "calm",     patterns: [/穏やか|ゆっくり|落ち着|待機|休憩/] },
  { emotion: "error",    patterns: [/エラー|失敗|不具合|バグ|壊れ/] },
];

export function detectEmotion(text) {
  for (const { emotion, patterns } of EMOTION_PATTERNS) {
    if (patterns.some(p => p.test(text))) return emotion;
  }
  return "normal";
}

export function resolveMode(agentId, emotion) {
  const persona = AGENT_PERSONA[agentId];
  if (!persona) return "normal";
  return persona.modeMap[emotion] ?? persona.defaultFace ?? "normal";
}

// HOLD キューは廃止。直接実行モードに移行。
// bot.mjs から resolveMode(agentId, emotion) → stackchanFace(face) を直接呼ぶ。

// 後方互換のためのスタブ (bot.mjs の import を壊さないため残す)
export function getLatestPending() { return null; }
export function approveProposal() { return { ok: false, reason: "hold_disabled" }; }
export function rejectProposal() { return { ok: false }; }
