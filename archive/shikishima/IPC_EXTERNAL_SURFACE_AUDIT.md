# IPC External Surface Audit

Date: 2026-05-26  
Scope: Shikishima Desktop IPC / preload / main-process / worker / integration external-effect routes  
Mode: read-only repository audit; no runtime, no external write, no git push

---

## 1. Baseline

```text
branch: main
HEAD_before_audit: 9e581663925b0958234d992af5c02c7299f562ac
origin/main_before_audit: 9e581663925b0958234d992af5c02c7299f562ac
commits_ahead_before_audit: 0
runtime_started: false
Discord_send: false
Obsidian_write: false
StackChan_connection: false
productionReady: false
execution: disabled
git_push_performed: false
```

Primary design source:

- `docs/shikishima/SYSTEM_DESIGN_OVERVIEW.md`

Requested companion docs checked but not present in this working tree:

- `docs/shikishima/STATUS_LABEL_STANDARD.md`
- `docs/shikishima/DISCORD_FIRST_OPERATION_ARCHITECTURE.md`
- `docs/shikishima/MODEL_TRACE_AND_AGENT_ROUTING_SPEC.md`
- `docs/shikishima/MEMORY_SCOPE_RESOLVER_SPEC.md`
- `docs/shikishima/WORKER_TASK_CONTRACT_STANDARD.md`

---

## 2. Discovery Summary

Repository inspection found:

```text
ipcMain.handle routes in src/main/index.ts: 87
preload ipcRenderer.invoke routes observed: 112
explicit createActionPreflight factory: present
SHIKISHIMA_SHADOW_MODE: true
```

Important context:

- `SHIKISHIMA_SHADOW_MODE` blocks several auto-start paths at application startup.
- `SHIKISHIMA_SHADOW_MODE` does not automatically wrap every manual IPC handler.
- Several IPC routes are ordinary app-management routes from the base Hermes app and can start processes, update config, run installers, open URLs, or run local worker CLIs.
- Shikishima-specific dangerous operations are often drafted through `createActionPreflight()`, but not all external-effect routes in the app pass through it.

---

## 3. External Surface Table

