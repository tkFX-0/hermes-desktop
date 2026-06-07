/**
 * L3 緩和ポリシー — L2 自動可と L3+ tk 承認の境界。
 */

import { classifyExternalSendRequest } from "./external-send-whitelist.mjs";
import { isNpmCheckGreen } from "./npm-check-state.mjs";

const ENV_SECRET_PATTERNS = [
  /\.env\b/i,
  /\b(api[_-]?key|token|secret|password|passwd|bearer)\b/i,
  /\bsk-[a-z0-9_-]{12,}/i,
  /パスワード|秘密|認証情報/i,
];

const L3_FILE_DELETE_PATTERNS = [
  /\brm\s+-rf\b/i,
  /Remove-Item\s+.+-Recurse\s+-Force/i,
  /大量削除|一括削除/i,
];

/**
 * @param {string} authorId
 * @param {string} operatorUserId
 */
export function isTkOperator(authorId, operatorUserId) {
  const op = String(operatorUserId ?? "").replace(/\D/g, "");
  const auth = String(authorId ?? "").replace(/\D/g, "");
  return Boolean(op && auth && op === auth);
}

/**
 * @param {string} text
 */
export function isEnvOrSecretExposure(text) {
  return ENV_SECRET_PATTERNS.some((p) => p.test(String(text ?? "")));
}

/**
 * @param {string} text
 */
export function classifySoulChangeRequest(text) {
  if (/(SOUL\.md).{0,16}(変更|更新|書き|反映|上書き)/i.test(text)) {
    return { band: "L3+", allowed: false, reason: "SOUL.md は manual only（自動変更不可）" };
  }
  return { band: "L2", allowed: true };
}

/**
 * @param {string} text
 * @param {object} [opts]
 * @param {boolean} [opts.trackedInGit]
 * @param {boolean} [opts.committed]
 */
export function classifyFileDeletion(text, opts = {}) {
  const value = String(text ?? "");
  if (L3_FILE_DELETE_PATTERNS.some((p) => p.test(value))) {
    return { band: "L3+", allowed: false, reason: "rm -rf / 大量削除は tk GO 必須" };
  }
  if (/削除|delete|unlink|rm\s+/i.test(value)) {
    if (opts.trackedInGit && opts.committed) {
      return { band: "L2", allowed: true, reason: "git 管理・commit 済みファイルの削除は L2" };
    }
    return { band: "L3+", allowed: false, reason: "未コミット/未追跡ファイルの削除は tk GO 必須" };
  }
  return { band: "L2", allowed: true };
}

/**
 * @param {string} command
 * @param {object} [packageJson]
 */
export function classifyNpmInstall(command, packageJson = {}) {
  const value = String(command ?? "");
  if (!/\bnpm\s+(install|i|add)\b/i.test(value) && !/\bnpm\s+update\b/i.test(value)) {
    return { band: "L2", allowed: true };
  }
  if (/\bnpm\s+update\b/i.test(value)) {
    return { band: "L2", allowed: true, reason: "既存パッケージ更新(npm update)は L2" };
  }
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.optionalDependencies,
  };
  const pkgMatch = value.match(/\b(?:install|i|add)\s+(?:-D\s+|-S\s+)?(@?[\w@/.-]+)/i);
  const pkg = pkgMatch?.[1]?.replace(/^@/, "")?.split("@")[0];
  if (!pkg) return { band: "L3+", allowed: false, reason: "新規パッケージ追加は tk GO 必須" };
  const known = Object.keys(deps).some((name) => name === pkg || name.endsWith(`/${pkg}`));
  if (known) return { band: "L2", allowed: true, reason: "既存パッケージの更新は L2" };
  return { band: "L3+", allowed: false, reason: "新規パッケージ追加は tk GO 必須" };
}

/**
 * @param {string} memoryDir
 */
export function canAutoGitPush(memoryDir) {
  if (!isNpmCheckGreen(memoryDir)) {
    return { ok: false, reason: "npm run check が緑ではない（!check を先に実行）" };
  }
  return { ok: true, reason: "npm run check 緑 — git push L2 自動可" };
}

/**
 * @param {object} p
 * @param {import("./kaihatu-auto-review.mjs").ShizumeStructuredVerdict | null | undefined} p.structuredVerdict
 * @param {string} p.memoryDir
 */
export function canAutoMergeToMain(p) {
  if (!isNpmCheckGreen(p.memoryDir)) {
    return { ok: false, reason: "npm run check が緑ではない（!check を先に実行）" };
  }
  const verdict = p.structuredVerdict?.verdict;
  if (verdict !== "GO") {
    return {
      ok: false,
      reason: `しずめ structured verdict=${verdict ?? "unknown"} — GO 以外はマージ不可`,
      verdict,
    };
  }
  return { ok: true, reason: "しずめ GO + check 緑 — main 自動マージ可" };
}

/**
 * @param {string} text
 * @param {(key: string) => string | undefined} [getEnv]
 */
export function classifyL3RelaxationRequest(text, getEnv) {
  if (isEnvOrSecretExposure(text)) {
    return { band: "L3+", allowed: false, reason: ".env / secrets の表示・送信は禁止" };
  }
  const soul = classifySoulChangeRequest(text);
  if (!soul.allowed) return soul;
  const external = classifyExternalSendRequest(text, getEnv);
  if (!external.allowed) return external;
  return { band: "L2", allowed: true };
}
