import type { MobileConsoleSnapshot } from "../../../../shared/mobile-console";
import MobileSafetyBanner from "./MobileSafetyBanner";
import MobileKomashikiCard from "./MobileKomashikiCard";

const card: React.CSSProperties = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 14, marginBottom: 12 };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#58a6ff", marginBottom: 12 };
const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 };
const muted: React.CSSProperties = { color: "#8b949e" };
const chip = (color: string): React.CSSProperties => ({
  background: `${color}18`, border: `1px solid ${color}55`, borderRadius: 4,
  padding: "2px 8px", color, fontSize: 12, fontWeight: 600,
});

interface Props { snapshot: MobileConsoleSnapshot }

export default function MobileStatusCard({ snapshot }: Props): React.JSX.Element {
  return (
    <div>
      <MobileSafetyBanner />
      <MobileKomashikiCard state={snapshot.komashikiState} caveats={snapshot.caveats} />
      <div style={card}>
        <div style={heading}>しきしま 状態</div>
        <div style={row}><span style={muted}>appStatus</span><span style={chip("#3fb950")}>{snapshot.appStatus}</span></div>
        <div style={row}><span style={muted}>phase</span><span style={{ color: "#d29922", fontSize: 12, fontFamily: "ui-monospace, monospace" }}>{snapshot.phase}</span></div>
        <div style={row}><span style={muted}>blockers</span><span style={{ color: "#f85149", fontWeight: 600 }}>{snapshot.agentTeam.blockerCount}</span></div>
        <div style={row}><span style={muted}>warnings</span><span style={{ color: "#d29922", fontWeight: 600 }}>{snapshot.agentTeam.warningCount}</span></div>
        <div style={{ ...row, marginBottom: 0 }}><span style={muted}>productionReady</span><span style={chip("#f85149")}>{String(snapshot.productionReady)}</span></div>
      </div>
      {snapshot.nextHumanAction && (
        <div style={{ ...card, background: "#0d1117", border: "1px solid #388bfd" }}>
          <div style={{ ...muted, fontSize: 11, marginBottom: 6 }}>次の必要アクション（人間）</div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: "#c9d1d9" }}>{snapshot.nextHumanAction}</div>
        </div>
      )}
      {snapshot.phaseProgress && (
        <div style={{ ...card, background: "#0d1117", border: "1px solid #30363d" }}>
          <div style={{ ...muted, fontSize: 11, marginBottom: 4 }}>フェーズ進捗</div>
          <div style={{ fontSize: 13, color: "#3fb950", fontWeight: 600 }}>{snapshot.phaseProgress}</div>
          {snapshot.currentSession && <div style={{ fontSize: 11, color: "#8b949e", marginTop: 2 }}>{snapshot.currentSession}</div>}
        </div>
      )}
      <div style={{ ...muted, fontSize: 11, textAlign: "center", padding: "8px 0" }}>
        dataSource: {snapshot.dataSource}
      </div>
    </div>
  );
}