| Route ID | Source Surface | File | Handler / Function | Effect Type | Current Behavior | Safety Gate Present | SHADOW_MODE Covered | Action Mode | Risk | Required Fix |
|---|---|---|---|---|---|---|---|---|---|---|
| IPC-001 | Renderer / preload | `src/preload/index.ts`, `src/main/index.ts` | `mobile-console.getPhase2cConnectionInfo` | local_file_read / token display surface | Returns Phase2C LAN/pairing info for Electron UI; includes raw token field named for UI only while `pairingTokenRawReported:false` | partial redaction contract | no | READ_ONLY | medium | Reconfirm no raw pairing token is rendered in production UI; prefer redacted-only return for audit mode |
| IPC-002 | Renderer / preload | `src/main/index.ts` | `check-install` | local_file_read | Checks install state | no preflight | no | READ_ONLY | low | No fix urgent |
| IPC-003 | Renderer / preload | `src/main/index.ts`, `src/main/installer.ts` | `start-install` | shell_exec / local_file_write / network_possible | Runs installer flow via spawned processes | no Shikishima preflight | no | SAFETY_HOLD | high | Add runtime/install GO or mark legacy Hermes setup route outside Shikishima autonomous operation |
| IPC-004 | Renderer / preload | `src/main/index.ts`, `src/main/installer.ts` | `run-hermes-doctor` | shell_exec | Runs Hermes doctor | no preflight | no | SAFETY_HOLD | high | Gate as diagnostic shell execution |
| IPC-005 | Renderer / preload | `src/main/index.ts`, `src/main/installer.ts` | `run-hermes-update` | shell_exec / network_possible / local_file_write | Runs Hermes update | no preflight | no | SAFETY_HOLD | high | Gate as update operation |
| IPC-006 | Renderer / preload | `src/main/index.ts` | `run-claw-migrate` | shell_exec / local_file_write | Runs OpenClaw migration | no preflight | no | SAFETY_HOLD | high | Gate as migration operation |
| IPC-007 | Renderer / preload | `src/main/index.ts`, `src/main/config.ts` | `set-env` | local_file_write / runtime_start | Writes env value and may restart gateway for API key/token changes | no Shikishima preflight | no | SAFETY_HOLD | critical | Require explicit config-change GO; redact token presence only |
| IPC-008 | Renderer / preload | `src/main/index.ts`, `src/main/config.ts` | `set-config` | local_file_write | Writes config value | no preflight | no | SAFETY_HOLD | medium | Classify allowed config keys; block execution-related keys |
| IPC-009 | Renderer / preload | `src/main/index.ts` | `set-model-config` | local_file_write / runtime_start | Writes model config and may restart gateway | no preflight | no | SAFETY_HOLD | high | Add model-change preflight and Model Trace update |
| IPC-010 | Renderer / preload | `src/main/index.ts` | `set-connection-config` | local_file_write / external_read_possible | Writes local/remote connection config | no preflight | no | SAFETY_HOLD | high | Validate remote endpoints and require connection GO |
| IPC-011 | Renderer / preload | `src/main/index.ts` | `test-remote-connection` | external_read | Tests remote URL/API key | no Shikishima preflight | no | SAFETY_HOLD | medium | Gate as external read; redact API key |
| IPC-012 | Renderer / preload | `src/main/index.ts`, `src/main/hermes.ts` | `send-message` | runtime_start / external_read_possible / tool_use_possible | Lazy-starts local gateway and sends chat | no createActionPreflight at IPC boundary | no | SAFETY_HOLD | high | Add Model Trace + tool/external-effect preflight for non-chat tools |
| IPC-013 | Renderer / preload | `src/main/index.ts`, `src/main/hermes.ts` | `start-gateway` | runtime_start | Starts Hermes gateway | no preflight | no | SAFETY_HOLD | high | Require RUNTIME-GO |
| IPC-014 | Renderer / preload | `src/main/index.ts`, `src/main/hermes.ts` | `stop-gateway` | runtime_control | Stops Hermes gateway | no preflight | no | READ_ONLY-ish | medium | Keep allowed as stop/kill switch; log evidence |
| IPC-015 | Renderer / preload | `src/main/index.ts`, `src/main/memory.ts` | `add-memory-entry`, `update-memory-entry`, `remove-memory-entry`, `write-user-profile`, `write-soul`, `reset-soul` | memory_write / local_file_write | Writes memory/profile/soul files | no Shikishima preflight | no | SAFETY_HOLD | high | Add Memory Scope resolver and raw-value guard |
| IPC-016 | Renderer / preload | `src/main/index.ts`, `src/main/profiles.ts` | `create-profile`, `delete-profile`, `set-active-profile` | local_file_write / shell_exec_possible | Profile operations; profile module also uses Hermes profile CLI | no Shikishima preflight at IPC | no | SAFETY_HOLD | medium | Gate profile mutation; classify active profile switching |
| IPC-017 | Renderer / preload | `src/main/index.ts` | `install-skill`, `uninstall-skill`, `set-toolset-enabled` | local_file_write / capability_change | Installs or removes skills/toolsets | no preflight | no | SAFETY_HOLD | high | Require capability-change GO |
| IPC-018 | Renderer / preload | `src/main/index.ts`, `src/main/models.ts` | `add-model`, `remove-model`, `update-model` | local_file_write / model_route_change | Changes model registry | no preflight | no | SAFETY_HOLD | medium | Tie to Model Trace registry |
| IPC-019 | Renderer / preload | `src/main/index.ts`, `src/main/claw3d.ts` | `claw3d-setup` | shell_exec / repo_write / network_read / dependency_install | Can git clone/pull and run npm install | no Shikishima preflight | no | NOT_APPROVED | critical | Must require explicit Level 5 runtime/dependency GO |
| IPC-020 | Renderer / preload | `src/main/index.ts`, `src/main/claw3d.ts` | `claw3d-start-all`, `claw3d-start-dev`, `claw3d-start-adapter` | runtime_start / shell_exec / network_listener | Starts dev server / adapter process | no preflight | no | NOT_APPROVED | critical | Require RUNTIME-GO and port/evidence/shutdown plan |
| IPC-021 | Renderer / preload | `src/main/index.ts` | `add-cron-job`, `pause-cron-job`, `resume-cron-job`, `trigger-cron-job`, `remove-cron-job` | automation / runtime_schedule | Mutates or triggers cron jobs | no Shikishima preflight | no | SAFETY_HOLD | high | Require automation GO; trigger must not bypass gate |
| IPC-022 | Renderer / preload | `src/main/index.ts` | `open-external` | external_read / external_navigation | Opens URL in OS browser | URL scheme validation only | no | READ_ONLY | medium | Add allowlist and audit log for non-http(s) schemes |
| IPC-023 | Renderer / preload | `src/main/index.ts`, `src/main/installer.ts` | `run-hermes-backup`, `run-hermes-import`, `run-hermes-dump` | shell_exec / local_file_read_write | Runs Hermes backup/import/dump | no Shikishima preflight | no | SAFETY_HOLD | high | Gate as local data operation |
| IPC-024 | Renderer / preload | `src/main/index.ts` | `read-logs` | local_file_read | Reads logs | no preflight | no | READ_ONLY | medium | Redact token/path/IP patterns before renderer |
| IPC-025 | Renderer / preload | `src/main/index.ts`, `src/main/library-export.ts` | `shikishima-library-write` | local_file_write | OB-01 dry-run true; validates filename and returns redacted path | dry-run internal, no createActionPreflight | no | DRAFT_ONLY | medium | Keep dry-run; if OB01_DRY_RUN false, wrap in preflight |
| IPC-026 | Renderer / preload | `src/main/index.ts` | `shikishima-discord-read` | external_read | IPC currently returns NEEDS_HUMAN draft and does not call Discord API | createActionPreflight present | no | SAFETY_HOLD | medium | Good boundary; note underlying `discord-intake.ts` read can be active from other callers |
| IPC-027 | Renderer / preload | `src/main/index.ts` | `shikishima-research-publish` | external_write / local_file_write | IPC returns draft preflight only | createActionPreflight present | no | DRAFT_ONLY | medium | Good boundary; ensure actual pipeline remains HOLD |
| IPC-028 | Renderer / preload | `src/main/index.ts`, `src/main/shikishima-grok-chat.ts` | `shikishima-grok-chat`, `shikishima-grok-quota` | external_read | Calls Grok/xai-oauth style chat/quota | no preflight at IPC | no | SAFETY_HOLD | high | Add x_search/social read GO and Model Trace |
| IPC-029 | Renderer / preload | `src/main/index.ts`, `src/main/claude-code-service.ts` | `claude-code-task` | shell_exec / worker_exec | Runs Claude CLI through WSL | no preflight at IPC | no | NOT_APPROVED | critical | Require worker task contract and human GO |
| IPC-030 | Renderer / preload | `src/main/index.ts`, `src/main/agent-router.ts` | `agent-dispatch`, `agent-route` | worker_exec / external_read_possible | May route to ClaudeCode/Groq/Gemini/Hermes Research depending task | no preflight at IPC | no | SAFETY_HOLD | high | Add Model Trace and per-tool gate before external action |
| IPC-031 | Renderer / preload | `src/main/index.ts` | `groq-availability`, `gemini-availability` | external_read | Checks provider availability | no preflight | no | READ_ONLY | medium | Treat as external read; redact errors |
| IPC-032 | Renderer / preload | `src/main/index.ts` | `memory-add-fact` | memory_write | Writes long-term memory fact | no preflight | no | SAFETY_HOLD | medium | Add Memory Scope resolver and blocked namespace policy |
| IPC-033 | Renderer / preload | `src/main/index.ts`, `src/main/stackchan-local-service.ts` | `stackchan-status` | device_display? / external_read / device_network | Connects to VOICEVOX and StackChan WS/status without changing face | no createActionPreflight | auto-loop held by SHADOW_MODE; manual IPC not covered | SAFETY_HOLD | high | Treat manual status check as StackChan connection; require device-read GO while StackChan HOLD |
| IPC-034 | Renderer / preload | `src/main/index.ts` | `stackchan-say` | device_audio | IPC returns draft only; no local say call | createStackchan speech draft/preflight inside draft helper | no | DRAFT_ONLY | medium | Good boundary; keep actual `stackchanSayLocal` unexposed or gated |
| IPC-035 | Renderer / preload | `src/main/index.ts` | `stackchan-face` | device_display / device_motion label | IPC returns NEEDS_HUMAN preflight only | createActionPreflight present | no | DRAFT_ONLY | medium | Use `device_display` rather than `stackchan_motion` for face-only if applicable |
| IPC-036 | Renderer / preload | `src/main/index.ts` | `stackchan-set-speed`, `stackchan-set-speaker` | device_audio_config | Mutates local TTS settings | no preflight | no | SAFETY_HOLD | medium | Gate or classify as local audio config; no device output by itself |
| IPC-037 | Renderer / preload | `src/main/index.ts`, `src/main/stackchan-stt-service.ts` | `stt-state`, `stt-check-whisper` | mic_stt / shell_exec | state is read; whisper check runs WSL import test | no preflight | no | SAFETY_HOLD | high | Gate WSL check; keep STT server start behind SHADOW_MODE and explicit GO |
| AUTO-001 | App startup | `src/main/index.ts` | `startDailyResearchPipeline` | external_read / external_write / local_file_write / scheduler | Blocked by SHADOW_MODE at startup | SHADOW_MODE | yes for startup | SAFETY_HOLD | high | Keep; also ensure tray/manual click cannot bypass |
| AUTO-002 | Tray menu | `src/main/index.ts` | tray `startDailyResearchPipeline()` click | external_read / external_write / local_file_write | Manual tray action can call pipeline; pipeline has `RESEARCH_PIPELINE_HOLD=true` | pipeline hold | not SHADOW_MODE covered | SAFETY_HOLD | high | Remove or gate tray action before production use |
| AUTO-003 | Tray menu | `src/main/index.ts` | `spawn("ollama", ["serve"])`, `taskkill` | runtime_start / shell_exec | Manual tray starts/stops Ollama | no preflight | not SHADOW_MODE covered | NOT_APPROVED | high | Add RUNTIME-GO or remove from Shikishima build |
| AUTO-004 | App startup | `src/main/index.ts` | sidebot / health report / StackChan status / STT server | network_listener / external_write / device_network / mic_stt | Blocked by SHADOW_MODE | SHADOW_MODE | yes for startup | SAFETY_HOLD | high | Manual equivalents still need gates |
| INT-001 | Internal service | `src/main/discord-intake.ts` | `readDiscordChannel` | external_read | `DIS01_HOLD=false`, can read Discord when called | local constant, no preflight | no | SAFETY_HOLD | high | Re-align with design: read route should require explicit read-only GO unless runtime session active |
| INT-002 | Internal service | `src/main/discord-intake.ts` | `sendDiscordMessage` | external_write | Sends Discord message when called | no preflight in function | no | NOT_APPROVED | critical | Require createDiscordSendPreflight at function boundary or wrap all callers |
| INT-003 | Internal service | `src/main/news-watcher.ts` | `startNewsWatcher` | external_write / scheduler | Sends Discord periodically if started; currently commented in app startup | no preflight | startup not called | NOT_APPROVED | critical | Keep disabled; add hard gate before any enablement |
| INT-004 | Internal service | `src/main/research-pipeline.ts` | `publishResearchReport` | external_write / local_file_write | `RESEARCH_PIPELINE_HOLD=true` blocks pipeline | hold constant | yes for startup | SAFETY_HOLD | high | Good hold; keep no alternate direct invocation without preflight |
| INT-005 | Internal service | `src/main/research-report-writer.ts` | `writeResearchReport` | local_file_write | `RESEARCH_WRITE_ENABLED=true` and can write if called | scoped path validation only | no | SAFETY_HOLD | high | Reconcile with Obsidian HOLD; wrap actual write in preflight |
| INT-006 | Internal service | `src/main/hermes-research-runner.ts` | `runHermesResearch` | shell_exec / external_read | Runs WSL Hermes x_search runner | no preflight in function | no | SAFETY_HOLD | high | Require XS-READ GO before invocation |
| INT-007 | Worker service | `src/main/claude-code-service.ts` | `claudeCodeTask` | shell_exec / worker_exec | Runs Claude CLI through WSL | no preflight | no | NOT_APPROVED | critical | Require worker task contract |
| INT-008 | Worker service | `src/main/codex-service.ts` | `codexTask` | shell_exec / worker_exec / secret_env | Reads API key value and runs Codex CLI when key exists | no createActionPreflight | no | NOT_APPROVED | critical | Keep Codex scope-only and require worker GO; avoid env key in shell string if possible |
| INT-009 | Agent skill | `src/main/agent-skills/tsumugi-skills.ts` | `skillTypecheck` | shell_exec | Runs `npm run ...` via cmd | skill registry uses createActionPreflight at skill level | no | SAFETY_HOLD | medium | Ensure skill registry is the only invocation path |
| INT-010 | StackChan service | `src/main/stackchan-local-service.ts` | `stackchanSayLocal`, `stackchanFaceLocal`, `stackchanDanceLocal`, `stackchanLedLocal`, `stackchanPetMode` | device_audio / device_display / device_motion | Actual device/VOICEVOX/WebSocket operations | no preflight in function | startup held; direct callers must gate | NOT_APPROVED | critical | Add preflight at function boundary or make functions private behind gated facade |
| INT-011 | StackChan service | `src/main/stackchan-stt-service.ts` | `startSttServer`, `/audio`, `/event`, `/camera` | network_listener / mic_stt / camera / local_file_write / shell_exec | `STT_SERVER_HOLD=true` blocks start; handlers save audio/camera when server active | hold constant | startup held | SAFETY_HOLD | critical | Keep HOLD; require privacy and runtime GO before enabling |
| INT-012 | Mobile console | `src/main/mobile-console/mobile-console-local-server.ts` | `startPhase2cServer` | network_listener | Read-only local HTTP server; feature flag controls start | feature flag / redaction | startup gated by flag | DRAFT_ONLY | medium | Confirm `MOBILE_CONSOLE_PHASE_2C_ENABLED` false in release builds |
| INT-013 | Control center local API | `src/main/ichikishima/control-center/local-api-server.ts` | local API server | network_listener | Local API server implementation exists | unknown in this audit | unknown | DESIGN_HOLD | medium | Confirm no start path exposed without GO |
| INT-014 | Config/profile | `src/main/config.ts`, `src/main/profiles.ts` | config/profile writes and Hermes profile CLI | local_file_write / shell_exec | Used by several IPC handlers | no centralized preflight | no | SAFETY_HOLD | medium | Add config mutation registry |
| INT-015 | Production/execution gate | `src/main/shikishima-core/secretary-lv5-activation.ts`, `action-gate-kernel.ts` | `createSecretaryLv5ActivationDraft` | production_gate / execution_gate | Draft only; actualMutationPerformed false | createActionPreflight present | n/a | DRAFT_ONLY | low | Good boundary; keep no direct mutation path |

