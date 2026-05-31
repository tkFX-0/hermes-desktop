/**
 * Unified Obsidian vault path (SideBot + tools). No Obsidian app API — filesystem only.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { resolveProjectRoot } from "./project-root.mjs";

/** Windows 標準 + setup-obsidian-vault.mjs と同じ既定 */
const DEFAULT_VAULT = join(homedir(), "Documents", "Obsidian Vault");
const DEFAULT_SUBFOLDER = "しきしま";

/**
 * @param {string} [projectRoot]
 */
export function resolveObsidianVaultPath(projectRoot = resolveProjectRoot()) {
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

/**
 * @param {string} categoryFolder — e.g. "しきしま", "Daily", "30_Evidence"
 * @param {string} [projectRoot]
 */
export function resolveObsidianCategoryDir(categoryFolder = DEFAULT_SUBFOLDER, projectRoot) {
  return join(resolveObsidianVaultPath(projectRoot), categoryFolder);
}

/**
 * @param {string} [projectRoot]
 */
export function checkObsidianVaultReady(projectRoot = resolveProjectRoot()) {
  const vaultPath = resolveObsidianVaultPath(projectRoot);
  const categoryDir = resolveObsidianCategoryDir(DEFAULT_SUBFOLDER, projectRoot);
  const vaultExists = existsSync(vaultPath);
  const categoryExists = existsSync(categoryDir);
  return {
    ready: vaultExists && categoryExists,
    vaultPath,
    categoryDir,
    vaultExists,
    categoryExists,
    configuredViaEnv: vaultPath !== DEFAULT_VAULT,
  };
}

export { DEFAULT_VAULT, DEFAULT_SUBFOLDER };
