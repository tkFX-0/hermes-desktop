# Discord Send Execution Plan

Date: 2026-05-26
Goal: `shikishima.push-discord-review-packet-and-add-discord-send-execution-plan`
Mode: docs-only plan; no Discord send, webhook, bot, token access, network call, or source changes

---

## 1. Purpose

This document defines the **one-shot execution boundary, evidence, rollback, and STOP rules** required before a `DiscordReviewPacket` may ever be sent to Discord.

It answers:

```text
What exact one-shot execution boundary, evidence, rollback, and STOP rules
are required before a DiscordReviewPacket may ever be sent?
```

This plan does **not** authorize Discord send, webhook use, bot runtime, token access, network calls, IPC wiring, queue mutation, file writing, or implementation in `src/**`.

```text
Obsidian actual write remains HOLD.
These files are repo-local Obsidian-compatible Markdown only.
No external write is approved by this plan.
```

Relationship to other docs:

| Document | Role |
|---|---|
| `DISCORD_SEND_GATE_PLAN.md` | General Discord send gates, route separation, token/webhook/bot policy |
| `DISCORD_SEND_EXECUTION_PLAN.md` (this file) | Execution-specific rules after `DiscordReviewPacket` exists |
| `HUMAN_GATE_QUEUE_MUTATION_PLAN.md` | Separate HOLD path for queue file mutation |

Queue-side prerequisites do **not** need to be hardened before this plan because this plan only defines future Discord send execution rules. Queue mutation remains a separate HOLD path.

---

## 2. Current Implemented Discord Review Pipeline

Implemented today (pure TypeScript; no network; no send):

```text
WorkerTaskContract
  → dryRunGoalContract()
  → createGoalRunnerDryRunReport()
  → createHumanGateReportFromDryRunReport()
  → createHumanGateQueueDisplayTargetItem()
  → createDiscordHumanGateMessageDraft()
  → renderDiscordHumanGateMessagePreview()
  → createDiscordSendPreflightIntentFromDraft()
  → evaluateDiscordSendPreflight()
  → createDiscordSendReadinessDigest()
  → createHumanGateStatusSnapshot()
  → createDiscordOperatorBrief()
  → renderDiscordOperatorBriefPreview()
  → createDiscordBriefSendPreflightJoin()
  → renderDiscordBriefSendPreflightJoinPreview()
  → createDiscordReviewPacket()
  → renderDiscordReviewPacketPreview()
  → (future Discord send execution preflight — NOT IMPLEMENTED)
  → (future one-shot Discord send execution — HOLD)
```

Upstream display layers (still display-only; not send):

```text
  → createDiscordHumanGateDigestDraft() / renderDiscordHumanGateDigestPreview()
  → createControlCenterHumanGateDisplayRenderModel()   (fallback/debug/read-only)
  → createIphoneHumanGateDisplayRenderModel()          (mobile read-only future)
  → createHumanGateQueueMarkdownRenderModel() / renderHumanGateQueueMarkdownPreview()
  → createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel()
  → evaluateHumanGateQueueMutationPreflight()
```

**Strategic direction:** Discord is the **primary operator viewing surface**. `DiscordReviewPacket` is the **final Discord-facing review bundle** before any future send gate. Ledger remains the source of truth.

---

## 3. Current Implemented Status

| Layer | Module / Doc | Status | Role |
|---|---|---|---|
| Discord message render | `discord-human-gate-message-render/` | PUSHED | draft + preview only |
| Discord send preflight | `discord-send-preflight/` | PUSHED | Intent/Result; `READY_CANDIDATE` ≠ send approval |
| Discord operator brief | `discord-operator-brief/` | PUSHED | short operator brief |
| Brief + preflight join | `discord-brief-send-preflight-join/` | PUSHED (`9a828f8`) | joined review unit |
| Discord review packet | `discord-review-packet/` | PUSHED (`95cfe3e`) | final review bundle; `packetOnly: true` |
| Discord send gate plan | `DISCORD_SEND_GATE_PLAN.md` | PUSHED | general send gates |
| Discord send execution plan | `DISCORD_SEND_EXECUTION_PLAN.md` | **THIS DOC** | execution rules after review packet |
| Discord send execution preflight | — | **FUTURE** | pure contract only; no network |
| Discord one-shot send execution | — | **HOLD** | separate Human GO + handler integration |
| Discord webhook execution | — | **HOLD** | separate route |
| Discord bot runtime | — | **HOLD** | supervised runtime only if ever approved |
| Token read at runtime | — | **HOLD** | separate Token Access GO |
| Human Gate Queue mutation | `HUMAN_GATE_QUEUE_MUTATION_PLAN.md` | **HOLD** | separate from Discord send |

