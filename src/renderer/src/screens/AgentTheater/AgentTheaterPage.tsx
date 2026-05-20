/**
 * AgentTheaterPage — unified pixel room control center.
 * Single view: PixelRoomView (night ops room) + RoomChat.
 * No tab switching. Display-only. No execute/push/send buttons.
 * PXR-01~05: tabs removed, single unified room.
 */

import type { AgentPoseMap, PoseState, SlotStatus } from "../../types/agent-theater-types";
import type { LocalChatMessage } from "../../types/service-contracts";
import { PixelRoomStage } from "./PixelRoomStage";
import { RoomChat } from "./PixelRoom/RoomChat";
import { WorkerEnvironmentPanel } from "./WorkerEnvironmentPanel";

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
      <PixelRoomStage decision={decision} poses={poses} lang={lang} />
      <WorkerEnvironmentPanel lang={lang} />
      {onSend && (
        <RoomChat messages={messages} onSend={onSend} lang={lang} />
      )}
    </div>
  );
}
