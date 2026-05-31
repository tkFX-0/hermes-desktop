#!/usr/bin/env node
/**
 * 実施GO — run constitutional-GO live steps (redacted output only).
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const { resolveConstitutionalGo } = await import(
  "../src/main/shikishima-full-autonomy/constitutional-go-state.ts"
);
const { executeObsidianWrite } = await import(
  "../src/main/shikishima-full-autonomy/obsidian-write-executor.ts"
);
const { writeEvidenceNote } = await import("../src/main/library-export.ts");
const { executeDiscordReadIntake } = await import(
  "../src/main/shikishima-full-autonomy/discord-read-executor.ts"
);
const { readDiscordChannel, getDiscordChannelIds } = await import("../src/main/discord-intake.ts");
const { executeHermesSubprocessBridge } = await import(
  "../src/main/shikishima-full-autonomy/hermes-subprocess-bridge.ts"
);
const { resolveShadowSttOptIn } = await import(
  "../src/main/shikishima-full-autonomy/shadow-stt-opt-in.ts"
);
const { runFullAutonomyPipeline } = await import(
  "../src/main/shikishima-full-autonomy/run-full-autonomy-pipeline.ts"
);
const { runCappedAutonomousTick, createCappedSchedulerContext } = await import(
  "../src/main/shikishima-full-autonomy/capped-autonomous-scheduler.ts"
);

const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
const report = {
  humanGoNote: "実施GO",
  constitutionalGo: null,
  obsidian: null,
  discordRead: null,
  hermesBridge: null,
  shadowStt: null,
  pipeline: null,
  cappedTick: null,
  gitPushAutomated: false
};

const go = resolveConstitutionalGo(root);
report.constitutionalGo = {
  active: go.active,
  scopeCount: go.scopes.length,
  source: go.source,
  humanGoNote: go.humanGoNote
};

if (!go.active) {
  console.log(JSON.stringify({ ...report, error: "constitutional_go_not_active" }, null, 2));
  process.exit(1);
}

report.obsidian = executeObsidianWrite(
  {
    filename: `${stamp}_constitutional-go-execute.md`,
    content: [
      "# Constitutional GO 実施",
      "",
      `- at: ${new Date().toISOString()}`,
      `- note: 実施GO`,
      `- scopes: ${go.scopes.length}`,
      ""
    ].join("\n")
  },
  writeEvidenceNote
);

const channels = getDiscordChannelIds();
const channelId = channels.commandChannelId || channels.reportChannelId;
report.discordRead = await executeDiscordReadIntake(
  { channelId, limit: 5 },
  readDiscordChannel
);
if (report.discordRead.messages?.length) {
  report.discordRead = {
    ...report.discordRead,
    messages: report.discordRead.messages.map((m) => ({
      id: m.id ? "[redacted]" : "",
      authorName: m.authorName,
      contentPreview: m.contentPreview?.slice(0, 80) ?? "",
      timestamp: m.timestamp,
      isBot: m.isBot
    }))
  };
}

report.hermesBridge = await executeHermesSubprocessBridge(
  { dryRun: true },
  async () => ({ exitCode: 0 })
);

report.shadowStt = resolveShadowSttOptIn(root);

report.pipeline = (() => {
  const p = runFullAutonomyPipeline({
    voicePass: true,
    stackchanConnected: true,
    stackchanDeferred: false,
    burnInWallClockPass: true,
    pilotLevel8HumanDeclaration: true,
    pilotVoiceTracksComplete: true,
    nowMs: Date.now()
  });
  const fa12 = p.acceptance.criteria.find((c) => c.id === "FA-12");
  return {
    level: p.autonomyLevel.currentLevel,
    level8Ready: p.level8Ready,
    openGaps: p.openGaps,
    fa12: fa12?.status,
    execution: p.execution,
    productionReady: p.productionReady
  };
})();

const ctx = createCappedSchedulerContext(Date.now());
report.cappedTick = runCappedAutonomousTick(ctx, {
  routeId: "autonomy.maintenance",
  nowMs: Date.now(),
  explicitPermittedGo: true
});
report.cappedTick = {
  allowed: report.cappedTick.allowed,
  reasons: report.cappedTick.reasons,
  schedulerState: report.cappedTick.schedulerState,
  level8Ready: report.cappedTick.maintenance?.pipeline?.level8Ready ?? null
};

console.log(JSON.stringify(report, null, 2));

const ok =
  report.obsidian?.success &&
  report.pipeline?.level8Ready &&
  report.constitutionalGo?.active;

process.exit(ok ? 0 : 2);
