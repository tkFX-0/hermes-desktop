import React from "react";

/**
 * PixelRoomHandoffRail — horizontal 5-step handoff workflow lane.
 * Reference: ３D部屋イメージ.png (bottom handoff rail)
 * Pixel box cards with arrows. Display-only. No clickable actions.
 */

interface PixelRoomHandoffRailProps {
  readonly decision?: string;
  readonly lang?: "ja" | "en";
}

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

const STEPS = [
  { num: 1, ja: "ユーザー依頼", en: "Request",      icon: "👤", status: "done"    },
  { num: 2, ja: "計画する",     en: "Plan",          icon: "🗺", status: "done"    },
  { num: 3, ja: "安全チェック", en: "Safety Check",  icon: "🛡", status: "hold"    },
  { num: 4, ja: "実装する",     en: "Implement",     icon: "⚙️", status: "waiting" },
  { num: 5, ja: "記録する",     en: "Record",        icon: "📝", status: "waiting" },
] as const;

function stepColor(status: string, isStop: boolean): string {
  if (isStop) return "#f85149";
  if (status === "done") return "#3fb950";
  if (status === "hold") return "#f0883e";
  return "#6680aa";
}

export function PixelRoomHandoffRail({ decision = "HOLD", lang = "ja" }: PixelRoomHandoffRailProps): React.JSX.Element {
  const isStop = decision === "STOP";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 0,
      padding: "8px 12px",
      background: "rgba(4,8,20,0.7)",
      borderTop: "1px solid rgba(40,60,140,0.4)",
      borderBottom: "1px solid rgba(40,60,140,0.4)",
      overflowX: "auto",
      flexShrink: 0,
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
              gap: 3,
              padding: "6px 10px",
              background: `${color}14`,
              border: `1.5px solid ${color}55`,
              borderRadius: 5,
              minWidth: 76,
              position: "relative",
              flex: "0 0 auto",
            }}>
              {/* Done checkmark */}
              {isDone && (
                <div style={{
                  position: "absolute", top: -6, right: -6,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "#3fb950", border: "1.5px solid #080d20",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 7, color: "#080d20", fontWeight: 700,
                }} aria-hidden>✓</div>
              )}
              {/* Circle number */}
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                border: `1.5px solid ${color}`,
                background: `${color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: MONO, fontSize: 10, fontWeight: 700, color,
              }}>
                {step.num}
              </div>
              <span style={{ fontSize: 11 }} aria-hidden>{step.icon}</span>
              <span style={{
                fontFamily: MONO, fontSize: 8, color: color,
                letterSpacing: 0.3, textAlign: "center", whiteSpace: "nowrap",
              }}>
                {lang === "ja" ? step.ja : step.en}
              </span>
            </div>

            {/* Arrow */}
            {i < STEPS.length - 1 && (
              <div style={{
                display: "flex", alignItems: "center", flexShrink: 0, padding: "0 2px",
              }} aria-hidden>
                <div style={{
                  width: 16, height: 1,
                  background: `linear-gradient(90deg, ${stepColor(STEPS[i].status, isStop)}88, ${stepColor(STEPS[i+1].status, isStop)}88)`,
                }} />
                <div style={{
                  width: 0, height: 0,
                  borderTop: "4px solid transparent",
                  borderBottom: "4px solid transparent",
                  borderLeft: `5px solid ${stepColor(STEPS[i+1].status, isStop)}88`,
                }} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
