/**
 * Room3DHUD — safety HUD overlay rendered via drei <Html>.
 * Positioned in 3D space but always readable (billboard).
 * execution:disabled / productionReady:false always visible.
 * PXR-05D.
 */

import { Html } from "@react-three/drei";

interface Room3DHUDProps {
  readonly decision?: string;
}

const HUD_BADGES = [
  { key: "execution",       value: "disabled",     color: "#f85149" },
  { key: "productionReady", value: "false",         color: "#f85149" },
  { key: "Gate",            value: "HOLD",          color: "#d29922" },
  { key: "ext.write",       value: "blocked",       color: "#f85149" },
  { key: "Level 5",         value: "human GO req.", color: "#6e7681" },
] as const;

function decisionColor(d: string): string {
  if (d === "STOP") return "#f85149";
  if (d === "PASS" || d === "PASS_WITH_CAVEAT") return "#3fb950";
  if (d === "GO_READY") return "#58a6ff";
  return "#d29922";
}

export function Room3DHUD({ decision = "HOLD" }: Room3DHUDProps): React.JSX.Element {
  const decColor = decisionColor(decision);

  return (
    <Html
      position={[0, -4.5, 0.1]}
      center
      distanceFactor={12}
      style={{ pointerEvents: "none", width: 420 }}
    >
      <div
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          background: "rgba(8,10,18,0.94)",
          border: "1px solid rgba(248,81,73,0.45)",
          borderRadius: 4,
          padding: "5px 10px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 8, color: "#6e7681", letterSpacing: 1 }}>SAFETY</span>
        <span style={{ fontSize: 8, color: decColor, border: `1px solid ${decColor}40`, borderRadius: 2, padding: "1px 5px" }}>
          decision: {decision}
        </span>
        {HUD_BADGES.map((b) => (
          <span
            key={b.key}
            style={{
              fontSize: 8,
              color: b.color,
              border: `1px solid ${b.color}40`,
              borderRadius: 2,
              padding: "1px 5px",
              whiteSpace: "nowrap",
            }}
          >
            {b.key}: {b.value}
          </span>
        ))}
      </div>
    </Html>
  );
}
