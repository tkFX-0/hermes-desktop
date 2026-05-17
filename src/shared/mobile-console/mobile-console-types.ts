/**
 * iPhone Private Console — Redacted Snapshot Types
 * Phase 2A: type definitions only. No network. No execution.
 *
 * productionReady and rawValuesReported are LITERAL false.
 * They must never be any other value in this type system.
 */

export type MobileDecision = "HOLD" | "stop";
export type MobileExecution = "disabled";
export type MobileLevel3 = "not_approved";

/**
 * Display-only state for こましき companion.
 * Display only — not an execution actor, not a GO authority.
 */
export type KomashikiDisplayState =
  | "GO"
  | "HOLD"
  | "REJECT"
  | "PASS"
  | "STOP"
  | "REVIEW_READY"
  | "PUSH_WAITING"
  | "RUNTIME_RUNNING"
  | "CAVEAT"
  | "SLEEPY";

export type MobileDataSource =
  | "static_phase1"
  | "redacted_snapshot_phase2a"
  | "redacted_snapshot_phase2b_ipc"
  | "redacted_snapshot_phase2b_localhost"
  | "redacted_snapshot_phase2c_same_lan";

export type ApprovalDecisionState =
  | "draft"
  | "waiting_human"
  | "approved_by_human"
  | "held_by_human"
  | "rejected_by_human"
  | "expired"
  | "completed"
  | "stopped";

export type ApprovalRiskLevel = "low" | "medium" | "high" | "critical";

export type ApprovalActionKind =
  | "docs_update"
  | "source_change"
  | "test_or_typecheck"
  | "git_push"
  | "runtime_observation"
  | "external_api"
  | "device_operation"
  | "production_release"
  | "unknown";

export interface ApprovalQueueItem {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly proposedBy: "human" | "gpt" | "codex" | "claudecode" | "system";
  readonly actionKind: ApprovalActionKind;
  readonly riskLevel: ApprovalRiskLevel;
  readonly decisionState: ApprovalDecisionState;
  readonly requiredHumanAction: string;
  readonly blockedReason?: string;
  readonly safeNextStep?: string;
  readonly evidenceRef?: string;
  readonly createdAtLabel?: string;
  readonly rawValuesReported: false;
  readonly execution: "disabled";
  readonly productionReady: false;
}

export interface ApprovalQueueSummary {
  readonly total: number;
  readonly waitingHuman: number;
  readonly held: number;
  readonly critical: number;
  readonly displayOnly: true;
  readonly execution: "disabled";
  readonly productionReady: false;
  readonly rawValuesReported: false;
}

export interface MobileSessionRecord {
  readonly id: string;
  readonly result: "CLEAN_B3_PASS" | "PASS_WITH_TIMING_CAVEAT" | "STOP" | "pending";
  readonly date: string;
}

export interface MobileAgentRecord {
  readonly id: string;
  readonly labelJa: string;
  readonly color: string;
  readonly category: string;
  readonly enabled: false;
  readonly dryRunOnly: true;
  readonly requiresUserApproval: true;
  readonly autoRun: false;
  readonly autoApprove: false;
}

export interface MobileAuditEvent {
  readonly time: string;
  readonly event: string;
  readonly type: "docs" | "stop" | "commit" | "pass" | "info";
}

export interface MobileStopRecord {
  readonly sessionId: string;
  readonly stopType: string;
  readonly date: string;
  readonly classified: boolean;
  readonly remediated: boolean;
  readonly note: string;
}

export interface MobilePushReadiness {
  readonly branch: string;
  readonly headShort: string;
  readonly originMainShort: string;
  readonly commitsAhead: number;
  readonly stagedFiles: number;
  readonly dirtyTracked: number;
  readonly recommendation: string;
}

export interface MobileB3Progress {
  readonly current: number;
  readonly required: number;
  readonly nextSession: string;
  readonly timingRule: string;
  readonly rustDeskDeprecated: boolean;
  readonly recentSessions: readonly MobileSessionRecord[];
}

export interface MobileAgentTeam {
  readonly schedulerEnabled: false;
  readonly agents: readonly MobileAgentRecord[];
  readonly blockerCount: number;
  readonly warningCount: number;
}

export interface MobileAuditSummary {
  readonly approvalQueueCount: number;
  readonly auditLogCountLabel: string;
  readonly memoryCandidateCount: number;
  readonly recentEvents: readonly MobileAuditEvent[];
}

/**
 * The top-level redacted snapshot delivered to MobileConsole.
 * productionReady: false — immutable literal. Never true.
 * rawValuesReported: false — immutable literal. Never true.
 */
export interface MobileConsoleSnapshot {
  readonly decision: MobileDecision;
  readonly execution: MobileExecution;
  readonly productionReady: false;
  readonly rawValuesReported: false;
  readonly level3: MobileLevel3;
  readonly robotMotion: "HOLD";
  readonly appStatus: string;
  readonly phase: string;
  readonly b3Progress: MobileB3Progress;
  readonly pushReadiness: MobilePushReadiness;
  readonly agentTeam: MobileAgentTeam;
  readonly auditSummary: MobileAuditSummary;
  readonly approvalQueue: readonly ApprovalQueueItem[];
  readonly approvalQueueSummary: ApprovalQueueSummary;
  readonly stopHistory: readonly MobileStopRecord[];
  readonly generatedAt: string;
  readonly dataSource: MobileDataSource;
  /** Display-only こましき state. Never an execution authority. */
  readonly komashikiState?: KomashikiDisplayState;
  /** Non-blocking caveat labels. Each string is safe display text only. */
  readonly caveats?: readonly string[];
  /** Safe display text for next required human action. No raw values. */
  readonly nextHumanAction?: string;
  /** Safe phase progress label (e.g. "30% COMPLETE_PASS_WITH_CAVEAT"). */
  readonly phaseProgress?: string;
  /** Current session identifier (e.g. "Session 004 PASS_WITH_CAVEAT"). */
  readonly currentSession?: string;
}
