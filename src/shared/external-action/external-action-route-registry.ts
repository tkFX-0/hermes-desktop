import type {
  ExternalActionRouteRecord,
  ExternalEffectType
} from "./external-action-types";

export const EXTERNAL_ACTION_ROUTE_REGISTRY: ExternalActionRouteRecord[] = [
  {
    routeId: "discord.read",
    sourceSurface: "main",
    file: "src/main/discord-intake.ts",
    handlerOrFunction: "readDiscordChannel",
    effectType: "external_read",
    defaultActionMode: "SAFETY_HOLD",
    risk: "medium",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Discord read is separate from send; one-shot read may be allowed with evidence."
  },
  {
    routeId: "discord.draft",
    sourceSurface: "main",
    file: "src/main/index.ts",
    handlerOrFunction: "prepareDiscordReplyDraft",
    effectType: "external_write",
    defaultActionMode: "DRAFT_ONLY",
    risk: "medium",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Drafting is not sending; exact target and payload summary must be evidenced."
  },
  {
    routeId: "discord.send",
    sourceSurface: "main",
    file: "src/main/discord-intake.ts",
    handlerOrFunction: "sendDiscordMessage",
    effectType: "external_write",
    defaultActionMode: "SAFETY_HOLD",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Send requires one-shot human GO, send_count=1, and gate restored to HOLD."
  },
  {
    routeId: "discord.autoReply",
    sourceSurface: "scheduler",
    file: "src/main/discord-bot-service.ts",
    handlerOrFunction: "polling reply flow",
    effectType: "external_write",
    defaultActionMode: "NOT_APPROVED",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: true,
    requiresHumanGo: true,
    notes: "Autonomous reply remains NOT_APPROVED even if bot polling is later enabled."
  },
  {
    routeId: "discord.botPolling",
    sourceSurface: "startup",
    file: "src/main/index.ts",
    handlerOrFunction: "startShikishimaSidebot",
    effectType: "external_read",
    defaultActionMode: "SAFETY_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: true,
    requiresHumanGo: true,
    notes: "Polling is not auto-reply; it still requires supervised runtime window and stop method."
  },
  {
    routeId: "stackchan.status",
    sourceSurface: "main",
    file: "src/main/stackchan-local-service.ts",
    handlerOrFunction: "checkStackchanLocalStatus",
    effectType: "external_read",
    defaultActionMode: "SAFETY_HOLD",
    risk: "medium",
    requiresPreflight: true,
    shadowModeCovered: true,
    requiresHumanGo: true,
    notes: "Device/network probe is not equivalent to voice, motion, or camera approval."
  },
  {
    routeId: "stackchan.faceDisplay",
    sourceSurface: "main",
    file: "src/main/stackchan-local-service.ts",
    handlerOrFunction: "stackchanFaceLocal",
    effectType: "device_display",
    defaultActionMode: "SAFETY_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Display-only is still a device effect and needs a StackChan GO."
  },
  {
    routeId: "stackchan.voiceAudio",
    sourceSurface: "main",
    file: "src/main/stackchan-local-service.ts",
    handlerOrFunction: "stackchanSayLocal",
    effectType: "device_audio",
    defaultActionMode: "SAFETY_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Voice requires exact text, allowed_speech_count=1, and evidence."
  },
  {
    routeId: "stackchan.motion",
    sourceSurface: "main",
    file: "src/main/stackchan-local-service.ts",
    handlerOrFunction: "stackchanDanceLocal / move commands",
    effectType: "device_motion",
    defaultActionMode: "SAFETY_HOLD",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Servo or dance motion remains HOLD unless a separate motion GO exists."
  },
  {
    routeId: "stackchan.touchPatSensor",
    sourceSurface: "main",
    file: "src/main/stackchan-stt-service.ts",
    handlerOrFunction: "event callback",
    effectType: "device_motion",
    defaultActionMode: "SAFETY_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: true,
    requiresHumanGo: true,
    notes: "Touch/pat reactions can trigger motion/audio/display and must be separately bounded."
  },
  {
    routeId: "stackchan.sttMicrophone",
    sourceSurface: "main",
    file: "src/main/stackchan-stt-service.ts",
    handlerOrFunction: "startSttServer / audio handler",
    effectType: "mic_stt",
    defaultActionMode: "SAFETY_HOLD",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: true,
    requiresHumanGo: true,
    notes: "Microphone/STT requires time window, consent, redaction, and no always-on mode."
  },
  {
    routeId: "stackchan.camera",
    sourceSurface: "main",
    file: "src/main/stackchan-stt-service.ts",
    handlerOrFunction: "camera handler",
    effectType: "camera",
    defaultActionMode: "SAFETY_HOLD",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: true,
    requiresHumanGo: true,
    notes: "Camera path is limited to one safe still image unless a future monitoring gate exists."
  },
  {
    routeId: "stackchan.firmwareUpload",
    sourceSurface: "worker",
    file: "docs/firmware/**",
    handlerOrFunction: "PlatformIO upload / M5Burner",
    effectType: "shell_exec",
    defaultActionMode: "NOT_APPROVED",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Firmware upload is device-critical and requires a firmware-specific GO and rollback plan."
  },
  {
    routeId: "obsidian.localWrite",
    sourceSurface: "main",
    file: "src/main/library-export.ts",
    handlerOrFunction: "writeEvidenceNote",
    effectType: "local_file_write",
    defaultActionMode: "SAFETY_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Local note write requires scoped folder, dry-run evidence, and raw-value redaction."
  },
  {
    routeId: "research.reportWrite",
    sourceSurface: "scheduler",
    file: "src/main/research-report-writer.ts",
    handlerOrFunction: "writeResearchReport",
    effectType: "local_file_write",
    defaultActionMode: "SAFETY_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: true,
    requiresHumanGo: true,
    notes: "Research reports can be local writes and must be scoped before scheduled operation."
  },
  {
    routeId: "memory.profileWrite",
    sourceSurface: "main",
    file: "src/main/memory-network.ts",
    handlerOrFunction: "memory-add-fact / profile write paths",
    effectType: "memory_write",
    defaultActionMode: "SAFETY_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Durable memory writes need namespace isolation and raw secret/local path blocking."
  },
  {
    routeId: "worker.readOnlyInspection",
    sourceSurface: "worker",
    file: "worker task contract",
    handlerOrFunction: "read-only inspection",
    effectType: "local_file_read",
    defaultActionMode: "READ_ONLY",
    risk: "low",
    requiresPreflight: false,
    shadowModeCovered: false,
    requiresHumanGo: false,
    notes: "Allowed when task scope is read-only and no raw secret is reported."
  },
  {
    routeId: "worker.localFileWrite",
    sourceSurface: "worker",
    file: "worker task contract",
    handlerOrFunction: "local file write",
    effectType: "local_file_write",
    defaultActionMode: "SAFETY_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "May be task-approved only with scoped file list and diff evidence."
  },
  {
    routeId: "worker.testCommand",
    sourceSurface: "worker",
    file: "worker task contract",
    handlerOrFunction: "test/typecheck/lint command",
    effectType: "shell_exec",
    defaultActionMode: "SAFETY_HOLD",
    risk: "medium",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Test commands need allowlist, cwd, and output summary."
  },
  {
    routeId: "worker.buildCommand",
    sourceSurface: "worker",
    file: "worker task contract",
    handlerOrFunction: "build command",
    effectType: "shell_exec",
    defaultActionMode: "SAFETY_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Builds may be allowed separately from runtime start or firmware upload."
  },
  {
    routeId: "worker.gitCommit",
    sourceSurface: "worker",
    file: "worker task contract",
    handlerOrFunction: "git commit",
    effectType: "repo_write",
    defaultActionMode: "SAFETY_HOLD",
    risk: "medium",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Commit may be task-approved after staged scope verification."
  },
  {
    routeId: "worker.gitPush",
    sourceSurface: "worker",
    file: "worker task contract",
    handlerOrFunction: "git push",
    effectType: "repo_write",
    defaultActionMode: "NOT_APPROVED",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Push always requires separate Push GO."
  },
  {
    routeId: "worker.runtimeStart",
    sourceSurface: "worker",
    file: "worker task contract",
    handlerOrFunction: "runtime start",
    effectType: "runtime_start",
    defaultActionMode: "NOT_APPROVED",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Runtime start requires time-window GO, stop method, and evidence."
  },
  {
    routeId: "worker.dependencyChange",
    sourceSurface: "worker",
    file: "package.json / lockfiles",
    handlerOrFunction: "npm install/update or package edit",
    effectType: "local_file_write",
    defaultActionMode: "NOT_APPROVED",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Dependency changes require separate dependency GO."
  },
  {
    routeId: "worker.arbitraryExternalCommand",
    sourceSurface: "worker",
    file: "worker task contract",
    handlerOrFunction: "arbitrary external command",
    effectType: "shell_exec",
    defaultActionMode: "NOT_APPROVED",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Unclassified external commands are not approved."
  },
  {
    routeId: "productionReady.change",
    sourceSurface: "internal",
    file: "src/main/shikishima-core/**",
    handlerOrFunction: "productionReady activation",
    effectType: "production_gate",
    defaultActionMode: "NOT_APPROVED",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "productionReady remains false until final acceptance GO."
  },
  {
    routeId: "execution.enablement",
    sourceSurface: "internal",
    file: "src/main/shikishima-core/**",
    handlerOrFunction: "execution activation",
    effectType: "execution_gate",
    defaultActionMode: "NOT_APPROVED",
    risk: "critical",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "execution remains disabled until final acceptance GO."
  },
  {
    routeId: "unknown.route",
    sourceSurface: "internal",
    file: "unclassified",
    handlerOrFunction: "unclassified route",
    effectType: "unknown",
    defaultActionMode: "DESIGN_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Unknown routes must remain DESIGN_HOLD until classified."
  }
];

