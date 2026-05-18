/**
 * CopyOnlyButton — copy/show/open action, never execute.
 * Design spec: pages-shell.jsx CopyBtn.
 * kind "copy" → ⧉ clipboard; "show" → ⌕ reveal; "open" → ↗ external panel.
 * No onExecute by design.
 */

const GLYPH = { copy: "⧉", show: "⌕", open: "↗" } as const;

export interface CopyOnlyButtonProps {
  readonly kind: "copy" | "show" | "open";
  readonly label: string;
  readonly onAction?: () => void;
}

export function CopyOnlyButton({ kind, label, onAction }: CopyOnlyButtonProps) {
  return (
    <button
      type="button"
      onClick={onAction}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "5px 9px",
        fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
        fontSize: 11,
        color: "var(--ink2, #374151)",
        background: "var(--paper, #ffffff)",
        border: "1px solid var(--rule, #e5e7eb)",
        borderRadius: 3,
        cursor: "pointer",
        width: "100%",
        textAlign: "left" as const,
      }}
    >
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 10,
          color: "var(--ink3, #9ca3af)",
          flexShrink: 0,
        }}
      >
        {GLYPH[kind]}
      </span>
      <span>{label}</span>
    </button>
  );
}
