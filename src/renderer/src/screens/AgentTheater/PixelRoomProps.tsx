/**
 * PixelRoomProps — CSS-only room decorations, PXR-05B enhanced.
 * CommandMonitor, SafetyGate, PlanBoard, ToolBox, BookShelf, DeskLamp.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

/* ── Dual command monitor (しきしま) ── */
export function CommandMonitor({ x, y, zIndex, decision }: { x: number; y: number; zIndex: number; decision: string }): React.JSX.Element {
  const isHold = decision !== "GO_READY" && decision !== "PASS";
  return (
    <div aria-hidden style={{
      position: "absolute", left: x, top: y, zIndex,
      display: "flex", gap: 5,
      transform: "translateX(-50%)",
    }}>
      {/* Main monitor */}
      <div style={{
        width: 84, height: 56,
        border: "2px solid rgba(88,166,255,0.5)",
        borderRadius: 4, background: "#020b1e",
        boxShadow: "0 0 14px rgba(88,166,255,0.18), inset 0 0 6px rgba(88,166,255,0.06)",
        overflow: "hidden",
      }}>
        {/* Title bar */}
        <div style={{ background: "rgba(88,166,255,0.12)", padding: "2px 5px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: MONO, fontSize: 5.5, color: "#7eb8ff" }}>本日のレーン状況</span>
          <div style={{ display: "flex", gap: 2 }}>
            {["#f85149","#f0883e","#3fb950"].map((c,i)=>(<div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: c, opacity: 0.8 }}/>))}
          </div>
        </div>
        {/* Bar chart */}
        {[
          { label: "SAFETY", pct: 100, color: "#3fb950" },
          { label: "DEV",    pct: isHold ? 0 : 65, color: "#7eb8ff" },
          { label: "PLAN",   pct: 80, color: "#f0883e" },
          { label: "REC",    pct: 55, color: "#b07fff" },
        ].map(b => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 5px" }}>
            <span style={{ fontFamily: MONO, fontSize: 5, color: "#6680aa", width: 26, flexShrink: 0 }}>{b.label}</span>
            <div style={{ flex: 1, height: 5, background: "rgba(40,60,140,0.35)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${b.pct}%`, height: "100%", background: b.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
        {/* Status */}
        <div style={{ textAlign: "center", padding: "2px 0" }}>
          <span style={{ fontFamily: MONO, fontSize: 5, color: isHold ? "#f85149" : "#3fb950" }}>
            {isHold ? "● HOLD MODE" : "● ACTIVE"}
          </span>
        </div>
      </div>

      {/* Side monitor */}
      <div style={{
        width: 52, height: 44,
        border: "1.5px solid rgba(88,166,255,0.3)",
        borderRadius: 3, background: "#010810",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "space-evenly", padding: 5,
      }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{
            width: "85%", height: 5,
            background: `rgba(88,166,255,${0.15+i*0.1})`,
            borderRadius: 2,
          }} />
        ))}
        <span style={{ fontFamily: MONO, fontSize: 5, color: "#7eb8ff88" }}>SUB</span>
      </div>
    </div>
  );
}

/* ── Safety HOLD gate (しずめ) ── */
export function SafetyGate({ x, y, zIndex }: { x: number; y: number; zIndex: number }): React.JSX.Element {
  return (
    <div aria-hidden style={{
      position: "absolute", left: x, top: y, zIndex,
      transform: "translateX(-50%)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
    }}>
      {/* HOLD sign */}
      <div style={{
        background: "#f85149",
        border: "2px solid #991b1b",
        borderRadius: 4,
        padding: "3px 10px",
        fontFamily: MONO, fontSize: 10, fontWeight: 800,
        color: "#fff", letterSpacing: 1,
        boxShadow: "0 0 12px rgba(248,81,73,0.8), 0 0 24px rgba(248,81,73,0.3)",
      }} className="pxr-blink">HOLD</div>
      {/* Pole */}
      <div style={{ width: 3, height: 16, background: "#7c3f00" }} />
      {/* Gate barrier */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <div style={{ width: 8, height: 22, background: "#f0883e", borderRadius: 2, border: "1.5px solid #92400e" }} />
        <div style={{
          width: 40, height: 7,
          background: "repeating-linear-gradient(90deg, #f85149 0px, #f85149 7px, #1a0404 7px, #1a0404 14px)",
          borderRadius: 2,
          boxShadow: "0 0 6px rgba(248,81,73,0.4)",
        }} />
        <div style={{ width: 8, height: 22, background: "#f0883e", borderRadius: 2, border: "1.5px solid #92400e" }} />
      </div>
      {/* Warning light */}
      <div className="pxr-blink" style={{
        width: 10, height: 10, borderRadius: "50%",
        background: "#f85149",
        boxShadow: "0 0 10px rgba(248,81,73,0.9), 0 0 20px rgba(248,81,73,0.4)",
      }} />
      {/* Cones */}
      <div style={{ display: "flex", gap: 10, marginTop: -2 }}>
        {[0,1].map(i=>(
          <div key={i} style={{
            width: 0, height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderBottom: "14px solid #f0883e",
            opacity: 0.85,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── Planning board (むすび) ── */
export function PlanBoard({ x, y, zIndex }: { x: number; y: number; zIndex: number }): React.JSX.Element {
  return (
    <div aria-hidden style={{ position: "absolute", left: x, top: y, zIndex, transform: "translateX(-50%)" }}>
      <div style={{
        width: 62, height: 46,
        border: "1.5px solid rgba(63,185,80,0.45)",
        borderRadius: 4,
        background: "#030c05",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 8px rgba(63,185,80,0.1)",
      }}>
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(63,185,80,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(63,185,80,0.07) 1px,transparent 1px)",
          backgroundSize: "10px 10px",
        }} />
        {/* Route SVG */}
        <svg style={{ position: "absolute", inset: 0 }} width="62" height="46">
          <polyline points="6,40 16,28 28,34 40,18 54,26" stroke="#3fb950" strokeWidth="1.2" fill="none" strokeDasharray="2.5 2" opacity="0.7" />
          {[[6,40],[16,28],[28,34],[40,18],[54,26]].map(([cx,cy],i)=>(
            <circle key={i} cx={cx} cy={cy} r="2.5" fill={i===0?"#f0883e":i===4?"#7eb8ff":"#3fb950"} opacity="0.85" />
          ))}
        </svg>
        {/* Sticky notes */}
        {[[4,3,"#f0883e"],[42,5,"#7eb8ff"],[26,22,"#3fb950","✓"]].map(([nx,ny,nc,txt],i)=>(
          <div key={i} style={{
            position: "absolute", left: nx as number, top: ny as number,
            width: 11, height: 11,
            background: nc as string, opacity: 0.7, borderRadius: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {txt && <span style={{ fontSize: 7, color: "#fff", fontWeight: 800 }}>{txt}</span>}
          </div>
        ))}
        {/* Label */}
        <span style={{
          position: "absolute", bottom: 3, right: 4,
          fontFamily: MONO, fontSize: 6, color: "#3fb95088",
        }}>PLAN</span>
      </div>
    </div>
  );
}

/* ── Tool box (つむぐ) ── */
export function ToolBox({ x, y, zIndex }: { x: number; y: number; zIndex: number }): React.JSX.Element {
  return (
    <div aria-hidden style={{
      position: "absolute", left: x, top: y, zIndex,
      transform: "translateX(-50%)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    }}>
      {/* Keyboard */}
      <div style={{
        width: 58, height: 13,
        border: "1.5px solid rgba(240,136,62,0.45)",
        borderRadius: 3, background: "#0e0800",
        backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, transparent 5px, rgba(240,136,62,0.15) 5px, rgba(240,136,62,0.15) 6px)",
        boxShadow: "0 0 6px rgba(240,136,62,0.15)",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: "30%", left: "6%", right: "6%", height: 1, background: "rgba(240,136,62,0.2)" }} />
      </div>
      {/* Tool box */}
      <div style={{
        width: 44, height: 26,
        border: "1.5px solid rgba(240,136,62,0.45)",
        borderRadius: 3, background: "#1a0e00",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
        boxShadow: "0 0 6px rgba(240,136,62,0.1)",
      }}>
        {/* Handle */}
        <div style={{ width: 18, height: 4, border: "1.5px solid rgba(240,136,62,0.4)", borderRadius: 3, borderBottom: "none" }} />
        <div style={{ width: "80%", height: 1.5, background: "rgba(240,136,62,0.25)" }} />
        <div style={{ fontFamily: MONO, fontSize: 6, color: "#f0883e88" }}>TOOLS</div>
      </div>
    </div>
  );
}

/* ── Book shelf (しるべ) ── */
export function BookShelf({ x, y, zIndex }: { x: number; y: number; zIndex: number }): React.JSX.Element {
  const books = ["#b07fff","#3fb950","#f0883e","#7eb8ff","#f85149","#b07fff","#3fb950","#f0883e","#7eb8ff"];
  return (
    <div aria-hidden style={{ position: "absolute", left: x, top: y, zIndex, transform: "translateX(-50%)" }}>
      <div style={{
        width: 72,
        border: "1.5px solid rgba(176,127,255,0.45)",
        borderRadius: 4, background: "#060212",
        padding: "4px 4px 2px",
        boxShadow: "0 0 8px rgba(176,127,255,0.1)",
      }}>
        <div style={{ fontFamily: MONO, fontSize: 6, color: "#b07fff88", marginBottom: 4, letterSpacing: 0.5 }}>ARCHIVE</div>
        {/* Two shelves */}
        {[books.slice(0,5), books.slice(5)].map((shelf,si)=>(
          <div key={si} style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", marginBottom: 2 }}>
              {shelf.map((c,bi)=>(
                <div key={bi} style={{
                  width: 8, height: 12 + bi*2,
                  background: c, borderRadius: "1px 1px 0 0", opacity: 0.85,
                }} />
              ))}
              {/* Log book */}
              {si===0 && (
                <div style={{
                  width: 12, height: 18, marginLeft: 1,
                  border: "1px solid rgba(176,127,255,0.5)",
                  borderRadius: 2, background: "#100820",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: MONO, fontSize: 5, color: "#b07fff" }}>LOG</span>
                </div>
              )}
            </div>
            <div style={{ height: 1.5, background: "rgba(176,127,255,0.25)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Desk lamp ── */
export function DeskLamp({ x, y, zIndex, color = "#f0883e" }: { x: number; y: number; zIndex: number; color?: string }): React.JSX.Element {
  return (
    <div aria-hidden style={{
      position: "absolute", left: x, top: y, zIndex,
      transform: "translateX(-50%)",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      {/* Shade */}
      <div style={{
        width: 16, height: 8,
        background: color,
        borderRadius: "3px 3px 7px 7px",
        opacity: 0.85,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}66`,
      }} />
      {/* Glow */}
      <div style={{
        width: 32, height: 10, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${color}40 0%, transparent 70%)`,
        marginTop: -4,
      }} />
      {/* Pole */}
      <div style={{ width: 1.5, height: 9, background: "#555", marginTop: -2 }} />
      {/* Base */}
      <div style={{ width: 10, height: 2.5, background: "#333", borderRadius: 1 }} />
    </div>
  );
}
