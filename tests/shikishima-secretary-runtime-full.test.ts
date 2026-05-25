import { mkdtempSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { describe, expect, it } from "vitest";

import {
  canRunSecretaryRoutine,
  createSecretaryExternalWriteDraft,
  createSecretaryRuntimeState,
  createSecretaryRoutineSchedulerState,
  createSecretarySensorSessionRuntime,
  createSecretaryStatusSnapshot,
  createSecretaryStillImageIntake,
  draftScheduledRoutine,
  draftSecretaryDialogue,
  draftSecretaryEventReaction,
  draftSecretarySensorSession,
  executeSecretaryExternalWriteDraft,
  pauseSecretaryRuntime,
  startSecretarySensorSession,
  stopSecretaryRuntime,
  tickSecretarySensorSession,
  type HumanGoTicket,
} from "../src/main/shikishima-core";

function ticket(gateId: string): HumanGoTicket {
  return {
    ticketId: `ticket-${gateId}`,
    approvedByHuman: true,
    gateId,
    exactAction: "bounded one-shot action",
    timeWindowJst: "2026-05-25 20:00-20:05",
    allowedRunCount: 1,
    target: "test target",
    forbiddenActions: ["retry_loop", "raw_value_output"],
    stopConditions: ["unexpected behavior"],
    evidenceFile: "docs/shikishima/test-evidence.md",
    afterActionHoldRequired: true,
  };
}

describe("Secretary runtime coordinator", () => {
  it("drafts one-shot dialogue while running and blocks it while paused", () => {
    const state = createSecretaryRuntimeState();
    const drafted = draftSecretaryDialogue(state, {
      dialogueId: "dialogue-1",
      agentId: "shikishima",
      userPromptSummary: "status",
      draftAnswer: "短く答えます。",
      allowVoice: true,
    });

    expect(drafted.result.kind).toBe("dialogue");
    expect(drafted.state.mode).toBe("one_shot_dialogue");

    const paused = pauseSecretaryRuntime(drafted.state, "human pause");
    const blocked = draftSecretaryDialogue(paused, {
      dialogueId: "dialogue-2",
      agentId: "shikishima",
      userPromptSummary: "status",
      draftAnswer: "これは止まる。",
      allowVoice: true,
    });

    expect(blocked.result.kind).toBe("blocked");
  });

  it("bridges events and sensor contracts without executing device action", () => {
    const state = createSecretaryRuntimeState();
    const event = draftSecretaryEventReaction(state, {
      eventId: "event-1",
      eventKind: "gate_stop",
      summary: "STOPです。",
    });
    expect(event.result.kind).toBe("event");

    const sensor = draftSecretarySensorSession(state, {
      contractId: "sensor-1",
      mode: "camera_continuous",
      humanGoTicket: ticket("SC-CAM-MONITOR"),
      durationSeconds: 999,
      localOnly: true,
      privateSpaceConfirmed: true,
      pauseCommand: "pause",
      stopCommand: "stop",
      evidencePath: "docs/shikishima/sensor.md",
    });
    expect(sensor.result.kind).toBe("sensor");
    if (sensor.result.kind === "sensor") {
      expect(sensor.result.draft.maxDurationSeconds).toBe(300);
      expect(sensor.result.draft.externalUpload).toBe(false);
    }
  });
});

describe("Secretary routine scheduler", () => {
  it("starts paused and enforces GO, interval, and run count", () => {
    const schedule = {
      routineId: "routine-1",
      routineKind: "break_reminder" as const,
      message: "休憩しましょう。",
      minimumIntervalMinutes: 15,
      maxRunsPerDay: 1,
      enabled: true,
      runCountToday: 0,
      humanGoTicket: ticket("routine-1"),
    };
    const paused = createSecretaryRoutineSchedulerState([schedule]);
    expect(canRunSecretaryRoutine(paused, "routine-1", 0).allowed).toBe(false);

    const running = { ...paused, paused: false };
    const first = draftScheduledRoutine(running, "routine-1", 1_000_000);
    expect(first.reason).toBe("routine_drafted");
    expect(first.draft?.retryLoop).toBe(false);
    const second = draftScheduledRoutine(first.state, "routine-1", 2_000_000);
    expect(second.reason).toBe("max_runs_reached");
  });
});

describe("Secretary still image intake", () => {
  it("accepts only a privacy-confirmed safe still image", () => {
    const dir = mkdtempSync(join(tmpdir(), "secretary-image-"));
    const imagePath = join(dir, "safe.png");
    writeFileSync(imagePath, Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4]));

    const intake = createSecretaryStillImageIntake({
      commentId: "SC-CAM-01",
      imagePath,
      userPrivacyConfirmed: true,
      visiblePeople: false,
      privateDataVisible: false,
      requestedQuestion: "一文で感想",
      humanGoTicket: ticket("SC-CAM-01"),
    });

    expect(intake.ok).toBe(true);
    expect(intake.externalUpload).toBe(false);
    expect(intake.identityRecognition).toBe(false);
    expect(intake.draft?.canExecuteNow).toBe(true);
  });
});

describe("Secretary sensor session runtime", () => {
  it("starts only approved bounded sessions and restores HOLD on stop/end", () => {
    const runtime = createSecretarySensorSessionRuntime("session-1", {
      contractId: "sensor-1",
      mode: "microphone_always_on",
      humanGoTicket: ticket("SC-MIC-SESSION"),
      durationSeconds: 999,
      localOnly: true,
      privateSpaceConfirmed: true,
      pauseCommand: "pause",
      stopCommand: "stop",
      evidencePath: "docs/shikishima/mic.md",
    });

    const started = startSecretarySensorSession(runtime, 1000);
    expect(started.state).toBe("running");
    expect(started.contract.maxDurationSeconds).toBe(300);
    const completed = tickSecretarySensorSession(started, 301_000);
    expect(completed.state).toBe("completed");
    const stopped = stopSecretaryRuntime(createSecretaryRuntimeState(), "final stop");
    expect(stopped.stopped).toBe(true);
  });
});

describe("Secretary external write executor and status", () => {
  it("executes only approved one-shot write drafts through supplied adapter", () => {
    const draft = createSecretaryExternalWriteDraft({
      writeId: "write-1",
      actionKind: "obsidian_write",
      destinationSummary: "approved local note",
      contentSummary: "redacted summary",
      humanGoTicket: ticket("write-1"),
    });
    const result = executeSecretaryExternalWriteDraft(draft, () => ({ ok: true }));

    expect(result.ok).toBe(true);
    expect(result.writePerformed).toBe(true);
    expect(result.gateRestoredHold).toBe(true);
    expect(result.rawValuesReported).toBe(false);
  });

  it("creates a redacted secretary status snapshot", () => {
    const snapshot = createSecretaryStatusSnapshot({
      runtime: createSecretaryRuntimeState(),
      voiceReady: true,
      cameraOneShotReady: true,
      monitoringReady: false,
      externalWriteReady: false,
    });

    expect(snapshot.secretaryReady).toBe(true);
    expect(snapshot.phase).toBe("camera_candidate");
    expect(snapshot.productionReady).toBe(false);
    expect(snapshot.execution).toBe("disabled");
    expect(snapshot.rawValuesReported).toBe(false);
  });
});

