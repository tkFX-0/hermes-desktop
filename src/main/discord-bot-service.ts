// Discord Bot Service — command intake + report delivery
// Poll-based (no discord.js dependency). Safe to start/stop from Electron main process.

import {
  readDiscordChannel,
  sendDiscordMessage,
  getDiscordChannelIds,
  type DiscordMessage,
} from "./discord-intake";

export type CommandHandler = (
  message: DiscordMessage,
  reply: (text: string) => Promise<void>,
) => Promise<void>;

export interface DiscordBotServiceState {
  running: boolean;
  commandChannelId: string;
  reportChannelId: string;
  lastProcessedMessageId: string | null;
  pollIntervalMs: number;
}

const DEFAULT_POLL_INTERVAL_MS = 10_000; // 10 seconds

let _timer: ReturnType<typeof setInterval> | null = null;
let _lastMessageId: string | null = null;
let _handler: CommandHandler | null = null;
let _running = false;

function getState(): DiscordBotServiceState {
  const { commandChannelId, reportChannelId } = getDiscordChannelIds();
  return {
    running: _running,
    commandChannelId,
    reportChannelId,
    lastProcessedMessageId: _lastMessageId,
    pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
  };
}

async function pollCommandChannel(): Promise<void> {
  const { commandChannelId } = getDiscordChannelIds();
  if (!commandChannelId) return;

  const result = await readDiscordChannel(commandChannelId, 10);
  if (!result.success || !result.messages) return;

  const messages = result.messages
    .filter((m) => !_lastMessageId || m.id > _lastMessageId)
    .reverse(); // oldest first

  for (const msg of messages) {
    _lastMessageId = msg.id;
    if (_handler) {
      await _handler(msg, async (text) => {
        await sendDiscordMessage(commandChannelId, text);
      });
    }
  }
}

export function startDiscordBot(handler: CommandHandler): { ok: boolean; reason?: string } {
  if (_running) return { ok: false, reason: "already_running" };

  const { commandChannelId } = getDiscordChannelIds();
  if (!commandChannelId) {
    return { ok: false, reason: "DISCORD_COMMAND_CHANNEL_ID not set in .env.local" };
  }

  _handler = handler;
  _running = true;
  _timer = setInterval(() => {
    pollCommandChannel().catch((e) =>
      console.error("[DiscordBot] poll error:", e),
    );
  }, DEFAULT_POLL_INTERVAL_MS);

  return { ok: true };
}

export function stopDiscordBot(): void {
  if (_timer) {
    clearInterval(_timer);
    _timer = null;
  }
  _running = false;
  _handler = null;
}

export async function sendReport(content: string): Promise<{ ok: boolean; error?: string }> {
  const { reportChannelId } = getDiscordChannelIds();
  if (!reportChannelId) {
    return { ok: false, error: "DISCORD_REPORT_CHANNEL_ID not set in .env.local" };
  }
  const result = await sendDiscordMessage(reportChannelId, content);
  return { ok: result.success, error: result.error };
}

export { getState as getDiscordBotState };
