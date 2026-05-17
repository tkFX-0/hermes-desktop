import type { MobileConsoleSnapshot } from "../../../../shared/mobile-console";

const card: React.CSSProperties = {
  background: "#161b22",
  border: "1px solid #30363d",
  borderRadius: 8,
  padding: 14,
  marginBottom: 12,
};
const heading: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: "#a371f7",
  marginBottom: 12,
};
const muted: React.CSSProperties = { color: "#8b949e", fontSize: 12 };
const tag = (color: string): React.CSSProperties => ({
  display: "inline-block",
  background: `${color}18`,
  border: `1px solid ${color}55`,
  borderRadius: 4,
  padding: "1px 7px",
  color,
  fontSize: 11,
  fontWeight: 600,
});

interface Props {
  snapshot: MobileConsoleSnapshot;
}

export default function MobileB3Progress({ snapshot }: Props): React.JSX.Element {
  const { b3Progress } = snapshot;
  const pct = Math.round((b3Progress.current / b3Progress.required) * 100);
  const RESULT_COLORS: Record<string, string> = {
    CLEAN_B3_PASS: "#3fb950",
    PASS_WITH_TIMING_CAVEAT: "#d29922",
    STOP: "#f85149",
    pending: "#8b949e",
  };

  return (
    <div>
      <div style={card}>
        <div style={heading}>B3 Session Progress</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#c9d1d9" }}>CLEAN PASS</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#3fb950" }}>
              {b3Progress.current} / {b3Progress.required}
            </span>
          </div>
          <div style={{ height: 10, background: "#0d1117", borderRadius: 5, overflow: "hidden", border: "1px solid #30363d" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "#3fb950", borderRadius: 5 }} />
          </div>
        </div>
        <div style={{ background: "#0d1117", border: "1px solid #a371f7", borderRadius: 6, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ ...muted, marginBottom: 4 }}>Next session</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e6edf3" }}>{b3Progress.nextSession}</div>
          <div style={{ ...muted, marginTop: 4 }}>Confirmation method: iPhone Private Console real status observation</div>
          <div style={{ ...muted, marginTop: 2 }}>Timing rule: {b3Progress.timingRule}</div>
        </div>
        {b3Progress.rustDeskDeprecated && (
          <div style={{ background: "rgba(248,81,73,0.07)", border: "1px solid rgba(248,81,73,0.3)", borderRadius: 6, padding: "8px 12px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#f85149" }}>Legacy PC/RustDesk observation route: deprecated</div>
            <div style={{ fontSize: 11, color: "#8b949e", marginTop: 2 }}>Use iPhone Private Console Phase 2C or later review paths.</div>
          </div>
        )}
        <div style={{ ...muted, marginBottom: 6 }}>Recent sessions</div>
        {b3Progress.recentSessions.map((s) => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#8b949e" }}>
              {s.date} {s.id}
            </span>
            <span style={tag(RESULT_COLORS[s.result] ?? "#8b949e")}>{s.result}</span>
          </div>
        ))}
      </div>
      <div style={{ ...card, background: "#0d1117" }}>
        <div style={{ fontSize: 12, color: "#8b949e" }}>
          Level 3: {snapshot.level3} - human GO is still required after B3 5/5.
        </div>
      </div>
    </div>
  );
}
