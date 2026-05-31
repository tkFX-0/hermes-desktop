import { describe, expect, it, afterEach } from "vitest";
import {
  enterDiscordSpeechDigestSession,
  exitDiscordSpeechDigestSession,
  getDeferredOperatorNotifyCount,
  isDiscordSpeechDigestActive,
  operatorNotifyDeferModeDuringDiscord,
  shouldDeferOperatorNotifyDuringDiscord,
} from "../../../../scripts/shikishima-stackchan.mjs";
import { speakOperatorNotify } from "../../../../scripts/lib/stackchan-operator-notify.mjs";

describe("stackchan-operator-notify-defer", () => {
  const prevDefer = process.env.SHIKISHIMA_OPERATOR_NOTIFY_DEFER_DURING_DISCORD;
  const prevHold = process.env.SHIKISHIMA_STACKCHAN_HOLD;
  const prevMode = process.env.SHIKISHIMA_OPERATOR_NOTIFY_DEFER_MODE;

  afterEach(async () => {
    while (isDiscordSpeechDigestActive()) {
      await exitDiscordSpeechDigestSession();
    }
    if (prevDefer === undefined) delete process.env.SHIKISHIMA_OPERATOR_NOTIFY_DEFER_DURING_DISCORD;
    else process.env.SHIKISHIMA_OPERATOR_NOTIFY_DEFER_DURING_DISCORD = prevDefer;
    if (prevHold === undefined) delete process.env.SHIKISHIMA_STACKCHAN_HOLD;
    else process.env.SHIKISHIMA_STACKCHAN_HOLD = prevHold;
    if (prevMode === undefined) delete process.env.SHIKISHIMA_OPERATOR_NOTIFY_DEFER_MODE;
    else process.env.SHIKISHIMA_OPERATOR_NOTIFY_DEFER_MODE = prevMode;
  });

  it("defaults defer during discord digest to on", () => {
    delete process.env.SHIKISHIMA_OPERATOR_NOTIFY_DEFER_DURING_DISCORD;
    expect(shouldDeferOperatorNotifyDuringDiscord()).toBe(true);
    expect(operatorNotifyDeferModeDuringDiscord()).toBe("defer");
  });

  it("defers operator notify while discord digest session is active", async () => {
    delete process.env.SHIKISHIMA_OPERATOR_NOTIFY_DEFER_DURING_DISCORD;
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "1";

    enterDiscordSpeechDigestSession();
    expect(isDiscordSpeechDigestActive()).toBe(true);

    const r = await speakOperatorNotify("codex_answer_complete", { skipDebounce: true });
    expect(r.skipped).toBe("discord_digest_deferred");
    expect(getDeferredOperatorNotifyCount()).toBe(1);

    const flush = await exitDiscordSpeechDigestSession();
    expect(flush.flushed).toBe(1);
    expect(getDeferredOperatorNotifyCount()).toBe(0);
    expect(isDiscordSpeechDigestActive()).toBe(false);
  });

  it("skip mode logs discord_digest_active without queueing", async () => {
    process.env.SHIKISHIMA_OPERATOR_NOTIFY_DEFER_MODE = "skip";
    enterDiscordSpeechDigestSession();

    const r = await speakOperatorNotify("codex_answer_complete", { skipDebounce: true });
    expect(r.skipped).toBe("discord_digest_active");
    expect(getDeferredOperatorNotifyCount()).toBe(0);
  });
});
