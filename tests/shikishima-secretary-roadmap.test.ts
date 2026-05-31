import { describe, expect, it } from "vitest";

import {
  addForbiddenPhraseCorrection,
  applyProfilePhrasePolicy,
  classifyRealtimeSource,
  createDefaultProfilePolicy,
  createSecretaryBridgeDraft,
  createSecretaryDialogueDraft,
  createSecretaryExternalWriteDraft,
  createSecretaryLv5ActivationDraft,
  createSecretaryMonitoringContract,
  createSecretaryRoutineCheckinDraft,
  createSecretaryStillImageCommentDraft,
  createSecretaryVoiceRouteDraft,
  type HumanGoTicket,
} from "../src/main/shikishima-core";

describe("SC-SECRETARY persona and phrase policy", () => {
  it("replaces hard forbidden phrases before StackChan speech", () => {
    const policy = addForbiddenPhraseCorrection(
      createDefaultProfilePolicy(),
      "never-say",
      "user preference",
      "2026-05-25",
      "safe wording",
      "hard",
    );

    const result = applyProfilePhrasePolicy("please never-say this", policy);

    expect(result.changed).toBe(true);
    expect(result.text).toBe("please safe wording this");
    expect(result.blockedPhrases).toContain("never-say");
  });
});

describe("SC-SECRETARY voice router", () => {
  it("creates display-only StackChan voice drafts that require human GO", () => {
    const route = createSecretaryVoiceRouteDraft({
      routeId: "sec-voice-1",
      eventKind: "task_done",
      agentId: "tsumugi",
      fullText: "Task is done. Good work.",
    });

    expect(route.displayOnly).toBe(true);
    expect(route.canExecuteNow).toBe(false);
    expect(route.motion).toBe("task_done");
    expect(route.led).toBe("green");
    expect(route.preflight.gate.decision).toBe("NEEDS_HUMAN");
  });

  it("keeps HOLD and STOP routed through safety presentation", () => {
    const hold = createSecretaryVoiceRouteDraft({
      routeId: "sec-hold-1",
      eventKind: "hold",
      agentId: "shizume",
      fullText: "Human GO is required.",
    });

    expect(hold.motion).toBe("safety_hold");
    expect(hold.spokenResponse.reasoningLevelLabel).toBe("critical");
    expect(hold.canExecuteNow).toBe(false);
  });
});

describe("SC-SECRETARY one-shot dialogue", () => {
  it("prepares one prompt to one answer without loops or camera/mic", () => {
    const draft = createSecretaryDialogueDraft({
      dialogueId: "dialogue-1",
      agentId: "shikishima",
      userPromptSummary: "status question",
      draftAnswer: "今は安全に確認中です。",
      allowVoice: true,
    });

    expect(draft.oneShotOnly).toBe(true);
    expect(draft.continuousLoop).toBe(false);
    expect(draft.microphoneAlwaysOn).toBe(false);
    expect(draft.cameraMonitoring).toBe(false);
    expect(draft.externalWrite).toBe(false);
    expect(draft.execution).toBe("disabled");
    expect(draft.voiceDraft?.canExecuteNow).toBe(false);
  });
});

describe("SC-SECRETARY routine and event bridge", () => {
  it("creates routine drafts without retry loops or escalation", () => {
    const routine = createSecretaryRoutineCheckinDraft({
      routineId: "routine-1",
      routineKind: "break_reminder",
      message: "少し休憩しましょう。",
      minimumIntervalMinutes: 5,
      maxRunsPerDay: 99,
    });

    expect(routine.minimumIntervalMinutes).toBe(15);
    expect(routine.maxRunsPerDay).toBe(8);
    expect(routine.retryLoop).toBe(false);
    expect(routine.naggingEscalation).toBe(false);
    expect(routine.requiresHumanGoForVoice).toBe(true);
  });

  it("bridges project events to drafts without executing device action", () => {
    const bridge = createSecretaryBridgeDraft({
      eventId: "event-1",
      eventKind: "fx_thesis_summary",
      summary: "FX thesis is informational only.",
    });

    expect(bridge.voiceDraft.agentId).toBe("shirube");
    expect(bridge.voiceDraft.eventKind).toBe("fx_summary");
    expect(bridge.externalWrite).toBe(false);
    expect(bridge.deviceActionExecuted).toBe(false);
    expect(bridge.canExecuteNow).toBe(false);
  });
});

