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

// WiFi接続テスト (デバイス到着後に使用)
export async function testConnection(
  config: StackChanConfig,
): Promise<StackChanConnectionResult> {
  const safety = checkStackChanSafety(config, "connect");
  if (!safety.allowed) {
    return { success: false, status: "disconnected", message: safety.reason };
  }

  if (config.connectionMode === "wifi") {
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
