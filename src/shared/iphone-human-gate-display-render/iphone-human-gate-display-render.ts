import type { IphoneHumanGateDisplayItem } from "../iphone-human-gate-display/iphone-human-gate-display-types";
import type {
  IphoneHumanGateDisplayRenderModel,
  IphoneHumanGateDisplayRenderSection,
  IphoneHumanGateDisplayRenderStatusTone
} from "./iphone-human-gate-display-render-types";

const FOOTER_NOTICE =
  "Review-only mobile card. Human GO required before push, runtime, external write, or queue mutation.";

function mapStatusTone(status: IphoneHumanGateDisplayItem["status"]): IphoneHumanGateDisplayRenderStatusTone {
  if (status === "READY_FOR_REVIEW") return "review";
  if (status === "PREVIEW_ONLY") return "preview";
  if (status === "REJECTED") return "rejected";
  return "hold";
}

function buildSections(item: IphoneHumanGateDisplayItem): IphoneHumanGateDisplayRenderSection[] {
  return item.mobileSections.map((section) => ({
    id: section.id,
    label: section.label,
    lines: [...section.lines]
  }));
}

export function createIphoneHumanGateDisplayRenderModel(
  item: IphoneHumanGateDisplayItem
): IphoneHumanGateDisplayRenderModel {
  return {
    surface: "iphone-private-console-readonly",
    displayOnly: true,
    mobileReady: true,
    layout: "human-gate-review-card",
    displayId: item.displayId,
    goalId: item.goalId,
    taskId: item.taskId,
    gateId: item.gateId,
    title: item.title,
    compactTitle: item.compactTitle,
    status: item.status,
    primaryStatusLabel: item.primaryStatusLabel,
    statusTone: mapStatusTone(item.status),
    summary: item.summary,
    sections: buildSections(item),
    safetyChips: [...item.safetyChips, "display-only"],
    requiredHumanGateLabels: [...item.requiredHumanGates],
    recommendedHumanActionLabel: item.recommendedHumanActionLabel,
    footerNotice: FOOTER_NOTICE,
    uiConnected: false,
    ipcConnected: false,
    networkExposed: false,
    actualQueueMutation: false,
    canApprovePush: false,
    canApproveRuntime: false,
    canApproveExternalWrite: false,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
    redacted: true
  };
}
