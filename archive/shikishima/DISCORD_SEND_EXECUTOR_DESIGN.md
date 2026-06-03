# Discord Send Executor Design

Date: 2026-05-26
Goal: `shikishima.push-discord-one-shot-send-go-template-and-add-discord-send-executor-design`
Mode: docs-only design; no executor implementation, Discord send, webhook, bot, token access, network call, or source changes

---

## 1. Purpose

This document defines how a **future one-shot Discord send executor** would be safely structured, bounded, verified, and stopped—without implementing it.

It answers:

```text
How would a future one-shot Discord send executor be safely designed
without implementing it yet?
```

This design does **not** authorize Discord send, executor implementation, token access, network calls, IPC wiring, or changes in `src/**`.

```text
Obsidian actual write remains HOLD.
These files are repo-local Obsidian-compatible Markdown only.
No external write is approved by this design.
```

Upstream documents:

| Document | Role |
|---|---|
| `DISCORD_SEND_GATE_PLAN.md` | Route separation, general send policy |
| `DISCORD_SEND_EXECUTION_PLAN.md` | Evidence, rollback, STOP rules |
| `DISCORD_ONE_SHOT_SEND_GO_TEMPLATE.md` | Human GO wording |
| `discord-review-packet/` | Final review bundle |
| `discord-send-execution-preflight/` | `EXECUTION_READY_CANDIDATE` check |
| This design | Future executor architecture only |

---

## 2. Non-Implementation Boundary

This design does **not**:

- implement `DiscordSendExecutor` or any send function
- add files under `src/**`
- call Discord REST, webhooks, or bot gateway
- read `.env` tokens in autonomy paths
- expose IPC/preload send APIs
- approve `productionReady: true` or `execution: enabled`

**Required safety language (invariants):**

```text
Discord Send Executor Design does not approve Discord send.
Executor design does not implement Discord send.
Executor design does not approve token access.
Executor design does not approve network calls.
Future executor implementation requires separate Human GO.
Future actual Discord send requires separate Human GO.
Discord send remains HOLD.
Webhook remains HOLD.
Bot runtime remains HOLD.
Token access remains HOLD.
Network call remains HOLD.
Auto-reply remains NOT_APPROVED.
Continuous mode remains NOT_APPROVED.
Queue mutation remains HOLD.
Runtime remains HOLD.
External write remains HOLD.
productionReady remains false.
execution remains disabled.
```

---

## 3. Current Implemented Send-Readiness Pipeline

Implemented today (pure TypeScript; no network; no send):

```text
WorkerTaskContract
  → … Human Gate display / preflight chain …
  → createDiscordReviewPacket()
  → renderDiscordReviewPacketPreview()
  → createDiscordSendExecutionPreflightIntent()
  → evaluateDiscordSendExecutionPreflight()
  → renderDiscordSendExecutionPreflightPreview()
  → (future Discord Send Executor — NOT IMPLEMENTED)
  → (future one-shot Discord send attempt — HOLD)
  → (future post-send evidence — NOT IMPLEMENTED)
  → (future gate restored HOLD — NOT IMPLEMENTED)
```

Human GO template (docs-only):

```text
  → DISCORD_ONE_SHOT_SEND_GO_TEMPLATE.md (filled by human; not automatic)
```

Pushed baseline: `origin/main` includes `discord-send-execution-preflight` and `DISCORD_ONE_SHOT_SEND_GO_TEMPLATE.md`.

---

## 4. Future Executor Responsibility

The future executor is designed **only** to perform:

```text
- exactly one Discord send attempt per invocation
- one exact message text (from approved GO)
- one target channel summary (redacted label; resolved at runtime under separate Token GO)
- one approved time window (from GO)
- one human_go_reference (from GO)
- one source review packet commit binding
- one execution preflight result binding
- post-send evidence recording (redacted)
- gate restoration to HOLD after attempt completes
```

The executor is a **thin orchestration layer** behind `createExternalActionGuard()` (or successor) with `GO_ONE_SHOT` decision—not an autonomous agent.

---

## 5. Explicit Non-Responsibilities

The future executor must **not** be designed to support:

```text
- webhook expansion or webhook URL management
- bot polling or gateway connection loops
- bot runtime lifecycle (start/stop daemon)
- auto-reply to inbound messages
- continuous mode or scheduled send
- scheduler / cron integration
- retry loop without new Human GO
- multiple sends per invocation
- channel discovery or guild enumeration
- raw token logging
- raw channel snowflake logging in ledger
- Human Gate Queue mutation
- Obsidian vault write
- productionReady true
- execution enabled globally
- UI “Send” button wiring (separate UI GO)
```

---

## 6. Required Inputs

Future executor entry (conceptual) must accept a sealed input object:

| Input | Source | Required |
|---|---|---|
| `humanGoArtifact` | Filled `DISCORD_ONE_SHOT_SEND_GO_TEMPLATE.md` block | yes |
| `reviewPacket` | `DiscordReviewPacket` at `source_review_packet_commit` | yes |
| `executionPreflightResult` | `evaluateDiscordSendExecutionPreflight()` at GO time | yes |
| `exactMessageTextToSend` | GO block | yes |
| `targetChannelSummary` | GO block | yes |
| `targetUserOrRoleSummary` | GO block | optional |
| `allowedSendCount` | Must be `1` | yes |
| `requestedSendCount` | Must be `1` | yes |
| `timeWindow` | GO block | yes |
| `routeGuardDecision` | `GO_ONE_SHOT` from external action guard | yes |

