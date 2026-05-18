/**
 * InactiveStamp — visual indicator for actions absent by design.
 * Design spec: pages-shell.jsx InactiveStamp.
 * Shows [OFF] badge + struck-through label + "設計上 inactive" suffix.
 * Used by Outbox/Queue/Push to mark actions that are missing by design.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';
const SANS = '"IBM Plex Sans", "Inter", system-ui, sans-serif';
const JP = '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif';

export interface InactiveStampProps {
  readonly label: string;
  readonly lang?: "ja" | "en";
}

export function InactiveStamp({ label, lang = "ja" }: InactiveStampProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: SANS,
        fontSize: 12,
        fontWeight: 600,
        color: "var(--ink3, #9ca3af)",
        background: "transparent",
        border: "1px dashed var(--ink3, #9ca3af)",
        borderRadius: 2,
        padding: "5px 10px",
        letterSpacing: 0.3,
        textDecoration: "line-through",
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 0.8,
          color: "var(--ink3, #9ca3af)",
          border: "1px solid var(--paper3, #e5e7eb)",
          padding: "1px 4px",
          borderRadius: 2,
          textDecoration: "none",
        }}
      >
        OFF
      </span>
      {label}
      <span
        style={{
          fontFamily: lang === "en" ? SANS : JP,
          fontSize: 9,
          opacity: 0.7,
          textDecoration: "none",
        }}
      >
        · {lang === "ja" ? "設計上 inactive" : "inactive by design"}
      </span>
    </span>
  );
}
