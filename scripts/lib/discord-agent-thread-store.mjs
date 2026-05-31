/**
 * Hermes gateway SessionStore 相当 — Discord 部屋×エージェント別スレッド記憶。
 * ~/.hermes/sessions/*.json と同様、再起動後も会話継続できる JSON 永続化。
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { AGENT_TEAM_IDS } from "./dispatch-agent-reply.mjs";
import { redactMessagePreview } from "./discord-read-intake.mjs";

function getMemRoot() {
  const override = process.env.SHIKISHIMA_THREAD_MEM_OVERRIDE?.trim();
  if (override) return override;
  return join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".shikishima-memory");
}

function getThreadDir() {
  return join(getMemRoot(), "discord-threads");
}

const MAX_SHARED = 40;
const MAX_AGENT_TURNS = 24;
const MAX_CONTENT_STORE = 600;

const AGENT_LABELS = {
  shikishima: "しきしま",
  shizume: "しずめ",
  tsumugi: "つむぎ",
  hajime: "はじめ",
  shirube: "しるべ",
  chihaya: "ちはや"
};

function threadPath(channelId) {
  const safe = String(channelId ?? "unknown").replace(/\W/g, "_");
  return join(getThreadDir(), `${safe}.json`);
}

function ensureThreadDir() {
  const dir = getThreadDir();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function redactForStore(text) {
  return redactMessagePreview(String(text ?? "").replace(/\n/g, " ")).slice(0, MAX_CONTENT_STORE);
}

function emptyChannelState(channelId) {
  const agents = {};
  for (const id of AGENT_TEAM_IDS) {
    agents[id] = { messages: [] };
  }
  return {
    channelId: String(channelId),
    updatedAt: new Date().toISOString(),
    sharedLog: [],
    agents
  };
}

/**
 * @param {string} channelId
 */
export function loadChannelThreads(channelId) {
  ensureThreadDir();
  const p = threadPath(channelId);
  if (!existsSync(p)) return emptyChannelState(channelId);
  try {
    const data = JSON.parse(readFileSync(p, "utf-8"));
    const base = emptyChannelState(channelId);
    return {
      ...base,
      ...data,
      channelId: String(channelId),
      sharedLog: Array.isArray(data.sharedLog) ? data.sharedLog : [],
      agents: { ...base.agents, ...(data.agents ?? {}) }
    };
  } catch {
    return emptyChannelState(channelId);
  }
}

/**
 * @param {string} channelId
 * @param {object} state
 */
export function saveChannelThreads(channelId, state) {
  ensureThreadDir();
  state.updatedAt = new Date().toISOString();
  state.channelId = String(channelId);
  const p = threadPath(channelId);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(state, null, 2), "utf-8");
}

/**
 * @param {string} channelId
 * @param {object} entry
 * @param {"user"|"assistant"} entry.role
 * @param {string} [entry.agentId]
 * @param {string} entry.content
 * @param {string} [entry.messageId]
 * @param {string} [entry.authorLabel]
 */
export function appendThreadMessage(channelId, entry) {
  const state = loadChannelThreads(channelId);
  const at = new Date().toISOString().slice(0, 19);
  const row = {
    role: entry.role,
    agentId: entry.agentId ?? null,
    content: redactForStore(entry.content),
    at,
    messageIdTail: entry.messageId ? String(entry.messageId).slice(-8) : undefined,
    authorLabel: entry.authorLabel ? String(entry.authorLabel).slice(0, 20) : undefined
  };

  state.sharedLog.push(row);
  state.sharedLog = state.sharedLog.slice(-MAX_SHARED);

  const threadAgentId = entry.threadAgentId ?? entry.agentId;
  if (entry.role === "user" && threadAgentId && state.agents[threadAgentId]) {
    state.agents[threadAgentId].messages.push({
      role: "user",
      content: row.content,
      at
    });
    state.agents[threadAgentId].messages = state.agents[threadAgentId].messages.slice(
      -MAX_AGENT_TURNS
    );
  }

  if (entry.role === "assistant" && entry.agentId && state.agents[entry.agentId]) {
    state.agents[entry.agentId].messages.push({
      role: "assistant",
      content: row.content,
      at
    });
    state.agents[entry.agentId].messages = state.agents[entry.agentId].messages.slice(
      -MAX_AGENT_TURNS
    );
  }

  saveChannelThreads(channelId, state);
  return row;
}

/**
 * sharedLog から per-agent スレッドを再構築（hydrate 後など）
 * @param {string} channelId
 */
export function rebuildPerAgentThreadsFromShared(channelId) {
  const state = loadChannelThreads(channelId);
  for (const id of AGENT_TEAM_IDS) {
    state.agents[id].messages = [];
  }
  const chron = [...state.sharedLog].sort((a, b) => String(a.at).localeCompare(String(b.at)));
  for (const row of chron) {
    if (row.role === "user") {
      for (const id of AGENT_TEAM_IDS) {
        state.agents[id].messages.push({
          role: "user",
          content: row.content,
          at: row.at
        });
        state.agents[id].messages = state.agents[id].messages.slice(-MAX_AGENT_TURNS);
      }
    } else if (row.role === "assistant" && row.agentId && state.agents[row.agentId]) {
      state.agents[row.agentId].messages.push({
        role: "assistant",
        content: row.content,
        at: row.at
      });
      state.agents[row.agentId].messages = state.agents[row.agentId].messages.slice(-MAX_AGENT_TURNS);
    }
  }
  saveChannelThreads(channelId, state);
}