Forbidden inputs:

```text
webhookUrl, botToken, rawChannelId in ledger-facing evidence
open-ended "send latest packet" without exact text
```

---

## 7. Required Human GO Validation

Before any future executor runs, it must validate the Human GO artifact. Reject (STOP) if:

```text
- GO text does not match DISCORD_ONE_SHOT_SEND_GO_TEMPLATE.md structure
- human_go_reference missing
- time_window missing or open-ended
- source_review_packet_commit missing
- source_execution_preflight_commit missing
- review_packet_id missing
- execution_preflight_status not EXECUTION_READY_CANDIDATE
- exact_message_text_to_send missing or differs from preflight intent
- target_channel_summary missing
- allowed_send_count not exactly 1
- requested_send_count not exactly 1
- webhook expansion mentioned
- bot runtime expansion mentioned
- auto-reply mentioned
- continuous mode mentioned
- token/raw value logging requested
- productionReady true requested
- execution enabled requested
- current time outside time_window
```

Validation is **structural and textual** in shared layer; cryptographic signing is out of scope unless a future GO adds it.

---

## 8. Required Preflight Validation

After Human GO validation, re-run or verify cached:

```text
evaluateDiscordSendExecutionPreflight(intent) → EXECUTION_READY_CANDIDATE
```

Rules:

```text
- reviewPacket.status must be REVIEW_READY_CANDIDATE
- reviewPacket.packetId must match GO review_packet_id
- exactPacketPreview must match renderDiscordReviewPacketPreview(reviewPacket)
- sendReady, maySendNow, actualDiscordSend must remain false on result
- EXECUTION_READY_CANDIDATE is not send approval; guard must still flip GO_ONE_SHOT
```

If preflight is HOLD or BLOCKED, executor must not start network layer.

---

## 9. Required Token / Secret Boundary

| Rule | Design |
|---|---|
| Token read | Only inside guarded main-process adapter; **separate Token Access GO** |
| Logging | Never log token, webhook secret, Authorization header |
| Evidence | `token_not_logged: true` on every attempt record |
| Config | `.env` only; never commit secrets |
| Shared types | `tokenRead: false` on all review/preflight contracts until explicit guarded flip |

Executor design assumes a **single read** immediately before POST, then discard from logs.

---

## 10. Required Discord Client Boundary

Future client adapter (main process only; **NOT IMPLEMENTED**):

```text
- one function: postMessage(redactedTargetRef, exactText) → ResultSummary
- no webhook client in v1 executor
- no bot gateway in v1 executor
- no message edit/delete in v1 executor
- no thread create in v1 executor
- no attachment upload in v1 executor
```

Route id (planned): `discord.send.one_shot.message`

Webhook and bot remain **separate routes** with separate GO and separate future adapters.

---

## 11. Required Network Boundary

```text
network_call_limited_to_discord_send_only: true
- at most one HTTP request per executor invocation
- no ancillary analytics, webhook creation, or bot login in same invocation
- timeout enforced; no retry without new GO
- externalWrite true only for duration of single POST (guard-scoped)
```

Shared contracts keep `networkCall: false` until guard explicitly enables one shot.

---

## 12. Required Send Count Enforcement

```text
allowed_send_count: 1
requested_send_count: 1
actual_send_count: 0 before attempt; 0 or 1 after
```

Executor must increment attempt counter atomically and refuse second call in same process session without new GO.

---

## 13. Required Post-Send Evidence

After attempt (success or failure), executor must emit:

```text
actual_send_count: 0 | 1
post_send_result_summary: HTTP class / error class only
post_send_timestamp: ISO-8601
post_send_message_reference_redacted_or_summary_only: optional
human_go_reference: copied from GO
review_packet_id: copied from GO
gate_restored_hold: true
rollback_or_remediation_recorded: true
token_not_logged: true
raw_values_reported: false
productionReady: false
execution: disabled
```

Evidence goes to ledger/queue artifact—not to Discord.

---

## 14. Required Gate Restoration

After every attempt:

```text
1. Guard returns discord.send.* to SAFETY_HOLD
2. sendReady / maySendNow / actualDiscordSend false on active session
3. No bot connection left open
4. No webhook client retained
5. productionReady stays false
6. execution stays disabled
7. Record gate_restored_hold: true
```

Continuous mode and auto-reply remain **NOT_APPROVED**.

---

## 15. Required Rollback / Remediation Handling

| Scenario | Executor behavior |
|---|---|
| HTTP 4xx/5xx | Record summary; restore HOLD; no auto-retry |
| Wrong channel | Record remediation note; no auto-delete |
| Wrong text | Record remediation; new GO required for correction |
| Token leak suspicion | STOP; no further sends; human rotates token OOB |
| Partial success | Treat as complete; no follow-up send |

