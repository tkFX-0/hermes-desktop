/**
 * Obsidian-compatible local library export type definitions.
 * Design spec: OBS_LIB_00_OBSIDIAN_LOCAL_LIBRARY_DESIGN.md
 *
 * localWriteEnabled is always false until OB-01 gate is opened.
 * dryRunOnly is always true in current phase.
 */

export type LibraryItemCategory =
  | "research"
  | "development"
  | "evidence"
  | "decision"
  | "handoff";

export type LibraryExportStatus =
  | "draft"
  | "ready"
  | "dry_run"
  | "exported"
  | "failed"
  | "hold";

export type LibraryExportTarget =
  | "markdown"
  | "report_image"
  | "metadata";

export interface LibrarySafetyState {
  readonly productionReady: false;
  readonly execution: "disabled";
  readonly rawValuesReported: false;
  readonly level5: "HOLD" | "NOT_APPLICABLE";
}

export interface LibraryItem {
  readonly id: string;
  readonly title: string;
  readonly category: LibraryItemCategory;
  readonly status: LibraryExportStatus;
  readonly createdAt: string;
  readonly summary: string;
  readonly bodyMarkdown: string;
  readonly tags: readonly string[];
  readonly relatedGate?: string;
  readonly relatedCommit?: string;
  readonly sourceType?: string;
  readonly nextAction?: string;
  readonly safety: LibrarySafetyState;
}

export interface LibrarySettings {
  readonly libraryRootConfigured: boolean;
  readonly libraryRootPathRedacted: string;
  readonly obsidianCompatible: true;
  readonly localWriteEnabled: false;
  readonly dryRunOnly: true;
  readonly categoryFolders: Readonly<Record<LibraryItemCategory, string>>;
}
