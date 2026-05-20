/**
 * LibraryReportPreview — article-style report preview (HTML/React).
 * Renders as styled React components. PNG export is OBS-LIB-03 next step.
 * Design spec: OBS_LIB_03_REPORT_IMAGE_EXPORT_PLAN.md
 */

import type { LibraryItem } from "../../types/library-export-types";
import { generateReportData } from "./libraryReportTemplate";

const CATEGORY_COLOR: Record<string, string> = {
  research:    "#1f6feb",
  development: "#8b5cf6",
  evidence:    "#3fb950",
  decision:    "#f0883e",
  handoff:     "#58a6ff",
};

interface LibraryReportPreviewProps {
  readonly item: LibraryItem;
  readonly lang?: "ja" | "en";
}

export function LibraryReportPreview({ item, lang = "ja" }: LibraryReportPreviewProps): React.JSX.Element {
  const report = generateReportData(item);
  const cc = CATEGORY_COLOR[item.category] ?? "#6e7681";

  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 6,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 10,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
          {lang === "ja" ? "レポートプレビュー" : "Report Preview"}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681", border: "1px solid #6e768144", borderRadius: 2, padding: "2px 6px" }}>
          HTML preview · PNG: OBS-LIB-03
        </span>
      </div>

      {/* Article card */}
      <div
        style={{
          background: "#f8f9fa",
          borderRadius: 8,
          padding: "24px 24px 16px",
          display: "flex",
          flexDirection: "column" as const,
          gap: 14,
          maxWidth: 560,
        }}
      >
        {/* Category badge + date */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 11, fontWeight: 700, color: "#fff", background: cc, borderRadius: 4, padding: "3px 10px" }}>
            {report.categoryLabel}
          </span>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6b7280" }}>
            {report.date}
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.3 }}>
          {report.title}
        </h2>

        {/* Summary card */}
        <div style={{ background: "#f3f4f6", borderRadius: 6, padding: "10px 14px", borderLeft: `4px solid ${cc}` }}>
          <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
            {report.summary}
          </span>
        </div>

        {/* Sections */}
        {report.sections.map((s) => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
            <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: 0.8 }}>
              {s.label}
            </span>
            <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
              {s.content}
            </span>
          </div>
        ))}

        {/* Meta row */}
        {(report.gate ?? report.commit) && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
            {report.gate && (
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6b7280" }}>
                gate: {report.gate}
              </span>
            )}
            {report.commit && (
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6b7280" }}>
                commit: {report.commit.slice(0, 7)}
              </span>
            )}
          </div>
        )}

        {/* Footer safety strip */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 8, marginTop: 4 }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#9ca3af" }}>
            {report.safetyFooter}
          </span>
        </div>
      </div>

      {/* PNG export note */}
      <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
        {lang === "ja"
          ? "PNG エクスポートは OBS-LIB-03 gate で実装予定 (次ステップ)"
          : "PNG export planned in OBS-LIB-03 gate (next step)"}
      </span>
    </div>
  );
}