Queue remediation uses `HUMAN_GATE_QUEUE_MUTATION_PLAN.md` separately.

---

## 16. Error Handling and STOP Behavior

```text
STOP (do not send) when:
- any validation in §7–§8 fails
- guard decision != GO_ONE_SHOT
- time_window expired
- git tree dirty when pre_send_git_status_clean required
- dependency/package drift vs GO commits

FAIL-SAFE default: HOLD

Never catch-and-retry network errors in a loop.
Never fall back to webhook “if REST fails”.
Never log response bodies that may contain secrets.
```

---

## 17. Audit / Log Schema

Minimum executor audit record (redacted; JSON or ledger Markdown):

```json
{
  "event": "discord_one_shot_send_attempt",
  "human_go_reference": "<ref>",
  "time_window": "<bounded>",
  "source_review_packet_commit": "<sha>",
  "source_execution_preflight_commit": "<sha>",
  "review_packet_id": "<id>",
  "execution_preflight_status": "EXECUTION_READY_CANDIDATE",
  "target_channel_summary": "<redacted>",
  "allowed_send_count": 1,
  "requested_send_count": 1,
  "actual_send_count": 0,
  "post_send_result_summary": null,
  "post_send_timestamp": null,
  "gate_restored_hold": false,
  "token_not_logged": true,
  "raw_values_reported": false,
  "productionReady": false,
  "execution": "disabled",
  "route_id": "discord.send.one_shot.message"
}
```

Update `actual_send_count`, `post_send_*`, `gate_restored_hold` after attempt.

---

## 18. Test Strategy Before Implementation

Before any executor code lands:

| Phase | Tests | Location (proposed) |
|---|---|---|
| 1 | GO parser / validator rejects invalid templates | `discord-send-executor-go-validator.test.ts` |
| 2 | Input seal + preflight re-check | `discord-send-executor-preflight.test.ts` |
| 3 | Guard integration mock (no real network) | `discord-send-executor-guard.test.ts` |
| 4 | Post-send evidence builder (redacted) | `discord-send-executor-evidence.test.ts` |
| 5 | E2E with stub HTTP client | main process; **separate GO**; no production token |

All unit tests must run without `DISCORD_*` env vars.

Contract tests must assert `sendReady: false` until guard flip; never assert `actualDiscordSend: true` in shared tests without stub.

---

## 19. Implementation File Boundary Proposal

**NOT IMPLEMENTED — proposal only.**

### Shared layer (pure; no network)

```text
src/shared/discord-send-executor/discord-send-executor-types.ts
src/shared/discord-send-executor/discord-send-executor-go-validator.ts
src/shared/discord-send-executor/discord-send-executor-evidence.ts
src/shared/discord-send-executor/discord-send-executor.test.ts
src/shared/discord-send-executor/index.ts
```

Responsibilities: GO validation, evidence DTOs, preflight re-check orchestration (calls existing preflight), preview strings.

### Main process (HOLD — future only)

```text
src/main/discord-send-executor/discord-send-executor-runner.ts   # guarded runner
src/main/discord-send-executor/discord-rest-adapter.ts           # Token GO only
```

Must sit behind `createExternalActionGuard()` / IPC guard facade per Goal A6 plan.

### Explicitly not in v1 proposal

```text
src/renderer/**          # no Send button
src/preload/**           # no send exposure
src/main/discord-bot/**  # HOLD
webhook client           # HOLD
```

---

## 20. Forbidden Expansion List

Do not add without separate Human GO:

```text
- second send per GO
- webhook send route in same executor
- bot gateway connection
- auto-reply handler
- scheduled jobs
- “send queue” batch processor
- token persistence beyond env read
- raw id fields in AUTONOMY_GOAL_LEDGER.md
- HUMAN_GATE_QUEUE.md auto-update on send
- productionReady flip
- execution global enable
- npm dependency for discord.js without Dependency Change GO
```

---

## 21. Recommended Next Goals

```text
1. /goal shikishima.push-discord-send-executor-design-and-add-discord-send-executor-preimplementation-review
   → Push this design + ledger; add docs-only preimplementation review checklist.

2. /goal shikishima.push-discord-send-executor-preimplementation-review-and-add-discord-send-executor-shared-types
   → Push review + ledger; add shared executor types only (no network, no main).
```

Meaning:

```text
First add a docs-only preimplementation review.
Then add shared executor types only.
Actual main-process executor and actual Discord send remain later and separate.
```

---

## Appendix: Planned Executor Flow (Future)

```text
1. Load Human GO artifact
2. Validate GO structure (§7)
3. Load review packet + preflight at pinned commits
4. Re-run evaluateDiscordSendExecutionPreflight → EXECUTION_READY_CANDIDATE
5. Request guard GO_ONE_SHOT for discord.send.one_shot.message
6. If guard denies → STOP (HOLD)
7. Resolve channel via redacted summary (main only; Token GO)
8. POST exact_message_text_to_send (one HTTP call)
9. Write post-send evidence (§13)
10. Restore HOLD (§14)
```

No step may be skipped. No step may run without completed Human GO artifact.
