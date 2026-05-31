/**
 * Constitutional GO — plain Node reader.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const LOCAL_REL = ".shikishima-memory/constitutional-go.local.json";

/**
 * @param {string} projectRoot
 */
export function readConstitutionalGo(projectRoot) {
  const path = join(projectRoot, LOCAL_REL);
  if (!existsSync(path)) {
    return { active: false, scopes: [], source: "default" };
  }
  try {
    const data = JSON.parse(readFileSync(path, "utf-8"));
    const active = data.allGoAcknowledged === true;
    const scopes = Array.isArray(data.scopes) ? data.scopes : [];
    return { active, scopes, source: "local_file", humanGoNote: data.humanGoNote ?? null };
  } catch {
    return { active: false, scopes: [], source: "default" };
  }
}

/**
 * @param {string} projectRoot
 * @param {string} scope
 */
export function hasConstitutionalScope(projectRoot, scope) {
  const go = readConstitutionalGo(projectRoot);
  return go.active && go.scopes.includes(scope);
}
