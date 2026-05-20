/**
 * Article-style report template data for library export preview.
 * Renders as HTML/React — PNG export is OBS-LIB-03 next step.
 * Design spec: OBS_LIB_03_REPORT_IMAGE_EXPORT_PLAN.md
 */

import type { LibraryItem, LibraryItemCategory } from "../../types/library-export-types";

export interface ReportSection {
  readonly label: string;
  readonly content: string;
}

export interface ReportData {
  readonly id: string;
  readonly category: LibraryItemCategory;
  readonly categoryLabel: string;
  readonly categoryColor: string;
  readonly title: string;
  readonly date: string;
  readonly summary: string;
  readonly sections: readonly ReportSection[];
  readonly gate?: string;
  readonly commit?: string;
  readonly nextAction: string;
  readonly safetyFooter: string;
}

const CATEGORY_META: Record<LibraryItemCategory, { label: string; color: string }> = {
  research:    { label: "Research", color: "#1f6feb" },
  development: { label: "Development", color: "#8b5cf6" },
  evidence:    { label: "Evidence", color: "#3fb950" },
  decision:    { label: "Decision", color: "#f0883e" },
  handoff:     { label: "Handoff", color: "#58a6ff" },
};

export function generateReportData(item: LibraryItem): ReportData {
  const meta = CATEGORY_META[item.category];
  return {
    id: item.id,
    category: item.category,
    categoryLabel: meta.label,
    categoryColor: meta.color,
    title: item.title,
    date: item.createdAt,
    summary: item.summary,
    sections: [
      { label: "Main Points", content: item.bodyMarkdown },
      { label: "Next Action", content: item.nextAction ?? "—" },
    ],
    gate: item.relatedGate,
    commit: item.relatedCommit,
    nextAction: item.nextAction ?? "—",
    safetyFooter:
      "productionReady: false · execution: disabled · rawValuesReported: false",
  };
}
