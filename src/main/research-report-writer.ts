// Research Report Writer — Obsidian 40_Research/ (permanent memory)
// User explicitly allowed: "永久記憶としてレポート作成を許可しましょう"
// Separate from OB01_DRY_RUN (30_Evidence/). This gate is ACTIVE for 40_Research/.

import { join, normalize, sep } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";

const VAULT_ROOT = join(
  homedir(),
  "Desktop",
  "プロジェクトファイル",
  "shikishima-library",
);
const RESEARCH_SUBFOLDER = "40_Research";
const RESEARCH_ROOT = normalize(join(VAULT_ROOT, RESEARCH_SUBFOLDER));

// User GO: "永久記憶としてレポート作成を許可" — research reports write is ACTIVE
const RESEARCH_WRITE_ENABLED = true;

export interface ResearchWriteResult {
  readonly success: boolean;
  readonly redactedPath?: string; // relative path only
  readonly error?: string;
  readonly writeEnabled: boolean;
}

export function writeResearchReport(
  filename: string,
  content: string,
): ResearchWriteResult {
  // Validate filename: no path separators, must end with .md
  if (!filename || /[/\\]/.test(filename) || !filename.endsWith(".md")) {
    return { success: false, error: "invalid_filename", writeEnabled: RESEARCH_WRITE_ENABLED };
  }

  const targetPath = normalize(join(RESEARCH_ROOT, filename));

  // Path containment check
  if (!targetPath.startsWith(RESEARCH_ROOT + sep) && targetPath !== RESEARCH_ROOT) {
    return { success: false, error: "path_outside_research_root", writeEnabled: RESEARCH_WRITE_ENABLED };
  }

  if (!RESEARCH_WRITE_ENABLED) {
    return { success: false, error: "research_write_disabled", writeEnabled: false };
  }

  try {
    if (!existsSync(RESEARCH_ROOT)) {
      mkdirSync(RESEARCH_ROOT, { recursive: true });
    }
    writeFileSync(targetPath, content, "utf-8");
    return {
      success: true,
      redactedPath: join(RESEARCH_SUBFOLDER, filename),
      writeEnabled: true,
    };
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message,
      writeEnabled: true,
    };
  }
}
