/**
 * StackChan 音声 — Discord 連携 env の単一参照（legacy + guarded bridge）
 */

const HOLD_KEY = "SHIKISHIMA_STACKCHAN_HOLD";
const DISCORD_VOICE_KEY = "STACKCHAN_DISCORD_VOICE";
const GUARDED_BRIDGE_KEY = "SHIKISHIMA_DISCORD_VOICE_BRIDGE";

/**
 * @param {string} key
 * @param {boolean} defaultOn
 * @param {NodeJS.ProcessEnv} env
 */
function envTruthy(key, defaultOn, env) {
  const raw = env[key];
  if (raw === undefined || raw === "") return defaultOn;
  const v = String(raw).trim().toLowerCase();
  if (v === "0" || v === "false" || v === "off" || v === "no") return false;
  if (v === "1" || v === "true" || v === "on" || v === "yes") return true;
  return defaultOn;
}

/** 全 StackChan 発話（legacy stackchanSay）を止める */
export function isStackchanVoiceHold(env = process.env) {
  return envTruthy(HOLD_KEY, false, env);
}

/** SideBot: Discord 返信の VOICEVOX 読み上げ（legacy 経路） */
export function isLegacyDiscordVoiceEnabled(env = process.env) {
  if (isStackchanVoiceHold(env)) return false;
  return envTruthy(DISCORD_VOICE_KEY, true, env);
}

/** Phase 7 guarded bridge（TS・allowlist・time window）— Bot 未配線時も状態参照可 */
export function isGuardedDiscordVoiceBridgeEnvEnabled(env = process.env) {
  return envTruthy(GUARDED_BRIDGE_KEY, false, env);
}

/** @deprecated 互換 — legacy Discord 読み上げ */
export function isDiscordVoiceBridgeEnabled(env = process.env) {
  return isLegacyDiscordVoiceEnabled(env);
}

/**
 * @param {NodeJS.ProcessEnv} [env]
 */
export function resolveStackchanDiscordVoiceConfig(env = process.env) {
  const hold = isStackchanVoiceHold(env);
  const legacyDiscord = isLegacyDiscordVoiceEnabled(env);
  const guardedBridge = isGuardedDiscordVoiceBridgeEnvEnabled(env);
  return {
    hold,
    legacyDiscordEnabled: legacyDiscord,
    guardedBridgeEnvEnabled: guardedBridge,
    discordReadAloudActive: legacyDiscord,
    primaryRoute: hold
      ? "hold"
      : legacyDiscord
        ? "legacy_voicovox"
        : guardedBridge
          ? "guarded_bridge_only"
          : "disabled",
    env: {
      [HOLD_KEY]: env[HOLD_KEY] ?? "(unset)",
      [DISCORD_VOICE_KEY]: env[DISCORD_VOICE_KEY] ?? "(default on)",
      [GUARDED_BRIDGE_KEY]: env[GUARDED_BRIDGE_KEY] ?? "(unset)"
    }
  };
}

/**
 * Discord 向け status 1 行（ログ・!status 用）
 */
export function formatStackchanDiscordVoiceStatusLine(env = process.env) {
  const c = resolveStackchanDiscordVoiceConfig(env);
  return `StackChan voice: hold=${c.hold ? "YES" : "NO"} legacyDiscord=${c.legacyDiscordEnabled ? "ON" : "OFF"} guardedBridgeEnv=${c.guardedBridgeEnvEnabled ? "ON" : "OFF"} route=${c.primaryRoute}`;
}
