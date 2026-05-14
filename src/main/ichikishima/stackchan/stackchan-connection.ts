import type { StackChanConfig, StackChanExpressionState } from "./stackchan-config";
import { checkStackChanSafety } from "./stackchan-safety-gate";
import { buildExpressionPayload } from "./stackchan-expression";

export type StackChanConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface StackChanConnectionResult {
  success: boolean;
  status: StackChanConnectionStatus;
  message?: string;
}

// IPv4アドレスのバリデーション (プライベートIP拒否)
function validateStackChanIp(ip: string): { ok: true } | { ok: false; reason: string } {
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip);
  if (!ipv4) return { ok: false, reason: "Invalid IPv4 format" };

  const octets = [ipv4[1], ipv4[2], ipv4[3], ipv4[4]].map((s) => parseInt(s, 10));
  const [a, b] = octets;
  if (octets.some((n) => n < 0 || n > 255)) {
    return { ok: false, reason: "Octet out of range" };
  }

  // StackChan は LAN 内デバイスなので 192.168.x.x のみ許可
  // 127.x / 169.254.x / 10.x / 172.16-31.x / 0.x はブロック
  if (a === 127 || a === 0 || a === 169) {
    return { ok: false, reason: `Blocked IP range: ${ip}` };
  }
  if (a === 10) {
    return { ok: false, reason: `Blocked IP range: ${ip}` };
  }
  if (a === 172 && b >= 16 && b <= 31) {
    return { ok: false, reason: `Blocked IP range: ${ip}` };
  }
  return { ok: true };
}

function validateStackChanPort(port: number): { ok: true } | { ok: false; reason: string } {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return { ok: false, reason: `Invalid port: ${port}` };
  }
  return { ok: true };
}

// WiFi接続テスト (デバイス到着後に使用)
export async function testConnection(
  config: StackChanConfig,
): Promise<StackChanConnectionResult> {
  const safety = checkStackChanSafety(config, "connect");
  if (!safety.allowed) {
    return { success: false, status: "disconnected", message: safety.reason };
  }

  if (config.connectionMode === "wifi") {
    const ipCheck = validateStackChanIp(config.wifiIp);
    if (!ipCheck.ok) {
      return { success: false, status: "error", message: ipCheck.reason };
    }
    const portCheck = validateStackChanPort(config.wifiPort);
    if (!portCheck.ok) {
      return { success: false, status: "error", message: portCheck.reason };
    }
    return testWifiConnection(config);
  }

  return { success: false, status: "error", message: "Unsupported mode" };
}

async function testWifiConnection(
  config: StackChanConfig,
): Promise<StackChanConnectionResult> {
  const url = `http://${config.wifiIp}:${config.wifiPort}/ping`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      return { success: true, status: "connected" };
    }
    return {
      success: false,
      status: "error",
      message: `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      success: false,
      status: "error",
      message: err instanceof Error ? err.message : "Connection failed",
    };
  }
}

// 表情コマンド送信 (expressionOnly mode)
export async function sendExpression(
  config: StackChanConfig,
  expression: StackChanExpressionState,
): Promise<StackChanConnectionResult> {
  const safety = checkStackChanSafety(config, "expression");
  if (!safety.allowed) {
    return { success: false, status: "disconnected", message: safety.reason };
  }

  if (config.connectionMode === "wifi") {
    const ipCheck = validateStackChanIp(config.wifiIp);
    if (!ipCheck.ok) {
      return { success: false, status: "error", message: ipCheck.reason };
    }
    const portCheck = validateStackChanPort(config.wifiPort);
    if (!portCheck.ok) {
      return { success: false, status: "error", message: portCheck.reason };
    }
    return sendExpressionWifi(config, expression);
  }

  return { success: false, status: "error", message: "Unsupported mode" };
}

async function sendExpressionWifi(
  config: StackChanConfig,
  expression: StackChanExpressionState,
): Promise<StackChanConnectionResult> {
  const url = `http://${config.wifiIp}:${config.wifiPort}/expression`;
  const payload = buildExpressionPayload({ expression });
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    if (res.ok) {
      return { success: true, status: "connected" };
    }
    return { success: false, status: "error", message: `HTTP ${res.status}` };
  } catch (err) {
    return {
      success: false,
      status: "error",
      message: err instanceof Error ? err.message : "Send failed",
    };
  }
}
