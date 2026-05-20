/**
 * PixelRoomWorkScene — per-station work status bubbles.
 * Shows what each agent is currently doing.
 * Positioned near each station. Display-only.
 * PXR-05D.
 */

import type { AgentId, PoseState } from "../../types/agent-theater-types";

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

interface WorkBubbleConfig {
  agentId: AgentId;
  x: number;
  y: number;
  workJa: string;
  workEn: string;
  icon: string;
  color: string;
  align: "left" | "right" | "center";
}

const WORK_SCENES: WorkBubbleConfig[] = [
  {
    agentId: "shikishima",
    x: 470,
    y: 116, // agent y=148 − 32px
    workJa: "🎧 全体確認・GO待ち",
    workEn: "Monitoring · awaiting GO",
    icon: "🖥",
    color: "#7eb8ff",
    align: "center",
  },
  {
    agentId: "shizume",
    x: 92,
    y: 204, // agent y=236 − 32px
    workJa: "⛑️ 安全確認中",
    workEn: "Safety check",
    icon: "🛑",
    color: "#f85149",
    align: "center",
  },
  {
    agentId: "hajime",
    x: 252,
    y: 192, // agent y=224 − 32px
    workJa: "🗺 計画作成中",
    workEn: "Planning route",
    icon: "✏️",
    color: "#3fb950",
    align: "center",
  },
  {
    agentId: "tsumugi",
    x: 686,
    y: 192, // agent y=224 − 32px
    workJa: "⌨️ 実装・テスト中",
    workEn: "Implementing",
    icon: "🔧",
    color: "#f0883e",
    align: "center",
  },
  {
    agentId: "shirube",
    x: 848,
    y: 198, // agent y=230 − 32px
    workJa: "📝 証跡記録中",
    workEn: "Recording log",
    icon: "📚",
    color: "#b07fff",
    align: "center",
  },
];

function poseToWorkJa(pose: PoseState, defaultWork: string): string {
  switch (pose) {
    case "hold_stop_blocked":
      return "🛑 HOLD 停止中";
    case "waiting_human_go":
      return "⏳ GO待ち...";
    case "working":
      return defaultWork;
    case "pass":
      return "✅ 完了";
    case "thinking":
      return "💭 判断中...";
    case "handoff_receive":
      return "📥 受け取り中";
    default:
      return defaultWork;
  }
}

interface WorkBubbleProps {
  config: WorkBubbleConfig;
  pose: PoseState;
  lang: "ja" | "en";
  zIndex: number;
}

function WorkBubble({
  config,
  pose,
  lang,
  zIndex,
}: WorkBubbleProps): React.JSX.Element {
  const workText = poseToWorkJa(pose, config.workJa);
  const isHold = pose === "hold_stop_blocked";
  const color = isHold ? "#f85149" : config.color;

  return (
    <div
      style={{
        position: "absolute",
        left: config.x,
        top: config.y,
        zIndex,
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        pointerEvents: "none",
      }}
    >
      {/* Work status pill */}
      <div
        style={{
          background: `rgba(1,2,12,0.88)`,
          border: `1px solid ${color}44`,
          borderRadius: 10,
          padding: "2px 8px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          whiteSpace: "nowrap",
          boxShadow: `0 0 6px ${color}18`,
        }}
      >
        <span style={{ fontSize: 9 }} aria-hidden>
          {config.icon}
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 7.5,
            color: color,
            letterSpacing: 0.3,
          }}
        >
          {lang === "ja" ? workText : config.workEn}
        </span>
      </div>

      {/* Thought connector line */}
      <div
        style={{
          width: 1,
          height: 8,
          background: `${color}33`,
        }}
      />
    </div>
  );
}

interface PixelRoomWorkSceneProps {
  readonly poses: {
    shikishima: PoseState;
    shizume: PoseState;
    hajime: PoseState;
    tsumugi: PoseState;
    shirube: PoseState;
  };
  readonly lang?: "ja" | "en";
  readonly zIndex?: number;
}

export function PixelRoomWorkScene({
  poses,
  lang = "ja",
  zIndex = 25,
}: PixelRoomWorkSceneProps): React.JSX.Element {
  const poseMap: Record<AgentId, PoseState> = {
    shikishima: poses.shikishima,
    shizume: poses.shizume,
    hajime: poses.hajime,
    tsumugi: poses.tsumugi,
    shirube: poses.shirube,
  };

  return (
    <>
      {WORK_SCENES.map((config) => (
        <WorkBubble
          key={config.agentId}
          config={config}
          pose={poseMap[config.agentId]}
          lang={lang}
          zIndex={zIndex}
        />
      ))}
    </>
  );
}