---

## 4. Complete IPC Inventory Summary

The following IPC route inventory was discovered from `src/main/index.ts`.
Routes with no obvious external effect are still listed here to make the audit traceable.

```text
abort-chat
agent-definitions
check-for-updates
check-install
check-openclaw
claw3d-get-logs
claw3d-get-port
claw3d-get-ws-url
claw3d-set-port
claw3d-setup
claw3d-set-ws-url
claw3d-start-adapter
claw3d-start-all
claw3d-start-dev
claw3d-status
claw3d-stop-adapter
claw3d-stop-all
claw3d-stop-dev
create-profile
delete-profile
discover-memory-providers
download-update
gateway-status
gemini-availability
get-app-version
get-config
get-connection-config
get-credential-pool
get-env
get-hermes-home
get-hermes-version
get-locale
get-model-config
get-platform-enabled
get-session-messages
get-skill-content
get-toolsets
groq-availability
install-update
is-remote-mode
list-bundled-skills
list-installed-skills
list-mcp-servers
list-models
list-profiles
list-sessions
memory-add-fact
memory-get-long
memory-get-medium
mobile-console.getPhase2cConnectionInfo
open-external
pause-cron-job
read-logs
read-memory
read-soul
refresh-hermes-version
remove-cron-job
remove-model
reset-soul
resume-cron-job
run-claw-migrate
run-hermes-backup
run-hermes-doctor
run-hermes-dump
run-hermes-import
run-hermes-update
search-sessions
set-active-profile
set-locale
shikishima-library-write
stackchan-face
stackchan-get-speaker
stackchan-get-speed
stackchan-say
stackchan-set-speaker
stackchan-set-speed
stackchan-status
start-gateway
start-install
stop-gateway
stt-check-whisper
stt-state
sync-session-cache
uninstall-skill
write-soul
```

