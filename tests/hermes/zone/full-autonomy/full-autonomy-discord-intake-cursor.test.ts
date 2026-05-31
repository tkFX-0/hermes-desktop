import { describe, expect, it } from "vitest";
import {
  isFreshEnoughToReply,
  STALE_REPLY_MS
} from "../../../../scripts/lib/discord-intake-cursor.mjs";

describe("Discord intake staleness guard", () => {
  const now = Date.parse("2026-05-29T07:00:00.000Z");

  it("replies to a fresh message", () => {
    const ts = new Date(now - 60_000).toISOString();
    expect(isFreshEnoughToReply(ts, now)).toBe(true);
  });

  it("skips reply for a stale message (cursor-only advance)", () => {
    const ts = new Date(now - (STALE_REPLY_MS + 60_000)).toISOString();
    expect(isFreshEnoughToReply(ts, now)).toBe(false);
  });

  it("treats missing/invalid timestamp as fresh (fail-open to reply)", () => {
    expect(isFreshEnoughToReply(undefined, now)).toBe(true);
    expect(isFreshEnoughToReply("not-a-date", now)).toBe(true);
  });
});
