/**
 * 課金ポリシー — 人間許可まで有料API・--live-api を抑止
 * Groq 無料枠 / WSL Claude・Codex サブスク CLI は許可（キー・ログインは別）
 */

/**
 * @param {(name: string) => string | undefined} [readEnv]
 */
export function isPaidApiExplicitlyAllowed(readEnv = (k) => process.env[k]) {
  const v = readEnv("SHIKISHIMA_ALLOW_PAID_API");
  return v === "1" || v === "true";
}

/**
 * @param {(name: string) => string | undefined} [readEnv]
 */
export function isSubscriptionCliOnlyMode(readEnv = (k) => process.env[k]) {
  if (isPaidApiExplicitlyAllowed(readEnv)) return false;
  const mode = readEnv("SHIKISHIMA_BILLING_MODE");
  if (mode === "subscription_only") return true;
  return readEnv("SHIKISHIMA_SUBSCRIPTION_ONLY") === "1";
}

/**
 * Agent team / orchestrator の --live-api (Groq/Claude 従量) を許可するか
 * @param {(name: string) => string | undefined} [readEnv]
 */
export function isLiveApiTickAllowed(readEnv = (k) => process.env[k]) {
  return isPaidApiExplicitlyAllowed(readEnv);
}
