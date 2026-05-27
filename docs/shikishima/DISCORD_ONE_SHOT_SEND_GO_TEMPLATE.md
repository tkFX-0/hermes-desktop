# Discord One-Shot Send GO Template

Date: 2026-05-26
Goal: `shikishima.push-send-execution-preflight-and-add-discord-one-shot-send-go-template`
Mode: docs-only template; no Discord send, webhook, bot, token access, network call, or source changes

---

## 1. Purpose

This document defines the **exact human approval statement** required before a future **one-shot Discord send** may ever be considered for execution.

It answers:

```text
What exact human approval statement is required
before a future one-shot Discord send can be executed?
```

This template does **not** authorize Discord send, webhook use, bot runtime, token access, network calls, executor implementation, or any change in `src/**`.

```text
Obsidian actual write remains HOLD.
These files are repo-local Obsidian-compatible Markdown only.
No external write is approved by this template.
```

Relationship to upstream contracts:

| Layer | Document / Module | Role |
|---|---|---|
| Review bundle | `discord-review-packet/` | Final Discord-facing review packet |
| Execution preflight | `discord-send-execution-preflight/` | `EXECUTION_READY_CANDIDATE` evidence check |
| Execution plan | `DISCORD_SEND_EXECUTION_PLAN.md` | One-shot boundary, evidence, rollback |
| Send gate | `DISCORD_SEND_GATE_PLAN.md` | General Discord route policy |
| This template | `DISCORD_ONE_SHOT_SEND_GO_TEMPLATE.md` | Human GO wording for one send only |

---

## 2. Non-Approval Boundary

This template does **not** approve:

- actual Discord message post (REST, webhook, or bot)
- reading or logging tokens, webhook secrets, or raw channel/user ids in ledger evidence
- webhook execution, bot runtime, auto-reply, or continuous mode
- Human Gate Queue mutation in `HUMAN_GATE_QUEUE.md`
- `productionReady: true` or `execution: enabled`
- batch send, follow-up send, or retry without a new GO

**Required safety language (invariants):**

```text
Discord One-Shot Send GO Template does not approve Discord send.
Reading this template does not approve Discord send.
Filling this template does not approve Discord send unless all required fields are present
  and a separate future executor GO explicitly references it.
Discord send remains HOLD.
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

---

## 3. Required Preconditions

Before any future **actual** Discord One-Shot Send GO is valid, all of the following must be true:

```text
DiscordReviewPacket contract exists and is PUSHED
DiscordSendExecutionPreflight contract exists and is PUSHED
DiscordSendExecutionPreflightResult.status is EXECUTION_READY_CANDIDATE
EXECUTION_READY_CANDIDATE is not send approval by itself
exactMessageTextToSend is recorded in the GO
targetChannelSummary is recorded in the GO
allowedSendCount is exactly 1
requestedSendCount is exactly 1
humanGoReference is explicit and traceable
token_not_logged is true
rawValuesReported is false
pre_send_git_status_clean is true
networkCallLimitedToDiscordSendOnly is true
productionReady remains false
execution remains disabled
```

Additional rules:

```text
review_packet_id must match the DiscordReviewPacket under review
source_review_packet_commit must match the commit that produced the packet
source_execution_preflight_commit must match the preflight contract commit in use
exact_packet_preview in preflight must match renderDiscordReviewPacketPreview() at GO time
time_window must be a bounded interval (not open-ended)
```

---

## 4. Required Source Commits

The Human GO must record both commits:

| Field | Requirement |
|---|---|
| `source_review_packet_commit` | Git commit containing `discord-review-packet` used to build the packet |
| `source_execution_preflight_commit` | Git commit containing `discord-send-execution-preflight` used for evaluation |

Rules:

```text
Commits must be full 7+ character hashes or full SHAs recorded in ledger/queue evidence.
"latest main" alone is invalid.
If packet or preflight code changes after GO issuance, STOP and re-issue GO.
```

---

## 5. Required Review Packet Evidence

The GO must bind to the review packet:

| Field | Requirement |
|---|---|
| `review_packet_id` | `DiscordReviewPacket.packetId` |
| `review_packet_status` | Must be `REVIEW_READY_CANDIDATE` at GO time |
| `exact_packet_preview` | Full `renderDiscordReviewPacketPreview(packet)` text attached or hashed in GO artifact |

The GO must **not** substitute digest-only text or operator brief alone for the full packet preview.

---

## 6. Required Execution Preflight Evidence

The GO must reference a completed execution preflight evaluation:

| Field | Requirement |
|---|---|
| `execution_preflight_status` | Must be `EXECUTION_READY_CANDIDATE` |
| `execution_preflight_result` | Redacted summary only in public ledger; full result in GO artifact if needed |
| `pre_send_tests_or_reason_if_skipped` | e.g. `vitest full suite PASS` or documented skip reason |

Remember:

```text
EXECUTION_READY_CANDIDATE means enough documentation to present to a human.
EXECUTION_READY_CANDIDATE does not authorize send.
sendReady and maySendNow remain false on the preflight result.
```

---

## 7. Required Exact Message Text

| Rule | Policy |
|---|---|
| `exact_message_text_to_send` | Full final text to post; no template expansion without re-GO |
| Parity | Must match approved Human Gate / review intent; no hidden append |
| Length | If truncated in UI preview, full text must still appear in GO block |
| Mentions | Only if listed in `target_user_or_role_summary` and present in exact text |

Forbidden:

```text
"Send the packet preview" without exact_message_text_to_send
"Same as last time"
Placeholder text like <TBD> or <fill later>
```

---

## 8. Required Target Channel Summary

| Field | Requirement |
|---|---|
| `target_channel_summary` | Redacted channel name or operator label (e.g. `#human-gate-review`) |
| Raw ids | Must not appear in ledger or public GO copy |
| Count | Exactly one channel per GO |

