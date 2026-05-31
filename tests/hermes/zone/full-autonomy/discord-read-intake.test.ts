import { describe, expect, it } from "vitest";
import { redactMessagePreview } from "../../../../scripts/lib/discord-read-intake.mjs";

describe("discord-read-intake.mjs", () => {
  it("redacts long tokens and ids in preview", () => {
    const preview = redactMessagePreview("hello 123456789012345678 user@note token_abcdefghijklmnopqrstuvwxyz");
    expect(preview).not.toContain("123456789012345678");
    expect(preview).toContain("[redacted]");
  });
});
