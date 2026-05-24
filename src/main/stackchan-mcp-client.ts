/**
 * StackChan MCP Client — XiaoZhi cloud bridge (direct WSS/JSON-RPC)
 *
 * XiaoZhi broker protocol (discovered 2026-05-22):
 *   1. We connect → broker sends initialize (broker = MCP client, we = MCP server)
 *   2. We respond to broker's initialize + notifications/initialized
 *   3. Broker sends tools/list → we respond with empty list
 *   4. Session established → we can call StackChan tools via tools/call
 *
 * Token: read from .env.local as XIAOZHI_TOKEN, appended as ?token= query param.
 * Auto-reconnects every 10s when offline.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const DEVICE_ID = "441BF6E1E1E4";
const RECONNECT_MS = 10_000;
const RPC_TIMEOUT_MS = 15_000;

const ENV_LOCAL_PATH = join(
  homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".env.local",
);

function readXiaozhiToken(): string | null {
  try {
    if (!existsSync(ENV_LOCAL_PATH)) return null;
    const content = readFileSync(ENV_LOCAL_PATH, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const eq = trimmed.indexOf("=");
      const key = trimmed.substring(0, eq).trim();
      if (key === "XIAOZHI_TOKEN") return trimmed.substring(eq + 1).trim() || null;
    }
  } catch { /* ignore */ }
  return null;
}

function buildMcpUrl(): string {
  const token = readXiaozhiToken();
  const base = `wss://api.XiaoZhi.me/mcp/?device_id=${DEVICE_ID}`;
  return token ? `${base}&token=${token}` : base;
}

