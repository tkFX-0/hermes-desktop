/**
 * Agent Theater type definitions.
 * AgentId, PoseState, SlotStatus, AgentPoseMap.
 * Design spec: AGENT_THEATER_IMPLEMENTATION_DESIGN.md
 */

export type AgentId =
  | "shikishima"
  | "shizume"
  | "hajime"
  | "tsumugi"
  | "shirube";

export type PoseState =
  | "idle"
  | "thinking"
  | "working"
  | "handoff_send"
  | "handoff_receive"
  | "waiting_human_go"
  | "pass"
  | "hold_stop_blocked";

export interface SlotStatus {
  readonly slotId: string;
  readonly labelJa: string;
  readonly labelEn: string;
  readonly workerLabel: string;
  readonly status: "active" | "idle" | "hold";
  readonly gateRequired?: string;
}

export type AgentPoseMap = Readonly<Record<AgentId, PoseState>>;

export type HandoffStage =
  | "request_received"
  | "planning"
  | "safety_check"
  | "dev_prepare"
  | "recording"
  | "waiting_human_go"
  | "hold_blocked"
  | "stopped";

export type SlotWorkerStatus =
  | "READY"
  | "BUSY"
  | "COOLDOWN"
  | "DEGRADED"
  | "BLOCKED"
  | "FAILED"
  | "NEEDS_HUMAN";

export type ResumeTaskStatus =
  | "ACTIVE"
  | "PAUSED"
  | "COOLDOWN"
  | "HANDOFF_READY"
  | "NEEDS_HUMAN"
  | "COMPLETED"
  | "FAILED";

export interface ResumeTask {
  readonly taskId: string;
  readonly titleJa: string;
  readonly titleEn: string;
  readonly worker: string;
  readonly workerStatus: ResumeTaskStatus;
  readonly autonomyLevel: 1 | 2 | 3 | 4 | 5;
  readonly lastCompletedStepJa: string;
  readonly lastCompletedStepEn: string;
  readonly nextActionJa: string;
  readonly nextActionEn: string;
  readonly cooldownUntilLabel?: string;
  readonly handoffCandidate?: string;
  readonly evidenceFile?: string;
  readonly gitHead?: string;
  readonly humanGoRequired: boolean;
  readonly stopReasonJa?: string;
  readonly stopReasonEn?: string;
}

export type GuardedActionStatus =
  | "HUMAN_GO_REQUIRED"
  | "READ_ONLY_GO"
  | "LOCAL_GO_REQUIRED"
  | "BLOCKED"
  | "LOCKED_FALSE"
  | "LOCKED_DISABLED"
  | "DISABLED";

export type WorkerRouteKind =
  | "DESIGN"
  | "UI_IMPLEMENTATION"
  | "SMALL_FIX"
  | "PUSH_READINESS"
  | "RUNTIME_OBSERVATION"
  | "OAUTH_GATE"
  | "SOCIAL_READ_ONLY"
  | "OBSIDIAN_LOCAL_NOTE"
  | "EXTERNAL_WRITE"
  | "HUMAN_APPROVAL";

export interface WorkerRoute {
  readonly routeId: string;
  readonly taskTypeJa: string;
  readonly taskTypeEn: string;
  readonly recommendedWorker: string;
  readonly workerStatus: SlotWorkerStatus;
  readonly autonomyLevelLabel: string;
  readonly handoffModeJa: string;
  readonly handoffModeEn: string;
  readonly plainReasonJa: string;
  readonly plainReasonEn: string;
  readonly allowedJa: readonly string[];
  readonly allowedEn: readonly string[];
  readonly forbiddenJa: readonly string[];
  readonly forbiddenEn: readonly string[];
  readonly samplePromptTitle: string;
  readonly samplePromptPreview: string;
  readonly humanGoRequired: boolean;
  readonly accentColor: string;
}
