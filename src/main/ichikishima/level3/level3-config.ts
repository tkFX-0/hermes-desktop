export type Level3Status =
  | "not_approved"
  | "go_issued"
  | "preflight_check"
  | "running"
  | "completed"
  | "stop";

export interface Level3Config {
  status: Level3Status;
  approvedBy: string | null;
  approvedAt: string | null;
  sessionId: string | null;
  timeWindow: { start: string; end: string } | null;
  allowedCommands: string[];
  forbiddenActions: string[];
}

export const LEVEL3_DEFAULT_CONFIG: Level3Config = {
  status: "not_approved",
  approvedBy: null,
  approvedAt: null,
  sessionId: null,
  timeWindow: null,
  allowedCommands: [],
  forbiddenActions: [
    "git_push",
    "deploy",
    "production_ready_true",
    "execution_enabled",
    "robot_motion",
    "voice_activation",
    "raw_value_output",
    "external_network",
  ],
};

export const LEVEL3_STOP_CONDITIONS = [
  "raw_value_visible",
  "secret_visible",
  "execution_escape",
  "production_ready_flip",
  "unexpected_network",
  "robot_motion_unauthorized",
  "time_window_expired",
  "human_stop_signal",
] as const;

export type Level3StopCondition = typeof LEVEL3_STOP_CONDITIONS[number];
