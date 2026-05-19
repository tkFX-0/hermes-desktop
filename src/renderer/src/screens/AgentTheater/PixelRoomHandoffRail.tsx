/**
 * PixelRoomHandoffRail — prominent 5-step handoff workflow lane.
 * Reference: ３D部屋イメージ.png bottom handoff row.
 * Larger cards, stronger colors. Display-only.
 */

import React from "react";

const MONO = '"IBM Plex Mono", ui-monospace, monospace';
const SANS = '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif';

const STEPS = [
  { num: 1, ja: "ユーザー依頼", en: "Request",     icon: "👤", status: "done"    },
  { num: 2, ja: "計画する",     en: "Plan",         icon: "🗺", status: "done"    },
  { num: 3, ja: "安全チェック", en: "Safety Check", icon: "🛡", status: "hold"    },
  { num: 4, ja: "実装する",     en: "Implement",    icon: "⚙️", status: "waiting" },
  { num: 5, ja: "記録する",     en: "Record",       icon: "📝", status: "waiting" },
] as const;

function stepColor(status: string, isStop: boolean): string {
  if (isStop) return "#f85149";
  if (status === "done")    return "#3fb950";
  if (status === "hold")    return "#f0883e";
  return "#6680aa";
}

interface PixelRoomHandoffRailProps {
  decision?: string;
  lang?: "ja" | "en";
}

export function PixelRoomHandoffRail({ decision = "HOLD", lang = "ja" }: PixelRoomHandoffRailProps): React.JSX.Element {
  const isStop = decision === "STOP";

  return (
    <div style={{
      background: "rgba(2,4,16,0.9)",
      borderTop: "2px solid rgba(40,60,140,0.5)",
      borderBottom: "2px solid rgba(40,60,140,0.5)",
      flexShrink: 0,
    }}>
      {/* Section label */}
      <div style={{
        padding: "5px 14px 3px",
        fontFamily: MONO, fontSize: 8, letterSpacing: 2,
        color: "rgba(126,184,255,0.5)", textTransform: "uppercase",
      }}>
        {lang === "ja" ? "引き渡しフロー · HANDOFF FLOW" : "HANDOFF FLOW"}
      </div>

      {/* Steps row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 0,
        padding: "4px 14px 10px",
        overflowX: "auto",
      }}>
        {STEPS.map((step, i) => {
          const color = stepColor(step.status, isStop);
          const isDone = !isStop && step.status === "done";

          return (
            <React.Fragment key={step.num}>
              {/* Step card */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "8px 14px",
                background: `${color}18`,
                border: `2px solid ${color}55`,
                borderRadius: 6,
                minWidth: 84,
                flex: "0 0 auto",
                position: "relative",
                boxShadow: `0 0 8px ${color}18`,
              }}>
                {/* Done badge */}
                {isDone && (
                  <div style={{
                    position: "absolute", top: -7, right: -7,
                    width: 15, height: 15, borderRadius: "50%",
                    background: "#3fb950",
                    border: "2px solid #01020a",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 7.5, color: "#01020a", fontWeight: 800,
                  }} aria-hidden>✓</div>
                )}

                {/* Number circle */}
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  border: `2px solid ${color}`,
                  background: `${color}28`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: MONO, fontSize: 12, fontWeight: 800, color,
                  boxShadow: `0 0 6px ${color}40`,
                }}>
                  {step.num}
                </div>

                {/* Icon */}
                <span style={{ fontSize: 14 }} aria-hidden>{step.icon}</span>

                {/* Label */}
                <span style={{
                  fontFamily: SANS, fontSize: 9,
                  color: color,
                  letterSpacing: 0.3,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                }}>
                  {lang === "ja" ? step.ja : step.en}
                </span>
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div style={{ display: "flex", alignItems: "center", flexShrink: 0, padding: "0 3px" }} aria-hidden>
                  <div style={{ width: 18, height: 1.5, background: `${stepColor(STEPS[i].status, isStop)}66` }} />
                  <div style={{
                    width: 0, height: 0,
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderLeft: `7px solid ${stepColor(STEPS[i+1].status, isStop)}66`,
                  }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
