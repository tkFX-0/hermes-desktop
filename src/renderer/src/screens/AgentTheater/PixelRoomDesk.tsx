/**
 * PixelRoomDesk — CSS pseudo-3D desk with richer station identity.
 * PXR-05B: wider, taller, more visible 3D faces.
 */

export type DeskKind = "command" | "gate" | "plan" | "dev" | "record";

const DESK_ACCENT: Record<DeskKind, string> = {
  command: "#58a6ff",
  gate:    "#f85149",
  plan:    "#3fb950",
  dev:     "#f0883e",
  record:  "#b07fff",
};

const DESK_COLORS: Record<DeskKind, { top: string; front: string; side: string }> = {
  command: { top: "#1a2550", front: "#0a1230", side: "#0d1a3c" },
  gate:    { top: "#2a1010", front: "#150808", side: "#1a0c0c" },
  plan:    { top: "#0e2018", front: "#060e0c", side: "#0a180e" },
  dev:     { top: "#1e1608", front: "#0e0a04", side: "#160e04" },
  record:  { top: "#180e2a", front: "#0c0616", side: "#120820" },
};

export interface PixelRoomDeskProps {
  readonly kind: DeskKind;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly zIndex: number;
}

export function PixelRoomDesk({ kind, x, y, width, zIndex }: PixelRoomDeskProps): React.JSX.Element {
  const accent = DESK_ACCENT[kind];
  const colors = DESK_COLORS[kind];
  const topH   = Math.round(width * 0.12);
  const frontH = Math.round(width * 0.26);
  const sideW  = Math.round(width * 0.06);

  return (
    <div
      aria-hidden
      style={{ position: "absolute", left: x, top: y, width, zIndex }}
    >
      {/* Top face */}
      <div style={{
        width: "100%",
        height: topH,
        background: `linear-gradient(180deg, ${colors.top}dd 0%, ${colors.top} 100%)`,
        border: `1.5px solid ${accent}66`,
        borderBottom: "none",
        borderRadius: "4px 4px 0 0",
        boxShadow: `0 0 10px ${accent}28, inset 0 1px 0 ${accent}22`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Surface gloss */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${accent}12 0%, transparent 60%)`,
        }} />
      </div>

      {/* Accent glow strip */}
      <div style={{
        width: "75%", height: 2, margin: "0 auto",
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        boxShadow: `0 0 8px ${accent}`,
        opacity: 0.75,
      }} />

      {/* Front face with side illusion */}
      <div style={{ display: "flex" }}>
        {/* Side face (3D depth illusion) */}
        <div style={{
          width: sideW,
          height: frontH,
          background: `linear-gradient(90deg, ${colors.side} 0%, ${colors.front} 100%)`,
          border: `1px solid ${accent}28`,
          borderTop: "none",
          borderRight: "none",
        }} />

        {/* Front face */}
        <div style={{
          flex: 1,
          height: frontH,
          background: colors.front,
          border: `1.5px solid ${accent}44`,
          borderTop: "none",
          borderLeft: "none",
          borderRadius: `0 0 3px 0`,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Front panel detail lines */}
          <div style={{ position: "absolute", top: "28%", left: "6%", right: "6%", height: 1, background: `${accent}28` }} />
          <div style={{ position: "absolute", top: "62%", left: "6%", right: "6%", height: 1, background: `${accent}18` }} />
          {/* Corner badge */}
          <div style={{
            position: "absolute", top: 4, right: 5,
            fontFamily: '"IBM Plex Mono", monospace', fontSize: 5,
            color: `${accent}88`, letterSpacing: 0.3,
          }}>
            {{ command: "CMD", gate: "GATE", plan: "PLAN", dev: "DEV", record: "REC" }[kind]}
          </div>
        </div>
      </div>

      {/* Desk legs */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: `0 ${sideW + 4}px` }}>
        {[0, 1].map((i) => (
          <div key={i} style={{
            width: 5, height: 10,
            background: "#020508",
            border: `1px solid ${accent}18`,
          }} />
        ))}
      </div>

      {/* Cast shadow */}
      <div style={{
        width: "80%", height: 8, margin: "0 auto",
        borderRadius: "50%",
        background: `radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)`,
      }} />
    </div>
  );
}
