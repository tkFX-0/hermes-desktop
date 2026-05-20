/**
 * LibraryMarkdownPreview — generated Markdown preview with dry-run export.
 * Shows frontmatter + body template. Actual write requires OB-01 GO.
 * Design spec: OBS_LIB_02_MARKDOWN_EXPORT_PLAN.md
 */

import { useState } from "react";
import type { LibraryItem } from "../../types/library-export-types";
import { generateMarkdown, generateFilename } from "./libraryExportTemplates";

interface LibraryMarkdownPreviewProps {
  readonly item: LibraryItem;
  readonly lang?: "ja" | "en";
}

type ExportState =
  | { phase: "idle" }
  | { phase: "running" }
  | { phase: "done"; redactedPath: string; ob01Status: "HOLD" | "ACTIVE" }
  | { phase: "error"; error: string };

export function LibraryMarkdownPreview({ item, lang = "ja" }: LibraryMarkdownPreviewProps): React.JSX.Element {
  const filename = generateFilename(item);
  const markdown = generateMarkdown(item);
  const [exportState, setExportState] = useState<ExportState>({ phase: "idle" });

  async function handleExport(): Promise<void> {
    setExportState({ phase: "running" });
    try {
      const result = await window.hermesAPI.shikishimaLibraryWrite({ filename, content: markdown });
      if (result.success && result.redactedPath) {
        setExportState({ phase: "done", redactedPath: result.redactedPath, ob01Status: result.ob01Status });
      } else {
        setExportState({ phase: "error", error: result.error ?? "unknown" });
      }
    } catch (e) {
      setExportState({ phase: "error", error: (e as Error).message });
    }
  }

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

      {/* Export button + result */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
        <button
          onClick={() => void handleExport()}
          disabled={exportState.phase === "running"}
          style={{
            alignSelf: "flex-start" as const,
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 11,
            color: exportState.phase === "running" ? "#6e7681" : "#c9d1d9",
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: 4,
            padding: "5px 12px",
            cursor: exportState.phase === "running" ? "wait" : "pointer",
          }}
        >
          {exportState.phase === "running"
            ? (lang === "ja" ? "確認中..." : "Checking...")
            : (lang === "ja" ? "Export dry-run (OB-01)" : "Export dry-run (OB-01)")}
        </button>

        {exportState.phase === "done" && (
          <div style={{ background: "#0d2119", border: "1px solid #3fb95044", borderRadius: 3, padding: "6px 10px", display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#3fb950" }}>
              dry-run OK: {exportState.redactedPath}
            </span>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f0883e" }}>
              OB-01: {exportState.ob01Status}
            </span>
          </div>
        )}

        {exportState.phase === "error" && (
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f85149" }}>
            error: {exportState.error}
          </span>
        )}
      </div>

      {/* Write gate notice */}
      <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 10, color: "#6e7681", lineHeight: 1.4 }}>
        {lang === "ja"
          ? "実際のファイル保存は OB-01 local write gate GO 後に有効になります。"
          : "Actual file save is enabled only after OB-01 local write gate GO."}
      </span>
    </div>
  );
}
