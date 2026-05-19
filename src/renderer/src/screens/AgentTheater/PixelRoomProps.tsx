/**
 * PixelRoomProps — CSS-only room decorations.
 * Monitors, shelves, lamps, safety gate, log board.
 * All absolutely positioned within the stage.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

/* ── Dual monitor (しきしま's command station) ── */
export function CommandMonitor({ x, y, zIndex, decision }: { x: number; y: number; zIndex: number; decision: string }): React.JSX.Element {
  const isHold = decision !== "GO_READY" && decision !== "PASS";
  return (
    <div aria-hidden style={{
      position: "absolute", left: x, top: y, zIndex,
      display: "flex", gap: 4, transform: "translateX(-50%)",
    }}>
      {/* Main monitor */}
      <div style={{
        width: 72, height: 46,
        border: "2px solid rgba(88,166,255,0.4)",
        borderRadius: 3, background: "#030a18",
        boxShadow: "0 0 10px rgba(88,166,255,0.12)",
        overflow: "hidden",
      }}>
        {/* Title bar */}
        <div style={{ background: "rgba(88,166,255,0.1)", padding: "2px 4px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: MONO, fontSize: 5, color: "#7eb8ff" }}>本日のレーン状況</span>
          <div style={{ display: "flex", gap: 1 }}>
            {["#f85149","#f0883e","#3fb950"].map((c,i)=>(<div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: c, opacity: 0.7 }}/>))}
          </div>
        </div>
        {/* Bars */}
        {[{ l: "SAFE", p: 100, c: "#3fb950" }, { l: "DEV", p: isHold?0:60, c: "#7eb8ff" }, { l: "PLAN", p: 80, c: "#f0883e" }].map(b=>(
          <div key={b.l} style={{ display: "flex", alignItems: "center", gap: 2, padding: "2px 4px" }}>
            <span style={{ fontFamily: MONO, fontSize: 4.5, color: "#6680aa", width: 22 }}>{b.l}</span>
            <div style={{ flex: 1, height: 4, background: "rgba(40,60,140,0.3)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${b.p}%`, height: "100%", background: b.c, borderRadius: 2 }} />
            </div>
          </div>
        ))}
        {/* Status dot */}
        <div style={{ textAlign: "center", paddingTop: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 4, color: isHold ? "#f85149" : "#3fb950" }}>
            {isHold ? "● HOLD" : "● ACTIVE"}
          </span>
        </div>
      </div>
      {/* Small side monitor */}
      <div style={{
        width: 46, height: 36,
        border: "1.5px solid rgba(88,166,255,0.25)",
        borderRadius: 2, background: "#020812",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
      }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{ width: "70%", height: 3, background: `rgba(88,166,255,${0.15+i*0.1})`, borderRadius: 1 }} />
        ))}
      </div>
    </div>
  );
}

/* ── Safety HOLD gate (しずめ's station) ── */
export function SafetyGate({ x, y, zIndex }: { x: number; y: number; zIndex: number }): React.JSX.Element {
  return (
    <div aria-hidden style={{ position: "absolute", left: x, top: y, zIndex, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      {/* HOLD sign on pole */}
      <div style={{ background: "#f85149", border: "1.5px solid #991b1b", borderRadius: 3, padding: "2px 8px", fontFamily: MONO, fontSize: 8, fontWeight: 800, color: "#fff", letterSpacing: 0.5, boxShadow: "0 0 8px rgba(248,81,73,0.7)" }}
        className="pxr-blink">HOLD</div>
      <div style={{ width: 2.5, height: 14, background: "#7c3f00" }} />
      {/* Gate barrier */}
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        <div style={{ width: 6, height: 16, background: "#f0883e", borderRadius: 1, border: "1px solid #92400e" }} />
        <div style={{ width: 30, height: 5, background: "repeating-linear-gradient(90deg, #f85149 0px, #f85149 6px, #1a0404 6px, #1a0404 12px)", borderRadius: 1 }} />
        <div style={{ width: 6, height: 16, background: "#f0883e", borderRadius: 1, border: "1px solid #92400e" }} />
      </div>
      {/* Cones */}
      <div style={{ display: "flex", gap: 8 }}>
        {[0,1].map(i=>(
          <div key={i} style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "12px solid #f0883e", opacity: 0.8 }} />
        ))}
      </div>
    </div>
  );
}

