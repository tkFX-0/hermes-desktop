import type { AutomationContract } from "./automation-contract";

export function createDraftOnlyAutomationContract(input: {
  automationId: string;
  purpose: string;
  evidencePath: string;
}): AutomationContract {
  return {
    automationId: input.automationId,
    scheduleLabel: "manual or proposed schedule only",
    purpose: input.purpose,
    mode: "draft_only",
    allowedActions: ["local_draft"],
    forbiddenActions: [
      "discord_write",
      "obsidian_write",
      "x_search",
      "stackchan_say",
      "stackchan_motion",
      "stackchan_camera",
      "runtime_start",
      "production_ready",
      "execution_enable",
    ],
    maxRunCount: 1,
    maxDurationSeconds: 300,
    gateRequired: false,
    evidencePath: input.evidencePath,
    stopConditions: ["external action requested", "missing evidence path"],
    productionReady: false,
    execution: "disabled",
  };
}

export function createOneShotExternalAutomationContract(input: {
  automationId: string;
  purpose: string;
  evidencePath: string;
  forbiddenActions?: readonly AutomationContract["forbiddenActions"][number][];
}): AutomationContract {
  return {
    automationId: input.automationId,
    scheduleLabel: "one-shot only after human GO",
    purpose: input.purpose,
    mode: "one_shot_external",
    allowedActions: [],
    forbiddenActions: input.forbiddenActions ?? [
      "runtime_start",
      "production_ready",
      "execution_enable",
    ],
    maxRunCount: 1,
    maxDurationSeconds: 300,
    gateRequired: true,
    evidencePath: input.evidencePath,
    stopConditions: ["run count exceeded", "unexpected loop", "raw value requested"],
    productionReady: false,
    execution: "disabled",
  };
}