Pushed baseline: `origin/main` at `95cfe3e` (Discord review packet contract + ledger).

---

## 4. Non-Approval Boundary

This plan does **not** approve:

- actual Discord message post (REST, webhook, or bot)
- webhook URL creation, storage, or invocation
- bot login, gateway connection, or polling loop
- reading `DISCORD_*` tokens from `.env` / `.env.local` in autonomous flows
- React/UI wiring to a “Send” button
- IPC/preload exposure of send-capable APIs
- Human Gate Queue mutation in `HUMAN_GATE_QUEUE.md`
- `productionReady: true` or `execution: enabled`
- continuous or scheduled Discord operations
- Discord auto-reply

**Required safety language (invariants):**

```text
Discord Review Packet does not approve Discord send.
Discord Send Preflight does not approve Discord send.
READY_CANDIDATE / REVIEW_READY_CANDIDATE are not send approvals.
Discord one-shot send execution remains HOLD.
Webhook execution remains HOLD.
Bot runtime remains HOLD.
Token access remains HOLD.
Auto-reply remains NOT_APPROVED.
Continuous mode remains NOT_APPROVED.
Queue mutation remains HOLD.
Runtime remains HOLD.
External write remains HOLD.
productionReady remains false.
execution remains disabled.
```

Even when `DiscordReviewPacket.status` is `REVIEW_READY_CANDIDATE`, packet safety must keep:

```text
sendReady: false
maySendNow: false
actualDiscordSend: false
webhookUsed: false
botStarted: false
tokenRead: false
networkCall: false
externalWrite: false
runtimeStarted: false
actualQueueMutation: false
fileWriteReady: false
humanGateQueueDocModified: false
productionReady: false
execution: disabled
```

---

## 5. Discord Route Separation

Discord capabilities must be modeled as **separate routes**. No route may imply approval of another.

| Route | Description | Default |
|---|---|---|
| Discord review packet | `createDiscordReviewPacket()` / `renderDiscordReviewPacketPreview()` | **IMPLEMENTED** / pure contract |
| Discord send execution preflight | Future pure contract evaluating execution readiness from review packet | **FUTURE** / pure contract only |
| Discord one-shot send execution | Future one-shot REST/bot post of approved exact text | **HOLD** |
| Discord webhook execution | HTTP POST to webhook URL | **HOLD** |
| Discord bot runtime | Gateway / polling loop | **HOLD** / supervised runtime only |
| Discord auto-reply | Autonomous reply to inbound messages | **NOT_APPROVED** |
| Discord continuous mode | Scheduled or repeated send/poll | **NOT_APPROVED** |

Rules:

```text
review_packet != send_execution_preflight
send_execution_preflight != one_shot_send
one_shot_send != webhook_execution
webhook_execution != bot_runtime
bot_runtime != auto_reply
send requires one-shot Human GO + full evidence chain
auto-reply requires a future gate category; default NOT_APPROVED
```

Alignment with `DISCORD_SEND_GATE_PLAN.md` §5 and `IPC_EXTERNAL_SURFACE_GUARD_PLAN.md` §7.

---

## 6. Future One-Shot Send Execution Route

Discord one-shot send execution is a **future** route that may only run after:

