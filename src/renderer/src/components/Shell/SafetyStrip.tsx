/**
 * SafetyStrip — always-visible one-line safety summary.
 * Design spec: pages-shell.jsx SafetyStrip + pages-states.jsx EXT_STATES.
 * Shows decision lamp + 6 safety chips + "安全境界 · 常時表示".
 * Must never be hidden regardless of page state.
 * Read-only display. No interactive actions.
 */

const DECISION_LABELS: Record<string, { ja: string; en: string; color: string }> = {
  HOLD: {
    ja: "まだ待機。人間GOが必要です。",
    en: "Holding. Human GO required.",
    color: "var(--hold, #d97706)",
  },
  GO_READY: {
    ja: "人間GOの判断待ち。実行はしません。",
    en: "Awaiting human GO. System will not execute.",
    color: "var(--go, #2563eb)",
  },
  PASS: {
    ja: "Gate通過。次のGateへ。",
    en: "Gate passed. Proceed to next gate.",
    color: "var(--pass, #16a34a)",
  },
  PASS_WITH_CAVEAT: {
    ja: "通過したが注意事項あり。確認後に進む。",
    en: "Passed with caveats. Review before advancing.",
    color: "#9aa72f",
  },
  STOP: {
    ja: "停止中。人間の解除が必要です。",
    en: "Stopped. Human release is required.",
    color: "var(--stop, #dc2626)",
  },
  REJECT: {
    ja: "却下。再提出を要求。",
    en: "Rejected. Resubmission requested.",
    color: "var(--reject, #9f1239)",
  },
  UNKNOWN: {
    ja: "状態が確定していません。安全のためHOLD扱い。",
    en: "State not determined. Treated as HOLD for safety.",
    color: "var(--ink3, #9ca3af)",
  },
  STALE: {
    ja: "最新確認まで HOLD として扱います。",
    en: "Treated as HOLD until refreshed.",
    color: "var(--hold, #d97706)",
  },
  ERROR: {
    ja: "状態を確認できません。安全のためHOLD扱い。",
    en: "Cannot read state. Treated as HOLD for safety.",
    color: "var(--stop, #dc2626)",
  },
};

interface SafetyChipProps {
  readonly k: string;
  readonly v: string;
  readonly tone?: "hold" | "pass" | "neutral";
  readonly compact?: boolean;
}

function SafetyChip({ k, v, tone = "neutral", compact = false }: SafetyChipProps) {
  const valueColor =
    tone === "hold"
      ? "var(--hold, #d97706)"
      : tone === "pass"
        ? "var(--pass, #16a34a)"
        : "var(--bar-text-2, #9ca3af)";

  return (
    <span
      style={{
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
        fontSize: compact ? 9 : 10,
        color: "var(--bar-text-2, #9ca3af)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 2,
        padding: compact ? "0 4px" : "1px 5px",
        letterSpacing: 0.3,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {k}:{" "}
      <span style={{ color: valueColor, fontWeight: 600 }}>{v}</span>
    </span>
  );
}

interface SafetyStripProps {
  readonly decision: string;
  readonly productionReady: false;
  readonly execution: "disabled";
  readonly stale?: boolean;
  readonly compact?: boolean;
  readonly stackchanConnection?: string;
}

export function SafetyStrip({
  decision,
  productionReady,
  execution,
  stale = false,
  compact = false,
  stackchanConnection,
}: SafetyStripProps) {
  const height = compact ? 28 : 36;
  const fontSize = compact ? 9 : 10;

  const resolvedDecision =
    stale && decision !== "STOP" && decision !== "HOLD" ? "HOLD" : decision;
  const resolvedInfo = DECISION_LABELS[resolvedDecision] ?? DECISION_LABELS["HOLD"]!;

  return (
    <div
      role="status"
      aria-label={`Safety: ${resolvedDecision} — productionReady: ${String(productionReady)} — execution: ${execution}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: compact ? 6 : 8,
        minHeight: height,
        padding: compact ? "3px 12px" : "4px 16px",
        background: "var(--bar, #1a1f2e)",
        borderBottom: "1px solid var(--rule, #2d3748)",
        flexShrink: 0,
      }}
    >
      {/* Left: lamp + decision + chips */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: compact ? 5 : 7,
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Decision lamp */}
        <span
          style={{
            width: compact ? 7 : 8,
            height: compact ? 7 : 8,
            borderRadius: "50%",
            background: resolvedInfo.color,
            flexShrink: 0,
          }}
          aria-hidden
        />

        {/* Decision code */}
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: fontSize + 1,
            color: resolvedInfo.color,
            fontWeight: 700,
            letterSpacing: 1,
            flexShrink: 0,
          }}
        >
          {resolvedDecision}
        </span>

        {/* Decision phrase — truncate on small screens */}
        <span
          style={{
            fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
            fontSize,
            color: "var(--bar-text-2, #9ca3af)",
            flexShrink: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: compact ? 120 : 220,
          }}
        >
          {resolvedInfo.ja}
        </span>

        {/* Safety chips */}
        <SafetyChip k="execution" v={execution} tone="hold" compact={compact} />
        <SafetyChip k="productionReady" v={String(productionReady)} tone="hold" compact={compact} />
        <SafetyChip k="external_write" v="false" tone="pass" compact={compact} />
        <SafetyChip k="rawValues" v="hidden" tone="pass" compact={compact} />
        <SafetyChip k="runtime" v="stopped" tone="pass" compact={compact} />
        <SafetyChip
          k="stackchan"
          v={stackchanConnection ?? "HOLD"}
          tone="hold"
          compact={compact}
        />

        {/* STALE badge */}
        {stale && (
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize,
              color: "var(--hold, #d97706)",
              border: "1px solid var(--hold, #d97706)",
              padding: compact ? "0 3px" : "1px 5px",
              borderRadius: 2,
              letterSpacing: 0.5,
              flexShrink: 0,
            }}
          >
            STALE
          </span>
        )}
      </div>

      {/* Right: "安全境界 · 常時表示" */}
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize,
          color: "var(--bar-text-2, #9ca3af)",
          letterSpacing: 0.5,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        安全境界 · 常時表示
      </span>
    </div>
  );
}
