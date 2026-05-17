/**
 * LoadingState — skeleton placeholder while data is fetching.
 * Display only. No callbacks.
 */

interface LoadingStateProps {
  readonly rows?: number;
  readonly label?: string;
  readonly lang?: "ja" | "en";
}

function SkeletonRow({ width }: { readonly width: string }) {
  return (
    <div
      style={{
        height: 12,
        width,
        background: "var(--rule, #e5e7eb)",
        borderRadius: 3,
        opacity: 0.7,
      }}
      aria-hidden
    />
  );
}

const ROW_WIDTHS = ["80%", "65%", "75%", "55%", "70%", "60%"] as const;

export function LoadingState({ rows = 3, label, lang = "ja" }: LoadingStateProps) {
  const defaultLabel = lang === "ja" ? "読み込み中…" : "Loading…";
  const displayLabel = label ?? defaultLabel;
  const clampedRows = Math.min(rows, 6);

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
      role="status"
      aria-label={displayLabel}
    >
      <p
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 10,
          letterSpacing: 1,
          color: "var(--ink3, #9ca3af)",
          margin: 0,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      >
        {displayLabel}
      </p>
      <div
        style={{
          padding: "16px",
          background: "var(--paper2, #f3f4f6)",
          border: "1px solid var(--rule, #e5e7eb)",
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {Array.from({ length: clampedRows }).map((_, i) => (
          <SkeletonRow key={i} width={ROW_WIDTHS[i % ROW_WIDTHS.length] as string} />
        ))}
      </div>
    </div>
  );
}