1. Explicit **Discord One-Shot Send GO** (separate from Review Packet GO, Preflight GO, or Queue Mutation GO)
2. Future **Discord send execution preflight** contract returns execution-ready candidate (still not send approval until GO applied)
3. `createExternalActionGuard()` (or successor) returns `GO_ONE_SHOT` for route id
4. All evidence fields in §7–§9 are satisfied
5. Operator confirms `exact_message_text_to_send` matches approved preview

Planned route shape (not implemented):

```text
decision: GO_ONE_SHOT
effectType: discord_one_shot_send
routeId: discord.send.one_shot.message
sourceSurface: guarded_handler_only
requiresHumanGo: true
allowedRunCount: 1
human_go_reference: <required>
```

Webhook and bot routes use **separate** `routeId` and **separate** Human GO references. One GO does not cover multiple routes.

---

## 7. Required Pre-Send Evidence

Before any Discord one-shot send effect may run (future implementation), evidence must exist:

| Evidence | Requirement |
|---|---|
| Human GO | Explicit `Discord One-Shot Send GO` recorded in queue/ledger |
| Review packet parity | `DiscordReviewPacket` built from current `DiscordBriefSendPreflightJoin` |
| Join status | Join status not `BLOCKED`; packet status mirrors join safely |
| Send preflight upstream | `DiscordSendPreflightResult` was input to join; preflight not `BLOCKED` |
| Execution preflight (future) | Future contract PASS for execution route; still not send until GO unlock |
| Route guard | Guard decision `GO_ONE_SHOT` for exactly one route |
| Git cleanliness | `pre_send_git_status_clean: true` (no untracked secrets; no unrelated dirty tree) |
| Tests | `pre_send_tests_or_reason_if_skipped` recorded |
| STOP review | No open STOP from worker task contract / dry-run for this goal |
| Dependency | No `package.json` change in same goal without Dependency Change GO |
| Safety checklist | `productionReady: false`, `execution: disabled` until one-shot guard flip only |

Optional but recommended:

- hash of `exact_packet_preview` (not raw secrets)
- link to `AUTONOMY_GOAL_LEDGER.md` goal entry

---

## 8. Required Exact Packet Evidence

The GO record and execution evidence must bind to the **exact** review packet:

| Field | Requirement |
|---|---|
| `source_review_packet_commit` | Git commit hash (or content hash) that produced the packet |
| `review_packet_id` | `DiscordReviewPacket.packetId` — must match packet under review |
| `exact_packet_preview` | Full output of `renderDiscordReviewPacketPreview(packet)` at GO time |
| `joined_review_status` | `packet.source.joinedReviewStatus` preserved |
| `packet_status` | `packet.status` at GO time (`REVIEW_READY_CANDIDATE` \| `HOLD` \| `BLOCKED`) |
| `human_go_reference` | Link to Human Gate queue item / GO id |

Rules:

```text
REVIEW_READY_CANDIDATE on the packet is not send approval.
BLOCKED packet must STOP execution.
HOLD packet must STOP execution unless explicit override GO exists (default: STOP).
Packet preview at send time must match exact_packet_preview byte-for-byte or STOP.
```

---

## 9. Required Exact Message Text Evidence

| Field | Requirement |
|---|---|
| `exact_message_text_to_send` | Full text to post; no template expansion without re-GO |
| Draft parity | Text must be derivable from approved `DiscordHumanGateMessageDraft` / operator brief chain |
| No truncation | If packet preview truncates for display, send text must still be explicit in GO |
| Mentions | Only if listed in `target_user_or_role_summary` and present in exact text |
| Embeds / attachments | **NOT_APPROVED** unless separate GO defines allowlist |

Forbidden without new GO:

- “send the packet preview” without separate `exact_message_text_to_send`
- batch send
- edit previous message as follow-up
- retry loop without new evidence record

---

## 10. Required Target Summary Evidence

| Field | Requirement |
|---|---|
| `target_channel_summary` | Redacted channel name/id summary (not raw snowflake in ledger) |
| `target_user_or_role_summary` | If mentions apply; redacted summary only |
| `allowed_send_count` | Must be `1` |
| `max_channels_per_go` | `1` |
| `max_messages_per_go` | `1` |