describe("SC-SECRETARY camera and microphone boundaries", () => {
  it("keeps continuous camera and microphone loops hard-held", () => {
    expect(classifyRealtimeSource("camera_monitoring").mode).toBe("HARD_HOLD");
    expect(classifyRealtimeSource("stackchan_mic_loop").mode).toBe("HARD_HOLD");
  });

  it("allows one still image comment only with GO and privacy confirmation", () => {
    const ticket: HumanGoTicket = {
      ticketId: "go-cam",
      approvedByHuman: true,
      gateId: "SC-CAM-01",
      exactAction: "one safe still image comment",
      timeWindowJst: "2026-05-25 20:00-20:05",
      allowedRunCount: 1,
      target: "one still image",
      forbiddenActions: ["identity_recognition", "continuous_monitoring"],
      stopConditions: ["private data visible"],
      evidenceFile: "docs/shikishima/SC_CAM_01_CAMERA_COMMENT_ONE_SHOT_EVIDENCE.md",
      afterActionHoldRequired: true,
    };
    const draft = createSecretaryStillImageCommentDraft({
      commentId: "SC-CAM-01",
      imageSourceSummary: "human-approved still image",
      userPrivacyConfirmed: true,
      visiblePeople: false,
      privateDataVisible: false,
      requestedQuestion: "一文で安全に感想を述べる",
      humanGoTicket: ticket,
    });

    expect(draft.canExecuteNow).toBe(true);
    expect(draft.identityRecognitionAllowed).toBe(false);
    expect(draft.continuousMonitoring).toBe(false);
  });

  it("requires bounded contracts for continuous sensors", () => {
    const ticket: HumanGoTicket = {
      ticketId: "go-monitor",
      approvedByHuman: true,
      gateId: "SC-CAM-MONITOR",
      exactAction: "bounded camera monitor",
      timeWindowJst: "2026-05-25 20:00-20:05",
      allowedRunCount: 1,
      target: "private local room",
      forbiddenActions: ["external_upload", "identity_recognition"],
      stopConditions: ["privacy risk"],
      evidenceFile: "docs/shikishima/SC_CAM_MONITOR_EVIDENCE.md",
      afterActionHoldRequired: true,
    };
    const contract = createSecretaryMonitoringContract({
      contractId: "monitor-1",
      mode: "camera_continuous",
      humanGoTicket: ticket,
      durationSeconds: 999,
      localOnly: true,
      privateSpaceConfirmed: true,
      pauseCommand: "pause",
      stopCommand: "stop",
      evidencePath: "docs/shikishima/SC_CAM_MONITOR_EVIDENCE.md",
    });

    expect(contract.approved).toBe(true);
    expect(contract.maxDurationSeconds).toBe(300);
    expect(contract.retryLoop).toBe(false);
    expect(contract.externalUpload).toBe(false);
    expect(contract.identityRecognition).toBe(false);
  });
});

describe("SC-SECRETARY external write", () => {
  it("keeps writes ticket-bound and one-shot", () => {
    const ticket: HumanGoTicket = {
      ticketId: "go-write",
      approvedByHuman: true,
      gateId: "write-1",
      exactAction: "write one secretary note",
      timeWindowJst: "2026-05-25 20:00-20:05",
      allowedRunCount: 1,
      target: "approved destination",
      forbiddenActions: ["raw_value_output"],
      stopConditions: ["unexpected destination"],
      evidenceFile: "docs/shikishima/SC_SECRETARY_EXTERNAL_WRITE_EVIDENCE.md",
      afterActionHoldRequired: true,
    };
    const draft = createSecretaryExternalWriteDraft({
      writeId: "write-1",
      actionKind: "obsidian_write",
      destinationSummary: "approved local note",
      contentSummary: "redacted secretary summary",
      humanGoTicket: ticket,
    });

    expect(draft.canExecuteNow).toBe(true);
    expect(draft.rawValuesReported).toBe(false);
    expect(draft.retryLoop).toBe(false);
  });
});

describe("SC-SECRETARY Lv5 activation draft", () => {
  it("does not mutate productionReady or execution while drafting activation", () => {
    const ticket: HumanGoTicket = {
      ticketId: "go-secretary-lv5",
      approvedByHuman: true,
      gateId: "secretary-lv5:production_ready",
      exactAction: "draft secretary productionReady activation",
      timeWindowJst: "2026-05-25 15:00-15:10",
      allowedRunCount: 1,
      target: "secretary lifecycle",
      forbiddenActions: ["raw_value_output"],
      stopConditions: ["raw values appear"],
      evidenceFile: "docs/shikishima/SC_SECRETARY_LV5_ACTIVATION_EVIDENCE.md",
      afterActionHoldRequired: true,
    };
    const draft = createSecretaryLv5ActivationDraft({
      activationId: "secretary-lv5",
      humanGoTicket: ticket,
      checks: {
        personaPolicyReady: true,
        voiceRouterReady: true,
        oneShotEvidenceReady: true,
        stopMethodDefined: true,
        rollbackDefined: true,
        rawValuePolicyPassed: true,
      },
    });

    expect(draft.criticalStateTransitionReady).toBe(true);
    expect(draft.productionReadyWouldBecome).toBe(false);
    expect(draft.executionWouldBecome).toBe("disabled");
    expect(draft.actualMutationPerformed).toBe(false);
  });
});
