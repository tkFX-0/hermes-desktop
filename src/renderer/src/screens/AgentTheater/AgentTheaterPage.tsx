/**
 * AgentTheaterPage - Agent Theater / Control Room main page.
 * Display-only. Shows control room environment with 5 agent zones.
 * No execute/push/send buttons. Safety invariants via PageRightRail.
 * Design spec: AGENT_THEATER_IMPLEMENTATION_DESIGN.md
 * Phase: AT-13 (final visual polish / responsive pass)
 */

import type { AgentPoseMap, PoseState, SlotStatus } from "../../types/agent-theater-types";
import { SlotStatusBar } from "./SlotStatusBar";
import { PageRightRail } from "../../components/Shell/PageRightRail";
import { ControlRoomLayout } from "./ControlRoomLayout";
import { WorkerStatusPanel } from "./WorkerStatusPanel";
import { ResumeQueuePanel } from "./ResumeQueuePanel";
import { RunawayGuardPanel } from "./RunawayGuardPanel";
import { WorkerRoutingPanel } from "./WorkerRoutingPanel";
import { GateDashboardPanel } from "./GateDashboardPanel";

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
  fontSize: 10,
  letterSpacing: 2,
  color: "var(--ink3, #9ca3af)",
  margin: "0 0 8px",
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
  readonly lang?: "ja" | "en";
}

export function AgentTheaterPage({
  decision,
  agentPoses,
  slotStatuses,
  lang = "ja",
}: AgentTheaterPageProps): React.JSX.Element {
  const poses = agentPoses ?? deriveAgentPoses(decision);
  const slots = slotStatuses ?? DEFAULT_SLOTS;

  return (
    <div
      style={{
        padding: "var(--page-pd-v, 18px) var(--page-pd-h, 22px)",
        minHeight: 0,
        overflowX: "hidden",
      }}
    >
      <p style={{ ...SECTION_HEADING, marginBottom: 16 }}>
        {lang === "ja" ? "管制室 · THEATER" : "CONTROL ROOM · THEATER"}
      </p>

      <div className="cc-operator-grid">
        <div className="cc-operator-main" style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
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
      </div>
    </div>
  );
}
