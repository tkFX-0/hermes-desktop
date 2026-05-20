/**
 * Controlled Worker Environment type definitions.
 * Defines the safe layer for Shikishima worker assignment.
 * Design spec: WK_00_CONTROLLED_WORKER_ENVIRONMENT_DESIGN.md
 *
 * Worker execution is copy-only / human-mediated.
 * Auto-execution, remote control, MCP, hooks, daemon: HOLD.
 */

export type WorkerProvider =
  | "human"
  | "claude_code"
  | "codex"
  | "cursor"
  | "gpt"
  | "future";

export type WorkerEnvironmentStatus =
  | "READY"
  | "BUSY"
  | "COOLDOWN"
  | "DEGRADED"
  | "BLOCKED"
  | "FAILED"
  | "NEEDS_HUMAN"
  | "HOLD";

export type WorkerAutonomyLevel = 1 | 2 | 3 | 4 | 5;

export type WorkerTaskKind =
  | "docs"
  | "ui"
  | "source"
  | "evidence"
  | "audit"
  | "runtime"
  | "external"
  | "push"
  | "unknown";

export type WorkerExecutionMode =
  | "copy_only"
  | "human_manual"
  | "future_remote_control_hold"
  | "forbidden";

export interface ControlledWorkerTask {
  readonly id: string;
  readonly title: string;
  readonly titleEn: string;
  readonly provider: WorkerProvider;
  readonly status: WorkerEnvironmentStatus;
  readonly autonomyLevel: WorkerAutonomyLevel;
  readonly taskKind: WorkerTaskKind;
  readonly executionMode: WorkerExecutionMode;
  readonly promptPreview: string;
  readonly requiredHumanAction: string;
  readonly forbiddenActions: readonly string[];
  readonly evidenceTarget: string;
  readonly gateStatus: string;
}

export interface ControlledWorkerEnvironment {
  readonly id: string;
  readonly label: string;
  readonly labelEn: string;
  readonly provider: WorkerProvider;
  readonly allowedScope: string;
  readonly currentStatus: WorkerEnvironmentStatus;
  readonly maxAutonomyLevel: WorkerAutonomyLevel;
  readonly requiresHumanBridge: true;
  readonly executionMode: WorkerExecutionMode;
  readonly notes: readonly string[];
  readonly accentColor: string;
}