---

## 9. Required Send Count Limit

```text
allowed_send_count: 1
requested_send_count: 1
max_messages_per_go: 1
max_channels_per_go: 1
```

Any value other than `1` invalidates the GO.

Follow-up messages require a **new** Human GO.

---

## 10. Required Token / Secret / Raw Value Policy

```text
token_not_logged: true
raw_values_reported: false
redacted summaries only in ledger evidence
no bot token in GO text
no webhook URL with secret in GO text
no full Authorization header in evidence
```

Token Access GO is **separate**. This GO does not approve token read for polling or storage.

---

## 11. Required Allowed Command / Scope Placeholder

The GO must state the **bounded scope** of the single send. Use this placeholder block:

```text
allowed_command_scope:
  route: discord_one_shot_send_execution
  effect: single_message_post_only
  channels: 1 (as target_channel_summary)
  messages: 1 (as exact_message_text_to_send)
  webhook: false
  bot_runtime: false
  auto_reply: false
  continuous_mode: false
  queue_mutation: false
  file_write: false
  network: discord_send_only
```

If scope expands beyond this block, the GO is invalid.

---

## 12. Required Post-Send Evidence

After a future one-shot send attempt (when ever implemented), the operator must record:

```text
actual_send_count: 0 or 1
post_send_result_summary: success/failure class only; no token leakage
post_send_timestamp: ISO timestamp
post_send_message_reference_redacted_or_summary_only: optional message id summary
gate_restored_hold: true
rollback_or_remediation_recorded: true
productionReady: false
execution: disabled
```

This template does not execute post-send recording; it only defines required fields.

---

## 13. Required Gate Restoration Confirmation

The Human GO must include an explicit understanding clause:

```text
After the single send attempt completes (success or failure),
all Discord send routes return to SAFETY_HOLD.
gate_restored_hold must be recorded as true in evidence.
No bot connection remains open.
No webhook client remains configured for auto-retry.
```

---

## 14. Required Rollback / Remediation Statement

The Human GO approver must acknowledge:

```text
If the wrong channel or wrong text was sent, remediation requires a new Human GO.
Automatic resend is NOT_APPROVED.
Token leak suspicion requires STOP and manual rotation out-of-band.
Queue file changes are NOT part of this GO (see HUMAN_GATE_QUEUE_MUTATION_PLAN.md).
```

---

## 15. STOP Conditions

Stop and do **not** treat any GO as valid if:

