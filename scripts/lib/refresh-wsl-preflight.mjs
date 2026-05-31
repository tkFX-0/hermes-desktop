/**
 * Re-run WSL dev preflight and return fresh JSON (SideBot / Discord commands).
 */

import { execFile } from "node:child_process";
import { loadWslPreflight } from "./dev-pipeline-router.mjs";

/**
 * @param {string} projectRoot
 */
export function refreshWslPreflight(projectRoot) {
  return new Promise((resolve) => {
    execFile(
      "node",
      ["scripts/shikishima-wsl-dev-preflight.mjs"],
      { cwd: projectRoot, timeout: 120_000, windowsHide: true },
      () => {
        resolve(loadWslPreflight());
      }
    );
  });
}
