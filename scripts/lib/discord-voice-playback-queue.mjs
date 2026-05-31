/**
 * Discord 読み上げ — poll 跨ぎ FIFO（「最後の1件だけ」「短文だけ」暫定対策の置き換え）
 *
 * 1 poll 内の pendingDiscordVoiceQueue に加え、プロセス全体で直列化する。
 */

/** @typedef {{ userContent: string, replyText: string, agentId?: string, source?: string, reason?: string, chunks: string[], messageId?: string, enqueuedAt: number }} DiscordVoicePlaybackItem */

/** @type {DiscordVoicePlaybackItem[]} */
let _pending = [];
let _flushChain = Promise.resolve();

export function getDiscordVoicePlaybackPendingCount() {
  return _pending.length;
}

export function clearDiscordVoicePlaybackQueueForTest() {
  _pending = [];
  _flushChain = Promise.resolve();
}

/**
 * @param {Omit<DiscordVoicePlaybackItem, "enqueuedAt"> & { chunks: string[] }} item
 */
export function pushDiscordVoicePlayback(item) {
  _pending.push({
    ...item,
    enqueuedAt: Date.now(),
  });
}

/**
 * @param {object} deps
 * @param {() => Promise<{ voicevoxReady?: boolean, connected?: boolean }>} deps.checkStatus
 * @param {(voiceItems: object[], opts: object) => Promise<object>} deps.speakBatchItems
 * @param {(opts: object) => object} [deps.speechOpts]
 */
async function flushDiscordVoicePlaybackQueueNow(deps) {
  if (_pending.length === 0) return { ok: true, flushed: 0, batchCount: 0 };

  const batch = _pending.splice(0);
  const st = await deps.checkStatus();
  if (!st.voicevoxReady || !st.connected) {
    console.warn("[StackChanVoice] skip global voice flush — VOICEVOX or StackChan offline");
    return { ok: false, skipped: "device_not_ready", flushed: 0, batchCount: batch.length };
  }

  const voiceItems = batch
    .filter((item) => item.chunks?.length)
    .map((item, index) => ({
      chunks: item.chunks,
      queueLabel: `discord:${item.reason ?? "full_read"}:${item.chunks.length}:msg${index + 1}`,
    }));

  if (voiceItems.length === 0) {
    return { ok: false, blockedReason: "empty_batch", flushed: 0, batchCount: 0 };
  }

  if (voiceItems.length > 1) {
    console.log(
      `[StackChanVoice] global flush: ${voiceItems.length} reply voice(s) — playing in order`,
    );
  }

  const speechOpts = deps.speechOpts ?? { skipMotion: true, skipMilestone: true };
  const batchResult = await deps.speakBatchItems(voiceItems, {
    ...speechOpts,
    queueLabel: `discord:global-batch:${voiceItems.length}`,
  });

  const tag = batchResult?.ok
    ? "ok"
    : (batchResult?.error ?? batchResult?.blockedReason ?? batchResult?.skipped ?? "fail");
  const totalChunks = batch.reduce((n, item) => n + (item.chunks?.length ?? 0), 0);
  console.log(
    `[StackChanVoice] global batch ${tag} (discord:global-batch:${voiceItems.length})`
      + ` utterances=${batchResult?.utteranceCount ?? "?"} chunks=${totalChunks}`,
  );

  return {
    ok: Boolean(batchResult?.ok),
    flushed: voiceItems.length,
    batchCount: voiceItems.length,
    batchResult,
    items: batch,
  };
}

/** poll / STT などから呼ぶ — 常に直列化してから再生 */
export function flushDiscordVoicePlaybackQueue(deps) {
  _flushChain = _flushChain.then(() => flushDiscordVoicePlaybackQueueNow(deps));
  return _flushChain;
}
