/**
 * AgentTheaterPage — Agent Theater / Control Room main page.
 * Display-only. Shows 5 pixel ghost agents, handoff flow, and slot status.
 * No execute/push/send buttons. Safety invariants via PageRightRail.
 * Design spec: AGENT_THEATER_IMPLEMENTATION_DESIGN.md
 * Phase: AT-02 (CSS placeholder — no sprite assets yet)
 */

import type { AgentId, AgentPoseMap, PoseState, SlotStatus } from "../../types/agent-theater-types";
import { AgentCard } from "./AgentCard";
import { SlotStatusBar } from "./SlotStatusBar";
import { PageRightRail } from "../../components/Shell/PageRightRail";

const AGENT_IDS: readonly AgentId[] = [
  "shikishima",
  "shizume",
  "hajime",
  "tsumugi",
  "shirube",
];

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

const HANDOFF_STEPS: readonly { agentId: AgentId; labelJa: string; labelEn: string }[] = [
  { agentId: "shikishima", labelJa: "指揮",   labelEn: "Command" },
  { agentId: "hajime",     labelJa: "計画",   labelEn: "Plan" },
  { agentId: "shizume",    labelJa: "確認",   labelEn: "Check" },
  { agentId: "tsumugi",    labelJa: "実装",   labelEn: "Build" },
  { agentId: "shirube",    labelJa: "記録",   labelEn: "Record" },
];

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
}: AgentTheaterPageProps) {
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
        <div className="cc-operator-main" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Agent stage */}
          <section aria-label={lang === "ja" ? "エージェント状態" : "Agent status"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "エージェント" : "AGENTS"}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {AGENT_IDS.map((id) => (
                <AgentCard key={id} agentId={id} pose={poses[id]} lang={lang} />
              ))}
            </div>
          </section>

          {/* Handoff flow */}
          <section aria-label={lang === "ja" ? "引き渡しフロー" : "Handoff flow"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "引き渡しフロー" : "HANDOFF FLOW"}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                background: "var(--paper2, #f3f4f6)",
                border: "1px solid var(--rule, #e5e7eb)",
                borderRadius: 4,
                flexWrap: "wrap",
              }}
            >
              {HANDOFF_STEPS.map((step, i) => (
                <span key={step.agentId} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                      fontSize: 11,
                      color:
                        poses[step.agentId] === "hold_stop_blocked"
                          ? "var(--stop, #dc2626)"
                          : poses[step.agentId] === "idle"
                            ? "var(--ink3, #9ca3af)"
                            : "var(--ink, #111827)",
                      fontWeight: poses[step.agentId] !== "idle" ? 700 : 400,
                    }}
                  >
                    {lang === "ja" ? step.labelJa : step.labelEn}
                  </span>
                  {i < HANDOFF_STEPS.length - 1 && (
                    <span
                      style={{
                        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                        fontSize: 10,
                        color: "var(--ink3, #9ca3af)",
                      }}
                    >
                      →
                    </span>
                  )}
                </span>
              ))}
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                  fontSize: 9,
                  color: "var(--hold, #d97706)",
                  border: "1px solid var(--hold, #d97706)",
                  borderRadius: 2,
                  padding: "1px 6px",
                  whiteSpace: "nowrap" as const,
                }}
              >
                {lang === "ja" ? "人間GO待ち" : "AWAIT HUMAN GO"}
              </span>
            </div>
          </section>

          {/* Slot status */}
          <section aria-label={lang === "ja" ? "スロット状態" : "Slot status"}>
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "スロット" : "SLOTS"}
            </p>
            <SlotStatusBar slots={slots} lang={lang} />
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
