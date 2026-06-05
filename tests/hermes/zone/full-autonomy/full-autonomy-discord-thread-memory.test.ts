import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  resolveInboundAgentRoute,
  stripAllDiscordMentions
} from "../../../../scripts/lib/discord-mention-route.mjs";
import {
  appendThreadMessage,
  buildAgentThreadContext,
  buildRoomStatusReport,
  loadChannelThreads,
  mergeDiscordSnapshotIntoThread,
  rebuildPerAgentThreadsFromShared
} from "../../../../scripts/lib/discord-agent-thread-store.mjs";

describe("discord mention route", () => {
  it("strips snowflake mentions and handles bot mention-only", () => {
    expect(stripAllDiscordMentions("<@123456789> こんにちは")).toBe("こんにちは");
    const r = resolveInboundAgentRoute({
      content: "<@999999999>",
      mentions: [{ id: "999999999" }],
      botUserId: "999999999",
      routeAgentFn: () => "tsumugi"
    });
    expect(r.mentionOnly).toBe(true);
    expect(r.agentId).toBe("shikishima");
    expect(r.userText.length).toBeGreaterThan(10);
  });

  it("routes text @つむぎ", () => {
    const r = resolveInboundAgentRoute({
      content: "@つむぎ コード直して",
      mentions: [],
      botUserId: "1",
      routeAgentFn: () => "shikishima"
    });
    expect(r.agentId).toBe("tsumugi");
    expect(r.userText).toMatch(/コード/);
  });
});

describe("discord agent thread store", () => {
  let memRoot = "";
  let channelId = "test-channel-001";

  beforeEach(() => {
    memRoot = mkdtempSync(join(tmpdir(), "shiki-thread-"));
    const threadDir = join(memRoot, "discord-threads");
    mkdirSync(threadDir, { recursive: true });
    process.env.SHIKISHIMA_THREAD_MEM_OVERRIDE = memRoot;
    channelId = `ch-${Date.now()}`;
  });

  afterEach(() => {
    if (memRoot) rmSync(memRoot, { recursive: true, force: true });
    delete process.env.SHIKISHIMA_THREAD_MEM_OVERRIDE;
  });

  it("persists per-agent thread turns", () => {
    appendThreadMessage(channelId, {
      role: "user",
      content: "指示部屋テスト1",
      messageId: "111"
    });
    appendThreadMessage(channelId, {
      role: "assistant",
      agentId: "shikishima",
      content: "了解、続きます"
    });
    rebuildPerAgentThreadsFromShared(channelId);
    const ctx = buildAgentThreadContext(channelId, "shikishima");
    expect(ctx).toMatch(/指示部屋テスト1/);
    expect(ctx).toMatch(/了解/);
    const state = loadChannelThreads(channelId);
    expect(state.agents.tsumugi.messages.length).toBeGreaterThanOrEqual(1);
    const report = buildRoomStatusReport(channelId);
    expect(report).toMatch(/しきしま/);
  });

  it("merges discord snapshot without duplicate tails", () => {
    mergeDiscordSnapshotIntoThread(channelId, [
      {
        id: "100000001",
        authorName: "op",
        contentPreview: "first",
        timestamp: "2026-05-30T10:00:00",
        isBot: false
      }
    ]);
    const added = mergeDiscordSnapshotIntoThread(channelId, [
      {
        id: "100000001",
        authorName: "op",
        contentPreview: "first",
        timestamp: "2026-05-30T10:00:00",
        isBot: false
      }
    ]);
    expect(added).toBe(0);
    const state = loadChannelThreads(channelId);
    expect(state.sharedLog.length).toBe(1);
  });
});
