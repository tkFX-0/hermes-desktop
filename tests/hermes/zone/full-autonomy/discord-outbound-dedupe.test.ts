import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("discord-outbound-dedupe.mjs", () => {
  let memoryDir: string;

  beforeEach(() => {
    memoryDir = mkdtempSync(join(tmpdir(), "outbound-dedupe-"));
  });

  afterEach(() => {
    rmSync(memoryDir, { recursive: true, force: true });
  });

  it("claimScheduledOutboundSlot allows only once per slot", async () => {
    const mod = await import(
      "../../../../scripts/lib/discord-outbound-dedupe.mjs"
    );
    const slot = "market-report-2026-05-29-22";
    expect(mod.claimScheduledOutboundSlot(memoryDir, slot)).toBe(true);
    expect(mod.claimScheduledOutboundSlot(memoryDir, slot)).toBe(false);
    expect(existsSync(join(memoryDir, "locks", "sched-market-report-2026-05-29-22.lock"))).toBe(
      true,
    );
  });

  it("peekOutboundDuplicate blocks same agent+body within window", async () => {
    const mod = await import(
      "../../../../scripts/lib/discord-outbound-dedupe.mjs"
    );
    const text = "🕯️ **しるべ** 市場速報\n\nXAUUSD注意";
    expect(mod.peekOutboundDuplicate(memoryDir, "shirube", text, 60_000).skip).toBe(false);
    mod.recordOutboundSent(memoryDir, "shirube", text);
    expect(mod.peekOutboundDuplicate(memoryDir, "shirube", text, 60_000).skip).toBe(true);
  });
});
