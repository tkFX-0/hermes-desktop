import type {
  ApprovalQueueItem,
  DisplayExpressionState,
  KomashikiDisplayState,
  MobileConsoleSnapshot,
} from "./mobile-console-types";

const AGENT_DEFAULTS = [
  { id: "supervisor",             labelJa: "しきしま",    color: "#a371f7", category: "顔・管制塔" },
  { id: "hermes_worker",          labelJa: "Hermes Core", color: "#58a6ff", category: "心臓・脳" },
  { id: "ichikishima_reviewer",   labelJa: "いちきしま",  color: "#3fb950", category: "審判" },
  { id: "approval_guardian",      labelJa: "しずめ",      color: "#fb923c", category: "ブレーキ" },
  { id: "audit_keeper",           labelJa: "しるべ",      color: "#39d353", category: "記録と道標" },
  { id: "memory_curator",         labelJa: "つむぐ",      color: "#f778ba", category: "記憶・文脈" },
  { id: "visualization_observer", labelJa: "しるべ",      color: "#79c0ff", category: "記録と道標" },
  { id: "suppressive_agent",      labelJa: "しずめ",      color: "#f85149", category: "ブレーキ" },
  { id: "research_agent",         labelJa: "むすび",      color: "#d29922", category: "接続と編成" },
  { id: "execution_planner",      labelJa: "むすび",      color: "#8b949e", category: "接続と編成" },
].map((a) => ({
  ...a,
  enabled: false as const,
  dryRunOnly: true as const,
  requiresUserApproval: true as const,
  autoRun: false as const,
  autoApprove: false as const,
}));

const DEFAULT_APPROVAL_QUEUE = [
  {
    id: "phase-45-60-approval-queue-ui",
    title: "Phase 45 to 60 Approval Queue UI",
    summary: "Implement display-only approval queue model, iPhone UI, desktop UI, tests, and evidence.",
    proposedBy: "human",
    actionKind: "source_change",
    riskLevel: "medium",
    decisionState: "waiting_human",
    requiredHumanAction: "Review implementation evidence before approving push.",
    blockedReason: "Git push requires separate human GO.",
    safeNextStep: "Run local typecheck and targeted tests, then request push GO.",
    evidenceRef: "PHASE_45_TO_60_APPROVAL_QUEUE_UI_EVIDENCE.md",
    createdAtLabel: "2026-05-17",
    rawValuesReported: false,
    execution: "disabled",
    productionReady: false,
  },
  {
    id: "future-runtime-observation",
    title: "Future runtime observation",
    summary: "Controlled observation may be requested later, but runtime is not active in this phase.",
    proposedBy: "system",
    actionKind: "runtime_observation",
    riskLevel: "high",
    decisionState: "held_by_human",
    requiredHumanAction: "Explicit final GO with a time window is required.",
    blockedReason: "Runtime start is outside Phase 45 to 60.",
    safeNextStep: "Keep MOBILE_CONSOLE_PHASE_2C_ENABLED false until a separate runtime GO.",
    evidenceRef: "PHASE_30_TO_45_IPHONE_CONSOLE_UX_EVIDENCE.md",
    createdAtLabel: "2026-05-17",
    rawValuesReported: false,
    execution: "disabled",
    productionReady: false,
  },
  {
    id: "git-push-after-review",
    title: "Git push after review",
    summary: "Push is allowed only after human reviews the local commits and gives explicit push GO.",
    proposedBy: "codex",
    actionKind: "git_push",
    riskLevel: "medium",
    decisionState: "waiting_human",
    requiredHumanAction: "Human push GO required.",
    blockedReason: "This UI cannot push.",
    safeNextStep: "Copy a push GO template into chat after review.",
    evidenceRef: "ROADMAP_CHANGELOG.md",
    createdAtLabel: "2026-05-17",
    rawValuesReported: false,
    execution: "disabled",
    productionReady: false,
  },
  {
    id: "stackchan-physical-operation",
    title: "StackChan physical operation",
    summary: "Physical device operation remains a critical future gate.",
    proposedBy: "system",
    actionKind: "device_operation",
    riskLevel: "critical",
    decisionState: "held_by_human",
    requiredHumanAction: "Separate future approval only.",
    blockedReason: "Device, voice, camera, mic, and physical motion are outside this phase.",
    safeNextStep: "Keep device operation HOLD.",
    evidenceRef: "STACKCHAN_SAFETY_BOUNDARY.md",
    createdAtLabel: "future",
    rawValuesReported: false,
    execution: "disabled",
    productionReady: false,
  },
] as const;

const DEFAULT_APPROVAL_QUEUE_SUMMARY = {
  total: DEFAULT_APPROVAL_QUEUE.length,
  waitingHuman: DEFAULT_APPROVAL_QUEUE.filter((item) => item.decisionState === "waiting_human").length,
  held: DEFAULT_APPROVAL_QUEUE.filter((item) => item.decisionState === "held_by_human").length,
  critical: DEFAULT_APPROVAL_QUEUE.filter((item) => item.riskLevel === "critical").length,
  displayOnly: true,
  execution: "disabled",
  productionReady: false,
  rawValuesReported: false,
} as const;

const DEFAULT_DISPLAY_TERMINAL_PREVIEW = {
  terminalKind: "stackchan_display",
  connectionState: "not_arrived",
  expressionState: "caution",
  displayLabel: "StackChan / Face Terminal Preview",
  displayMessage: "Device not arrived. Display preparation only. Physical operation remains HOLD.",
  safetyNote: "Display-only preview. No robot motion, no voice, no camera, no microphone, no device connection.",
  physicalOperation: false,
  voiceEnabled: false,
  cameraEnabled: false,
  microphoneEnabled: false,
  execution: "disabled",
  productionReady: false,
  rawValuesReported: false,
} as const;

