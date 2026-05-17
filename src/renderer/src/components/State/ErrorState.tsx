/**
 * ErrorState — displayed when a data fetch fails or an invariant is broken.
 * Copy-only action (copies error text). No external calls.
 */

interface ErrorStateProps {
  readonly title?: string;
  readonly message: string;
  readonly onCopy?: (text: string) => void;
  readonly onRetry?: () => void;
  readonly lang?: "ja" | "en";
}

export function ErrorState({
  title,
  message,
  onCopy,
  onRetry,
  lang = "ja",
}: ErrorStateProps) {
  const defaultTitle = lang === "ja" ? "エラー" : "Error";

  return (
    <div
      style={{
        padding: "16px",
        background: "var(--stop-soft, #fee2e2)",
        border: "1px solid var(--stop, #dc2626)",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
      role="alert"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 11,
            fontWeight: 700,
            color: "var(--stop, #dc2626)",
            letterSpacing: 1,
          }}
        >
          {title ?? defaultTitle}
        </span>
      </div>
      <p
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 11,
          color: "var(--stop, #dc2626)",
          margin: 0,
          wordBreak: "break-all",
        }}
      >
        {message}
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {onCopy && (
          <button
            type="button"
            onClick={() => onCopy(message)}
            aria-label={lang === "ja" ? "エラーをコピー" : "Copy error"}
            style={{
              padding: "4px 12px",
              fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
              fontSize: 10,
              color: "var(--ink, #111827)",
              background: "var(--paper, #ffffff)",
              border: "1px solid var(--rule, #e5e7eb)",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            {lang === "ja" ? "コピー" : "Copy"}
          </button>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            aria-label={lang === "ja" ? "再試行" : "Retry"}
            style={{
              padding: "4px 12px",
              fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
              fontSize: 10,
              color: "var(--paper, #ffffff)",
              background: "var(--stop, #dc2626)",
              border: "none",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            {lang === "ja" ? "再試行" : "Retry"}
          </button>
        )}
      </div>
    </div>
  );
}
