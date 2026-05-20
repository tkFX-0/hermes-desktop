/**
 * LibrarySettingsPanel — vault configuration display.
 * Shows redacted path, local write gate state, dry-run status.
 * No write controls. local write is always HOLD in this phase.
 * Design spec: OBS_LIB_01_LOCAL_VAULT_CONNECTION_PLAN.md
 */

import type { LibrarySettings } from "../../types/library-export-types";

const DEFAULT_SETTINGS: LibrarySettings = {
  libraryRootConfigured: true,
  libraryRootPathRedacted: "...\\プロジェクトファイル\\shikishima-library",
  obsidianCompatible: true,
  localWriteEnabled: false,
  dryRunOnly: true,
  categoryFolders: {
    research:    "10_Research",
    development: "20_Development",
    evidence:    "30_Evidence",
    decision:    "40_Decisions",
    handoff:     "60_Handoffs",
  },
};

interface LibrarySettingsPanelProps {
  readonly settings?: LibrarySettings;
  readonly lang?: "ja" | "en";
}

export function LibrarySettingsPanel({
  settings = DEFAULT_SETTINGS,
  lang = "ja",
}: LibrarySettingsPanelProps): React.JSX.Element {
  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderRadius: 6,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 10,
      }}
    >
      <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
        {lang === "ja" ? "Vault 設定" : "Vault Settings"}
      </span>

      {/* Vault path */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#8b949e" }}>
          {lang === "ja" ? "Vault パス" : "Vault Path"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 11, color: settings.libraryRootConfigured ? "#3fb950" : "#f0883e" }}>
            {settings.libraryRootConfigured ? (lang === "ja" ? "設定済み" : "configured") : (lang === "ja" ? "未設定" : "not configured")}
          </span>
          {settings.libraryRootConfigured && (
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
              {settings.libraryRootPathRedacted}
            </span>
          )}
        </div>
      </div>

      {/* State chips row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#3fb950", border: "1px solid #3fb95044", borderRadius: 2, padding: "2px 6px" }}>
          Obsidian-compatible
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#58a6ff", border: "1px solid #58a6ff44", borderRadius: 2, padding: "2px 6px" }}>
          dry-run: {settings.dryRunOnly ? "ON" : "OFF"}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f0883e", border: "1px solid #f0883e44", borderRadius: 2, padding: "2px 6px" }}>
          local write: {settings.localWriteEnabled ? "enabled" : "HOLD"}
        </span>
      </div>

      {/* Category folders */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#8b949e" }}>
          {lang === "ja" ? "カテゴリフォルダ" : "Category Folders"}
        </span>
        {(Object.entries(settings.categoryFolders) as [string, string][]).map(([cat, folder]) => (
          <span key={cat} style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
            {cat} → {folder}/
          </span>
        ))}
      </div>

      {/* OB-01 gate notice */}
      <div style={{ background: "#0d1117", border: "1px solid #f0883e33", borderRadius: 3, padding: "7px 10px" }}>
        <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e", lineHeight: 1.4 }}>
          {lang === "ja"
            ? "実際のファイル書き込みは OB-01 gate GO 後に有効になります。現在はプレビュー・dry-run のみ。"
            : "Actual file write is enabled only after OB-01 gate GO. Currently preview / dry-run only."}
        </span>
      </div>
    </div>
  );
}
