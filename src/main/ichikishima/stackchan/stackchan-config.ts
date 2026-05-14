export type StackChanConnectionMode = "wifi" | "serial" | "none";

export interface StackChanConfig {
  enabled: boolean;
  connectionMode: StackChanConnectionMode;
  wifiIp: string;
  wifiPort: number;
  serialPort: string;
  serialBaud: number;
  expressionOnly: boolean;
  motionEnabled: boolean;
}

export const STACKCHAN_DEFAULT_CONFIG: StackChanConfig = {
  enabled: false,
  connectionMode: "none",
  wifiIp: "192.168.1.100",
  wifiPort: 8080,
  serialPort: "COM3",
  serialBaud: 115200,
  expressionOnly: true,
  motionEnabled: false,
};

export const STACKCHAN_EXPRESSION_STATES = [
  "neutral",
  "hold",
  "thinking",
  "warning",
  "completed",
  "stop",
  "happy",
  "sad",
] as const;

export type StackChanExpressionState =
  typeof STACKCHAN_EXPRESSION_STATES[number];

export const SAFETY_EXPRESSION_MAP: Record<string, StackChanExpressionState> = {
  HOLD: "hold",
  THINKING: "thinking",
  WARNING: "warning",
  COMPLETED: "completed",
  STOP: "stop",
  HAPPY: "happy",
  SAD: "sad",
  NEUTRAL: "neutral",
};
