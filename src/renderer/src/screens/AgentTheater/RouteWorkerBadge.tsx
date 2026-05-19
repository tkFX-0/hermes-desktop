/**
 * RouteWorkerBadge — worker name badge with accent color.
 * Display-only. Design spec: AT_11_WORKER_ROUTING_HANDOFF_PROMPT_PANEL_EVIDENCE.md
 */

interface RouteWorkerBadgeProps {
  readonly worker: string;
  readonly accentColor: string;
  readonly humanGoRequired?: boolean;
}

export function RouteWorkerBadge({ worker, accentColor, humanGoRequired = false }: RouteWorkerBadgeProps): React.JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 10,
          fontWeight: 700,
          color: accentColor,
        }}
      >
        {worker}
      </span>
      {humanGoRequired && (
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 7,
            color: "#f0883e",
            border: "1px solid #f0883e",
            borderRadius: 2,
            padding: "0 3px",
            whiteSpace: "nowrap" as const,
          }}
        >
          Lv 5
        </span>
      )}
    </div>
  );
}