Additional preloaded invoke routes were found for config/model/platform/credential/skill/session/memory operations.
The discovery count is higher than the `index.ts` route count because preload also includes typed wrappers, duplicate update handlers, and helper functions.

---

## 5. Critical Questions

### 1. Does every external-effect route pass through `createActionPreflight()` or equivalent?

No.

Routes using `createActionPreflight()` or an equivalent draft policy include:

- `shikishima-discord-read`
- `shikishima-research-publish`
- `stackchan-say` draft path
- `stackchan-face` draft path
- secretary camera/external write/Lv5 draft policies
- skill registry wrapper for some agent skills

Routes without complete preflight coverage include:

- installer/update/migration IPC
- gateway start / chat lazy-start
- config/env/model mutation
- `claw3d-*` setup/start routes
- cron trigger routes
- `open-external`
- ClaudeCode/Codex worker execution services
- direct Discord intake/send functions
- StackChan local service actual device functions
- research writer actual local write function
- Hermes research runner WSL execution

### 2. Are there any renderer/preload APIs that can trigger external effects directly?

Yes, via Main IPC handlers exposed through preload.

Notable examples:

- `startGateway`
- `sendMessage`
- `setEnv`
- `setModelConfig`
- `testRemoteConnection`
- `claw3dSetup`
- `claw3dStartAll`
- `claw3dStartDev`
- `triggerCronJob`
- `openExternal`
- `claudeCodeTask`
- `shikishimaGrokChat`
- `stackchanStatus`
- `sttCheckWhisper`

