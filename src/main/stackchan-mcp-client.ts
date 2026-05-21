/**
 * StackChan MCP Client — XiaoZhi cloud bridge (direct WSS/JSON-RPC)
 * Connects to wss://api.XiaoZhi.me/mcp/?device_id=...
 * StackChan must be powered on and connected to XiaoZhi cloud.
 * Auto-reconnects every 10s when offline.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

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
  const base = "wss://api.XiaoZhi.me/mcp/?device_id=441BF6E1E1E4";
  return token ? `${base}&token=${token}` : base;
}
const RECONNECT_INTERVAL_MS = 10_000;
const RPC_TIMEOUT_MS = 15_000;

// Electron 29+ / Node.js 22 exposes WebSocket as a global in the main process.
// The main-process tsconfig uses types:["node"] which lacks the browser type —
// so we access it via globalThis without relying on the DOM lib type declaration.
interface ElectronWebSocket {
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
  ((new (url: string) => ElectronWebSocket) & { OPEN: 1; CONNECTING: 0 }) | undefined;

interface McpTool {
  name: string;
}

interface RpcResponse {
  id?: number;
  result?: unknown;
  error?: { message: string };
  method?: string;
}

export interface StackchanStatus {
  connected: boolean;
  tools: string[];
  error?: string;
}

let _ws: ElectronWebSocket | null = null;
let _ready = false;
let _tools: string[] = [];
let _msgId = 1;
let _pending = new Map<number, {
  resolve: (v: unknown) => void;
  reject: (e: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}>();
let _reconnectTimer: ReturnType<typeof setTimeout> | null = null;

function nextId(): number { return _msgId++; }

function sendRaw(msg: object): void {
  if (_ws && _ws.readyState === 1 /* OPEN */) {
    _ws.send(JSON.stringify(msg));
  }
}

function rpc<T>(method: string, params?: object): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!_ws || _ws.readyState !== 1) {
      reject(new Error("StackChan not connected"));
      return;
    }
    const id = nextId();
    const timer = setTimeout(() => {
      _pending.delete(id);
      reject(new Error(`MCP timeout: ${method}`));
    }, RPC_TIMEOUT_MS);

    _pending.set(id, {
      resolve: resolve as (v: unknown) => void,
      reject,
      timer,
    });
    sendRaw({ jsonrpc: "2.0", id, method, ...(params ? { params } : {}) });
  });
}

function onMessage(raw: string): void {
  let msg: RpcResponse;
  try { msg = JSON.parse(raw) as RpcResponse; } catch { return; }
  if (msg.id === undefined) return;
  const p = _pending.get(msg.id);
  if (!p) return;
  clearTimeout(p.timer);
  _pending.delete(msg.id);
  if (msg.error) {
    p.reject(new Error(msg.error.message));
  } else {
    p.resolve(msg.result);
  }
}

function clearPending(reason: string): void {
  for (const { reject, timer } of _pending.values()) {
    clearTimeout(timer);
    reject(new Error(reason));
  }
  _pending.clear();
}

async function handshake(): Promise<void> {
  await rpc("initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "shikishima-desktop", version: "1.0.0" },
  });
  sendRaw({ jsonrpc: "2.0", method: "notifications/initialized" });

  const result = await rpc<{ tools: McpTool[] }>("tools/list");
  _tools = (result as { tools: McpTool[] }).tools?.map((t) => t.name) ?? [];
  _ready = true;
  console.log("[StackChan MCP] Connected. Tools:", _tools.join(", "));
}

function scheduleReconnect(): void {
  if (_reconnectTimer) return;
  _reconnectTimer = setTimeout(() => {
    _reconnectTimer = null;
    connect();
  }, RECONNECT_INTERVAL_MS);
}

export function connect(): void {
  if (!WS_CTOR) {
    console.warn("[StackChan MCP] WebSocket not available in this environment.");
    return;
  }
  if (_ws && (_ws.readyState === 0 || _ws.readyState === 1)) return; // already connecting/open

  _ready = false;
  _tools = [];

  try {
    _ws = new WS_CTOR(buildMcpUrl());
  } catch (e) {
    console.warn("[StackChan MCP] Failed to create socket:", e);
    scheduleReconnect();
    return;
  }

  _ws.addEventListener("open", () => {
    handshake().catch((e) => {
      console.warn("[StackChan MCP] Handshake failed (StackChan offline?):", (e as Error).message);
      _ws?.close();
    });
  });

  _ws.addEventListener("message", (e) => onMessage(e.data));

  _ws.addEventListener("close", () => {
    const wasReady = _ready;
    _ready = false;
    _tools = [];
    clearPending("Connection closed");
    if (wasReady) console.log("[StackChan MCP] Disconnected.");
    scheduleReconnect();
  });

  _ws.addEventListener("error", () => {
    // close event always follows; nothing to do here
  });
}

export function disconnect(): void {
  if (_reconnectTimer) { clearTimeout(_reconnectTimer); _reconnectTimer = null; }
  clearPending("Disconnecting");
  _ws?.close();
  _ws = null;
  _ready = false;
}

export function getStatus(): StackchanStatus {
  return { connected: _ready, tools: _tools };
}

export async function stackchanSay(text: string): Promise<{ ok: boolean; error?: string }> {
  if (!_ready) return { ok: false, error: "StackChan offline" };
  try {
    await rpc("tools/call", { name: "say", arguments: { text } });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function stackchanFace(emotion: string): Promise<{ ok: boolean; error?: string }> {
  if (!_ready || !_tools.includes("face")) return { ok: false, error: "face tool not available" };
  try {
    await rpc("tools/call", { name: "face", arguments: { emotion } });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
