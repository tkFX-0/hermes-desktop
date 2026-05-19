/**
 * PixelRoomGatePanel — compact gate HOLD/GO status panel.
 * Reference: ３D部屋イメージ.png (bottom-right gate list)
 * Display-only. No buttons.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

const GATES = [
  { id: "git-push",       label: "Git Push",       status: "HOLD" },
  { id: "runtime",        label: "runtime Start",  status: "HOLD" },
  { id: "command-chat",   label: "Command Chat",   status: "HOLD" },
  { id: "hermes-bridge",  label: "Hermes Bridge",  status: "HOLD" },
  { id: "x-search",       label: "x_search Read",  status: "HOLD" },
  { id: "obsidian",       label: "Obsidian Write", status: "HOLD" },
  { id: "prod-ready",     label: "productionReady",status: "false" },
  { id: "execution",      label: "execution",      status: "disabled" },
] as const;

function gateColor(status: string): string {
  if (status === "HOLD") return "#f0883e";
  if (status === "GO") return "#3fb950";
  return "#f85149";
}

export function PixelRoomGatePanel(): React.JSX.Element {
  return (
    <div style={{
      background: "rgba(4,8,20,0.85)",
      border: "1px solid rgba(40,60,140,0.5)",
      borderRadius: 6,
      padding: "8px 10px",
      minWidth: 160,
      flex: "0 0 auto",
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 8, color: "#7eb8ff",
        letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6,
      }}>
        Gate Status
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {GATES.map((g) => {
          const color = gateColor(g.status);
          return (
            <div key={g.id} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: 8,
            }}>
              <span style={{ fontFamily: MONO, fontSize: 8, color: "#8899cc", whiteSpace: "nowrap" }}>
                {g.label}
              </span>
              <span style={{
                fontFamily: MONO, fontSize: 7, fontWeight: 700,
                color, border: `1px solid ${color}55`,
                borderRadius: 2, padding: "0px 4px", whiteSpace: "nowrap",
              }}>
                {g.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
