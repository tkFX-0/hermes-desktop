import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  buildDiscordVoiceChunks,
  createDiscordVoiceQueue,
  decideDiscordVoiceSpeak,
  isDiscordVoiceBridgeEnabled,
  plainDiscordReplyForVoice,
  splitTextForVoiceSpeech,
  verifyDiscordVoiceChunkCoverage,
} from "../../../../scripts/lib/stackchan-discord-voice.mjs";
import { prepareDiscordVoiceSpeech, prepareSecretarySpeech } from "../../../../scripts/shikishima-secretary-filter.mjs";

describe("stackchan-discord-voice", () => {
  const prev = process.env.STACKCHAN_DISCORD_VOICE;

  afterEach(() => {
    if (prev === undefined) delete process.env.STACKCHAN_DISCORD_VOICE;
    else process.env.STACKCHAN_DISCORD_VOICE = prev;
  });

  beforeEach(() => {
    process.env.STACKCHAN_DISCORD_VOICE = "1";
    delete process.env.SHIKISHIMA_STACKCHAN_HOLD;
  });

  it("bridge enabled by default when env unset", () => {
    delete process.env.STACKCHAN_DISCORD_VOICE;
    expect(isDiscordVoiceBridgeEnabled()).toBe(true);
  });

  it("speaks full short reply as one chunk", () => {
    const d = decideDiscordVoiceSpeak({
      userContent: "おはよう",
      replyText: "おはようございます。しきしまです。",
      agentId: "shikishima",
    });
    expect(d.speak).toBe(true);
    expect(d.chunks).toHaveLength(1);
    expect(d.chunks[0]).toBe("おはようございます。しきしまです。");
  });

  it("speaks long structural replies in multiple chunks", () => {
    const body = "!human-go\nline1\nline2\n".repeat(20);
    const d = decideDiscordVoiceSpeak({
      userContent: "status",
      replyText: body,
      agentId: "shizume",
    });
    expect(d.speak).toBe(true);
    expect(d.reason).toBe("discord_full_read");
    expect(d.chunks.length).toBeGreaterThan(1);
  });

  it("speaks conversational answer with banner stripped", () => {
    const d = decideDiscordVoiceSpeak({
      userContent: "今の状態は？",
      replyText: "🏯 **しきしま** — 接続は問題ありません。",
      agentId: "shikishima",
    });
    expect(d.speak).toBe(true);
    expect(d.chunks[0]).not.toMatch(/\*\*/);
    expect(d.chunks.join("")).toContain("接続は問題ありません");
  });

  it("plainDiscordReplyForVoice strips agent banner", () => {
    expect(plainDiscordReplyForVoice("🏯 **しきしま** — こんにちは。")).toBe("こんにちは。");
  });

  it("skips when user declines voice", () => {
    const d = decideDiscordVoiceSpeak({
      userContent: "テキストで答えて",
      replyText: "🏯 **しきしま** — 了解です。",
    });
    expect(d.speak).toBe(false);
    expect(d.reason).toBe("user_declined_voice");
  });

  it("splits very long reply without dropping text", () => {
    const long = "詳細です。".repeat(40);
    const chunks = buildDiscordVoiceChunks("🏯 **しきしま** — " + long);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join("")).toContain("詳細です。");
  });

  it("splitTextForVoiceSpeech keeps greeting intact", () => {
    const parts = splitTextForVoiceSpeech("おはようございます。しきしまです。");
    expect(parts).toEqual(["おはようございます。しきしまです。"]);
  });

  it("disabled when stackchan hold", () => {
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "1";
    const d = decideDiscordVoiceSpeak({
      userContent: "hi",
      replyText: "こんにちは",
    });
    expect(d.speak).toBe(false);
    expect(d.reason).toBe("bridge_disabled");
  });

  it("stt source uses stt reason when policy passes", () => {
    const d = decideDiscordVoiceSpeak({
      userContent: "[mic]",
      replyText: "はい、どうぞ。",
      source: "stt",
    });
    expect(d.speak).toBe(true);
    expect(d.reason).toBe("stt");
  });

  it("prepareDiscordVoiceSpeech does not apply 80-char secretary limit", () => {
    const long = "あ".repeat(120);
    const secretary = prepareSecretarySpeech(long, { maxSpeechChars: 80 });
    const discord = prepareDiscordVoiceSpeech(long);
    expect(secretary.spokenText.length).toBeLessThanOrEqual(83);
    expect(discord.spokenText.length).toBe(120);
  });

  it("verifyDiscordVoiceChunkCoverage accepts full long reply", () => {
    const body = "段落です。".repeat(30);
    const chunks = buildDiscordVoiceChunks("🏯 **しきしま** — " + body);
    const v = verifyDiscordVoiceChunkCoverage("🏯 **しきしま** — " + body, chunks);
    expect(v.ok).toBe(true);
    expect(v.joinedLength).toBeGreaterThan(100);
  });

  it("serial queue preserves Discord voice order when an earlier item is slower", async () => {
    const order = [];
    const queue = createDiscordVoiceQueue(async (item) => {
      order.push(`start:${item.id}`);
      if (item.id === "first") {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      order.push(`done:${item.id}`);
      return { ok: true, id: item.id };
    });

    const first = queue.enqueue({ id: "first" });
    const second = queue.enqueue({ id: "second" });

    await Promise.all([first, second]);

    expect(order).toEqual([
      "start:first",
      "done:first",
      "start:second",
      "done:second",
    ]);
    expect(queue.getPendingCount()).toBe(0);
  });
});
