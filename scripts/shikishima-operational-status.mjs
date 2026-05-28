#!/usr/bin/env node
/** Print operational release + pilot status (redacted). */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { resolveOperationalRelease } = await import(
  "../src/main/shikishima-full-autonomy/operational-release-state.ts"
);
const { runFullAutonomyPipeline } = await import(
  "../src/main/shikishima-full-autonomy/run-full-autonomy-pipeline.ts"
);

const release = resolveOperationalRelease(root);
const pipeline = runFullAutonomyPipeline({
  voicePass: true,
  stackchanConnected: true,
  stackchanDeferred: false,
  burnInWallClockPass: true,
  pilotLevel8HumanDeclaration: true,
  pilotVoiceTracksComplete: true,
  sidebotHold: !release.sidebotHoldReleased
});

console.log(
  JSON.stringify(
    {
      operationalRelease: {
        activated: release.activated,
        executionEnabled: release.executionEnabled,
        productionReady: release.productionReady,
        sidebotHoldReleased: release.sidebotHoldReleased,
        hermesDaemonPilotEnabled: release.hermesDaemonPilotEnabled,
        source: release.source
      },
      pipeline: {
        execution: pipeline.execution,
        productionReady: pipeline.productionReady,
        level: pipeline.autonomyLevel.currentLevel,
        openGaps: pipeline.openGaps
      }
    },
    null,
    2
  )
);
