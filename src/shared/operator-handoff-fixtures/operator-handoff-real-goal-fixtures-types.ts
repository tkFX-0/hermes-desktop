import type { OperatorHandoffAssemblyResult } from "../operator-handoff-assembly/operator-handoff-assembly-types";
import type { OperatorHandoffMarkdownSnapshot } from "../operator-handoff-markdown-snapshot/operator-handoff-markdown-snapshot-types";

export type RealGoalOperatorHandoffFixture = {
  fixtureName: string;
  goalName: string;
  assembly: OperatorHandoffAssemblyResult;
  markdownSnapshot: OperatorHandoffMarkdownSnapshot;
};

export type RealGoalOperatorHandoffFixtureRegistry = {
  operatorHandoffMarkdownSnapshotGoal: RealGoalOperatorHandoffFixture;
  operatorHandoffAssemblyGoal: RealGoalOperatorHandoffFixture;
  humanGateReportSnapshotAdapterGoal: RealGoalOperatorHandoffFixture;
  discordReviewPacketAssemblyGoal: RealGoalOperatorHandoffFixture;
};
