export type ExternalEffectType =
  | "external_read"
  | "external_write"
  | "local_file_read"
  | "local_file_write"
  | "repo_write"
  | "shell_exec"
  | "runtime_start"
  | "network_listener"
  | "device_display"
  | "device_audio"
  | "device_motion"
  | "mic_stt"
  | "camera"
  | "memory_write"
  | "production_gate"
  | "execution_gate"
  | "unknown";

export type ExternalActionMode =
  | "DRAFT_ONLY"
  | "READ_ONLY"
  | "SAFETY_HOLD"
  | "DESIGN_HOLD"
  | "NOT_APPROVED"
  | "GO_ONE_SHOT";

export type ExternalSourceSurface =
  | "renderer"
  | "discord"
  | "worker"
  | "startup"
  | "scheduler"
  | "internal"
  | "preload"
  | "main";

export type ExternalRouteRisk = "low" | "medium" | "high" | "critical";

export type ExternalActionRouteRecord = {
  routeId: string;
  sourceSurface: ExternalSourceSurface;
  file: string;
  handlerOrFunction: string;
  effectType: ExternalEffectType;
  defaultActionMode: ExternalActionMode;
  risk: ExternalRouteRisk;
  requiresPreflight: boolean;
  shadowModeCovered: boolean;
  requiresHumanGo: boolean;
  notes: string;
};
