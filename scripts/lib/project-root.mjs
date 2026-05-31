/**
 * Resolve hermes-desktop project root from script location.
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function resolveProjectRoot() {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "..");
}
