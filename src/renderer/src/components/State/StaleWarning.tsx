/**
 * StaleWarning — inline STALE banner for use within page bodies.
 * Complements the SafetyStrip STALE badge.
 * Display only. Optional onRefresh callback.
 */

interface StaleWarningProps {
  readonly generatedAtLabel?: string;
  readonly onRefresh?: () => void;
  readonly lang?: "ja" | "en";
  readonly compact?: boolean;
}

export function StaleWarning({
  generatedAtLabel,
  onRefresh,
  lang = "ja",
  compact = false,
}: StaleWarningProps) {
  const message = lang === "ja"
    ? "データが期限切れです。全判定はHOLDにフォールバックしています。"
    : "Data is stale. All decisions are falling back to HOLD.";

  return (
    <div
      role="status"
      aria-label={lang === "ja" ? "staleデータ警告" : "Stale data warning"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: compact ? "5px 10px" : "8px 12px",
        background: "var(--hold-soft, #fef3c7)",
        border: "1px solid var(--hold, #d97706)",
        borderRadius: 4,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            fontWeight: 700,
            color: "var(--hold, #d97706)",
            border: "1px solid var(--hold, #d97706)",
            padding: "1px 5px",
            borderRadius: 2,
            flexShrink: 0,
          }}
        >
          STALE
        </span>
        <p
          style={{
            fontFamily:
              lang === "en"
                ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
            fontSize: compact ? 10 : 11,
            color: "var(--hold, #d97706)",
            margin: 0,
          }}
        >
          {message}
        </p>
        {generatedAtLabel && (
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 9,
              color: "var(--ink3, #9ca3af)",
            }}
          >
            {generatedAtLabel}
          </span>
        )}
      </div>
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          aria-label={lang === "ja" ? "スナップショットを更新" : "Refresh snapshot"}
          style={{
            padding: "3px 10px",
            fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
            fontSize: 10,
            color: "var(--hold, #d97706)",
            background: "var(--paper, #ffffff)",
            border: "1px solid var(--hold, #d97706)",
            borderRadius: 3,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {lang === "ja" ? "更新" : "Refresh"}
        </button>
      )}
    </div>
  );
}
