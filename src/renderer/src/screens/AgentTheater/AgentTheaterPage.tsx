/**
 * AgentTheaterPage - Agent Theater / Control Room main page.
 * Display-only. Shows control room environment with 5 agent zones.
 * No execute/push/send buttons. Safety invariants via PageRightRail.
 * Design spec: AGENT_THEATER_IMPLEMENTATION_DESIGN.md
 * Phase: AT-13 (final visual polish / responsive pass)
 * PXR-01: added ROOM tab (CSS isometric pixel room).
 */

import { useState } from "react";
import type { AgentPoseMap, PoseState, SlotStatus } from "../../types/agent-theater-types";
import type { LocalChatMessage } from "../../types/service-contracts";
import { SlotStatusBar } from "./SlotStatusBar";
import { PageRightRail } from "../../components/Shell/PageRightRail";
import { ControlRoomLayout } from "./ControlRoomLayout";
import { WorkerStatusPanel } from "./WorkerStatusPanel";
import { ResumeQueuePanel } from "./ResumeQueuePanel";
import { RunawayGuardPanel } from "./RunawayGuardPanel";
import { WorkerRoutingPanel } from "./WorkerRoutingPanel";
import { GateDashboardPanel } from "./GateDashboardPanel";
import { PixelRoomView } from "./PixelRoom/PixelRoomView";
import { RoomChat } from "./PixelRoom/RoomChat";
import { Room3DView } from "./PixelRoom3D/Room3DView";

function allPoses(pose: PoseState): AgentPoseMap {
  return {
    shikishima: pose,
    shizume: pose,
    hajime: pose,
    tsumugi: pose,
    shirube: pose,
  };
}

function deriveAgentPoses(decision: string): AgentPoseMap {
  switch (decision) {
    case "STOP":
      return allPoses("hold_stop_blocked");
    case "PASS":
    case "PASS_WITH_CAVEAT":
      return {
        shikishima: "handoff_receive",
        shizume: "pass",
        hajime: "pass",
        tsumugi: "pass",
        shirube: "working",
      };
    case "GO_READY":
      return {
        shikishima: "waiting_human_go",
        shizume: "working",
        hajime: "working",
        tsumugi: "working",
        shirube: "idle",
      };
    default:
      return {
        shikishima: "waiting_human_go",
        shizume: "idle",
        hajime: "idle",
        tsumugi: "idle",
        shirube: "idle",
      };
  }
}

const DEFAULT_SLOTS: readonly SlotStatus[] = [
  { slotId: "SLOT-CONVERSE",  labelJa: "会話",       labelEn: "Converse", workerLabel: "Grok-Hermes", status: "hold", gateRequired: "GHG-03" },
  { slotId: "SLOT-PLAN",      labelJa: "計画",       labelEn: "Plan",     workerLabel: "GPT",         status: "idle" },
  { slotId: "SLOT-SAFETY",    labelJa: "安全確認",   labelEn: "Safety",   workerLabel: "しずめ",      status: "active" },
  { slotId: "SLOT-DEV-CODEX", labelJa: "開発(Codex)", labelEn: "Dev (Codex)", workerLabel: "Codex",    status: "hold", gateRequired: "scoped GO" },
  { slotId: "SLOT-DEV-CC",    labelJa: "開発(CC)",   labelEn: "Dev (CC)", workerLabel: "ClaudeCode",   status: "hold", gateRequired: "scoped GO" },
  { slotId: "SLOT-RECORD",    labelJa: "記録",       labelEn: "Record",   workerLabel: "しるべ",      status: "active" },
  { slotId: "SLOT-SOCIAL",    labelJa: "社会認知",   labelEn: "Social",   workerLabel: "x_search",    status: "hold", gateRequired: "XS-03" },
];

const SECTION_HEADING: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 12,
  letterSpacing: 2,
  color: "var(--ink3, #9ca3af)",
  margin: "0 0 10px",
  textTransform: "uppercase" as const,
};

const SECTION_BLOCK: React.CSSProperties = {
  minWidth: 0,
  overflow: "hidden",
};

export interface AgentTheaterPageProps {
  readonly decision: string;
  readonly agentPoses?: AgentPoseMap;
  readonly slotStatuses?: readonly SlotStatus[];
  readonly messages?: readonly LocalChatMessage[];
  readonly onSend?: (content: string) => void;
  readonly lang?: "ja" | "en";
}