export function getExternalActionRoute(
  routeId: string
): ExternalActionRouteRecord | undefined {
  return EXTERNAL_ACTION_ROUTE_REGISTRY.find((route) => route.routeId === routeId);
}

export function listExternalActionRoutes(): ExternalActionRouteRecord[] {
  return [...EXTERNAL_ACTION_ROUTE_REGISTRY];
}

export function listRoutesByEffectType(
  effectType: ExternalEffectType
): ExternalActionRouteRecord[] {
  return EXTERNAL_ACTION_ROUTE_REGISTRY.filter(
    (route) => route.effectType === effectType
  );
}

export function listRoutesRequiringPreflight(): ExternalActionRouteRecord[] {
  return EXTERNAL_ACTION_ROUTE_REGISTRY.filter((route) => route.requiresPreflight);
}

export function listRoutesWithoutShadowModeCoverage(): ExternalActionRouteRecord[] {
  return EXTERNAL_ACTION_ROUTE_REGISTRY.filter(
    (route) => !route.shadowModeCovered
  );
}

export function classifyUnknownRoute(routeId: string): ExternalActionRouteRecord {
  return {
    routeId,
    sourceSurface: "internal",
    file: "unclassified",
    handlerOrFunction: "unclassified route",
    effectType: "unknown",
    defaultActionMode: "DESIGN_HOLD",
    risk: "high",
    requiresPreflight: true,
    shadowModeCovered: false,
    requiresHumanGo: true,
    notes: "Unknown routes must remain DESIGN_HOLD until classified."
  };
}
