/**
 * RoomHUD — Safety status strip always visible at the bottom of the pixel room.
 * Displays execution/productionReady/Gate/Level invariants.
 * Display-only. No action buttons.
 * PXR-01 (static values; PXR-03 will wire live state).
 */

interface RoomHUDProps {
  readonly decision?: string;
  readonly lang?: "ja" | "en";
}

const HUD_BADGES = [
  { key: "execution",       value: "disabled",     cls: "danger" },
  { key: "productionReady", value: "false",         cls: "danger" },
  { key: "Gate",            value: "HOLD",          cls: "warn"   },
  { key: "ext.write",       value: "blocked",       cls: "danger" },
  { key: "Level 5",         value: "human GO req.", cls: "neutral" },
] as const;

export function RoomHUD({ decision = "HOLD", lang: _lang = "ja" }: RoomHUDProps): React.JSX.Element {
  const decColor = decision === "STOP" ? "#f85149"
    : (decision === "PASS" || decision === "PASS_WITH_CAVEAT") ? "#3fb950"
    : decision === "GO_READY" ? "#58a6ff"
    : "#f0883e";

  return (
    <div className="pxr-hud" role="status" aria-label="Safety invariants HUD">
      <span className="pxr-hud-label">SAFETY</span>

      {/* Decision badge (dynamic) */}
      <span
        className="pxr-hud-badge"
        style={{
          color: decColor,
          border: `1px solid ${decColor}40`,
          fontFamily: "inherit",
        }}
      >
        decision: {decision}
      </span>

      {/* Static invariant badges */}
      {HUD_BADGES.map((b) => (
        <span key={b.key} className={`pxr-hud-badge ${b.cls}`}>
          {b.key}: {b.value}
        </span>
      ))}
    </div>
  );
}
