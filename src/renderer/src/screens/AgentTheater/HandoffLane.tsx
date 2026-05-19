/**
 * HandoffLane — static display of the 6-step task handoff flow.
 * Display-only. No execute/push/send labels. Human GO is the final gate.
 * Design spec: AT_07_CONTROL_ROOM_ENVIRONMENT_LAYOUT_EVIDENCE.md
 */

const STEPS = [
  { step: 1, ja: "依頼",    en: "Request",  color: "#3b82f6" },
  { step: 2, ja: "計画",    en: "Plan",     color: "#22c55e" },
  { step: 3, ja: "安全確認", en: "Safety",  color: "#f59e0b" },
  { step: 4, ja: "作業準備", en: "Prepare", color: "#f97316" },
  { step: 5, ja: "記録",    en: "Record",   color: "#a855f7" },
  { step: 6, ja: "GO待ち",  en: "Await GO", color: "#f0883e" },
] as const;

function deriveActiveStep(decision: string): number {
  switch (decision) {
    case "STOP":             return 3;  // blocked at safety
    case "PASS":
    case "PASS_WITH_CAVEAT": return 5;  // recording
    case "GO_READY":         return 6;  // awaiting human GO
    default:                 return 6;  // HOLD → await GO
  }
}

interface HandoffLaneProps {
  readonly decision: string;
  readonly lang?: "ja" | "en";
}

export function HandoffLane({ decision, lang = "ja" }: HandoffLaneProps) {
  const activeStep = deriveActiveStep(decision);

  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 4,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        rowGap: 8,
        columnGap: 0,
      }}
    >
      {STEPS.map((s, i) => {
        const isActive = s.step === activeStep;
        const isDone = s.step < activeStep && decision !== "STOP";
        const isBlocked = decision === "STOP" && s.step >= activeStep;

        return (
          <div key={s.step} style={{ display: "flex", alignItems: "center" }}>
            {/* Step */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: isBlocked ? "#f85149" : isActive ? s.color : isDone ? "#21262d" : "#0d1117",
                  border: `1.5px solid ${isBlocked ? "#f85149" : isActive || isDone ? s.color : "#334155"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 9,
                  fontWeight: 700,
                  color: isActive && !isBlocked ? "#0d1117" : isBlocked ? "#0d1117" : isDone ? s.color : "#6e7681",
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
              <span
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 8,
                  color: isBlocked ? "#f85149" : isActive ? s.color : isDone ? "#8b949e" : "#6e7681",
                  fontWeight: isActive ? 700 : 400,
                  whiteSpace: "nowrap" as const,
                }}
              >
                {lang === "ja" ? s.ja : s.en}
              </span>
            </div>

            {/* Arrow */}
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 18,
                  height: 1,
                  background: isDone && !isBlocked ? "#334155" : "#1c2333",
                  margin: "0 3px",
                  marginBottom: 16,
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
          fontSize: 8,
          color: "#f0883e",
          border: "1px solid #f0883e",
          borderRadius: 2,
          padding: "2px 6px",
          whiteSpace: "nowrap" as const,
          alignSelf: "flex-start",
          marginTop: 1,
          flexShrink: 0,
        }}
      >
        {lang === "ja" ? "人間GO必要" : "HUMAN GO REQUIRED"}
      </div>
    </div>
  );
}
