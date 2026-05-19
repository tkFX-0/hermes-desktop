/**
 * AgentTheaterPage — Agent Theater / Control Room main page.
 * Display-only. Shows control room environment with 5 agent zones.
 * No execute/push/send buttons. Safety invariants via PageRightRail.
 * Design spec: AGENT_THEATER_IMPLEMENTATION_DESIGN.md
 * Phase: AT-09 (resume queue / cooldown panel)
 */

import type { AgentPoseMap, PoseState, SlotStatus } from "../../types/agent-theater-types";
import { SlotStatusBar } from "./SlotStatusBar";
import { PageRightRail } from "../../components/Shell/PageRightRail";
import { ControlRoomLayout } from "./ControlRoomLayout";
import { WorkerStatusPanel } from "./WorkerStatusPanel";
import { ResumeQueuePanel } from "./ResumeQueuePanel";

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
  { slotId: "SLOT-CONVERSE",  labelJa: "会話",     labelEn: "Converse", workerLabel: "Grok-Hermes",  status: "hold",   gateRequired: "GHG-03" },
  { slotId: "SLOT-PLAN",      labelJa: "計画",     labelEn: "Plan",     workerLabel: "—",            status: "idle" },
  { slotId: "SLOT-SAFETY",    labelJa: "安全確認", labelEn: "Safety",   workerLabel: "しずめ",       status: "active" },
  { slotId: "SLOT-DEV-CODEX", labelJa: "開発(Codex)", labelEn: "Dev (Codex)", workerLabel: "—",    status: "hold",   gateRequired: "scoped GO" },
  { slotId: "SLOT-DEV-CC",    labelJa: "開発(CC)", labelEn: "Dev (CC)", workerLabel: "—",            status: "hold",   gateRequired: "scoped GO" },
  { slotId: "SLOT-RECORD",    labelJa: "記録",     labelEn: "Record",   workerLabel: "しるべ",       status: "active" },
  { slotId: "SLOT-SOCIAL",    labelJa: "社会認知", labelEn: "Social",   workerLabel: "x_search",     status: "hold",   gateRequired: "XS-03" },
];

const SECTION_HEADING: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 10,
  letterSpacing: 2,
  color: "var(--ink3, #9ca3af)",
  margin: "0 0 10px",
  textTransform: "uppercase" as const,
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
      }}
    >
      <p style={{ ...SECTION_HEADING, marginBottom: 16 }}>
        {lang === "ja" ? "管制室 · THEATER" : "CONTROL ROOM · THEATER"}
      </p>

      <div className="cc-operator-grid">
        {/* ── MAIN column ── */}
        <div className="cc-operator-main" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Control room environment */}
          <section aria-label={lang === "ja" ? "管制室" : "Control room"}>
            <ControlRoomLayout decision={decision} poses={poses} lang={lang} />
          </section>

          {/* Slot status */}
          <section aria-label={lang === "ja" ? "スロット状態" : "Slot status"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "スロット" : "SLOTS"}
            </p>
            <SlotStatusBar slots={slots} lang={lang} />
          </section>

          {/* Worker status + autonomy level legend */}
          <section aria-label={lang === "ja" ? "ワーカー状態" : "Worker status"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "ワーカー" : "WORKERS"}
            </p>
            <WorkerStatusPanel lang={lang} />
          </section>

          {/* Resume queue / cooldown panel */}
          <section aria-label={lang === "ja" ? "再開キュー" : "Resume queue"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "再開キュー" : "RESUME QUEUE"}
            </p>
            <ResumeQueuePanel lang={lang} />
          </section>
        </div>

        {/* ── SIDEBAR (desktop ≥900px) ── */}
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
