export interface AutonomousOperationSummary {
  readonly productionReady: false;
  readonly execution: "disabled";
  readonly rawValuesReported: false;
  readonly estimatedCompletion: "35-40%";
  readonly humanSupervisedV1: "possible";
  readonly limitedAutonomousV2: "not_ready";
}

export const autonomousOperationSummary: AutonomousOperationSummary = {
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  estimatedCompletion: "35-40%",
  humanSupervisedV1: "possible",
  limitedAutonomousV2: "not_ready",
};

