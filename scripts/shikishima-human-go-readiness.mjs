#!/usr/bin/env node
/** Human GO batch checklist (redacted JSON). Works with plain `node` on Windows. */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildHumanGoReadinessReport } from "./lib/human-go-readiness-report.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const report = buildHumanGoReadinessReport(root);

console.log(JSON.stringify(report, null, 2));
process.exit(report.decisionForAutomation === "GO_PREPARED" ? 0 : 2);