/**
 * スレッド先頭から conversation-summary を更新（P1）
 * @param {string} channelId
 */
export function syncConversationSummaryFromThread(channelId) {
  const state = loadChannelThreads(channelId);
  if (!state.sharedLog.length) return;
  const chron = [...state.sharedLog].sort((a, b) => String(a.at).localeCompare(String(b.at)));
  const tail = chron.slice(-6);
  const summary = tail
    .map((r) => {
      const who =
        r.role === "user" ? r.authorLabel ?? "ユーザー" : AGENT_LABELS[r.agentId] ?? "Bot";
      return `${who}: ${r.content.slice(0, 50)}`;
    })
    .join(" / ")
    .slice(0, 480);
  const agentDecisions = {};
  for (const id of AGENT_TEAM_IDS) {
    const msgs = state.agents[id]?.messages ?? [];
    const last = msgs[msgs.length - 1];
    if (last) agentDecisions[id] = last.content.slice(0, 80);
  }
  const memPath = join(getMemRoot(), "conversation-summary.json");
  try {
    writeFileSync(
      memPath,
      JSON.stringify(
        {
          date: new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }),
          summary,
          agentDecisions,
          savedAt: new Date().toISOString(),
          source: `discord-thread:${channelId}`
        },
        null,
        2
      ),
      "utf-8"
    );
  } catch {
    /* best-effort */
  }
}

/**
 * Discord GET 結果を sharedLog にマージ（既存 id はスキップ）
 * @param {string} channelId
 * @param {Array<{ id: string, authorName?: string, contentPreview?: string, timestamp?: string, isBot?: boolean, agentId?: string }>} rows
 */
export function mergeDiscordSnapshotIntoThread(channelId, rows) {
  if (!rows?.length) return 0;
  const state = loadChannelThreads(channelId);
  const existing = new Set(
    state.sharedLog.map((r) => r.messageIdTail).filter(Boolean)
  );
  let added = 0;
  for (const m of rows) {
    const tail = String(m.id ?? "").slice(-8);
    if (tail && existing.has(tail)) continue;
    const role = m.isBot ? "assistant" : "user";
    state.sharedLog.push({
      role,
      agentId: m.agentId ?? (m.isBot ? "shikishima" : null),
      content: redactForStore(m.contentPreview ?? ""),
      at: String(m.timestamp ?? "").slice(0, 19),
      messageIdTail: tail || undefined,
      authorLabel: m.authorName
    });
    if (tail) existing.add(tail);
    added++;
  }
  state.sharedLog.sort((a, b) => String(a.at).localeCompare(String(b.at)));
  state.sharedLog = state.sharedLog.slice(-MAX_SHARED);
  saveChannelThreads(channelId, state);
  rebuildPerAgentThreadsFromShared(channelId);
  return added;
}

/**
 * @param {string} channelId
 * @param {string} agentId
 * @param {{ maxChars?: number }} [opts]
 */
export function buildAgentThreadContext(channelId, agentId, opts = {}) {
  const maxChars = opts.maxChars ?? 1400;
  const state = loadChannelThreads(channelId);
  const agentMsgs = state.agents[agentId]?.messages ?? [];
  const lines = [`[${AGENT_LABELS[agentId] ?? agentId} スレッド — 直近]`];

  for (const m of agentMsgs.slice(-12)) {
    const who = m.role === "user" ? "ユーザー" : AGENT_LABELS[agentId] ?? agentId;
    lines.push(`${who}(${m.at}): ${m.content}`);
  }

  const shared = state.sharedLog.slice(-10);
  if (shared.length) {
    lines.push("[部屋共有ログ 直近]");
    for (const s of shared) {
      const who =
        s.role === "user"
          ? s.authorLabel ?? "ユーザー"
          : AGENT_LABELS[s.agentId] ?? s.agentId ?? "Bot";
      lines.push(`${who}(${s.at}): ${s.content}`);
    }
  }

  return lines.join("\n").slice(0, maxChars);
}

/**
 * @param {string} channelId
 */
export function buildRoomStatusReport(channelId) {
  const state = loadChannelThreads(channelId);
  const lines = [
    "🏯 **しきしま** — 部屋状況（スレッド記憶）",
    `更新: ${state.updatedAt?.slice(0, 19) ?? "unknown"}`,
    `共有ログ: ${state.sharedLog.length} 件`,
    ""
  ];

  for (const id of AGENT_TEAM_IDS) {
    const msgs = state.agents[id]?.messages ?? [];
    const last = msgs[msgs.length - 1];
    const label = AGENT_LABELS[id] ?? id;
    lines.push(
      last
        ? `• ${label}: 直近 ${last.at} — ${last.content.slice(0, 72)}`
        : `• ${label}: （スレッド空）`
    );
  }

  if (state.sharedLog.length) {
    lines.push("", "【部屋 直近3件】");
    for (const s of [...state.sharedLog].slice(-3).reverse()) {
      const who =
        s.role === "user"
          ? s.authorLabel ?? "ユーザー"
          : AGENT_LABELS[s.agentId] ?? "Bot";
      lines.push(`  ${who}: ${s.content.slice(0, 60)}`);
    }
  }

  return lines.join("\n").slice(0, 1900);
}

export { AGENT_TEAM_IDS, AGENT_LABELS, getMemRoot, getThreadDir };