Digest send (multiple Human Gate items in one message) requires **explicit** GO text listing all included gate ids; default is single-item send only.

---

## 11. Token / Secret / Raw Value Policy

| Rule | Policy |
|---|---|
| Storage | `.env` / `.env.local` only; never commit secrets |
| Autonomous read | **HOLD** — no token read without Token Access GO |
| Logging | **Never** log token, webhook URL with secret, or Authorization header |
| Review packet | `tokenRead: false`, `rawValuesReported: false`, `redacted: true` |
| Execution evidence | `token_not_logged: true` mandatory |
| Evidence | `raw_values_reported: false` on every send record |

Token Access GO is **separate** from Discord One-Shot Send GO. Send GO does not imply token read for polling.

---

## 12. Webhook Policy

| Topic | Policy |
|---|---|
| Default | **HOLD** |
| Route | `Discord webhook execution` separate from `Discord one-shot send execution` |
| Creation | Storing webhook URLs = external write; requires Webhook GO |
| One-shot | Same limits: `allowed_send_count: 1` |
| Evidence | Webhook URL must not appear in ledger; use `target_channel_summary` |
| Review packet | `webhookUsed: false` always on packet contract |

Webhook execution remains **HOLD** until explicit future GO and guarded handler integration.

---

## 13. Bot Runtime Policy

| Topic | Policy |
|---|---|
| Default | **HOLD** |
| Route | `Discord bot runtime` separate from one-shot send |
| Continuous polling | **NOT_APPROVED** without supervised runtime GO + kill switch |
| Login / gateway | Requires Bot Runtime GO + Runtime GO |
| Review packet | `botStarted: false` always on packet contract |

Bot runtime remains **HOLD**. Any future polling must be time-bounded and restore HOLD on stop.

---

## 14. Network Call Policy

| Topic | Policy |
|---|---|
| Default | **HOLD** |
| Review packet | `networkCall: false` always |
| Future one-shot send | `network_call_limited_to_discord_send_only: true` — no ancillary calls in same GO |
| Forbidden in send GO | analytics, webhook creation, bot gateway connect, queue file write |
| External write | **HOLD** except the single approved Discord send attempt |

Network exposure for review/display contracts remains **false**.

---

## 15. Send Count Restrictions

```text
allowed_send_count: 1 per Human GO
actual_send_count: 0 or 1 only (evidence after attempt)
max_channels_per_go: 1
max_messages_per_go: 1
thread_create: NOT_APPROVED unless separate GO
cross-post / broadcast: NOT_APPROVED
scheduled_send: NOT_APPROVED
retry_without_new_go: NOT_APPROVED
```

---

## 16. Post-Send Evidence

After the one-shot attempt (success or failure):

| Field | Requirement |
|---|---|
| `actual_send_count` | `0` or `1` only |
| `post_send_result_summary` | HTTP status class / error class; no response body with tokens |
| `post_send_timestamp` | ISO timestamp in evidence record |
| `post_send_message_reference_redacted_or_summary_only` | Message id summary if available; no raw token |
| `gate_restored_hold` | Must be `true` |
| `token_not_logged` | Must be `true` |
| `raw_values_reported` | Must be `false` |
| `productionReady` | Must be `false` |
| `execution` | Must be `disabled` |
| Ledger note | Goal line: send attempted yes/no; send remains HOLD globally |

No auto-retry. Operator must issue new GO for another attempt.

---

## 17. Rollback / Remediation Policy

| Failure | Action |
|---|---|
| HTTP 4xx/5xx | Record `post_send_result_summary`; restore HOLD; `rollback_or_remediation_recorded: true` |
| Partial delivery | Treat as complete; no automatic resend |
| Wrong channel | Record remediation; do not auto-delete without Delete GO |
| Wrong text | Record remediation; follow-up correction requires new GO |
| Token leak suspected | STOP; rotate token out-of-band; no autonomous rotation |
| Guard stuck open | Force `gate_restored_hold: true`; incident record |

