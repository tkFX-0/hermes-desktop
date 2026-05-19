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
