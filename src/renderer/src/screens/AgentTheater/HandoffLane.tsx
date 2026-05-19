/**
 * HandoffLane — 6-step task handoff flow with display-only stage animation.
 * Active step shows a floating HandoffCard (CSS-only, no execute/push/send).
 * Design spec: AT_07_CONTROL_ROOM_ENVIRONMENT_LAYOUT_EVIDENCE.md
 */

import { HandoffCard } from "./HandoffCard";
import type { HandoffStage } from "../../types/agent-theater-types";

const LANE_CSS = `
.at-active-step {
  animation: at-pulse-glow 2s ease-in-out infinite;
}
.at-handoff-card {
  animation: at-card-enter 0.25s ease-out, at-card-float 3s ease-in-out 0.25s infinite;
}
@keyframes at-pulse-glow {
  0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.1); }
  50%     { box-shadow: 0 0 5px 2px rgba(255,255,255,0.18); }
}
@keyframes at-card-float {
  0%,100% { transform: translateX(-50%) translateY(0); }
  50%     { transform: translateX(-50%) translateY(-2px); }
}
@keyframes at-card-enter {
  from { opacity: 0; transform: translateX(-50%) translateY(4px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .at-active-step  { animation: none !important; }
  .at-handoff-card { animation: none !important; }
}
`;

const STEPS = [
  { step: 1, ja: "依頼",     en: "Request",  color: "#3b82f6" },
  { step: 2, ja: "計画",     en: "Plan",     color: "#22c55e" },
  { step: 3, ja: "安全確認", en: "Safety",   color: "#f59e0b" },
  { step: 4, ja: "作業準備", en: "Prepare",  color: "#f97316" },
  { step: 5, ja: "記録",     en: "Record",   color: "#a855f7" },
  { step: 6, ja: "GO待ち",   en: "Await GO", color: "#f0883e" },
] as const;

function deriveActiveStep(decision: string): number {
  switch (decision) {
    case "STOP":             return 3;
    case "PASS":
    case "PASS_WITH_CAVEAT": return 5;
    case "GO_READY":         return 6;
    default:                 return 6;
  }
}

function deriveHandoffStage(decision: string): HandoffStage {
  switch (decision) {
    case "STOP":             return "stopped";
    case "PASS":
    case "PASS_WITH_CAVEAT": return "recording";
    case "GO_READY":         return "waiting_human_go";
    default:                 return "hold_blocked";
  }
}

interface HandoffLaneProps {
  readonly decision: string;
  readonly lang?: "ja" | "en";
}

export function HandoffLane({ decision, lang = "ja" }: HandoffLaneProps): React.JSX.Element {
  const activeStep = deriveActiveStep(decision);
  const stage = deriveHandoffStage(decision);

  return (
    <>
      <style>{LANE_CSS}</style>
      <div
        style={{
          background: "#0d1117",
          border: "1px solid #21262d",
          borderRadius: 4,
          padding: "46px 18px 14px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          rowGap: 10,
          columnGap: 0,
        }}
      >
        {STEPS.map((s, i) => {
          const isActive  = s.step === activeStep;
          const isDone    = s.step < activeStep && decision !== "STOP";
          const isBlocked = decision === "STOP" && s.step >= activeStep;

          return (
            <div key={s.step} style={{ display: "flex", alignItems: "center" }}>
              {/* Step circle + label (relative parent for HandoffCard) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "center",
                  gap: 3,
                  position: "relative" as const,
                }}
              >
                {/* Floating stage card above active step */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute" as const,
                      bottom: "calc(100% + 4px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <HandoffCard stage={stage} lang={lang} />
                  </div>
                )}

                {/* Step number circle */}
                <div
                  className={isActive ? "at-active-step" : undefined}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: isBlocked
                      ? "#f85149"
                      : isActive
                        ? s.color
                        : isDone
                          ? "#21262d"
                          : "#0d1117",
                    border: `1.5px solid ${
                      isBlocked ? "#f85149" : isActive || isDone ? s.color : "#334155"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color:
                      (isActive && !isBlocked) || isBlocked
                        ? "#0d1117"
                        : isDone
                          ? s.color
                          : "#6e7681",
                    flexShrink: 0,
                  }}
                >
                  {s.step}
                </div>

                {/* Step label */}
                <span
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 10,
                    color: isBlocked
                      ? "#f85149"
                      : isActive
                        ? s.color
                        : isDone
                          ? "#8b949e"
                          : "#6e7681",
                    fontWeight: isActive ? 700 : 400,
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {lang === "ja" ? s.ja : s.en}
                </span>
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    width: 22,
                    height: 1,
                    background: isDone && !isBlocked ? "#334155" : "#1c2333",
                    margin: "0 4px",
                    marginBottom: 20,
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Human GO required badge */}
        <div
          style={{
            marginLeft: "auto",
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 10,
            color: "#f0883e",
            border: "1px solid #f0883e",
            borderRadius: 2,
            padding: "3px 8px",
            whiteSpace: "nowrap" as const,
            alignSelf: "flex-start",
            marginTop: 1,
            flexShrink: 0,
          }}
        >
          {lang === "ja" ? "人間GO必要" : "HUMAN GO REQUIRED"}
        </div>
      </div>
    </>
  );
}
