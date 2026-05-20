/**
 * LibraryMarkdownPreview — generated Markdown preview (dry-run).
 * Shows frontmatter + body template. No file write occurs here.
 * Design spec: OBS_LIB_02_MARKDOWN_EXPORT_PLAN.md
 */

import type { LibraryItem } from "../../types/library-export-types";
import { generateMarkdown, generateFilename } from "./libraryExportTemplates";

interface LibraryMarkdownPreviewProps {
  readonly item: LibraryItem;
  readonly lang?: "ja" | "en";
}

export function LibraryMarkdownPreview({ item, lang = "ja" }: LibraryMarkdownPreviewProps): React.JSX.Element {
  const filename = generateFilename(item);
  const markdown = generateMarkdown(item);

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
          {lang === "ja" ? "Markdown プレビュー" : "Markdown Preview"}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#58a6ff", border: "1px solid #58a6ff44", borderRadius: 2, padding: "2px 6px" }}>
          dry-run
        </span>
      </div>

      {/* Filename */}
      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 3, padding: "6px 10px" }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#3fb950" }}>
          📄 {filename}
        </span>
      </div>

      {/* Markdown content */}
      <pre
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 10,
          color: "#8b949e",
          background: "#161b22",
          border: "1px solid #21262d",
          borderRadius: 3,
          padding: "10px 12px",
          margin: 0,
          whiteSpace: "pre-wrap" as const,
          wordBreak: "break-word" as const,
          lineHeight: 1.5,
          maxHeight: 300,
          overflowY: "auto" as const,
        }}
      >
        {markdown}
      </pre>

      {/* Write gate notice */}
      <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 10, color: "#6e7681", lineHeight: 1.4 }}>
        {lang === "ja"
          ? "実際のファイル保存は OB-01 local write gate GO 後に有効になります。"
          : "Actual file save is enabled only after OB-01 local write gate GO."}
      </span>
    </div>
  );
}