/* ── Planning board (はじめ's station) ── */
export function PlanBoard({ x, y, zIndex }: { x: number; y: number; zIndex: number }): React.JSX.Element {
  return (
    <div aria-hidden style={{ position: "absolute", left: x, top: y, zIndex, transform: "translateX(-50%)" }}>
      <div style={{
        width: 54, height: 38, border: "1.5px solid rgba(63,185,80,0.4)",
        borderRadius: 3, background: "#040f08", position: "relative", overflow: "hidden",
      }}>
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(63,185,80,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(63,185,80,0.06) 1px,transparent 1px)", backgroundSize: "9px 9px" }} />
        {/* Route */}
        <svg style={{ position: "absolute", inset: 0 }} width="54" height="38">
          <polyline points="6,32 14,20 24,26 36,14 48,20" stroke="#3fb950" strokeWidth="1" fill="none" strokeDasharray="2 1.5" opacity="0.7" />
          {[[6,32],[14,20],[24,26],[36,14],[48,20]].map(([cx,cy],i)=>(
            <circle key={i} cx={cx} cy={cy} r="2" fill={i===0?"#f0883e":"#3fb950"} opacity="0.85" />
          ))}
        </svg>
        {/* Sticky notes */}
        {[[4,3,"#f0883e"],[36,4,"#7eb8ff"],[22,20,"#3fb950"]].map(([nx,ny,nc],i)=>(
          <div key={i} style={{ position: "absolute", left: nx as number, top: ny as number, width: 9, height: 9, background: nc as string, opacity: 0.65, borderRadius: 1 }} />
        ))}
      </div>
    </div>
  );
}

/* ── Tool box (つむぐ's station) ── */
export function ToolBox({ x, y, zIndex }: { x: number; y: number; zIndex: number }): React.JSX.Element {
  return (
    <div aria-hidden style={{ position: "absolute", left: x, top: y, zIndex, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      {/* Keyboard */}
      <div style={{
        width: 52, height: 11, border: "1.5px solid rgba(240,136,62,0.4)", borderRadius: 2,
        background: "#0e0800",
        backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, transparent 5px, rgba(240,136,62,0.12) 5px, rgba(240,136,62,0.12) 6px)",
      }} />
      {/* Toolbox */}
      <div style={{ width: 36, height: 20, border: "1.5px solid rgba(240,136,62,0.4)", borderRadius: 2, background: "#1a0c00", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
        <div style={{ width: "80%", height: 2, background: "rgba(240,136,62,0.3)" }} />
        <div style={{ fontFamily: MONO, fontSize: 6, color: "#f0883e", opacity: 0.7 }}>TOOLS</div>
      </div>
    </div>
  );
}

/* ── Book shelf (しるべ's station) ── */
export function BookShelf({ x, y, zIndex }: { x: number; y: number; zIndex: number }): React.JSX.Element {
  const books = ["#b07fff","#3fb950","#f0883e","#7eb8ff","#f85149","#b07fff","#3fb950"];
  return (
    <div aria-hidden style={{ position: "absolute", left: x, top: y, zIndex, transform: "translateX(-50%)" }}>
      {/* Shelf frame */}
      <div style={{ width: 60, border: "1.5px solid rgba(176,127,255,0.4)", borderRadius: 3, background: "#0a0616", overflow: "hidden", padding: 3 }}>
        {/* Top shelf */}
        <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", marginBottom: 3 }}>
          {books.slice(0,4).map((c,i)=>(
            <div key={i} style={{ width: 7, height: 12+i*2, background: c, borderRadius: "1px 1px 0 0", opacity: 0.85 }} />
          ))}
          <div style={{ flex: 1 }} />
          {/* Log icon */}
          <div style={{ width: 10, height: 14, border: "1px solid rgba(176,127,255,0.5)", borderRadius: 1, background: "#120820", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: MONO, fontSize: 5, color: "#b07fff" }}>LOG</span>
          </div>
        </div>
        {/* Shelf divider */}
        <div style={{ height: 1.5, background: "rgba(176,127,255,0.3)", marginBottom: 3 }} />
        {/* Bottom shelf */}
        <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
          {books.slice(3).map((c,i)=>(
            <div key={i} style={{ width: 6, height: 9+i, background: c, borderRadius: "1px 1px 0 0", opacity: 0.75 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Desk lamp ── */
export function DeskLamp({ x, y, zIndex, color = "#f0883e" }: { x: number; y: number; zIndex: number; color?: string }): React.JSX.Element {
  return (
    <div aria-hidden style={{ position: "absolute", left: x, top: y, zIndex, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Shade */}
      <div style={{ width: 12, height: 5, background: color, borderRadius: "2px 2px 5px 5px", opacity: 0.8, boxShadow: `0 0 8px ${color}` }} />
      {/* Pole */}
      <div style={{ width: 1.5, height: 8, background: "#444" }} />
      {/* Base */}
      <div style={{ width: 8, height: 2, background: "#333", borderRadius: 1 }} />
    </div>
  );
}
