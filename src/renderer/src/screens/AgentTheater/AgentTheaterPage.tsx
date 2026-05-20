/**
 * AgentTheaterPage — unified pixel room control center.
 * Single view: PixelRoomView (night ops room) + RoomChat.
 * No tab switching. Display-only. No execute/push/send buttons.
 * PXR-01~05: tabs removed, single unified room.
 */

import type { AgentPoseMap, PoseState, SlotStatus } from "../../types/agent-theater-types";
import type { LocalChatMessage } from "../../types/service-contracts";
import { PixelRoomStage } from "./PixelRoomStage";
import { RoomChatInline } from "./RoomChatInline";
import { WorkerEnvironmentPanel } from "./WorkerEnvironmentPanel";
import { XSearchAutomationPanel } from "./XSearchAutomationPanel";
import { DiscordInboxPanel } from "./DiscordInboxPanel";
import { HumanGateStatusPanel } from "./HumanGateStatusPanel";

function allPoses(pose: PoseState): AgentPoseMap {
  return { shikishima: pose, shizume: pose, hajime: pose, tsumugi: pose, shirube: pose };
}

function deriveAgentPoses(decision: string): AgentPoseMap {
  switch (decision) {
    case "STOP":
      return allPoses("hold_stop_blocked");
    case "PASS":
    case "PASS_WITH_CAVEAT":
      return { shikishima: "handoff_receive", shizume: "pass", hajime: "pass", tsumugi: "working", shirube: "working" };
    case "GO_READY":
      return { shikishima: "waiting_human_go", shizume: "working", hajime: "working", tsumugi: "working", shirube: "idle" };
    default:
      return { shikishima: "waiting_human_go", shizume: "idle", hajime: "idle", tsumugi: "idle", shirube: "idle" };
  }
}

export interface AgentTheaterPageProps {
  readonly decision: string;
  readonly agentPoses?: AgentPoseMap;
  readonly slotStatuses?: readonly SlotStatus[];
  readonly messages?: readonly LocalChatMessage[];
  readonly onSend?: (content: string) => void;
  readonly lang?: "ja" | "en";
}

export function AgentTheaterPage({
  decision,
  agentPoses,
  messages = [],
  onSend,
  lang = "ja",
}: AgentTheaterPageProps): React.JSX.Element {
  const poses = agentPoses ?? deriveAgentPoses(decision);

  return (
    <div style={{ padding: "var(--page-pd-v, 16px) var(--page-pd-h, 20px)", minHeight: 0, overflowX: "hidden" }}>
      <div style={{ position: "relative" as const }}>
        <PixelRoomStage decision={decision} poses={poses} lang={lang} />
        {onSend && (
          <RoomChatInline messages={messages} onSend={onSend} lang={lang} />
        )}
      </div>
      <WorkerEnvironmentPanel lang={lang} />
      <XSearchAutomationPanel lang={lang} />
      <DiscordInboxPanel lang={lang} />
      <HumanGateStatusPanel lang={lang} />
    </div>
  );
}
