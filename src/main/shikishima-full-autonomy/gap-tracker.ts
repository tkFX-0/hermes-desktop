/**
 * Chapter 10 — residual gaps G1–G7.
 */

export type GapId = "G1" | "G2" | "G3" | "G4" | "G5" | "G6" | "G7" | "G8";

export type GapStatus = "OPEN" | "MITIGATED" | "DEFERRED" | "CLOSED";

export interface TrackedGap {
  id: GapId;
  title: string;
  status: GapStatus;
  mitigation: string;
}

export interface GapTrackerInput {
  stackchanConnected: boolean;
  voicePass: boolean;
  phase8CodeDone: boolean;
  burnInPass: boolean;
  sidebotHold: boolean;
  /** A1+A2 wall-clock burn-in complete. */
  burnInWallClockPass?: boolean;
  /** B1–B3 + C2–C3 pilot voice tracks complete. */
  pilotVoiceTracksComplete?: boolean;
  /** Track D operational release active (local file / env). */
  trackDOperationalRelease?: boolean;
  /** SideBot auto-start released via ops file. */
  sidebotHoldReleased?: boolean;
  /** Obsidian write dry-run governor ready (E3). */
  obsidianWriteDryRunReady?: boolean;
  /** E4 capped scheduler + runtime caps wired. */
  schedulerCapsIntegrated?: boolean;
  /** E5 Discord read dry-run plan ready. */
  discordReadDryRunReady?: boolean;
  /** Constitutional 全てGO active. */
  constitutionalAllGoActive?: boolean;
  /** Obsidian live write enabled (E3b). */
  obsidianActualWriteEnabled?: boolean;
  /** Hermes subprocess bridge ready (E6). */
  hermesSubprocessBridgeReady?: boolean;
  /** Shadow STT opt-in (E7). */
  shadowSttOptIn?: boolean;
}

export function buildGapTracker(input: GapTrackerInput): readonly TrackedGap[] {
  return [
    {
      id: "G1",
      title: "Voice / StackChan connection",
      status:
        input.voicePass && input.stackchanConnected
          ? "CLOSED"
          : input.stackchanConnected
            ? "MITIGATED"
            : "DEFERRED",
      mitigation: "stackchan_resume"
    },
    {
      id: "G2",
      title: "Phase 8–9 production burn-in",
      status: input.burnInWallClockPass
        ? "CLOSED"
        : input.burnInPass
          ? "MITIGATED"
          : "OPEN",
      mitigation: "burn-in-monitor.ts + human run"
    },
    {
      id: "G3",
      title: "Real execution layer",
      status: input.trackDOperationalRelease ? "CLOSED" : "OPEN",
      mitigation: input.trackDOperationalRelease
        ? "TRACK_D operational-release.local.json"
        : "zone + per-route GO"
    },
    {
      id: "G4",
      title: "SideBot / Shadow HOLD",
      status: input.sidebotHoldReleased
        ? "CLOSED"
        : input.pilotVoiceTracksComplete
          ? "MITIGATED"
          : input.sidebotHold
            ? "OPEN"
            : "MITIGATED",
      mitigation: input.sidebotHoldReleased
        ? "operational-release sidebotHoldReleased"
        : input.pilotVoiceTracksComplete
          ? "C2/C3 voice pilot PASS; release sidebot via ops file"
          : "explicit GO to release SIDEBOT_HOLD"
    },
    {
      id: "G5",
      title: "Obsidian actual write",
      status: input.obsidianActualWriteEnabled
        ? "CLOSED"
        : input.obsidianWriteDryRunReady
          ? "MITIGATED"
          : "OPEN",
      mitigation: input.obsidianActualWriteEnabled
        ? "obsidian-write-executor.ts + constitutional GO"
        : input.obsidianWriteDryRunReady
          ? "obsidian-write-plan.ts dry-run; actual write needs GO"
          : "separate GO"
    },
    {
      id: "G6",
      title: "Governor full integration",
      status:
        input.schedulerCapsIntegrated && input.phase8CodeDone
          ? "MITIGATED"
          : input.phase8CodeDone
            ? "MITIGATED"
            : "OPEN",
      mitigation: input.schedulerCapsIntegrated
        ? "capped-autonomous-scheduler.ts + integrated-safety-pipeline.ts"
        : "integrated-safety-pipeline.ts"
    },
    {
      id: "G7",
      title: "Firmware pcmBuf.clear",
      status: "MITIGATED",
      mitigation: "docs/firmware — flash required"
    },
    {
      id: "G8",
      title: "Hermes subprocess / Shadow STT",
      status:
        input.hermesSubprocessBridgeReady && input.shadowSttOptIn
          ? "CLOSED"
          : input.constitutionalAllGoActive
            ? "MITIGATED"
            : "OPEN",
      mitigation: "hermes-subprocess-bridge.ts + shadow-stt-opt-in.ts"
    }
  ];
}

export function openGapCount(gaps: readonly TrackedGap[]): number {
  return gaps.filter((g) => g.status === "OPEN").length;
}
