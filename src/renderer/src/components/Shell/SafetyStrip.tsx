/**
 * SafetyStrip — always-visible one-line safety summary.
 * Displays decision, productionReady, and execution state.
 * Must never be hidden regardless of page state.
 * Read-only display. No interactive actions.
 */

const DECISION_LABELS: Record<string, { ja: string; color: string }> = {
  HOLD: {
    ja: "まだ待機。人間GOが必要です。",
    color: "var(--hold, #d97706)",
  },
  GO_READY: {
    ja: "人間GOの判断待ち。実行はしません。",
    color: "var(--go, #2563eb)",
  },
  PASS: {
    ja: "Gate通過。次のGateへ。",
    color: "var(--pass, #16a34a)",
  },
  PASS_WITH_CAVEAT: {
    ja: "条件付き通過。注意事項を確認。",
    color: "#9aa72f",
  },
  STOP: {
    ja: "停止中。人間の解除が必要です。",
    color: "var(--stop, #dc2626)",
  },
};

interface SafetyStripProps {
  readonly decision: string;
  readonly productionReady: false;
  readonly execution: "disabled";
  readonly stale?: boolean;
  readonly compact?: boolean;
}

export function SafetyStrip({
  decision,
  productionReady,
  execution,
  stale = false,
  compact = false,
}: SafetyStripProps) {
  const info = DECISION_LABELS[decision] ?? DECISION_LABELS["HOLD"]!;
  const height = compact ? 28 : 32;
  const fontSize = compact ? 10 : 11;

  return (
    <div
      role="status"
      aria-label={`Safety: ${decision} — productionReady: ${String(productionReady)} — execution: ${execution}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        height,
        padding: "0 16px",
        background: "var(--bar, #1a1f2e)",
        borderBottom: "1px solid var(--rule, #2d3748)",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Decision lamp */}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: info.color,
          flexShrink: 0,
        }}
        aria-hidden
      />
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize,
          color: info.color,
          fontWeight: 700,
          letterSpacing: 1,
          flexShrink: 0,
        }}
      >
        {decision}
      </span>
      <span
        style={{
          fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize,
          color: "var(--bar-text-2, #9ca3af)",
          flexShrink: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {info.ja}
      </span>

      <span style={{ flex: 1 }} />

      {/* productionReady badge */}
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: fontSize - 1,
          color: "var(--bar-text-2, #9ca3af)",
          letterSpacing: 0.5,
          flexShrink: 0,
        }}
      >
        productionReady:{" "}
        <span style={{ color: "var(--pass, #16a34a)" }}>
          {String(productionReady)}
        </span>
      </span>

      {/* execution badge */}
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: fontSize - 1,
          color: "var(--bar-text-2, #9ca3af)",
          letterSpacing: 0.5,
          flexShrink: 0,
        }}
      >
        execution:{" "}
        <span style={{ color: "var(--hold, #d97706)" }}>{execution}</span>
      </span>

      {/* STALE badge */}
      {stale && (
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: fontSize - 1,
            color: "var(--hold, #d97706)",
            border: "1px solid var(--hold, #d97706)",
            padding: "1px 5px",
            borderRadius: 2,
            letterSpacing: 0.5,
            flexShrink: 0,
          }}
        >
          STALE
        </span>
      )}
    </div>
  );
}
