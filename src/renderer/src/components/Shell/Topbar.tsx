/**
 * Topbar — Command Center mode indicator bar.
 * Design spec: pages-shell.jsx PageShell Topbar.
 * Display-only. Shows current mode (OPERATOR / INSPECTOR) and optional
 * sub-context label. No actions, no external calls.
 */

interface TopbarProps {
  readonly mode?: "OPERATOR" | "INSPECTOR";
  readonly sub?: string;
  readonly lang?: "ja" | "en";
}

const MODE_LABEL: Record<"OPERATOR" | "INSPECTOR", { ja: string; en: string }> = {
  OPERATOR: { ja: "操作室", en: "OPERATOR" },
  INSPECTOR: { ja: "詳細検査", en: "INSPECTOR" },
};

export function Topbar({ mode = "OPERATOR", sub, lang = "ja" }: TopbarProps) {
  const label = MODE_LABEL[mode];

  return (
    <div
      aria-label={`Command Center mode: ${mode}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 30,
        padding: "0 16px",
        background: "var(--bar, #1a1f2e)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}
    >
      {/* App label */}
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 9,
          color: "var(--bar-text-2, #9ca3af)",
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        しきしま
      </span>

      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 9,
          color: "rgba(255,255,255,0.15)",
        }}
        aria-hidden
      >
        ·
      </span>

      {/* Mode badge */}
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 1.2,
          color: mode === "INSPECTOR" ? "var(--go, #2563eb)" : "var(--bar-text, #f9fafb)",
          border: `1px solid ${mode === "INSPECTOR" ? "var(--go, #2563eb)" : "rgba(255,255,255,0.15)"}`,
          padding: "1px 5px",
          borderRadius: 2,
        }}
      >
        {lang === "ja" ? label.ja : label.en}
      </span>

      {/* Sub context label */}
      {sub && (
        <>
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 9,
              color: "rgba(255,255,255,0.15)",
            }}
            aria-hidden
          >
            /
          </span>
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 9,
              color: "var(--bar-text-2, #9ca3af)",
              letterSpacing: 0.5,
            }}
          >
            {sub}
          </span>
        </>
      )}

      <span style={{ flex: 1 }} />

      {/* Private console tag */}
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 9,
          color: "var(--bar-text-2, #9ca3af)",
          opacity: 0.6,
          letterSpacing: 0.5,
        }}
      >
        Private Console
      </span>
    </div>
  );
}
