// Research Pipeline
// XS-AUTO findings → single article → Discord (しきしまレポート) + Obsidian (40_Research/)
// Daily cron trigger or manual IPC call.

import { generateResearchReport, type ResearchReportInput } from "./research-report-generator";
import { writeResearchReport } from "./research-report-writer";
import { getDiscordChannelIds } from "./discord-intake";
import { renderArticleHtml } from "./research-article-html";
import { captureHtmlAsPng } from "./research-screenshot";
import { sendPngToDiscord } from "./research-discord-image";

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

// Daily scheduler — call startDailyResearchPipeline() from Electron main
// Runs at the specified JST hour (default 08:00 JST = UTC+9)
let _schedulerTimer: ReturnType<typeof setInterval> | null = null;

export function startDailyResearchPipeline(
  reportFn: () => Promise<ResearchReportInput | null>,
  targetJSTHour = 8,
): void {
  if (_schedulerTimer) return;

  _schedulerTimer = setInterval(
    () => {
      const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);
      if (nowJST.getUTCHours() === targetJSTHour && nowJST.getUTCMinutes() < 5) {
        reportFn()
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
