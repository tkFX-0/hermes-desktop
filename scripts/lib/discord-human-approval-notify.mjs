/**
 * Operator @mention with allowlisted phrase only (Phase C dialogue room).
 */

export const OPERATOR_NOTIFY_PHRASES = ["確認しました。", "了解しました。", "承知しました。"];

/**
 * @param {string} phrase
 */
export function isAllowlistedOperatorNotifyPhrase(phrase) {
  return OPERATOR_NOTIFY_PHRASES.includes(phrase.trim());
}

/**
 * @param {string} operatorUserId Discord snowflake (digits only)
 * @param {string} [phrase]
 */
export function buildOperatorNotifyContent(operatorUserId, phrase = "確認しました。") {
  const p = phrase.trim();
  if (!isAllowlistedOperatorNotifyPhrase(p)) {
    return { ok: false, error: "phrase_not_allowlisted", content: "" };
  }
  const id = String(operatorUserId ?? "").replace(/\D/g, "");
  if (!id) {
    return { ok: false, error: "operator_user_id_missing", content: p };
  }
  return { ok: true, error: "", content: `<@${id}> ${p}` };
}
