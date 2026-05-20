// DIS-01: Discord read-only intake
// Channel: 1498670816366428208 (shikishima dedicated channel)
// Token: read from 自立型AIイツキシマ .env at call time — never cached, never logged
// Status: DIS01_HOLD = true (explicit DIS-01 GO required for execution)

import { join } from "path";
import { readFileSync, existsSync } from "fs";
import * as https from "https";
import { homedir } from "os";

const ITSUKISHIMA_ENV_PATH = join(
  homedir(),
  "Desktop",
  "プロジェクトファイル",
  "自立型AIイツキシマ",
  ".env",
);

const APPROVED_CHANNEL_ID = "1498670816366428208";
const MAX_READ_COUNT = 10;

// DIS-01 one-shot read executed 2026-05-21 — gate restored to HOLD posture
const DIS01_HOLD = true;

export interface DiscordMessage {
  id: string;
  authorName: string; // username only — no discriminator, no snowflake
  contentPreview: string; // truncated at 200 chars
  timestamp: string;
}

export interface DiscordIntakeResult {
  readonly success: boolean;
  readonly messages?: DiscordMessage[];
  readonly error?: string;
  readonly channelIdConfirmed: string;
  readonly readCount: number;
  readonly rawTokenReported: false; // literal — token never in result
  readonly dis01Status: "HOLD" | "ACTIVE";
}

function readBotToken(): string | null {
  try {
    if (!existsSync(ITSUKISHIMA_ENV_PATH)) return null;
    const content = readFileSync(ITSUKISHIMA_ENV_PATH, "utf-8");
    const match = /^DISCORD_BOT_TOKEN=(.+)$/m.exec(content);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

export async function readDiscordChannel(
  limit: number = MAX_READ_COUNT,
): Promise<DiscordIntakeResult> {
  if (DIS01_HOLD) {
    return {
      success: false,
      error: "dis01_hold_pending_go",
      channelIdConfirmed: APPROVED_CHANNEL_ID,
      readCount: 0,
      rawTokenReported: false,
      dis01Status: "HOLD",
    };
  }

  // Unreachable until DIS01_HOLD = false via explicit human GO
  const count = Math.min(limit, MAX_READ_COUNT);
  const token = readBotToken();

  if (!token) {
    return {
      success: false,
      error: "token_not_found",
      channelIdConfirmed: APPROVED_CHANNEL_ID,
      readCount: 0,
      rawTokenReported: false,
      dis01Status: "ACTIVE",
    };
  }

  return new Promise((resolve) => {
    const options: https.RequestOptions = {
      hostname: "discord.com",
      path: `/api/v10/channels/${APPROVED_CHANNEL_ID}/messages?limit=${count}`,
      method: "GET",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "ShikishimaApp (shikishima, 1.0.0)",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const raw = JSON.parse(data) as Array<{
              id: string;
              author: { username: string };
              content: string;
              timestamp: string;
            }>;
            const messages: DiscordMessage[] = raw.map((m) => ({
              id: m.id,
              authorName: m.author.username,
              contentPreview: m.content.slice(0, 200),
              timestamp: m.timestamp,
            }));
            resolve({
              success: true,
              messages,
              channelIdConfirmed: APPROVED_CHANNEL_ID,
              readCount: messages.length,
              rawTokenReported: false,
              dis01Status: "ACTIVE",
            });
          } catch {
            resolve({
              success: false,
              error: "parse_error",
              channelIdConfirmed: APPROVED_CHANNEL_ID,
              readCount: 0,
              rawTokenReported: false,
              dis01Status: "ACTIVE",
            });
          }
        } else {
          resolve({
            success: false,
            error: `http_${res.statusCode}`,
            channelIdConfirmed: APPROVED_CHANNEL_ID,
            readCount: 0,
            rawTokenReported: false,
            dis01Status: "ACTIVE",
          });
        }
      });
    });

    req.on("error", (e: Error) => {
      resolve({
        success: false,
        error: e.message,
        channelIdConfirmed: APPROVED_CHANNEL_ID,
        readCount: 0,
        rawTokenReported: false,
        dis01Status: "ACTIVE",
      });
    });

    req.end();
  });
}
