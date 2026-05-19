/**
 * PixelRoomDesk — CSS 3-face pseudo-3D desk for the pixel room stage.
 * Top face + front face + accent glow strip.
 * Positioned absolutely within the stage.
 */

export type DeskKind = "command" | "gate" | "plan" | "dev" | "record";

const DESK_ACCENT: Record<DeskKind, string> = {
  command: "#58a6ff",
  gate:    "#f85149",
  plan:    "#3fb950",
  dev:     "#f0883e",
  record:  "#b07fff",
};

const DESK_COLORS: Record<DeskKind, { top: string; front: string }> = {
  command: { top: "#1a2545", front: "#0d1530" },
  gate:    { top: "#2a1010", front: "#180808" },
  plan:    { top: "#0e2018", front: "#080e0c" },
  dev:     { top: "#1e1608", front: "#0e0c04" },
  record:  { top: "#180e2a", front: "#0c0616" },
};

export interface PixelRoomDeskProps {
  readonly kind: DeskKind;
  readonly x: number;      // left in px
  readonly y: number;      // top in px
  readonly width: number;  // px
  readonly zIndex: number;
}

export function PixelRoomDesk({ kind, x, y, width, zIndex }: PixelRoomDeskProps): React.JSX.Element {
  const accent = DESK_ACCENT[kind];
  const colors = DESK_COLORS[kind];
  const topH   = Math.round(width * 0.1);  // top face height
  const frontH = Math.round(width * 0.22); // front face height

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        zIndex,
      }}
    >
      {/* Top face */}
      <div style={{
        width: "100%",
        height: topH,
        background: colors.top,
        border: `1px solid ${accent}55`,
        borderBottom: "none",
        borderRadius: "3px 3px 0 0",
        boxShadow: `0 0 8px ${accent}22`,
      }} />

      {/* Accent glow strip */}
      <div style={{
        width: "80%",
        height: 2,
        margin: "0 auto",
        background: accent,
        boxShadow: `0 0 6px ${accent}`,
        opacity: 0.6,
      }} />

      {/* Front face */}
      <div style={{
        width: "100%",
        height: frontH,
        background: colors.front,
        border: `1px solid ${accent}33`,
        borderTop: "none",
        borderRadius: "0 0 2px 2px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Front panel lines */}
        <div style={{
          position: "absolute",
          top: "30%", left: "8%", right: "8%",
          height: 1,
          background: `${accent}22`,
        }} />
        <div style={{
          position: "absolute",
          top: "65%", left: "8%", right: "8%",
          height: 1,
          background: `${accent}18`,
        }} />
      </div>

      {/* Desk legs */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 6px" }}>
        {[0, 1].map((i) => (
          <div key={i} style={{
            width: 4,
            height: 8,
            background: "#040810",
            border: `1px solid ${accent}22`,
          }} />
        ))}
      </div>

      {/* Drop shadow for depth */}
      <div style={{
        width: "90%",
        height: 6,
        margin: "0 auto",
        background: "transparent",
        boxShadow: `0 4px 12px rgba(0,0,0,0.7)`,
        borderRadius: "50%",
      }} />
    </div>
  );
}
