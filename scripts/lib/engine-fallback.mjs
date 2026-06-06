import { isCliCapacityError } from "./goal-slash-routing.mjs";

export const FRIENDLY_ENGINE_UNAVAILABLE_TEXT =
  "現在応答できません。Claude/Codex/Composer の利用枠またはCLI接続が混み合っています。しばらく待ってからもう一度送ってください。";

export function isEngineCapacityError(text) {
  return isCliCapacityError(text);
}

export function isEngineTemporaryError(text) {
  const t = String(text ?? "");
  if (!t || isEngineCapacityError(t)) return false;
  return /timeout|temporar|try again|failed to connect|websocket|ECONNRESET|ETIMEDOUT|EAI_AGAIN|spawn setup refresh|resource busy/i.test(t);
}

export function shouldRetryEngineFailure(result) {
  return !result?.ok && isEngineTemporaryError(result?.text ?? result?.error);
}

export function fallbackEnginesFor(engine) {
  if (engine === "claude") return ["codex", "composer"];
  if (engine === "codex") return ["composer"];
  if (engine === "composer") return ["codex"];
  return ["codex", "composer"];
}

export function normalizeEngineFailure(result, engine) {
  const text = String(result?.text ?? result?.error ?? "");
  if (isEngineCapacityError(text)) {
    return {
      ...result,
      ok: false,
      text: `${engine}: session/rate limit`,
      capacity: true,
    };
  }
  return result;
}