```text
- review_packet_status is HOLD or BLOCKED
- execution_preflight_status is not EXECUTION_READY_CANDIDATE
- exact_message_text_to_send is missing or ambiguous
- target_channel_summary is missing
- allowed_send_count != 1 or requested_send_count != 1
- human_go_reference is missing
- source_review_packet_commit or source_execution_preflight_commit is missing
- time_window is missing or open-ended
- webhook, bot, auto-reply, or continuous mode is requested
- queue mutation is requested in the same GO
- productionReady true or execution enabled is requested
- raw values would be logged
- pre_send_git_status_clean is false
```

---

## 16. Human GO Template Block

Copy, fill every field, and attach to Human Gate evidence. **Incomplete blocks are invalid.**

```text
# Discord One-Shot Send GO

I approve exactly one Discord send under the following constraints.

human_go_reference: <human-filled reference>
time_window: <YYYY-MM-DD HH:MM-HH:MM JST>
source_review_packet_commit: <commit>
source_execution_preflight_commit: <commit>
review_packet_id: <packet id>
execution_preflight_status: EXECUTION_READY_CANDIDATE

exact_packet_preview:
<full renderDiscordReviewPacketPreview output or attached artifact hash>

exact_message_text_to_send:
<exact message text>

target_channel_summary:
<redacted/safe summary only>

target_user_or_role_summary:
<redacted/safe summary or none>

allowed_send_count: 1
requested_send_count: 1

allowed_command_scope:
  route: discord_one_shot_send_execution
  effect: single_message_post_only
  channels: 1
  messages: 1
  webhook: false
  bot_runtime: false
  auto_reply: false
  continuous_mode: false
  queue_mutation: false
  file_write: false
  network: discord_send_only

pre_send_git_status_clean: true
pre_send_tests_or_reason_if_skipped: <e.g. vitest full suite PASS>
token_not_logged: true
raw_values_reported: false
networkCallLimitedToDiscordSendOnly: true
productionReady: false
execution: disabled

I understand:
- EXECUTION_READY_CANDIDATE is not automatic send approval.
- This GO approves one send only.
- No webhook expansion is approved.
- No bot runtime expansion is approved.
- No auto-reply is approved.
- No continuous mode is approved.
- No token or raw value may be logged.
- After the send attempt, the gate must be restored to HOLD.
- productionReady remains false.
- execution remains disabled.

Approver: <name or role>
Approved at: <YYYY-MM-DD HH:MM:SS JST>
```

**Separate future executor GO required:** A future implementation goal must explicitly reference this completed GO block before any executor code may run. Filling this template alone does not start send.

---

## 17. Invalid GO Examples

The following are **invalid** and must be rejected:

| Example | Why invalid |
|---|---|
| `Send it.` | No exact message, target, counts, commits, or time window |
| `Post to Discord.` | No exact_message_text_to_send or channel summary |
| `Looks good, go.` | No evidence binding; vague approval |
| `Send whenever ready.` | Open-ended; not one-shot; no time_window |
| `Turn on Discord bot.` | Bot runtime NOT_APPROVED; wrong route |
| `Start auto-replies.` | Auto-reply NOT_APPROVED |
| `Use webhook if needed.` | Webhook HOLD; scope expansion |
| `Send this and future updates.` | Continuous / batch; violates count limit |
| `READY_CANDIDATE so you can send.` | Confuses preflight candidate with send approval |
| `Same message as yesterday.` | No exact_message_text_to_send recorded |

---

## 18. Recommended Next Goals

Order matters. Actual Discord send remains later and separate.

```text
1. /goal shikishima.push-discord-one-shot-send-go-template-and-add-discord-send-executor-design
   → Push this template + ledger; add docs-only executor design (no send).

2. /goal shikishima.push-discord-send-executor-design-and-add-discord-send-executor-preimplementation-review
   → Push design + ledger; add preimplementation review checklist (no executor code).
```

Meaning:

```text
First add a docs-only executor design.
Then add a preimplementation review before any executor code.
Actual Discord send remains later and separate.
```

Do not implement executor, webhook client, bot runtime, or IPC send routes without explicit Human GO per goal.
