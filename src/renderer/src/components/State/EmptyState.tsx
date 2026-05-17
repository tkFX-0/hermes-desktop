/**
 * EmptyState — placeholder shown when a page list has no items.
 * Display only. No actions except optional onRefresh callback.
 */

interface EmptyStateProps {
  readonly label: string;
  readonly description?: string;
  readonly variant?: "nominal" | "hold" | "neutral";
  readonly onRefresh?: () => void;
  readonly refreshLabel?: string;
  readonly lang?: "ja" | "en";
}

export function EmptyState({
  label,
  description,
  variant = "nominal",
  onRefresh,
  refreshLabel,
  lang = "ja",
}: EmptyStateProps) {
  const color =
    variant === "nominal"
      ? "var(--pass, #16a34a)"
      : variant === "hold"
        ? "var(--hold, #d97706)"
        : "var(--ink3, #9ca3af)";

  const bg =
    variant === "nominal"
      ? "var(--pass-soft, #dcfce7)"
      : variant === "hold"
        ? "var(--hold-soft, #fef3c7)"
        : "var(--paper2, #f3f4f6)";

  const border =
    variant === "nominal"
      ? "1px solid var(--pass, #16a34a)"
      : variant === "hold"
        ? "1px solid var(--hold, #d97706)"
        : "1px solid var(--rule, #e5e7eb)";

  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        background: bg,
        border,
        borderRadius: 6,
        textAlign: "center",
      }}
      role="status"
    >
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 22,
          color,
        }}
        aria-hidden
      >
        {variant === "nominal" ? "✓" : variant === "hold" ? "—" : "○"}
      </span>
      <p
        style={{
          fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          color,
          margin: 0,
        }}
      >
        {label}
      </p>
      {description && (
        <p
          style={{
            fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
            fontSize: 11,
            color: "var(--ink3, #9ca3af)",
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          aria-label={refreshLabel ?? (lang === "ja" ? "更新" : "Refresh")}
          style={{
            marginTop: 4,
            padding: "5px 14px",
            fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
            fontSize: 11,
            color: "var(--ink2, #374151)",
            background: "var(--paper, #ffffff)",
            border: "1px solid var(--rule, #d1d5db)",
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          {refreshLabel ?? (lang === "ja" ? "更新" : "Refresh")}
        </button>
      )}
    </div>
  );
}
