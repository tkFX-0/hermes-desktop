import { describe, expect, it } from "vitest";
import {
  buildDevStatusBriefing,
  buildDevStatusRedactedPreview
} from "../../../../src/main/shikishima-full-autonomy/dev-status-briefing";
import { SECRETARY_VOICE_PHRASE_ALLOWLIST } from "../../../../src/main/shikishima-full-autonomy/secretary-voice-phrase-map";

describe("dev-status-briefing (Phase A)", () => {
  it("redacted preview has no path-like tokens", () => {
    const preview = buildDevStatusRedactedPreview({
      stackchanHold: true,
      orchestratorDecision: "GO_PREPARED",
      maintenanceTicksToday: 2,
      discordReadOnly: true,
      hermesBackendEnabled: false,
      zoneTests: "pass",
      phaseLabel: "A"
    });
    expect(preview).toMatch(/phase=A/);
    expect(preview).toMatch(/voice=H/);
    expect(preview).not.toMatch(/[A-Za-z]:\\/);
    expect(preview).not.toMatch(/@\S+\.\S+/);
  });

  it("speak phrase is always allowlisted or null", () => {
    const r = buildDevStatusBriefing({
      stackchanHold: true,
      discordReadOnly: true,
      hermesBackendEnabled: false
    });
    if (r.speakPhrase !== null) {
      expect(SECRETARY_VOICE_PHRASE_ALLOWLIST).toContain(r.speakPhrase);
    }
  });

  it("hints when hermes backend on during subscription phase", () => {
    const r = buildDevStatusBriefing({
      stackchanHold: false,
      discordReadOnly: true,
      hermesBackendEnabled: true
    });
    expect(r.hints.some((h) => h.includes("hermes_backend"))).toBe(true);
  });
});
