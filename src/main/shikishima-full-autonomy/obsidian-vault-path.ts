/**
 * Unified Obsidian vault path (Electron / full-autonomy). Filesystem only.
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DEFAULT_VAULT = join(homedir(), "Documents", "Obsidian Vault");

export function resolveObsidianVaultPath(projectRoot = process.cwd()): string {
  const envPath = join(projectRoot, ".env.local");
  try {
    if (existsSync(envPath)) {
      const line = readFileSync(envPath, "utf-8")
        .split("\n")
        .find((l) => l.startsWith("OBSIDIAN_VAULT_PATH="));
      if (line) {
        const v = line.split("=").slice(1).join("=").trim();
        if (v) return v;
      }
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_VAULT;
}

export function resolveObsidianCategoryDir(
  categoryFolder: string,
  projectRoot = process.cwd()
): string {
  return join(resolveObsidianVaultPath(projectRoot), categoryFolder);
}
