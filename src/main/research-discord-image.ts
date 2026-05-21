// Sends a PNG buffer to a Discord channel as a file attachment.
// Uses multipart/form-data over native https (no discord.js needed).

import * as https from "https";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const ENV_LOCAL_PATH = join(
  homedir(),
  "Desktop",
  "プロジェクトファイル",
  "hermes-desktop",
  ".env.local",
);

function readToken(): string | null {
  try {
    if (!existsSync(ENV_LOCAL_PATH)) return null;
    const content = readFileSync(ENV_LOCAL_PATH, "utf-8");
    const m = /^DISCORD_BOT_TOKEN=(.+)$/m.exec(content);
    return m ? m[1].trim() : null;
  } catch {
    return null;
  }
}

export interface DiscordImageSendResult {
  readonly success: boolean;
  readonly messageId?: string;
  readonly error?: string;
  readonly rawTokenReported: false;
}

export async function sendPngToDiscord(
  channelId: string,
  pngBuffer: Buffer,
  filename: string,
  caption?: string,
): Promise<DiscordImageSendResult> {
  const token = readToken();
  if (!token) {
    return { success: false, error: "token_not_found", rawTokenReported: false };
  }

  const boundary = `----ShikishimaBoundary${Date.now()}`;
  const CRLF = "\r\n";

  const parts: Buffer[] = [];

  // Part 1: payload_json (caption as message content)
  if (caption) {
    const payload = JSON.stringify({ content: caption });
    parts.push(
      Buffer.from(
        `--${boundary}${CRLF}` +
          `Content-Disposition: form-data; name="payload_json"${CRLF}` +
          `Content-Type: application/json${CRLF}${CRLF}` +
          payload +
          CRLF,
        "utf-8",
      ),
    );
  }

  // Part 2: file
  parts.push(
    Buffer.from(
      `--${boundary}${CRLF}` +
        `Content-Disposition: form-data; name="files[0]"; filename="${filename}"${CRLF}` +
        `Content-Type: image/png${CRLF}${CRLF}`,
      "utf-8",
    ),
  );
  parts.push(pngBuffer);
  parts.push(Buffer.from(`${CRLF}--${boundary}--${CRLF}`, "utf-8"));

  const body = Buffer.concat(parts);

  return new Promise((resolve) => {
    const options: https.RequestOptions = {
      hostname: "discord.com",
      path: `/api/v10/channels/${channelId}/messages`,
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": body.length,
        "User-Agent": "ShikishimaApp (shikishima, 1.0.0)",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          try {
            const parsed = JSON.parse(data) as { id?: string };
            resolve({ success: true, messageId: parsed.id, rawTokenReported: false });
          } catch {
            resolve({ success: false, error: "parse_error", rawTokenReported: false });
          }
        } else {
          resolve({
            success: false,
            error: `http_${res.statusCode}: ${data.slice(0, 200)}`,
            rawTokenReported: false,
          });
        }
      });
    });

    req.on("error", (e: Error) =>
      resolve({ success: false, error: e.message, rawTokenReported: false }),
    );
    req.write(body);
    req.end();
  });
}