Some are not direct external writes, but they can start runtimes, shell commands, external reads, or network/device checks.

### 3. Does `SHADOW_MODE` block only auto-start paths, or also manual IPC paths?

Mostly auto-start paths.

`SHIKISHIMA_SHADOW_MODE` blocks:

- daily research pipeline startup
- sidebot startup
- StackChan status auto-check startup
- startup Discord health report
- StackChan STT/event server startup

It does not globally block manual IPC handlers such as:

- `start-gateway`
- `send-message`
- `claw3d-start-*`
- `claude-code-task`
- `stackchan-status`
- `stt-check-whisper`
- config mutation routes

### 4. Are Discord read and Discord send separated?

Partially.

- Renderer IPC `shikishima-discord-read` is draft/HOLD and does not call the Discord API.
- `discord-intake.ts` separates `readDiscordChannel()` and `sendDiscordMessage()`.
- However, `DIS01_HOLD=false` means the internal read function can actively read when called.
- `sendDiscordMessage()` is an active send function with no preflight at function boundary.
- `news-watcher.ts` and health reporting call send paths when their start routes are enabled.

### 5. Are StackChan face/display, voice, motion, STT, and camera separated?

Partially.

- Renderer IPC `stackchan-say` and `stackchan-face` are draft-only.
- StackChan actual local functions are separated by function:
  - `stackchanSayLocal`
  - `stackchanFaceLocal`
  - `stackchanDanceLocal`
  - `stackchanLedLocal`
  - `stackchanPetMode`
  - `startSttServer`
