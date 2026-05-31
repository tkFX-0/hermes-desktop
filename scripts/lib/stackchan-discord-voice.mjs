/**
 * Discord → StackChan voice (VOICEVOX): every Discord reply is spoken in full,
 * one message at a time, split into sentence-sized chunks (serial queue).
 */

import { prepareDiscordVoiceSpeech } from "../shikishima-secretary-filter.mjs";
import {
  isDiscordVoiceBridgeEnabled,
  isLegacyDiscordVoiceEnabled,
  resolveStackchanDiscordVoiceConfig,
  formatStackchanDiscordVoiceStatusLine
} from "./stackchan-voice-config.mjs";

export {
  isDiscordVoiceBridgeEnabled,
  isLegacyDiscordVoiceEnabled,
  resolveStackchanDiscordVoiceConfig,
  formatStackchanDiscordVoiceStatusLine
};

const USER_DECLINES_VOICE =
  /(?:読まないで|喋らないで|音はいい|声はいい|テキスト(?:のみ|で)|文字だけで|mute|サイレント)/i;

/**
 * Sentence split target — PCM cap is enforced in stackchanSay (single WS batch per reply).
 * 48 だと長文が細切れ WS になり途切れやすいため文単位を優先して大きめにする。
 */
const VOICE_CHUNK_CHARS = 96;

export function stripDiscordMarkdown(text) {
  return String(text ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[返答\]\s*\S+/gi, " ")
    .replace(/\[開発\]\s*\S+/gi, " ")
    .replace(/[_~#|]/g, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Plain speakable body (banner removed, full reply kept). */
export function plainDiscordReplyForVoice(replyText) {
  let plain = stripDiscordMarkdown(replyText);
  plain = plain.replace(/^[^\s]{0,4}\s*(?:しきしま|しずめ|しるべ|つむぎ|はじめ)\s*[—–\-:]\s*/u, "");
  return plain.trim();
}

/**
 * Split into chunks without dropping text (sentence boundaries, then hard split).
 */
export function splitTextForVoiceSpeech(plain, maxChunk = VOICE_CHUNK_CHARS) {
  const text = String(plain ?? "").trim();
  if (!text) return [];
  if (text.length <= maxChunk) return [text];

  const sentences = text
    .split(/(?<=[。．！？!?])/u)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks = [];
  let buf = "";

  const flush = () => {
    if (buf) {
      chunks.push(buf);
      buf = "";
    }
  };

  const pushLong = (segment) => {
    for (let i = 0; i < segment.length; i += maxChunk) {
      chunks.push(segment.slice(i, i + maxChunk));
    }
  };

  for (const sentence of sentences.length > 0 ? sentences : [text]) {
    if (sentence.length > maxChunk) {
      flush();
      pushLong(sentence);
      continue;
    }
    if (!buf) {
      buf = sentence;
      continue;
    }
    if ((buf + sentence).length <= maxChunk) {
      buf += sentence;
    } else {
      flush();
      buf = sentence;
    }
  }
  flush();

  return chunks.length > 0 ? chunks : [text.slice(0, maxChunk)];
}

/**
 * Build prepared speak chunks (full Discord reply).
 */
export function buildDiscordVoiceChunks(replyText) {
  const plain = plainDiscordReplyForVoice(replyText);
  if (!plain) return [];

  const rawParts = splitTextForVoiceSpeech(plain);
  const chunks = [];

  for (const part of rawParts) {
    const speech = prepareDiscordVoiceSpeech(part);
    if (!speech.spokenAllowed || !speech.spokenText.trim()) continue;
    chunks.push(speech.spokenText.trim());
  }

  return chunks;
}

/** チャンク結合が元プレーン文を欠落していないか（テスト・ログ用） */
export function verifyDiscordVoiceChunkCoverage(replyText, chunks) {
  const plain = plainDiscordReplyForVoice(replyText);
  const joined = chunks.join("");
  if (!plain) return { ok: chunks.length === 0, plainLength: 0, joinedLength: 0 };
  const normalize = (s) => String(s).replace(/\s+/g, "");
  const ok =
    joined.length >= Math.min(plain.length, 8) &&
    (normalize(plain).includes(normalize(joined).slice(0, 12)) ||
      normalize(joined).length >= Math.floor(normalize(plain).length * 0.85));
  return { ok, plainLength: plain.length, joinedLength: joined.length, chunkCount: chunks.length };
}

/**
 * Discord返信は原則すべて発話（メッセージ単位・全文をチャンク分割）。
 */
export function decideDiscordVoiceSpeak(input) {
  const userContent = String(input.userContent ?? "").trim();
  const replyText = String(input.replyText ?? "").trim();
  const source = input.source ?? "discord_reply";

  if (!isDiscordVoiceBridgeEnabled()) {
    return { speak: false, reason: "bridge_disabled", spokenText: "", chunks: [] };
  }
  if (!replyText) {
    return { speak: false, reason: "empty_reply", spokenText: "", chunks: [] };
  }
  if (USER_DECLINES_VOICE.test(userContent)) {
    return { speak: false, reason: "user_declined_voice", spokenText: "", chunks: [] };
  }

  const chunks = buildDiscordVoiceChunks(replyText);
  if (chunks.length === 0) {
    return { speak: false, reason: "speech_policy_blocked", spokenText: "", chunks: [] };
  }

  return {
    speak: true,
    reason: source === "stt" ? "stt" : "discord_full_read",
    spokenText: chunks[0],
    chunks,
  };
}

/**
 * Serial voice queue — one queue item = one VOICEVOX utterance; never merge messages.
 */
export function createDiscordVoiceQueue(speakOnce) {
  let chain = Promise.resolve();
  let pending = 0;

  function enqueue(item) {
    pending += 1;
    const job = chain.then(async () => {
      try {
        return await speakOnce(item);
      } finally {
        pending -= 1;
      }
    });
    chain = job.catch((e) => {
      console.warn("[StackChanVoice] queue error:", e.message);
    });
    return job;
  }

  return {
    enqueue,
    getPendingCount: () => pending,
  };
}
