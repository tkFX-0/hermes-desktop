// Discord Bot Service — command intake + 5-agent routing + report delivery
// Poll-based (no discord.js dependency). Safe to start/stop from Electron main process.

import {
  readDiscordChannel,
  getDiscordChannelIds,
  type DiscordMessage,
} from "./discord-intake";
import { grokChat } from "./shikishima-grok-chat";
import { dispatchToAgent, agentLabel } from "./agent-router";
import { prepareDiscordReplyDraft } from "./shikishima-core";

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
    .filter((m) => !m.isBot) // ignore bot messages (prevents self-loop)
    .reverse(); // oldest first

  for (const msg of messages) {
    _lastMessageId = msg.id;
    if (_handler) {
      await _handler(msg, async (text) => {
        const draft = prepareDiscordReplyDraft({
          responseId: `discord-${msg.id}`,
          agentId: "shikishima",
          fullResponse: text,
          reasoningLevel: "standard",
          actionId: "DISCORD-BOT-REPLY-DRAFT",
          evidencePath: "docs/shikishima/DISCORD_REPLY_DRAFT_EVIDENCE.md",
        });
        console.log("[DiscordBot] reply draft prepared:", draft.preflight.gate.decision);
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

  // Seed _lastMessageId with the latest message already in the channel
  // so we don't re-process old messages on startup
  readDiscordChannel(commandChannelId, 1).then((seed) => {
    if (seed.success && seed.messages && seed.messages.length > 0) {
      _lastMessageId = seed.messages[0].id;
      console.log("[DiscordBot] seeded lastMessageId:", _lastMessageId);
    }
  }).catch(() => {/* ignore seed failure */});

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
  const draft = prepareDiscordReplyDraft({
    responseId: `discord-report-${Date.now()}`,
    agentId: "shirube",
    fullResponse: content,
    reasoningLevel: "standard",
    actionId: "DISCORD-REPORT-DRAFT",
    evidencePath: "docs/shikishima/DISCORD_REPORT_DRAFT_EVIDENCE.md",
  });
  return { ok: false, error: draft.preflight.gate.decision };
}

export { getState as getDiscordBotState };

// Grok 4.3 default handler — simple wrapper (used where 5-agent not needed)
export const shikishimaGrokHandler: CommandHandler = async (msg, reply) => {
  if (!msg.contentPreview.trim() || msg.authorName === "Shikishima") return;
  const result = await grokChat(msg.contentPreview);
  if (result.success && result.reply) {
    await reply(result.reply.slice(0, 2000));
  }
};

// 5-agent handler — routes Discord commands to appropriate agent
// Agent 1: Grok conversation / Agent 2: Claude Code / Agent 3: Hermes Research
// Agent 4: Grok FX analysis / Agent 5: Grok deep analysis
export const shikishima5AgentHandler: CommandHandler = async (msg, onReply) => {
  const content = msg.contentPreview.trim();
  if (!content || msg.authorName === "Shikishima") return;

  const result = await dispatchToAgent(content);
  const label = agentLabel(result.agentId);
  const body = result.success
    ? result.reply
    : `[エラー] ${result.error ?? "不明なエラー"}`;

  // Prefix reply with agent label for transparency
  const fullReply = `${label} ${body}`;
  await onReply(fullReply.slice(0, 2000));
};