- But actual local functions do not have preflight at their own boundary.
- `stackchan-status` manually opens a StackChan/VOICEVOX check path and is not protected by preflight.

### 6. Can any worker bridge trigger shell commands or repo writes without explicit task contract?

Yes.

- `claude-code-task` invokes Claude CLI through WSL.
- `agent-router.ts` can call ClaudeCode for coding-related routing.
- `codex-service.ts` can invoke Codex CLI when an API key is present.
- `claw3d-setup` can run git clone/pull and npm install.
- `tsumugi-skills.ts` can run `npm run ...` through skill execution.

Some skill registry paths have preflight, but direct IPC/worker functions should be treated as gaps until a Worker Task Contract is enforced uniformly.

### 7. Can memory write save raw secrets, IPs, tokens, local paths, or unrelated domain memories?

Potentially yes.

Memory/profile IPC routes accept arbitrary user-provided text:

- `add-memory-entry`
- `update-memory-entry`
- `write-user-profile`
- `write-soul`
- `memory-add-fact`

The audit did not find a centralized raw-secret scrubber or memory namespace resolver at each IPC boundary.
This is a gap relative to the Memory Scope design.

### 8. Can productionReady or execution be changed from UI/IPC/config without human GO?

No direct productionReady/execution mutation IPC was found in the inspected route list.