type TheaterView = "card" | "room" | "3d";

const TAB_STYLE_BASE: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 11,
  letterSpacing: 1.5,
  padding: "5px 14px",
  border: "1px solid #21262d",
  borderRadius: 4,
  cursor: "pointer",
  background: "transparent",
  textTransform: "uppercase" as const,
  transition: "color 0.15s, border-color 0.15s, background 0.15s",
};

export function AgentTheaterPage({
  decision,
  agentPoses,
  slotStatuses,
  messages = [],
  onSend,
  lang = "ja",
}: AgentTheaterPageProps): React.JSX.Element {
  const poses = agentPoses ?? deriveAgentPoses(decision);
  const slots = slotStatuses ?? DEFAULT_SLOTS;
  const [view, setView] = useState<TheaterView>("room");

  return (
    <div
      style={{
        padding: "var(--page-pd-v, 22px) var(--page-pd-h, 28px)",
        minHeight: 0,
        overflowX: "hidden",
      }}
    >
      {/* Page title + view tab toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <p style={{ ...SECTION_HEADING, margin: 0 }}>
          {lang === "ja" ? "管制室 · THEATER" : "CONTROL ROOM · THEATER"}
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          {(["room", "3d", "card"] as const).map((v) => (
            <button
              key={v}
              style={{
                ...TAB_STYLE_BASE,
                color: view === v ? "#e6edf3" : "#6e7681",
                borderColor: view === v ? "#58a6ff" : "#21262d",
                background: view === v ? "rgba(88,166,255,0.08)" : "transparent",
              }}
              onClick={() => setView(v)}
            >
              {v === "room" ? (lang === "ja" ? "部屋" : "ROOM")
               : v === "3d" ? "3D"
               : (lang === "ja" ? "カード" : "CARD")}
            </button>
          ))}
        </div>
      </div>

      {/* ROOM view (CSS 2.5D) */}
      {view === "room" && (
        <>
          <PixelRoomView decision={decision} lang={lang} />
          {onSend && (
            <RoomChat messages={messages} onSend={onSend} lang={lang} />
          )}
        </>
      )}

      {/* 3D view (Three.js / R3F) */}
      {view === "3d" && (
        <>
          <Room3DView decision={decision} lang={lang} />
          {onSend && (
            <RoomChat messages={messages} onSend={onSend} lang={lang} />
          )}
        </>
      )}

      {/* CARD view */}
      {view === "card" && <div className="cc-operator-grid">
        <div className="cc-operator-main" style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
          <section style={SECTION_BLOCK} aria-label={lang === "ja" ? "管制室" : "Control room"}>
            <ControlRoomLayout decision={decision} poses={poses} lang={lang} />
          </section>

          <section style={SECTION_BLOCK} aria-label={lang === "ja" ? "スロット状態" : "Slot status"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "スロット" : "SLOTS"}
            </p>
            <SlotStatusBar slots={slots} lang={lang} />
          </section>

          <section style={SECTION_BLOCK} aria-label={lang === "ja" ? "ワーカー状態" : "Worker status"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "ワーカー" : "WORKERS"}
            </p>
            <WorkerStatusPanel lang={lang} />
          </section>

          <section style={SECTION_BLOCK} aria-label={lang === "ja" ? "再開キュー" : "Resume queue"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "再開キュー" : "RESUME QUEUE"}
            </p>
            <ResumeQueuePanel lang={lang} />
          </section>

          <section style={SECTION_BLOCK} aria-label={lang === "ja" ? "暴走防止境界" : "Runaway guard"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "暴走防止" : "RUNAWAY GUARD"}
            </p>
            <RunawayGuardPanel lang={lang} />
          </section>

          <section style={SECTION_BLOCK} aria-label={lang === "ja" ? "ワーカールーティング" : "Worker routing"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "ルーティング" : "ROUTING"}
            </p>
            <WorkerRoutingPanel lang={lang} />
          </section>

          <section style={SECTION_BLOCK} aria-label={lang === "ja" ? "未来ゲート" : "Gate dashboard"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "ゲート" : "GATES"}
            </p>
            <GateDashboardPanel lang={lang} />
          </section>
        </div>

        <aside
          className="cc-operator-side"
          aria-label={lang === "ja" ? "アクションサイドバー" : "Action sidebar"}
        >
          <PageRightRail decision={decision} lang={lang} />
        </aside>
      </div>}
    </div>
  );
}
