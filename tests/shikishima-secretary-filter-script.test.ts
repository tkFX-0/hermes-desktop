import { describe, expect, it } from "vitest";

describe("StackChan secretary script filter", () => {
  it("redacts local-looking values before speech", async () => {
    const { prepareSecretarySpeech } = await import("../scripts/shikishima-secretary-filter.mjs");
    const prepared = prepareSecretarySpeech("connect to 10.20.30.40 with abcdefghijklmnopqrstuvwxyz123456");

    expect(prepared.spokenText).toContain("[redacted-address]");
    expect(prepared.spokenText).toContain("[redacted-token]");
    expect(prepared.redactionPassed).toBe(false);
  });

  it("replaces forbidden phrases from the local policy object", async () => {
    const { prepareSecretarySpeech } = await import("../scripts/shikishima-secretary-filter.mjs");
    const prepared = prepareSecretarySpeech("please never-say this", {
      policy: {
        maxSpeechChars: 80,
        forbiddenPhraseRules: [
          {
            phrase: "never-say",
            replacement: "safe wording",
            reason: "test",
            severity: "hard",
          },
        ],
      },
    });

    expect(prepared.spokenText).toBe("please safe wording this");
    expect(prepared.blockedPhrases).toContain("never-say");
  });
});

