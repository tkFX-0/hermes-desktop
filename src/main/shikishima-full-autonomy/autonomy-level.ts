/** Chapter 6 — Autonomy Level 0–8 evaluation. */

export type AutonomyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface AutonomyLevelAssessment {
  currentLevel: AutonomyLevel;
  targetLevel: 8;
  levelName: string;
  blockers: readonly string[];
}

const LEVEL_NAMES: Record<AutonomyLevel, string> = {
  0: "Manual Gate",
  1: "Safe One-shot",
  2: "Draft-first Planning",
  3: "Read-only Monitoring",
  4: "Local Autonomous Work",
  5: "Controlled External",
  6: "Limited Autonomous Exec",
  7: "Secretary Mode",
  8: "Full Autonomous Operation"
};

export interface LevelAssessmentInput {
  designPackageDone: boolean;
  displayAccepted: boolean;
  motionPass: boolean;
  voicePass: boolean;
  phases2to7CodeDone: boolean;
  phase8SchedulerDone: boolean;
  burnInPass: boolean;
  acceptanceAllPass: boolean;
  stackchanDeferred: boolean;
}

export function assessAutonomyLevel(input: LevelAssessmentInput): AutonomyLevelAssessment {
  const blockers: string[] = [];

  if (!input.designPackageDone) blockers.push("design_package");
  if (!input.displayAccepted) blockers.push("display_not_accepted");
  if (!input.motionPass) blockers.push("motion_not_pass");
  if (!input.voicePass && !input.stackchanDeferred) blockers.push("voice_not_pass");
  if (input.stackchanDeferred) blockers.push("stackchan_deferred");
  if (!input.phases2to7CodeDone) blockers.push("phases_2_7_incomplete");
  if (!input.phase8SchedulerDone) blockers.push("phase8_scheduler");
  if (!input.burnInPass) blockers.push("burn_in");
  if (!input.acceptanceAllPass) blockers.push("acceptance_matrix");

  let level: AutonomyLevel = 0;
  if (input.designPackageDone) level = 2;
  if (input.displayAccepted && input.motionPass) level = 1;
  if (input.phases2to7CodeDone) level = 4;
  if (input.phase8SchedulerDone) level = 5;
  if (input.burnInPass) level = 6;
  if (input.acceptanceAllPass && input.voicePass && !input.stackchanDeferred) level = 8;
  else if (input.acceptanceAllPass && input.stackchanDeferred) level = 7;

  return {
    currentLevel: level,
    targetLevel: 8,
    levelName: LEVEL_NAMES[level],
    blockers
  };
}
