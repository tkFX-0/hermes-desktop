#!/usr/bin/env node
/** Bounded all-agent autonomous tick (redacted stdout). */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
process.env.SHIKISHIMA_TEST_CONSTITUTIONAL_GO = "1";

const {
  createAgentTeamTickCounter,
  runAgentTeamAutonomousTick
} = await import("../src/main/shikishima-full-autonomy/agent-team-autonomous-tick.ts");

const counter = createAgentTeamTickCounter(Date.now());
const summary = await runAgentTeamAutonomousTick(counter, Date.now());

console.log(
  JSON.stringify(
    {
      allowed: summary.allowed,
      reasons: summary.reasons,
      agentCount: summary.agents.length,
      agents: summary.agents.map((a) => ({
        agentId: a.agentId,
        success: a.success,
        backend: a.backend,
        model: a.model,
        durationMs: a.durationMs,
        replyPreviewLen: a.replyPreview.length
      }))
    },
    null,
    2
  )
);

process.exit(summary.allowed && summary.agents.every((a) => a.success) ? 0 : 2);
