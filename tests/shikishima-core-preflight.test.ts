import { describe, expect, it } from "vitest";

import {
  createDiscordSendPreflight,
  createDryRunLedgerEntry,
  createObsidianWritePreflight,
  createStackchanSpeechPreflight,
  prepareDiscordReplyDraft,
  prepareStackchanSpeechDraft,
  validateLedgerEntry,
} from "../src/main/shikishima-core";

describe("preflight factories", () => {
  it("requires human GO before Discord send", () => {
    const preflight = createDiscordSendPreflight({
      actionId: "DIS-REPLY",
      actor: "shikishima",
      source: "discord",
      targetSummary: "Discord reply",
      evidencePath: "docs/shikishima/discord.md",
    });

    expect(preflight.gate.decision).toBe("NEEDS_HUMAN");
    expect(preflight.request.requestedEffects).toContain("external_write");
  });

  it("requires human GO before StackChan speech", () => {
    const preflight = createStackchanSpeechPreflight({
      actionId: "SC-SAY",
      actor: "shikishima",
      source: "renderer",
      targetSummary: "StackChan speech",
      evidencePath: "docs/shikishima/stackchan.md",
    });

    expect(preflight.gate.decision).toBe("NEEDS_HUMAN");
    expect(preflight.request.allowedRunCount).toBe(1);
  });

  it("requires human GO before Obsidian write", () => {
    const preflight = createObsidianWritePreflight({
      actionId: "OBS-WRITE",
      actor: "shirube",
      source: "renderer",
      targetSummary: "local note write",
      evidencePath: "docs/shikishima/obsidian.md",
    });

    expect(preflight.gate.decision).toBe("NEEDS_HUMAN");
  });
});

describe("dry-run operation ledger", () => {
  it("creates a safe local ledger entry for review", () => {
    const entry = createDryRunLedgerEntry({
      operationId: "op-1",
      source: "renderer",
      agentId: "shikishima",
      modelId: "stable-general",
      gateId: "DRAFT",
      actionKind: "local_draft",
      inputSummary: "draft only",
      outputSummary: "draft produced",
      evidenceFile: "docs/shikishima/draft.md",
    });

    expect(entry.externalWrite).toBe(false);
    expect(entry.deviceAction).toBe(false);
    expect(entry.productionReady).toBe(false);
    expect(entry.execution).toBe("disabled");
    expect(entry.rawValuesReported).toBe(false);
    expect(validateLedgerEntry(entry)).toEqual({ ok: true });
  });
});

describe("route-specific drafts", () => {
  it("prepares StackChan speech as display-only draft", () => {
    const draft = prepareStackchanSpeechDraft({
      responseId: "resp-sc",
      agentId: "shikishima",
      fullResponse: "画面には長い説明を残します。",
      requestedSpokenResponse: "短く話します。",
      reasoningLevel: "standard",
    });

    expect(draft.displayOnly).toBe(true);
    expect(draft.canExecuteNow).toBe(false);
    expect(draft.response.spokenResponse).toBe("短く話します。");
    expect(draft.preflight.gate.decision).toBe("NEEDS_HUMAN");
  });

  it("prepares Discord reply as display-only draft", () => {
    const draft = prepareDiscordReplyDraft({
      responseId: "resp-discord",
      agentId: "shirube",
      fullResponse: "Discordに表示する候補文です。",
      reasoningLevel: "standard",
    });

    expect(draft.displayOnly).toBe(true);
    expect(draft.canSendNow).toBe(false);
    expect(draft.preflight.gate.decision).toBe("NEEDS_HUMAN");
  });
});
