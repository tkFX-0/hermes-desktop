/**
 * External send whitelist (L2 auto). Non-listed hosts require L3 tk GO.
 */

const DEFAULT_ALLOWLIST = [
  "discord.com",
  "discordapp.com",
  "api.github.com",
  "github.com",
  "registry.npmjs.org",
];

/**
 * @param {(key: string) => string | undefined} [getEnv]
 */
export function resolveExternalSendAllowlist(getEnv = (k) => process.env[k]) {
  const extra = String(getEnv("SHIKISHIMA_EXTERNAL_SEND_ALLOWLIST") ?? "")
    .split(/[,;\s]+/)
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ALLOWLIST, ...extra])];
}

/**
 * @param {string} hostOrUrl
 * @param {string[]} [allowlist]
 */
export function isExternalSendWhitelisted(hostOrUrl, allowlist = DEFAULT_ALLOWLIST) {
  const raw = String(hostOrUrl ?? "").trim().toLowerCase();
  if (!raw) return false;
  let host = raw;
  try {
    if (/^https?:\/\//i.test(raw)) host = new URL(raw).hostname.toLowerCase();
    else if (raw.includes("/")) host = raw.split("/")[0].toLowerCase();
  } catch {
    host = raw.split("/")[0].toLowerCase();
  }
  host = host.replace(/^www\./, "");
  return allowlist.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

/**
 * @param {string} text
 * @param {(key: string) => string | undefined} [getEnv]
 */
export function classifyExternalSendRequest(text, getEnv) {
  const allowlist = resolveExternalSendAllowlist(getEnv);
  const value = String(text ?? "");
  const urlMatch = value.match(/https?:\/\/[^\s)]+/gi) ?? [];
  for (const url of urlMatch) {
    if (!isExternalSendWhitelisted(url, allowlist)) {
      return {
        band: "L3+",
        allowed: false,
        host: (() => {
          try {
            return new URL(url).hostname;
          } catch {
            return url;
          }
        })(),
        reason: "ホワイトリスト外の外部送信は tk GO が必要",
      };
    }
  }
  return { band: "L2", allowed: true, reason: "外部送信なし、または許可ドメインのみ" };
}
