import { existsSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

export const TOKENTRACKER_QUEUE_PATH = resolve(
  join(homedir(), ".tokentracker", "tracker", "queue.jsonl")
);

const DEFAULT_CLAUDE_WARN_TOKENS = 50_000;
const MAX_QUEUE_BYTES = 2 * 1024 * 1024;

function parseFiniteNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function readJsonl(path) {
  if (!existsSync(path)) return [];
  const st = statSync(path);
  if (st.size > MAX_QUEUE_BYTES) return [];
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export function tokenTrackerAllowlist() {
  return [TOKENTRACKER_QUEUE_PATH];
}

export function readTokenTrackerQueue(options = {}) {
  const path = resolve(options.queuePath ?? TOKENTRACKER_QUEUE_PATH);
  const allowed = new Set((options.allowlist ?? tokenTrackerAllowlist()).map((p) => resolve(p)));
  if (!allowed.has(path)) {
    return { ok: false, entries: [], path, error: "tokentracker_path_not_allowlisted" };
  }
  const entries = readJsonl(path)
    .filter((row) => row && typeof row === "object")
    .map((row) => ({
      source: String(row.source ?? "").toLowerCase(),
      model: String(row.model ?? ""),
      hourStart: String(row.hour_start ?? ""),
      totalTokens: parseFiniteNumber(row.total_tokens),
      billableTotalTokens: parseFiniteNumber(row.billable_total_tokens ?? row.total_tokens),
      conversationCount: parseFiniteNumber(row.conversation_count),
    }))
    .filter((row) => row.source && row.hourStart);
  return { ok: true, entries, path };
}

export function latestTokenUsageForSource(entries, source) {
  const wanted = String(source ?? "").toLowerCase();
  const rows = (entries ?? []).filter((row) => row.source === wanted);
  if (!rows.length) return null;
  return rows.sort((a, b) => {
    const byHour = String(a.hourStart).localeCompare(String(b.hourStart));
    if (byHour !== 0) return byHour;
    return a.billableTotalTokens - b.billableTotalTokens;
  }).at(-1);
}

export function shouldProactivelyFallbackFromClaude(options = {}) {
  const env = options.env ?? process.env;
  const enabled = String(env.SHIKISHIMA_TOKENTRACKER_ENABLE ?? "1").trim() !== "0";
  if (!enabled) return { fallback: false, reason: "disabled" };
  const threshold = parseFiniteNumber(
    env.SHIKISHIMA_TOKENTRACKER_CLAUDE_WARN_TOKENS,
    DEFAULT_CLAUDE_WARN_TOKENS
  );
  const queue = readTokenTrackerQueue(options);
  if (!queue.ok) return { fallback: false, reason: queue.error, path: queue.path };
  const latest = latestTokenUsageForSource(queue.entries, "claude");
  if (!latest) return { fallback: false, reason: "no_claude_usage", path: queue.path };
  const used = latest.billableTotalTokens;
  return {
    fallback: used >= threshold,
    reason: used >= threshold ? "claude_usage_threshold" : "under_threshold",
    used,
    threshold,
    model: latest.model,
    hourStart: latest.hourStart,
    path: queue.path,
  };
}
