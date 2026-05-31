// OB-01: Obsidian-compatible evidence write
// Target: shikishima-library/30_Evidence/ only
// Status: DRY_RUN = true (OB-01 GO required for actual write)

import { join, normalize, sep } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";

const VAULT_ROOT = join(
  homedir(),
  "Desktop",
  "プロジェクトファイル",
  "shikishima-library",
);
const ALLOWED_SUBFOLDER = "30_Evidence";
const ALLOWED_ROOT = normalize(join(VAULT_ROOT, ALLOWED_SUBFOLDER));

import { hasConstitutionalGoScope } from "./shikishima-full-autonomy/constitutional-go-state";

function ob01DryRunEnabled(): boolean {
  return !hasConstitutionalGoScope("obsidian_write");
}

export interface LibraryWriteRequest {
  filename: string; // YYYY-MM-DD_slug.md — no path separators allowed
  content: string;
}

export interface LibraryWriteResult {
  readonly success: boolean;
  readonly redactedPath?: string; // relative path only — no raw vault root
  readonly error?: string;
  readonly dryRun: boolean;
  readonly ob01Status: "HOLD" | "ACTIVE";
}

export function writeEvidenceNote(req: LibraryWriteRequest): LibraryWriteResult {
  // Validate filename: no path separators, must end with .md
  const filename = req.filename ?? "";
  if (!filename || /[/\\]/.test(filename) || !filename.endsWith(".md")) {
    return {
      success: false,
      error: "invalid_filename",
      dryRun: true,
      ob01Status: "HOLD",
    };
  }

  const targetPath = normalize(join(ALLOWED_ROOT, filename));

  // Path containment check — resolved path must start with ALLOWED_ROOT
  if (!targetPath.startsWith(ALLOWED_ROOT + sep) && targetPath !== ALLOWED_ROOT) {
    return {
      success: false,
      error: "path_outside_allowed_root",
      dryRun: true,
      ob01Status: "HOLD",
    };
  }

  if (ob01DryRunEnabled()) {
    return {
      success: true,
      redactedPath: join(ALLOWED_SUBFOLDER, filename),
      dryRun: true,
      ob01Status: "HOLD",
    };
  }

  // Live write when constitutional GO scope obsidian_write is active
  try {
    if (!existsSync(ALLOWED_ROOT)) {
      mkdirSync(ALLOWED_ROOT, { recursive: true });
    }
    writeFileSync(targetPath, req.content, "utf-8");
    return {
      success: true,
      redactedPath: join(ALLOWED_SUBFOLDER, filename),
      dryRun: false,
      ob01Status: "ACTIVE",
    };
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message,
      dryRun: false,
      ob01Status: "ACTIVE",
    };
  }
}
