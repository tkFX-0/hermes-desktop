import { describe, expect, it } from "vitest";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { tmpdir } from "os";
import {
  latestTokenUsageForSource,
  readTokenTrackerQueue,
  shouldProactivelyFallbackFromClaude,
  tokenTrackerAllowlist,
} from "../../../scripts/lib/tokentracker-readonly.mjs";

function withTempQueue(rows: unknown[], fn: (path: string, dir: string) => void) {
  const dir = join(tmpdir(), `tokentracker-test-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, "queue.jsonl");
  writeFileSync(path, rows.map((row) => JSON.stringify(row)).join("\n"), "utf8");
  try {
    fn(path, dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("tokentracker read-only", () => {
  it("uses a narrow allowlist for queue.jsonl only", () => {
    const allowed = tokenTrackerAllowlist().map((p) => resolve(p));
    expect(allowed).toHaveLength(1);
    expect(allowed[0]).toMatch(/\.tokentracker[\\/]tracker[\\/]queue\.jsonl$/);
    expect(allowed[0]).not.toMatch(/relay-cookies|sessions|host-log/i);
  });

  it("rejects non-allowlisted paths", () => {
    const result = readTokenTrackerQueue({
      queuePath: "C:\\Users\\example\\.tokentracker\\tracker\\relay-cookies.json",
      allowlist: ["C:\\safe\\queue.jsonl"],
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBe("tokentracker_path_not_allowlisted");
  });

  it("reads aggregate token rows without content fields", () => {
    withTempQueue(
      [
        {
          source: "claude",
          model: "claude-sonnet-4-6",
          hour_start: "2026-06-06T10:00:00.000Z",
          total_tokens: 10,
          billable_total_tokens: 10,
          conversation_count: 1,
          prompt: "must not be surfaced",
        },
      ],
      (queuePath) => {
        const result = readTokenTrackerQueue({ queuePath, allowlist: [queuePath] });
        expect(result.ok).toBe(true);
        expect(result.entries[0]).toEqual({
          source: "claude",
          model: "claude-sonnet-4-6",
          hourStart: "2026-06-06T10:00:00.000Z",
          totalTokens: 10,
          billableTotalTokens: 10,
          conversationCount: 1,
        });
        expect(JSON.stringify(result.entries)).not.toContain("must not be surfaced");
      }
    );
  });

  it("selects the latest claude usage and triggers threshold fallback", () => {
    withTempQueue(
      [
        { source: "claude", model: "old", hour_start: "2026-06-06T09:00:00.000Z", billable_total_tokens: 1 },
        { source: "claude", model: "new", hour_start: "2026-06-06T10:00:00.000Z", billable_total_tokens: 60000 },
        { source: "codex", model: "gpt-5.4", hour_start: "2026-06-06T10:00:00.000Z", billable_total_tokens: 999999 },
      ],
      (queuePath) => {
        const queue = readTokenTrackerQueue({ queuePath, allowlist: [queuePath] });
        const latest = latestTokenUsageForSource(queue.entries, "claude");
        expect(latest?.model).toBe("new");

        const decision = shouldProactivelyFallbackFromClaude({
          queuePath,
          allowlist: [queuePath],
          env: { SHIKISHIMA_TOKENTRACKER_CLAUDE_WARN_TOKENS: "50000" },
        });
        expect(decision.fallback).toBe(true);
        expect(decision.reason).toBe("claude_usage_threshold");
        expect(decision.used).toBe(60000);
      }
    );
  });

  it("does not fallback when disabled or under threshold", () => {
    withTempQueue(
      [{ source: "claude", model: "sonnet", hour_start: "2026-06-06T10:00:00.000Z", billable_total_tokens: 100 }],
      (queuePath) => {
        expect(
          shouldProactivelyFallbackFromClaude({
            queuePath,
            allowlist: [queuePath],
            env: { SHIKISHIMA_TOKENTRACKER_ENABLE: "0" },
          }).fallback
        ).toBe(false);
        expect(
          shouldProactivelyFallbackFromClaude({
            queuePath,
            allowlist: [queuePath],
            env: { SHIKISHIMA_TOKENTRACKER_CLAUDE_WARN_TOKENS: "50000" },
          }).fallback
        ).toBe(false);
      }
    );
  });
});
