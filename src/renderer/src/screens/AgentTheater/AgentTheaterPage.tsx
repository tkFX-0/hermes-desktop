/**
 * AgentTheaterPage — unified pixel room control center.
 * Single view: PixelRoomStage + panels (AT-10/11/12/13).
 * No tab switching. Display-only. No execute/push/send buttons.
 * AT-13: visual polish — consistent section spacing, responsive panels wrapper.
 */

import type { AgentPoseMap, PoseState, SlotStatus } from "../../types/agent-theater-types";
import type { LocalChatMessage } from "../../types/service-contracts";
import { PixelRoomStage } from "./PixelRoomStage";
import { RoomChatInline } from "./RoomChatInline";
import { WorkerEnvironmentPanel } from "./WorkerEnvironmentPanel";
import { XSearchAutomationPanel } from "./XSearchAutomationPanel";
import { DiscordInboxPanel } from "./DiscordInboxPanel";
import { DiscordDraftPanel } from "./DiscordDraftPanel";
import { WorkerRoutingPanel } from "./WorkerRoutingPanel";
import { GateDashboardPanel } from "./GateDashboardPanel";
import { HumanGateStatusPanel } from "./HumanGateStatusPanel";
import { AutonomousOperationPanel } from "./AutonomousOperationPanel";
import { AIUsageCockpitPanel } from "./AIUsageCockpitPanel";
// ShikishimaAgentPanel: 一時無効化 (クラッシュ調査中)
// import { ShikishimaAgentPanel } from "./ShikishimaAgentPanel";

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
  readonly stackchanOnline?: boolean;
  readonly voicevoxReady?: boolean;
  readonly stackchanStyle?: string;
  readonly stackchanBattery?: number;
}

// AT-13: section divider for visual separation
function SectionDivider({ label }: { label: string }): React.JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 0" }}>
      <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#30363d", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#21262d" }} />
    </div>
  );
}

export function AgentTheaterPage({
  decision,
  agentPoses,
  messages = [],
  onSend,
  lang = "ja",
  stackchanOnline = false,
  voicevoxReady = false,
  stackchanStyle,
  stackchanBattery,
}: AgentTheaterPageProps): React.JSX.Element {
  const poses = agentPoses ?? deriveAgentPoses(decision);

  return (
    <div style={{ padding: "var(--page-pd-v, 16px) var(--page-pd-h, 20px)", minHeight: 0, overflowX: "hidden" }}>
      {/* Room + Chat */}
      <div style={{ position: "relative" as const }}>
        <PixelRoomStage decision={decision} poses={poses} lang={lang} />
        {onSend && <RoomChatInline messages={messages} onSend={onSend} lang={lang} stackchanOnline={stackchanOnline} voicevoxReady={voicevoxReady} stackchanStyle={stackchanStyle} stackchanBattery={stackchanBattery} />}
      </div>

      {/* Worker section */}
      <SectionDivider label="worker" />
      <WorkerEnvironmentPanel lang={lang} />
      <WorkerRoutingPanel lang={lang} />

      {/* Search section */}
      <SectionDivider label="search" />
      <XSearchAutomationPanel lang={lang} />

      {/* Discord section */}
      <SectionDivider label="discord" />
      <DiscordInboxPanel lang={lang} />
      <DiscordDraftPanel lang={lang} />

      {/* Gate section */}
      <SectionDivider label="gates" />
      <GateDashboardPanel lang={lang} />
      <HumanGateStatusPanel lang={lang} />

      {/* Autonomous readiness section */}
      <SectionDivider label="autonomous readiness" />
      <AutonomousOperationPanel />

      {/* AI usage section */}
      <SectionDivider label="ai usage" />
      <AIUsageCockpitPanel lang={lang} />
    </div>
  );
}
