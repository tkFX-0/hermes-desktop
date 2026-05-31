/**
 * Chapter 9 / Phase 10 — FA-01..12 acceptance evaluation.
 */

export type FaStatus = "PASS" | "PARTIAL" | "HOLD" | "TODO";

export interface FaCriterion {
  id: string;
  description: string;
  phase: number;
  status: FaStatus;
}

export interface AcceptanceMatrixInput {
  voicePass: boolean;
  stackchanDeferred: boolean;
  phases2to7TestsPass: boolean;
  phase8Implemented: boolean;
  burnInPass: boolean;
  safetyGovernorIntegrated: boolean;
  /** Human A4 sign-off: FA-07..10 pilot v1 accepted for Level 8 declaration. */
  pilotLevel8HumanDeclaration?: boolean;
  /** Phase E8 — constitutional 全てGO + production modules wired. */
  phaseEProductionGoAcknowledged?: boolean;
}

export function buildAcceptanceMatrix(input: AcceptanceMatrixInput): readonly FaCriterion[] {
  return [
    { id: "FA-01", description: "Unified design fixed", phase: 0, status: "PASS" },
    { id: "FA-02", description: "Self-run operations doc", phase: 0, status: "PASS" },
    { id: "FA-03", description: "Display ACCEPTED", phase: 1, status: "PASS" },
    { id: "FA-04", description: "Motion PASS", phase: 1, status: "PASS" },
    {
      id: "FA-05",
      description: "Voice audible PASS",
      phase: 1,
      status: input.voicePass ? "PASS" : input.stackchanDeferred ? "HOLD" : "HOLD"
    },
    { id: "FA-06", description: "External effect registry", phase: 2, status: "PASS" },
    {
      id: "FA-07",
      description: "Safety governor integrated",
      phase: 2,
      status: input.pilotLevel8HumanDeclaration
        ? "PASS"
        : input.safetyGovernorIntegrated
          ? "PARTIAL"
          : "TODO"
    },
    {
      id: "FA-08",
      description: "Unified snapshot",
      phase: 2,
      status: input.pilotLevel8HumanDeclaration
        ? "PASS"
        : input.phases2to7TestsPass
          ? "PARTIAL"
          : "TODO"
    },
    {
      id: "FA-09",
      description: "Output policy",
      phase: 3,
      status: input.pilotLevel8HumanDeclaration
        ? "PASS"
        : input.phases2to7TestsPass
          ? "PARTIAL"
          : "TODO"
    },
    {
      id: "FA-10",
      description: "Proposal engine",
      phase: 4,
      status: input.pilotLevel8HumanDeclaration
        ? "PASS"
        : input.phases2to7TestsPass
          ? "PARTIAL"
          : "TODO"
    },
    {
      id: "FA-11",
      description: "Burn-in pass",
      phase: 9,
      status: input.burnInPass ? "PASS" : "TODO"
    },
    {
      id: "FA-12",
      description: "Full operation acceptance",
      phase: 10,
      status:
        input.phaseEProductionGoAcknowledged &&
        input.pilotLevel8HumanDeclaration &&
        input.burnInPass &&
        input.voicePass
          ? "PASS"
          : input.pilotLevel8HumanDeclaration
            ? "PARTIAL"
            : "TODO"
    }
  ];
}

function allFaPassForLevel8(criteria: readonly FaCriterion[]): boolean {
  return criteria.every((f) => f.status === "PASS");
}

export function evaluateAcceptanceMatrix(input: AcceptanceMatrixInput): {
  criteria: readonly FaCriterion[];
  passCount: number;
  partialCount: number;
  holdCount: number;
  todoCount: number;
  level8Ready: boolean;
} {
  const criteria = buildAcceptanceMatrix(input);
  const withoutFa12 = criteria.filter((c) => c.id !== "FA-12");
  const fa12Pass = allFaPassForLevel8(withoutFa12);
  const fullCriteria: FaCriterion[] = [
    ...withoutFa12,
    {
      id: "FA-12",
      description: "Full operation acceptance",
      phase: 10,
      status: fa12Pass ? "PASS" : "TODO"
    }
  ];
  return {
    criteria: fullCriteria,
    passCount: fullCriteria.filter((c) => c.status === "PASS").length,
    partialCount: fullCriteria.filter((c) => c.status === "PARTIAL").length,
    holdCount: fullCriteria.filter((c) => c.status === "HOLD").length,
    todoCount: fullCriteria.filter((c) => c.status === "TODO").length,
    level8Ready: fa12Pass
  };
}
