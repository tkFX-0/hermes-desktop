import { describe, expect, it, afterEach } from "vitest";
import {
  clearDiscordVoicePlaybackQueueForTest,
  flushDiscordVoicePlaybackQueue,
  getDiscordVoicePlaybackPendingCount,
  pushDiscordVoicePlayback,
} from "../../../../scripts/lib/discord-voice-playback-queue.mjs";

describe("discord-voice-playback-queue", () => {
  afterEach(() => {
    clearDiscordVoicePlaybackQueueForTest();
  });

  it("flushes replies in FIFO order across pushes", async () => {
    const order = [];

    pushDiscordVoicePlayback({
      userContent: "a",
      replyText: "first",
      chunks: ["first"],
      reason: "discord_full_read",
    });
    pushDiscordVoicePlayback({
      userContent: "b",
      replyText: "second",
      chunks: ["second"],
      reason: "discord_full_read",
    });

    expect(getDiscordVoicePlaybackPendingCount()).toBe(2);

    await flushDiscordVoicePlaybackQueue({
      checkStatus: async () => ({ voicevoxReady: true, connected: true }),
      speakBatchItems: async (items) => {
        for (const item of items) {
          order.push(item.chunks[0]);
        }
        return { ok: true, batchCount: items.length, utteranceCount: items.length };
      },
    });

    expect(order).toEqual(["first", "second"]);
    expect(getDiscordVoicePlaybackPendingCount()).toBe(0);
  });
});
