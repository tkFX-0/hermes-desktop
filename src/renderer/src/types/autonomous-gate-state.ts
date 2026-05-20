export type AutonomousGateStatus =
  | "PASS"
  | "ONE_SHOT_PASS"
  | "IMPLEMENTED"
  | "HOLD"
  | "BLOCKED"
  | "DRAFT"
  | "CRITICAL_HOLD";

export type AutonomousGateRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AutonomousGate {
  readonly id: string;
  readonly label: string;
  readonly status: AutonomousGateStatus;
  readonly risk: AutonomousGateRisk;
  readonly level: 1 | 2 | 3 | 4 | 5;
  readonly lastResultDate?: string;
  readonly requiresHumanGo: boolean;
  readonly allowedRunCount: number;
  readonly nextAction: string;
  readonly forbiddenActions: readonly string[];
  readonly evidencePath: string;
}

export const autonomousGates: readonly AutonomousGate[] = [
  {
    id: "XS-01",
    label: "x_search read-only",
    status: "PASS",
    risk: "MEDIUM",
    level: 5,
    lastResultDate: "2026-05-20",
    requiresHumanGo: true,
    allowedRunCount: 0,
    nextAction: "closed; use XS-AUTO-03 for next controlled read-only run",
    forbiddenActions: ["social write", "reply", "DM", "like", "follow"],
    evidencePath: "docs/shikishima/XS_01_READ_ONLY_EXECUTION_EVIDENCE_2026-05-20.md",
  },
  {
    id: "OB-01",
    label: "Obsidian local write",
    status: "ONE_SHOT_PASS",
    risk: "HIGH",
    level: 5,
    lastResultDate: "2026-05-20",
    requiresHumanGo: true,
    allowedRunCount: 0,
    nextAction: "gate restored HOLD; next write needs new GO",
    forbiddenActions: ["additional write", "cloud sync", "raw path output"],
    evidencePath: "docs/shikishima/OB01_WRITE_EVIDENCE_2026-05-20.md",
  },
  {
    id: "DIS-01",
    label: "Discord read-only",
    status: "ONE_SHOT_PASS",
    risk: "HIGH",
    level: 5,
    lastResultDate: "2026-05-21",
    requiresHumanGo: true,
    allowedRunCount: 0,
    nextAction: "gate restored HOLD; no read without new GO",
    forbiddenActions: ["send", "reply", "DM", "token output"],
    evidencePath: "docs/shikishima/DIS01_READ_EVIDENCE_2026-05-21.md",
  },
  {
    id: "DIS-02",
    label: "Discord draft response",
    status: "IMPLEMENTED",
    risk: "MEDIUM",
    level: 4,
    requiresHumanGo: false,
    allowedRunCount: 0,
    nextAction: "draft-only UI review",
    forbiddenActions: ["send", "post", "webhook"],
    evidencePath: "docs/shikishima/DIS02_DRAFT_RESPONSE_IMPLEMENTATION_EVIDENCE.md",
  },
  {
    id: "DIS-03",
    label: "Discord one-shot reply",
    status: "ONE_SHOT_PASS",
    risk: "CRITICAL",
    level: 5,
    lastResultDate: "2026-05-21",
    requiresHumanGo: true,
    allowedRunCount: 0,
    nextAction: "gate restored HOLD; no additional send",
    forbiddenActions: ["additional send", "auto-reply", "retry loop"],
    evidencePath: "docs/shikishima/DIS03_REPLY_EVIDENCE_2026-05-21.md",
  },
  {
    id: "XS-AUTO-03",
    label: "x_search autonomous read-only one-shot",
    status: "HOLD",
    risk: "HIGH",
    level: 5,
    requiresHumanGo: true,
    allowedRunCount: 1,
    nextAction: "review GO form and choose a one-shot target",
    forbiddenActions: ["write", "daemon", "retry escalation"],
    evidencePath: "docs/shikishima/XS_AUTO_03_EVIDENCE_TEMPLATE.md",
  },
  {
    id: "CC-03",
    label: "Command Chat one-shot",
    status: "HOLD",
    risk: "HIGH",
    level: 5,
    requiresHumanGo: true,
    allowedRunCount: 1,
    nextAction: "review exact message and stop conditions",
    forbiddenActions: ["unbounded chat", "Hermes bridge", "retry loop"],
    evidencePath: "docs/shikishima/CC_03_EVIDENCE_TEMPLATE.md",
  },
  {
    id: "HB-01",
    label: "Hermes/WSL controlled bridge",
    status: "HOLD",
    risk: "CRITICAL",
    level: 5,
    requiresHumanGo: true,
    allowedRunCount: 1,
    nextAction: "review controlled command, shutdown, and evidence path",
    forbiddenActions: ["daemon", "unbounded bridge", "external write"],
    evidencePath: "docs/shikishima/HB_01_EVIDENCE_TEMPLATE.md",
  },
  {
    id: "XACC-01",
    label: "X account decision",
    status: "HOLD",
    risk: "CRITICAL",
    level: 5,
    requiresHumanGo: true,
    allowedRunCount: 0,
    nextAction: "decide GO/HOLD/STOP for read-only auth scope",
    forbiddenActions: ["post", "reply", "DM", "like", "follow"],
    evidencePath: "docs/shikishima/XACC_01_EVIDENCE_TEMPLATE.md",
  },
  {
    id: "PROD",
    label: "productionReady true",
    status: "CRITICAL_HOLD",
    risk: "CRITICAL",
    level: 5,
    requiresHumanGo: true,
    allowedRunCount: 0,
    nextAction: "do not use yet; blockers remain",
    forbiddenActions: ["set true", "ship", "external operation"],
    evidencePath: "docs/shikishima/PRODUCTION_READY_PRE_GO_EVIDENCE_TEMPLATE.md",
  },
  {
    id: "EXEC",
    label: "execution enabled",
    status: "CRITICAL_HOLD",
    risk: "CRITICAL",
    level: 5,
    requiresHumanGo: true,
    allowedRunCount: 0,
    nextAction: "do not use before productionReady GO",
    forbiddenActions: ["enable execution", "auto-run", "background loop"],
    evidencePath: "docs/shikishima/EXECUTION_ENABLED_PRE_GO_EVIDENCE_TEMPLATE.md",
  },
];

export const autonomousNextActionOrder = [
  "XS-AUTO-03 one-shot read-only",
  "CC-03 one-shot Command Chat",
  "HB-01 controlled Hermes/WSL",
  "XACC-01 decision",
  "BLOCKER-005 human review",
  "LMO session",
  "productionReady GO",
  "execution enabled GO",
] as const;

