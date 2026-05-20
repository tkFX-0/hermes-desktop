/**
 * LibraryItemCard — display card for one library export item.
 * Shows category, title, status, summary. No external actions.
 * Design spec: OBS_LIB_02_MARKDOWN_EXPORT_PLAN.md
 */

import type { LibraryItem, LibraryItemCategory, LibraryExportStatus } from "../../types/library-export-types";

const CATEGORY_COLOR: Record<LibraryItemCategory, string> = {
  research:    "#1f6feb",
  development: "#8b5cf6",
  evidence:    "#3fb950",
  decision:    "#f0883e",
  handoff:     "#58a6ff",
};

const CATEGORY_LABEL: Record<LibraryItemCategory, { ja: string; en: string }> = {
  research:    { ja: "リサーチ", en: "Research" },
  development: { ja: "開発",    en: "Development" },
  evidence:    { ja: "証跡",    en: "Evidence" },
  decision:    { ja: "判断",    en: "Decision" },
  handoff:     { ja: "引き継ぎ", en: "Handoff" },
};

const STATUS_COLOR: Record<LibraryExportStatus, string> = {
  draft:    "#8b949e",
  ready:    "#3fb950",
  dry_run:  "#58a6ff",
  exported: "#10b981",
  failed:   "#f85149",
  hold:     "#6e7681",
};

interface LibraryItemCardProps {
  readonly item: LibraryItem;
  readonly selected?: boolean;
  readonly onSelect?: (id: string) => void;
  readonly lang?: "ja" | "en";
}

export function LibraryItemCard({ item, selected = false, onSelect, lang = "ja" }: LibraryItemCardProps): React.JSX.Element {
  const cc = CATEGORY_COLOR[item.category];
  const cl = CATEGORY_LABEL[item.category];
  const sc = STATUS_COLOR[item.status];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item.id)}
      style={{
        background: selected ? "#1c2128" : "#161b22",
        border: `1px solid ${selected ? cc : "#21262d"}`,
        borderLeft: `3px solid ${cc}`,
        borderRadius: 4,
        padding: "10px 13px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 6,
        textAlign: "left" as const,
        cursor: "pointer",
        width: "100%",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: cc, border: `1px solid ${cc}44`, borderRadius: 2, padding: "1px 5px", flexShrink: 0 }}>
          {lang === "ja" ? cl.ja : cl.en}
        </span>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const }}>
          {item.relatedGate && (
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
              {item.relatedGate}
            </span>
          )}
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: sc, border: `1px solid ${sc}44`, borderRadius: 2, padding: "1px 5px", flexShrink: 0 }}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Title */}
      <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: "#c9d1d9", lineHeight: 1.3 }}>
        {item.title}
      </span>

      {/* Summary */}
      <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e", lineHeight: 1.4 }}>
        {item.summary}
      </span>

      {/* Meta row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
          {item.createdAt}
        </span>
        {item.relatedCommit && (
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
            commit: {item.relatedCommit.slice(0, 7)}
          </span>
        )}
      </div>
    </button>
  );
}
