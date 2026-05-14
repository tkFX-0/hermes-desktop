import type { Level3StopCondition } from "./level3-config";

export interface Level3SessionEvidence {
  sessionId: string;
  date: string;
  timeWindow: { start: string; end: string };
  actualStartTime: string;
  actualEndTime: string | null;
  result: "pass" | "stop" | "pending";
  stopCondition: Level3StopCondition | null;
  rawValuesReported: false;
  screensChecked: Array<{ screen: string; result: "pass" | "hold" | "ng" }>;
  safetyLabels: {
    decision: string;
    execution: string;
    productionReady: string;
  };
  workingTree: {
    stagedBefore: number;
    diffBefore: number;
    stagedAfter: number;
    diffAfter: number;
  };
}

export function createLevel3Evidence(
  sessionId: string,
  timeWindow: { start: string; end: string },
): Level3SessionEvidence {
  return {
    sessionId,
    date: new Date().toISOString().split("T")[0],
    timeWindow,
    actualStartTime: new Date().toISOString(),
    actualEndTime: null,
    result: "pending",
    stopCondition: null,
    rawValuesReported: false,
    screensChecked: [],
    safetyLabels: {
      decision: "HOLD",
      execution: "disabled",
      productionReady: "false",
    },
    workingTree: { stagedBefore: 0, diffBefore: 0, stagedAfter: 0, diffAfter: 0 },
  };
}
