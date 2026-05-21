// DIS-01: Discord intake + send (Shikishima bot)
// Token: read from hermes-desktop/.env.local at call time — never cached, never logged
// Status: DIS01_HOLD = true for read-polling; send is active after explicit GO

import { join } from "path";
import { readFileSync, existsSync } from "fs";
import * as https from "https";
import { homedir } from "os";

const ENV_LOCAL_PATH = join(
  homedir(),
  "Desktop",
  "プロジェクトファイル",
  "hermes-desktop",
  ".env.local",
);

// DIS-01 command-read gate — requires explicit human GO to activate polling
const DIS01_HOLD = true;

const MAX_READ_COUNT = 10;

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
  readonly rawTokenReported: false;
  readonly dis01Status: "HOLD" | "ACTIVE";
}

export interface DiscordSendResult {
  readonly success: boolean;
  readonly messageId?: string;
  readonly error?: string;
  readonly rawTokenReported: false;
}

function readEnvLocal(): Record<string, string> {
  try {
    if (!existsSync(ENV_LOCAL_PATH)) return {};
    const content = readFileSync(ENV_LOCAL_PATH, "utf-8");
    const result: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const eq = trimmed.indexOf("=");
      const key = trimmed.substring(0, eq).trim();
      const val = trimmed.substring(eq + 1).trim();
      if (key && val) result[key] = val;
    }
    return result;
  } catch {
    return {};
  }
}

function readBotToken(): string | null {
  const env = readEnvLocal();
  return env["DISCORD_BOT_TOKEN"] ?? null;
}

function makeRequest(
  options: https.RequestOptions,
  body?: string,
): Promise<{ statusCode: number; data: string }> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () =>
        resolve({ statusCode: res.statusCode ?? 0, data }),
      );
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

export async function readDiscordChannel(
  channelId: string,
  limit: number = MAX_READ_COUNT,
): Promise<DiscordIntakeResult> {
  if (DIS01_HOLD) {
    return {
      success: false,
      error: "dis01_hold_pending_go",
      channelIdConfirmed: channelId,
      readCount: 0,
      rawTokenReported: false,
      dis01Status: "HOLD",
    };
  }

  const token = readBotToken();
  if (!token) {
    return {
      success: false,
      error: "token_not_found",
      channelIdConfirmed: channelId,
      readCount: 0,
      rawTokenReported: false,
      dis01Status: "ACTIVE",
    };
  }

  const count = Math.min(limit, MAX_READ_COUNT);
  try {
    const { statusCode, data } = await makeRequest({
      hostname: "discord.com",
      path: `/api/v10/channels/${channelId}/messages?limit=${count}`,
      method: "GET",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "ShikishimaApp (shikishima, 1.0.0)",
      },
    });

    if (statusCode === 200) {
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
      return {
        success: true,
        messages,
        channelIdConfirmed: channelId,
        readCount: messages.length,
        rawTokenReported: false,
        dis01Status: "ACTIVE",
      };
    }

    return {
      success: false,
      error: `http_${statusCode}`,
      channelIdConfirmed: channelId,
      readCount: 0,
      rawTokenReported: false,
      dis01Status: "ACTIVE",
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "unknown",
      channelIdConfirmed: channelId,
      readCount: 0,
      rawTokenReported: false,
      dis01Status: "ACTIVE",
    };
  }
}

export async function sendDiscordMessage(
  channelId: string,
  content: string,
): Promise<DiscordSendResult> {
  if (!channelId) {
    return { success: false, error: "channel_id_not_configured", rawTokenReported: false };
  }

  const token = readBotToken();
  if (!token) {
    return { success: false, error: "token_not_found", rawTokenReported: false };
  }

  const body = JSON.stringify({ content: content.slice(0, 2000) });

  try {
    const { statusCode, data } = await makeRequest(
      {
        hostname: "discord.com",
        path: `/api/v10/channels/${channelId}/messages`,
        method: "POST",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          "User-Agent": "ShikishimaApp (shikishima, 1.0.0)",
        },
      },
      body,
    );

    if (statusCode === 200 || statusCode === 201) {
      const parsed = JSON.parse(data) as { id?: string };
      return { success: true, messageId: parsed.id, rawTokenReported: false };
    }

    return { success: false, error: `http_${statusCode}`, rawTokenReported: false };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "unknown",
      rawTokenReported: false,
    };
  }
}

export function getDiscordChannelIds(): {
  commandChannelId: string;
  reportChannelId: string;
  guildId: string;
} {
  const env = readEnvLocal();
  return {
    commandChannelId: env["DISCORD_COMMAND_CHANNEL_ID"] ?? "",
    reportChannelId: env["DISCORD_REPORT_CHANNEL_ID"] ?? "",
    guildId: env["DISCORD_GUILD_ID"] ?? "",
  };
}
