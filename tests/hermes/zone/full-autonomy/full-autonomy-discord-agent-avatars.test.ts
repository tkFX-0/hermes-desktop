import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import {
  AGENT_AVATAR_IDS,
  localAvatarPath,
  webhookNameForAgent
} from "../../../../scripts/lib/discord-agent-avatars.mjs";

describe("discord agent avatars", () => {
  it("has five local png files in agent order", () => {
    expect(AGENT_AVATAR_IDS).toEqual([
      "shikishima",
      "shizume",
      "tsumugi",
      "hajime",
      "shirube",
    ]);
    for (const id of AGENT_AVATAR_IDS) {
      expect(existsSync(localAvatarPath(id))).toBe(true);
    }
  });

  it("webhook names are per-agent", () => {
    expect(webhookNameForAgent("shikishima")).toBe("shiki-agent-shikishima");
    expect(AGENT_AVATAR_IDS).toHaveLength(5);
  });
});
