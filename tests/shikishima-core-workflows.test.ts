import { describe, expect, it } from "vitest";

import {
  createDirectionalFxThesis,
  createDraftOnlyAutomationContract,
  createOneShotExternalAutomationContract,
  createStandardDebateDraft,
  prepareChannelOutputBundle,
  validateAutomationContract,
  validateDebateSessionDraft,
  validateFxThesis,
  validateLedgerEntry,
} from "../src/main/shikishima-core";

describe("channel output bundle", () => {
  it("prepares UI, Discord draft, StackChan draft, and ledgers without execution", () => {
    const bundle = prepareChannelOutputBundle({
      responseId: "resp-100",
      agentId: "shikishima",
      modelId: "stable-general",
      fullResponse: "画面では詳しい説明を表示します。StackChanには短く伝えます。",
      spokenResponse: "短く伝えます。",
      reasoningLevel: "standard",
      evidenceFile: "docs/shikishima/response.md",
    });

    expect(bundle.ui.fullResponse).toContain("詳しい説明");
    expect(bundle.discord.displayOnly).toBe(true);
    expect(bundle.discord.canSendNow).toBe(false);
    expect(bundle.stackchan.displayOnly).toBe(true);
    expect(bundle.stackchan.canExecuteNow).toBe(false);
    expect(bundle.stackchan.response.spokenResponse).toBe("短く伝えます。");
    expect(bundle.discord.preflight.gate.decision).toBe("NEEDS_HUMAN");
    expect(bundle.stackchan.preflight.gate.decision).toBe("NEEDS_HUMAN");
    expect(validateLedgerEntry(bundle.ledgers.discordDraft)).toEqual({ ok: true });
    expect(validateLedgerEntry(bundle.ledgers.stackchanDraft)).toEqual({ ok: true });
    expect(bundle.execution).toBe("disabled");
    expect(bundle.productionReady).toBe(false);
    expect(bundle.rawValuesReported).toBe(false);
  });
});

describe("automation builders", () => {
  it("creates a safe draft-only contract", () => {
    const contract = createDraftOnlyAutomationContract({
      automationId: "draft-status",
      purpose: "prepare status draft",
      evidencePath: "docs/shikishima/draft-status.md",
    });

    expect(contract.mode).toBe("draft_only");
    expect(contract.gateRequired).toBe(false);
    expect(contract.forbiddenActions).toContain("discord_write");
    expect(validateAutomationContract(contract)).toEqual({ ok: true });
  });

  it("creates a gated one-shot external contract", () => {
    const contract = createOneShotExternalAutomationContract({
      automationId: "discord-one-shot",
      purpose: "send one Discord reply after human GO",
      evidencePath: "docs/shikishima/discord-one-shot.md",
    });

    expect(contract.mode).toBe("one_shot_external");
    expect(contract.gateRequired).toBe(true);
    expect(contract.maxRunCount).toBe(1);
    expect(validateAutomationContract(contract)).toEqual({ ok: true });
  });
});

describe("FX and debate builders", () => {
  it("creates a directional FX thesis without trade execution", () => {
    const thesis = createDirectionalFxThesis({
      marketContext: "London session pullback",
      directionBias: "short",
      setupName: "liquidity sweep thesis",
      entryZone: "after confirmation only",
      invalidation: "higher high after sweep",
      riskNotes: "risk must be set by human",
      confidenceLabel: "medium",
      evidenceSources: ["chart observation"],
      whatWouldChangeMyMind: "clean bullish break",
    });

    expect(thesis.positionIntent).toContain("thesis only");
    expect(thesis.tradeExecution).toBe(false);
    expect(validateFxThesis(thesis)).toEqual({ ok: true });
  });

  it("creates debate draft with human decision required", () => {
    const debate = createStandardDebateDraft({
      debateId: "debate-usable",
      mode: "implementation_debate",
      proposal: "wire channel output bundle",
      positions: [
        {
          agentId: "tsumugi",
          stance: "support",
          summary: "implementation is ready",
          riskNotes: [],
        },
        {
          agentId: "shizume",
          stance: "hold",
          summary: "external send remains gated",
          riskNotes: ["Discord write", "StackChan speech"],
        },
      ],
      riskLevel: "medium",
      recommendedNextAction: "wire draft-only display first",
    });

    expect(debate.humanDecisionRequired).toBe(true);
    expect(debate.conflicts).toContain("shizume: external send remains gated");
    expect(validateDebateSessionDraft(debate)).toEqual({ ok: true });
  });
});
