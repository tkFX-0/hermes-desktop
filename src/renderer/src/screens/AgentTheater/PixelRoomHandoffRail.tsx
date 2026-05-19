/**
 * PixelRoomHandoffRail — horizontal 5-step handoff workflow lane.
 * For the 2.5D pixel room stage.
 * Display-only. No clickable actions.
 */

import React from "react";

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

const STEPS = [
  { num: 1, ja: "ユーザー依頼", en: "Request",     icon: "👤", status: "done"    },
  { num: 2, ja: "計画する",     en: "Plan",         icon: "🗺", status: "done"    },
  { num: 3, ja: "安全チェック", en: "Safety",       icon: "🛡", status: "hold"    },
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
      display: "flex", alignItems: "center", gap: 0,
      padding: "8px 14px",
      background: "rgba(3,6,16,0.82)",
      borderTop: "1px solid rgba(40,60,140,0.4)",
      borderBottom: "1px solid rgba(40,60,140,0.4)",
      overflowX: "auto", flexShrink: 0,
    }}>
      {STEPS.map((step, i) => {
        const color = stepColor(step.status, isStop);
        const isDone = !isStop && step.status === "done";
        return (
          <React.Fragment key={step.num}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "5px 10px",
              background: `${color}14`,
              border: `1.5px solid ${color}44`,
              borderRadius: 4,
              minWidth: 72, flex: "0 0 auto",
              position: "relative",
            }}>
              {isDone && (
                <div style={{
                  position: "absolute", top: -6, right: -6,
                  width: 13, height: 13, borderRadius: "50%",
                  background: "#3fb950", border: "1.5px solid #030a10",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 6.5, color: "#030a10", fontWeight: 700,
                }} aria-hidden>✓</div>
              )}
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                border: `1.5px solid ${color}`,
                background: `${color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: MONO, fontSize: 9, fontWeight: 700, color,
              }}>{step.num}</div>
              <span style={{ fontSize: 10 }} aria-hidden>{step.icon}</span>
              <span style={{ fontFamily: MONO, fontSize: 7.5, color, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
                {lang === "ja" ? step.ja : step.en}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ display: "flex", alignItems: "center", flexShrink: 0, padding: "0 2px" }} aria-hidden>
                <div style={{ width: 14, height: 1, background: `${color}66` }} />
                <div style={{ width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: `5px solid ${stepColor(STEPS[i+1].status, isStop)}66` }} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
