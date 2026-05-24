// Research Pipeline
// XS-AUTO findings → single article → Discord (しきしまレポート) + Obsidian (40_Research/)
// Daily cron trigger or manual IPC call.

import { generateResearchReport, type ResearchReportInput } from "./research-report-generator";
import { writeResearchReport } from "./research-report-writer";
import { getDiscordChannelIds } from "./discord-intake";
import { renderArticleHtml } from "./research-article-html";
import { captureHtmlAsPng } from "./research-screenshot";
import { sendPngToDiscord } from "./research-discord-image";
import { runHermesResearch, DAILY_RESEARCH_TOPICS } from "./hermes-research-runner";

const RESEARCH_PIPELINE_HOLD = true;

export interface PipelineResult {
  readonly success: boolean;
  readonly report: {
    title: string;
    filename: string;
    date: string;
  };
  readonly discord: {
    sent: boolean;
    messageId?: string;
    error?: string;
    channelId: string;
  };
  readonly obsidian: {
    written: boolean;
    redactedPath?: string;
    error?: string;
  };
  readonly rawValuesReported: false;
}

export async function publishResearchReport(
  input: ResearchReportInput,
): Promise<PipelineResult> {
  if (RESEARCH_PIPELINE_HOLD) {
    return {
      success: false,
      report: {
        title: input.title,
        filename: "held-by-human-gate.md",
        date: input.date,
      },
      discord: {
        sent: false,
        error: "NEEDS_HUMAN",
        channelId: "",
      },
      obsidian: {
        written: false,
        error: "NEEDS_HUMAN",
      },
      rawValuesReported: false,
    };
  }
  const report = generateResearchReport(input);
  const { reportChannelId } = getDiscordChannelIds();

  // Discord send — PNG image
  let discordResult: PipelineResult["discord"];
  if (reportChannelId) {
    try {
      const html = renderArticleHtml(input);
      const png = await captureHtmlAsPng(html);
      const filename = `shikishima-research-${report.date}.png`;
      const sent = await sendPngToDiscord(reportChannelId, png, filename);
      discordResult = {
        sent: sent.success,
        messageId: sent.messageId,
        error: sent.error,
        channelId: reportChannelId,
      };
    } catch (e) {
      discordResult = {
        sent: false,
        error: e instanceof Error ? e.message : "screenshot_failed",
        channelId: reportChannelId,
      };
    }
  } else {
    discordResult = {
      sent: false,
      error: "DISCORD_REPORT_CHANNEL_ID not configured",
      channelId: "",
    };
  }

  // Obsidian write
  const obsidianResult = writeResearchReport(report.filename, report.markdownContent);

  return {
    success: discordResult.sent && obsidianResult.success,
    report: {
      title: report.title,
      filename: report.filename,
      date: report.date,
    },
    discord: discordResult,
    obsidian: {
      written: obsidianResult.success,
      redactedPath: obsidianResult.redactedPath,
      error: obsidianResult.error,
    },
    rawValuesReported: false,
  };
}

// Build ResearchReportInput from Hermes x_search output
async function buildInputFromHermes(topicIndex = 0): Promise<ResearchReportInput | null> {
  const query = DAILY_RESEARCH_TOPICS[topicIndex % DAILY_RESEARCH_TOPICS.length];
  const result = await runHermesResearch(query);
  if (!result.success || !result.content) return null;

  const date = new Date().toISOString().slice(0, 10);
  return {
    date,
    title: `Shikishima Daily Research — ${date}`,
    topics: ["X-Research", "Grok-4.3", "xai-oauth"],
    gateId: "XS-AUTO-03",
    findings: result.content,
    keyPoints: [],
    sources: ["X (Twitter) via Hermes x_search + Grok 4.3", "xai-oauth / X Premium"],
  };
}

// Daily scheduler — call startDailyResearchPipeline() from Electron main
// Runs at the specified JST hour (default 08:00 JST = UTC+9)
let _schedulerTimer: ReturnType<typeof setInterval> | null = null;
let _topicIndex = 0;

export function startDailyResearchPipeline(
  reportFn?: () => Promise<ResearchReportInput | null>,
  targetJSTHour = 8,
): void {
  if (RESEARCH_PIPELINE_HOLD) {
    console.log("[ResearchPipeline] HOLD until explicit human GO");
    return;
  }
  if (_schedulerTimer) return;

  // Default to Hermes x_search if no custom reportFn provided
  const fn = reportFn ?? (() => buildInputFromHermes(_topicIndex++));

  _schedulerTimer = setInterval(
    () => {
      const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);
      if (nowJST.getUTCHours() === targetJSTHour && nowJST.getUTCMinutes() < 5) {
        fn()
          .then((input) => {
            if (input) return publishResearchReport(input);
            return null;
          })
          .catch((e) => console.error("[ResearchPipeline] error:", e));
      }
    },
    60_000, // check every minute
  );
}

export function stopDailyResearchPipeline(): void {
  if (_schedulerTimer) {
    clearInterval(_schedulerTimer);
    _schedulerTimer = null;
  }
}