// Electron 29+ / Node.js 22 exposes WebSocket globally in main process.
// Main-process tsconfig uses types:["node"] so we access via globalThis.
interface ElectronWS {
  readonly readyState: 0 | 1 | 2 | 3;
  send(data: string): void;
  close(): void;
  addEventListener(event: "open",    cb: ()                          => void): void;
  addEventListener(event: "message", cb: (e: { data: string })      => void): void;
  addEventListener(event: "close",   cb: ()                          => void): void;
  addEventListener(event: "error",   cb: (e: unknown)                => void): void;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WS_CTOR = (globalThis as Record<string, unknown>)["WebSocket"] as
  ((new (url: string) => ElectronWS) & { OPEN: 1; CONNECTING: 0 }) | undefined;

interface RpcMsg {
  id?: number;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: { message: string };
  jsonrpc: "2.0";
}

export interface StackchanStatus {
  connected: boolean;
  tools: string[];
  error?: string;
}

let _ws: ElectronWS | null = null;
let _ready = false;
let _tools: string[] = [];
let _msgId = 100; // start high so broker's id:0,1 don't collide with ours
const _pending = new Map<number, {
  resolve: (v: unknown) => void;
  reject: (e: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}>();
let _reconnectTimer: ReturnType<typeof setTimeout> | null = null;

function nextId(): number { return _msgId++; }

function send(msg: object): void {
  if (_ws?.readyState === 1) _ws.send(JSON.stringify(msg));
}

function rpc<T>(method: string, params?: object): Promise<T> {
  return new Promise((resolve, reject) => {
    if (_ws?.readyState !== 1) { reject(new Error("not connected")); return; }
    const id = nextId();
    const timer = setTimeout(() => {
      _pending.delete(id);
      reject(new Error(`timeout: ${method}`));
    }, RPC_TIMEOUT_MS);
    _pending.set(id, { resolve: resolve as (v: unknown) => void, reject, timer });
    send({ jsonrpc: "2.0", id, method, ...(params ? { params } : {}) });
  });
}

function handleIncoming(raw: string): void {
  let msg: RpcMsg;
  try { msg = JSON.parse(raw) as RpcMsg; } catch { return; }

  // Response to one of our outgoing requests
  if (msg.id !== undefined && !msg.method) {
    const p = _pending.get(msg.id);
    if (p) {
      clearTimeout(p.timer);
      _pending.delete(msg.id);
      if (msg.error) p.reject(new Error(msg.error.message));
      else p.resolve(msg.result);
    }
    return;
  }

  // Incoming request FROM broker (we act as MCP server for the broker)
  if (msg.method === "initialize" && msg.id !== undefined) {
    // Broker sends initialize first — respond as MCP server
    send({ jsonrpc: "2.0", id: msg.id, result: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      serverInfo: { name: "shikishima-desktop", version: "1.0.0" },
    }});
    return;
  }

  if (msg.method === "notifications/initialized") {
    // Broker acknowledged — nothing to do
    return;
  }

  if (msg.method === "tools/list" && msg.id !== undefined) {
    // Broker asks what tools WE provide — answer empty (we're a caller, not a provider)
    send({ jsonrpc: "2.0", id: msg.id, result: { tools: [] } });
    // Session is now fully established — discover StackChan's tools
    discoverTools().catch(() => {/* StackChan offline */});
    return;
  }
}

async function discoverTools(): Promise<void> {
  try {
    const result = await rpc<{ tools: Array<{ name: string }> }>("tools/list");
    _tools = result.tools?.map((t) => t.name) ?? [];
    _ready = true;
    console.log("[StackChan MCP] Ready. Tools:", _tools.join(", ") || "(none)");
  } catch (e) {
    console.warn("[StackChan MCP] tools/list failed (StackChan offline?):", (e as Error).message);
    _ws?.close();
  }
}

function clearPending(reason: string): void {
  for (const { reject, timer } of _pending.values()) {
    clearTimeout(timer);
    reject(new Error(reason));
  }
  _pending.clear();
}

function scheduleReconnect(): void {
  if (_reconnectTimer) return;
  _reconnectTimer = setTimeout(() => { _reconnectTimer = null; connect(); }, RECONNECT_MS);
}

export function connect(): void {
  if (!WS_CTOR) { console.warn("[StackChan MCP] WebSocket not available."); return; }
  if (_ws && (_ws.readyState === 0 || _ws.readyState === 1)) return;

  _ready = false; _tools = [];

  try { _ws = new WS_CTOR(buildMcpUrl()); }
  catch (e) { console.warn("[StackChan MCP] Socket create failed:", e); scheduleReconnect(); return; }

  _ws.addEventListener("open", () => {
    // Broker will send initialize first — wait passively
    console.log("[StackChan MCP] WSS open, waiting for broker initialize...");
  });

  _ws.addEventListener("message", (e) => handleIncoming(e.data));

  _ws.addEventListener("close", () => {
    const wasReady = _ready;
    _ready = false; _tools = [];
    clearPending("disconnected");
    if (wasReady) console.log("[StackChan MCP] Disconnected.");
    scheduleReconnect();
  });

  _ws.addEventListener("error", () => { /* close always follows */ });
}

export function disconnect(): void {
  if (_reconnectTimer) { clearTimeout(_reconnectTimer); _reconnectTimer = null; }
  clearPending("disconnecting");
  _ws?.close(); _ws = null; _ready = false;
}

export function getStatus(): StackchanStatus {
  return { connected: _ready, tools: _tools };
}

export async function stackchanSay(text: string): Promise<{ ok: boolean; error?: string }> {
  if (!_ready) return { ok: false, error: "StackChan offline" };
  try {
    await rpc("tools/call", { name: "say", arguments: { text } });
    return { ok: true };
  } catch (e) { return { ok: false, error: (e as Error).message }; }
}

export async function stackchanFace(emotion: string): Promise<{ ok: boolean; error?: string }> {
  if (!_ready || !_tools.includes("face")) return { ok: false, error: "face tool not available" };
  try {
    await rpc("tools/call", { name: "face", arguments: { emotion } });
    return { ok: true };
  } catch (e) { return { ok: false, error: (e as Error).message }; }
}