Rollback does **not** imply queue file rewrite. Queue remediation uses `HUMAN_GATE_QUEUE_MUTATION_PLAN.md` separately.

---

## 18. Gate Restoration Policy

After every send attempt (success, failure, or timeout):

```text
1. Set decision back to SAFETY_HOLD on discord.send.* and discord.webhook.*
2. Set discordSend: false on active contracts unless new draft session
3. Record gate_restored_hold: true in evidence
4. Do not leave bot connection open
5. Do not leave webhook client configured for auto-retry
6. productionReady stays false
7. execution stays disabled
8. Review packet contracts remain packet-only (no sendReady flip)
```

Continuous mode remains **NOT_APPROVED**. Auto-reply remains **NOT_APPROVED**.

---

## 19. Audit / Log Fields

Minimum audit record for a future one-shot send (redacted):

```text
human_go_reference
source_review_packet_commit
review_packet_id
exact_packet_preview_hash (optional; full text in GO artifact only)
exact_message_text_hash (optional; full text in GO artifact only)
target_channel_summary
target_user_or_role_summary
allowed_send_count: 1
actual_send_count
pre_send_git_status_clean
pre_send_tests_or_reason_if_skipped
token_not_logged: true
raw_values_reported: false
network_call_limited_to_discord_send_only: true
post_send_result_summary
post_send_timestamp
post_send_message_reference_redacted_or_summary_only
gate_restored_hold: true
rollback_or_remediation_recorded: true
productionReady: false
execution: disabled
route_id
effect_type
decision_before: SAFETY_HOLD
decision_during: GO_ONE_SHOT
decision_after: SAFETY_HOLD
```

Never store: bot token, webhook secret, full Authorization header, raw channel snowflakes in public ledger.

---

## 20. STOP Conditions

Stop immediately if:

```text
- DiscordReviewPacket.status is BLOCKED or HOLD (unless explicit override GO — default STOP)
- exact_packet_preview does not match live renderDiscordReviewPacketPreview()
- exact_message_text_to_send missing or ambiguous
- allowed_send_count != 1
- human_go_reference missing
- pre_send_git_status_clean is false
- tests failed and no documented skip reason
- token would be logged
- raw_values_reported would become true
- webhook or bot route requested in same GO as REST send without separate GO
- queue mutation requested in same GO (separate plan)
- package.json change in same goal without Dependency Change GO
- productionReady true required
- execution enabled required
- continuous or auto-reply behavior requested
- implementation would touch src/main, preload, renderer without source-change GO
- HUMAN_GATE_QUEUE.md data mutation required
```

---

## 21. Recommended Next Goals

Order matters. Actual Discord send remains later and separate.

```text
1. /goal shikishima.push-discord-send-execution-plan-and-add-discord-send-execution-preflight-contract
   → Push this plan + ledger; add pure send execution preflight contract (no network).

2. /goal shikishima.push-discord-send-execution-preflight-and-add-discord-one-shot-send-go-template
   → Push preflight + ledger; add docs-only one-shot send GO template (no send).
```

Meaning:

```text
First add a pure send execution preflight contract.
Then add a docs-only one-shot send GO template.
Actual Discord send remains later and separate.
```

Do **not** implement one-shot send, webhook, bot, token read, or handler integration in the preflight contract goal without explicit Human GO.

---

## Appendix: Future One-Shot Send Execution Gate Checklist

Required on every future Discord One-Shot Send GO (summary):

```text
human_go_reference
source_review_packet_commit
review_packet_id
exact_packet_preview
exact_message_text_to_send
target_channel_summary
target_user_or_role_summary (if any)
allowed_send_count: 1
actual_send_count (post)
pre_send_git_status_clean: true
pre_send_tests_or_reason_if_skipped
token_not_logged: true
raw_values_reported: false
network_call_limited_to_discord_send_only: true
post_send_result_summary
post_send_timestamp
post_send_message_reference_redacted_or_summary_only
gate_restored_hold: true
rollback_or_remediation_recorded: true
productionReady: false
execution: disabled
```