However:

- config/env/model/profile routes are broad mutation surfaces.
- production/execution gate drafts exist and correctly return `actualMutationPerformed:false`.
- A guard should still classify config keys so no future config route introduces a hidden critical state transition.

### 9. Are x_search / Hermes Research paths read-only or capable of publishing/writing?

Both paths exist.

- `runHermesResearch()` is an external read / shell execution path through WSL.
- `publishResearchReport()` can combine Hermes research with Discord image send and Obsidian/local write, but it is currently blocked by `RESEARCH_PIPELINE_HOLD=true`.
- `writeResearchReport()` itself has `RESEARCH_WRITE_ENABLED=true` and can write if called directly.

### 10. Are there any unknown external routes requiring DESIGN_HOLD?

Yes.

- `src/main/ichikishima/control-center/local-api-server.ts` defines a local API server; start exposure was not fully traced in this pass.
- `claw3d-*` routes are broad enough to require a separate runtime/dependency gate review.
- updater/install/import routes should be treated as legacy Hermes operational surfaces and not Shikishima autonomous surfaces.

---

## 6. Critical Findings

1. **SHADOW_MODE is not a universal manual IPC guard.**  
   It blocks startup side effects, but multiple manual IPC routes can still start runtimes, shell commands, or external reads.

2. **Worker execution routes need a uniform task contract.**  
   `claude-code-task`, `agent-router` ClaudeCode calls, Codex CLI, and Tsumugi skill execution are not all gated at the same level.

3. **StackChan IPC is draft-only, but StackChan status and internal local functions are active device/network surfaces.**  
   With StackChan currently HOLD, even status checks should be classified as device/network reads requiring explicit allowance.

4. **Discord IPC read is safe, but underlying Discord send/read functions are active when called from other services.**  
   `sendDiscordMessage()` should have function-boundary preflight or a single gated facade.

5. **Research publish IPC is draft-only, but research writer can perform local writes when called directly.**  
   `writeResearchReport()` should be wrapped or gated before broader use.

6. **Memory/profile writes do not yet enforce Memory Scope or raw-value filtering at every IPC boundary.**  
   This is a concrete path for unrelated domain memory or local-only values to persist.

7. **Installer/update/claw3d routes are inherited operational surfaces with strong side effects.**  
   They should be labeled legacy/admin and excluded from autonomous operation unless separate GO exists.

---

## 7. Recommended Fix Plan

Recommended next tasks:

1. `IPC_EXTERNAL_SURFACE_GUARD_PLAN`
   - Define a central route registry for every IPC route with effect type, action mode, and gate requirement.

2. `PRELOAD_ALLOWED_API_REDUCTION`
   - Split read-only UI APIs from runtime/admin APIs.
   - Hide or disable runtime/admin APIs in Shikishima operation mode.

3. `WORKER_TASK_CONTRACT_IMPLEMENTATION`
   - Gate `claude-code-task`, Codex, and agent skill execution behind a common worker task contract.

4. `STACKCHAN_DEVICE_FACADE_HOLD`
   - Keep actual local StackChan functions private.
   - Expose only draft/status stubs while StackChan is HOLD.

5. `DISCORD_SEND_FACADE`
   - Move `sendDiscordMessage()` behind `createDiscordSendPreflight()`.
   - Require evidence, allowedRunCount, and after-action HOLD.

6. `MEMORY_SCOPE_AND_REDACTION_GATE`
   - Add memory namespace selection and raw-value scrub at memory write boundaries.

7. `RUNTIME_ADMIN_ROUTE_HOLD`
   - Gate installer/update/claw3d/gateway start routes as runtime/admin routes.

---

## 8. Safety Verification

```text
source_changes: false
package_changed: false
runtime_started: false
git_push_performed: false
Discord_send: false
Obsidian_write: false
StackChan_connection: false
external_API_write: false
productionReady: false
execution: disabled
```

This audit document records risks and required fixes only. It does not approve any route to execute.
