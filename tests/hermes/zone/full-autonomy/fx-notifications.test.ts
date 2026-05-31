import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("fx-notifications.mjs", () => {
  let memoryDir: string;

  beforeEach(async () => {
    memoryDir = mkdtempSync(join(tmpdir(), "fx-notif-"));
  });

  afterEach(() => {
    rmSync(memoryDir, { recursive: true, force: true });
  });

  it("stops kill zone and market reports when setAllFxNotifications(false)", async () => {
    const mod = await import(
      "../../../../scripts/lib/fx-notifications.mjs"
    );
    mod.setAllFxNotifications(memoryDir, false);
    expect(mod.shouldSendKillZoneAlerts(memoryDir)).toBe(false);
    expect(mod.shouldSendMarketReports(memoryDir)).toBe(false);
    expect(mod.isChihayaHeld(memoryDir)).toBe(true);
    expect(existsSync(join(memoryDir, "chihaya-hold.json"))).toBe(true);
  });

  it("resumes notifications when setAllFxNotifications(true)", async () => {
    const mod = await import(
      "../../../../scripts/lib/fx-notifications.mjs"
    );
    mod.setAllFxNotifications(memoryDir, false);
    mod.setAllFxNotifications(memoryDir, true);
    expect(mod.shouldSendKillZoneAlerts(memoryDir)).toBe(true);
    expect(mod.shouldSendMarketReports(memoryDir)).toBe(true);
    expect(mod.isChihayaHeld(memoryDir)).toBe(false);
  });

  it("persists fx-notifications.json on hold", async () => {
    const mod = await import(
      "../../../../scripts/lib/fx-notifications.mjs"
    );
    mod.setChihayaHold(memoryDir, true, "test");
    const raw = JSON.parse(
      readFileSync(join(memoryDir, "fx-notifications.json"), "utf-8"),
    );
    expect(raw.killZoneAlerts).toBe(false);
    expect(raw.marketReports).toBe(false);
  });
});
