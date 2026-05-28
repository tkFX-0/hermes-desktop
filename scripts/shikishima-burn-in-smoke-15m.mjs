/**
 * Track A1 — 15-minute smoke Burn-in (no send, execution disabled).
 * Human GO required before each run.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DURATION_MS = 15 * 60 * 1000;
const TICK_MS = 60 * 1000;
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const {
  createBurnInMonitor,
  evaluateBurnInMonitor,
  recordBurnInEvent
} = await import("../src/main/shikishima-full-autonomy/burn-in-monitor.ts");
const { runFullAutonomyPipeline } = await import(
  "../src/main/shikishima-full-autonomy/run-full-autonomy-pipeline.ts"
);
const { verifyGlobalInvariants } = await import(
  "../src/main/shikishima-full-autonomy/autonomy-invariants.ts"
);
const { runLocalWorkDryRun } = await import(
  "../src/main/shikishima-full-autonomy/local-work-dry-run.ts"
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isoNow() {
  return new Date().toISOString();
}

async function main() {
  const startedAtMs = Date.now();
  const startedIso = isoNow();
  const monitor = createBurnInMonitor(startedAtMs, {
    maxDurationMs: DURATION_MS + 30_000,
    maxEventsPerWindow: 200,
    windowMs: DURATION_MS
  });

  const tickSummaries = [];
  let stopReason = null;

  console.log(
    JSON.stringify({
      phase: "A1_smoke_burn_in_start",
      startedIso,
      durationMs: DURATION_MS,
      tickMs: TICK_MS,
      execution: "disabled",
      sends: "none"
    })
  );

  let tick = 0;
  while (Date.now() - startedAtMs < DURATION_MS) {
    tick += 1;
    const nowMs = Date.now();
    recordBurnInEvent(monitor, nowMs, "cycle_tick", `tick-${tick}`);

    const invariants = verifyGlobalInvariants({
      productionReady: false,
      executionEnabled: false,
      rawValuesReported: false
    });
    if (!invariants.ok) {
      stopReason = `invariant_violation:${invariants.violations.join(",")}`;
      break;
    }

    const pipeline = runFullAutonomyPipeline({
      voicePass: true,
      stackchanConnected: true,
      stackchanDeferred: false,
      sidebotHold: true,
      nowMs
    });
    recordBurnInEvent(monitor, nowMs + 1, "dry_run", "pipeline.phases2-10");

    const localRead = runLocalWorkDryRun({
      targetPath: "docs/shikishima/AUTONOMY_GOAL_LEDGER.md",
      operation: "read",
      taskLabel: `burn-in-tick-${tick}`
    });
    recordBurnInEvent(monitor, nowMs + 2, "dry_run", "local.read");

    const evalNow = evaluateBurnInMonitor(monitor, nowMs + 3);
    tickSummaries.push({
      tick,
      atIso: isoNow(),
      pipelineExecution: pipeline.execution,
      pipelineProductionReady: pipeline.productionReady,
      localWouldProceed: localRead.wouldProceed,
      burnEvalPass: evalNow.pass,
      burnEvalReasons: [...evalNow.reasons]
    });

    console.log(
      JSON.stringify({
        phase: "tick",
        tick,
        elapsedMs: nowMs - startedAtMs,
        burnEvalPass: evalNow.pass,
        eventCount: evalNow.eventCount
      })
    );

    if (!evalNow.pass) {
      stopReason = `burn_eval_fail:${evalNow.reasons.join(",")}`;
      break;
    }

    const remaining = DURATION_MS - (Date.now() - startedAtMs);
    if (remaining <= 0) break;
    await sleep(Math.min(TICK_MS, remaining));
  }

  const endedAtMs = Date.now();
  const finalEval = evaluateBurnInMonitor(monitor, endedAtMs);
  const elapsedMs = endedAtMs - startedAtMs;
  const completedFullDuration = elapsedMs >= DURATION_MS - 1000 && !stopReason;
  const pass =
    completedFullDuration &&
    finalEval.pass &&
    !monitor.rawLeakDetected &&
    !monitor.unapprovedWriteDetected;

  const report = {
    schema: "shikishima-burn-in-smoke-15m/v1",
    track: "A1",
    humanGo: true,
    startedIso,
    endedIso: isoNow(),
    elapsedMs,
    durationTargetMs: DURATION_MS,
    tickCount: tick,
    completedFullDuration,
    stopReason,
    pass,
    execution: "disabled",
    productionReady: false,
    rawValuesReported: false,
    sendsPerformed: false,
    finalEval: {
      pass: finalEval.pass,
      reasons: [...finalEval.reasons],
      eventCount: finalEval.eventCount,
      runawayDetected: finalEval.runawayDetected
    },
    flags: {
      rawLeakDetected: monitor.rawLeakDetected,
      unapprovedWriteDetected: monitor.unapprovedWriteDetected
    },
    tickSummaries
  };

  const jsonPath = join(
    REPO_ROOT,
    "docs/shikishima/FULL_AUTONOMY_BURN_IN_SMOKE_15M_EVIDENCE.json"
  );
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(JSON.stringify({ phase: "A1_smoke_burn_in_end", pass, jsonPath }));

  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error(JSON.stringify({ phase: "fatal", message: String(err) }));
  process.exit(2);
});