const DEFAULT_DISPLAY_TERMINAL_SUMMARY = {
  deviceArrivalStatus: "not_arrived",
  physicalTestStatus: "deferred",
  connectionAttempted: false,
  displayOnly: true,
  physicalOperation: false,
  voiceEnabled: false,
  cameraEnabled: false,
  microphoneEnabled: false,
  execution: "disabled",
  productionReady: false,
  rawValuesReported: false,
} as const;

export function mapKomashikiToDisplayExpression(
  state: KomashikiDisplayState = "HOLD",
  caveats: readonly string[] = [],
): DisplayExpressionState {
  if (caveats.length > 0 && state === "PASS") return "pass_with_caveat";

  switch (state) {
    case "STOP":
      return "stop";
    case "REJECT":
      return "rejected";
    case "PASS":
      return "pass";
    case "CAVEAT":
      return "pass_with_caveat";
    case "PUSH_WAITING":
      return "push_waiting";
    case "RUNTIME_RUNNING":
      return "runtime_running";
    case "REVIEW_READY":
      return "review_ready";
    case "SLEEPY":
      return "sleepy";
    case "GO":
      return "neutral";
    case "HOLD":
    default:
      return "holding";
  }
}

export function deriveDisplayExpressionState(input: {
  approvalQueue?: readonly ApprovalQueueItem[];
  komashikiState?: KomashikiDisplayState;
  caveats?: readonly string[];
}): DisplayExpressionState {
  const queue = input.approvalQueue ?? [];
  const criticalHeld = queue.some(
    (item) => item.riskLevel === "critical" && item.decisionState === "held_by_human",
  );
  if (criticalHeld) return "caution";

  const highHeld = queue.some(
    (item) => item.riskLevel === "high" && item.decisionState === "held_by_human",
  );
  if (highHeld) return "holding";

  return mapKomashikiToDisplayExpression(input.komashikiState, input.caveats);
}

/** Safe static default snapshot — aligned with Phase 45→60 state. */
export const MOBILE_CONSOLE_DEFAULT_SNAPSHOT: MobileConsoleSnapshot = {
  decision: "HOLD",
  execution: "disabled",
  productionReady: false,
  rawValuesReported: false,
  level3: "not_approved",
  robotMotion: "HOLD",
  appStatus: "initialized",
  phase: "iphone_private_console_phase_2c",
  b3Progress: {
    current: 5,
    required: 5,
    nextSession: "Level 3-A Session 005",
    timingRule: "human_go_required",
    rustDeskDeprecated: true,
    recentSessions: [
      { id: "L3-A Session 004", result: "PASS_WITH_TIMING_CAVEAT", date: "05-17" },
      { id: "L3-A Session 003", result: "STOP",                    date: "05-17" },
      { id: "L3-A Session 002", result: "STOP",                    date: "05-17" },
      { id: "L3-A Session 001", result: "STOP",                    date: "05-17" },
      { id: "B3 5/5",           result: "CLEAN_B3_PASS",           date: "05-16" },
    ],
  },
  pushReadiness: {
    branch: "main",
    headShort: "a0ffa2a",
    originMainShort: "a0ffa2a",
    commitsAhead: 0,
    stagedFiles: 0,
    dirtyTracked: 0,
    recommendation: "push_go_pending",
  },
  agentTeam: {
    schedulerEnabled: false,
    agents: AGENT_DEFAULTS,
    blockerCount: 0,
    warningCount: 0,
  },
  auditSummary: {
    approvalQueueCount: DEFAULT_APPROVAL_QUEUE.length,
    auditLogCountLabel: "≈40",
    memoryCandidateCount: 5,
    recentEvents: [
      { time: "02:17", event: "Phase 30→45 COMPLETE_PASS_CONFIRMED_AFTER_FIX",            type: "pass"   },
      { time: "02:10", event: "Phase 30→45 evidence and mobile console UX reviewed",      type: "pass"   },
      { time: "01:55", event: "feat: improve mobile console safety UX pushed",            type: "commit" },
      { time: "01:40", event: "Session evidence stale references removed",                type: "commit" },
      { time: "01:20", event: "fix: Hermes installer classifier pushed",                  type: "commit" },
    ],
  },
  approvalQueue: DEFAULT_APPROVAL_QUEUE,
  approvalQueueSummary: DEFAULT_APPROVAL_QUEUE_SUMMARY,
  displayTerminalPreview: DEFAULT_DISPLAY_TERMINAL_PREVIEW,
  displayTerminalSummary: DEFAULT_DISPLAY_TERMINAL_SUMMARY,
  stopHistory: [
    {
      sessionId: "L3-A-Session-003",
      stopType: "windows_manual_installer_required",
      date: "2026-05-17 01:46",
      classified: true,
      remediated: true,
      note: "Windows installer blocked iPhone observation. Fix 7f98c78 makes it non-blocking.",
    },
    {
      sessionId: "L3-A-Session-001",
      stopType: "unexpected_external_operation_appeared",
      date: "2026-05-17 00:15",
      classified: true,
      remediated: true,
      note: "NousResearch Hermes Installer appeared. Option B caveat policy established.",
    },
  ],
  generatedAt: "2026-05-17T02:17:00+09:00",
  dataSource: "static_phase1",
  komashikiState: "HOLD",
  caveats: ["windows_manual_installer_required_non_blocking"],
  nextHumanAction: "review Approval Queue UI evidence before push GO",
  phaseProgress: "45% reached; 45→60 approval queue foundation in progress",
  currentSession: "Session 004 PASS_WITH_CAVEAT",
};
