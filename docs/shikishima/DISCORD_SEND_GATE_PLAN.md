# Discord Send Gate Plan

Date: 2026-05-26
Goal: `shikishima.push-discord-display-contracts-and-plan-discord-send-gate`
Mode: docs-only plan; no Discord send, webhook, bot, token access, or source changes

---

## 1. Purpose

This document defines the **gates, evidence, and one-shot limits** that must exist before Discord **send** (external write) can ever be allowed in Shikishima.

It answers:

```text
What exact gates, evidence, and one-shot limits are required
before Discord send can ever be allowed?
```

This plan does **not** authorize Discord send, webhook use, bot runtime, token access, network calls, IPC wiring, or implementation in `src/**`.

```text
Obsidian actual write remains HOLD.
These files are repo-local Obsidian-compatible Markdown only.
No external write is approved by this plan.
```

---

## 2. Current Discord Display Pipeline

Implemented today (pure TypeScript; no network; no send):

```text
WorkerTaskContract
  → dryRunGoalContract()
  → createGoalRunnerDryRunReport()
  → createHumanGateReportFromDryRunReport()
  → createHumanGateQueueDisplayTargetItem()
  → createDiscordHumanGateMessageDraft()
  → renderDiscordHumanGateMessagePreview()          (string only)
  → createDiscordHumanGateDigestDraft()
  → renderDiscordHumanGateDigestPreview()           (string only)
```

Parallel surfaces (display-only; not send):

```text
  → createControlCenterHumanGateDisplayItem()
  → createControlCenterHumanGateDisplayRenderModel()  (fallback/debug/read-only)
  → createIphoneHumanGateDisplayItem()
  → createIphoneHumanGateDisplayRenderModel()         (mobile read-only future)
```

**Strategic direction:** Discord is the **primary operator viewing surface**. Control Center remains fallback/debug/read-only local surface. Ledger remains the source of truth.

---

## 3. Current Implemented Status

| Layer | Module | Status | Role |
|---|---|---|---|
| Human Gate queue display target | `human-gate-queue-display-target/` | PUSHED | upstream shape for all displays |
| Discord message render | `discord-human-gate-message-render/` | PUSHED (`f697f39`) | `DiscordHumanGateMessageDraft`; `draftOnly: true`, `sendReady: false` |
| Discord digest render | `discord-human-gate-digest-render/` | PUSHED (`b066f73`) | digest preview; no send |
| iPhone display render | `iphone-human-gate-display-render/` | PUSHED (`66eead7`) | mobile card model; no network |
| Control Center render | `control-center-human-gate-display-render/` | PUSHED | fallback panel model |
| Discord send preflight | — | **NOT IMPLEMENTED** | recommended next pure contract |
| Discord send executor | — | **NOT APPROVED** | separate future GO |
| Webhook send | — | **HOLD** | separate route |
| Bot polling / runtime | — | **HOLD** | supervised runtime only if ever approved |
| Token read at runtime | — | **HOLD** | env/secret policy below |

Pushed baseline: `origin/main` at `a5ead79` (Discord render contracts + ledger).

Related guard design (exists; not implemented in handlers):

- `docs/shikishima/IPC_EXTERNAL_SURFACE_GUARD_PLAN.md` — §7 Discord Route Guard Plan
- `docs/shikishima/IPC_EXTERNAL_SURFACE_AUDIT.md` — external route inventory

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
Discord message render contracts do not approve Discord send.
Discord digest render contracts do not approve Discord send.
Discord preview does not approve Discord send.
Discord send remains HOLD.
Webhook use remains HOLD.
Bot runtime remains HOLD.
Token access remains HOLD.
Auto-reply remains NOT_APPROVED.
Continuous mode remains NOT_APPROVED.
External API write remains HOLD.
productionReady remains false.
execution remains disabled.
```

---

## 5. Discord Route Separation

Discord capabilities must be modeled as **separate routes**. No route may imply approval of another.

| Route | Description | Default decision |
|---|---|---|
| Discord read | Fetch channel/message metadata for operator review | **HOLD** or **READ_ONLY** after separate Human GO |
| Discord draft | Build in-memory / repo-local draft from Human Gate pipeline | **DRAFT_ONLY** |
| Discord preview | Render preview string (no network) | **DRAFT_ONLY** |
| Discord send | One-shot REST/bot post of approved exact text | **SAFETY_HOLD** |
| Discord webhook send | HTTP POST to webhook URL | **SAFETY_HOLD** |
| Discord bot polling | Gateway / polling loop | **SAFETY_HOLD** / supervised runtime only |
| Discord auto-reply | Autonomous reply to inbound messages | **NOT_APPROVED** |

Rules:

```text
read != send
draft != send
preview != send
webhook_send != bot_send (separate GO references)
polling != auto-reply
send requires one-shot Human GO + evidence
auto-reply requires a future gate category; default NOT_APPROVED
```

Alignment with `IPC_EXTERNAL_SURFACE_GUARD_PLAN.md` §7: this plan adds **Discord preview** and **Discord webhook send** as explicit routes (preview was implicit in draft-only contracts).

---

## 6. Discord Send One-Shot Gate

Discord send may only be planned as **future one-shot** behavior per explicit Human GO.

Each approved send operation is exactly **one** external write attempt unless a new Human GO is issued.

### Gate decision shape (planned; not implemented)

```text
decision: GO_ONE_SHOT
effectType: discord_send | discord_webhook_send
routeId: discord.send.message | discord.webhook.post
sourceSurface: discord | renderer | worker
requiresHumanGo: true
allowedRunCount: 1
human_go_reference: <required>
```

### Required fields on the GO record

| Field | Requirement |
|---|---|
| `human_go_reference` | Link to Human Gate queue item / GO id (e.g. `Discord Send GO`) |
| `exact_message_text` | Full text to send; no template expansion without re-GO |
| `target_channel_summary` | Redacted channel name/id summary (not raw token) |
| `target_user_or_role_summary` | If mentions apply; redacted summary only |
| `allowed_send_count` | Must be `1` |
| `actual_send_count` | Evidence after attempt: `0` or `1` only |
| `send_result_summary` | Success/failure summary; no token leakage |
| `gate_restored_hold` | Must be `true` after operation completes |
| `token_not_logged` | Must be `true` |
| `raw_values_reported` | Must be `false` |
| `productionReady` | Must be `false` |
| `execution` | Must be `disabled` |

### Forbidden without new GO

- batch send
- edit previous message as follow-up send
- retry loop without new evidence record
- “send digest + send detail” as two writes in one GO (each write = one GO)

---

## 7. Required Evidence Before Send

Before any Discord send effect may run (future implementation), evidence must exist:

| Evidence | Content |
|---|---|
| Human GO | Explicit `Discord Send GO` (or webhook-specific GO) recorded in queue/ledger |
| Draft parity | `DiscordHumanGateMessageDraft` or digest draft matches `exact_message_text` intent |
| Preflight PASS | Future `discord-send-preflight` contract returns `sendReady: false` until GO applied; then one-shot unlock |
| Route guard | `createExternalActionGuard()` decision `GO_ONE_SHOT` for route id |
| Target summary | `target_channel_summary` approved in GO |
| Safety checklist | `productionReady: false`, `execution: disabled`, `discordSend: false` in contracts until guard flips for one shot only |
| STOP review | No open STOP from worker task contract / dry-run for this goal |
| Dependency | No `package.json` change in same goal without Dependency Change GO |

Optional but recommended:

- screenshot or log of preview string hash (not raw secrets)
- link to `AUTONOMY_GOAL_LEDGER.md` entry for the goal

---

## 8. Required Evidence After Send

After the one-shot attempt (success or failure):

| Evidence | Content |
|---|---|
| `actual_send_count` | `0` or `1` |
| `send_result_summary` | HTTP status class / error class; no response body with tokens |
| `gate_restored_hold` | `true` — all send routes return SAFETY_HOLD |
| `token_not_logged` | `true` — audit must not contain bot token or webhook secret |
| `raw_values_reported` | `false` |
| Ledger note | Goal completion line: send performed yes/no; still `productionReady: false` |
| Queue state | If queue tracks GO: mark USED / restore HOLD per `HUMAN_GATE_QUEUE.md` policy (mutation requires separate GO) |
| No follow-up | No auto-retry; operator must issue new GO |

---

## 9. Token and Secret Policy

| Rule | Policy |
|---|---|
| Storage | `.env` / `.env.local` only; never commit secrets |
| Autonomous read | **HOLD** — no token read in worker/autonomy path without Token Access GO |
| Logging | **Never** log token, webhook URL with secret, or full Authorization header |
| Preview contracts | `tokenRequired: false`, `tokenRead: false` on `DiscordHumanGateMessageDraft` |
| Preflight (future) | May check “token configured” as boolean only; must not emit token value |
| Evidence | `token_not_logged: true` on every send evidence record |

Token Access GO is a **separate** gate from Discord Send GO. Send GO does not imply token read GO for continuous polling.

---

## 10. Webhook Policy

| Topic | Policy |
|---|---|
| Default | **SAFETY_HOLD** |
| Route | `Discord webhook send` separate from `Discord send` (bot REST) |
| Creation | Creating/storing webhook URLs = external write; requires Webhook GO |
| One-shot | Same one-shot limits: `allowed_send_count: 1` |
| Evidence | Webhook URL must not appear in ledger evidence; use `target_channel_summary` |
| Render contracts | `webhookRequired: false`, `webhookUsed: false` on drafts |

Webhook use remains **HOLD** until explicit future GO and handler integration behind guard facade.

---

## 11. Bot Runtime Policy

| Topic | Policy |
|---|---|
| Default | **SAFETY_HOLD** |
| Route | `Discord bot polling` separate from send |
| Continuous polling | **NOT_APPROVED** without supervised runtime GO + kill switch |
| Login / gateway | Requires Bot Runtime GO + Runtime GO |
| Test sends | Historical evidence (e.g. DIS-BOT-02) does not auto-approve future sends |
| Render contracts | `botRequired: false`, `botStarted: false` on drafts |

Bot runtime remains **HOLD**. Any future polling must be time-bounded and restore HOLD on stop.

---

## 12. Send Count and Target Restrictions

```text
allowed_send_count: 1 per Human GO
max_channels_per_go: 1
max_messages_per_go: 1
mentions: only if listed in target_user_or_role_summary and exact_message_text
embeds/attachments: NOT_APPROVED unless separate GO defines allowlist
thread_create: NOT_APPROVED unless separate GO
cross-post / broadcast: NOT_APPROVED
```

Digest send (multiple Human Gate items in one message) requires **explicit** GO text listing all included gate ids; default is single-item send only.

---

## 13. Gate Restoration Policy

After every send attempt (success, failure, or timeout):

```text
1. Set decision back to SAFETY_HOLD on discord.send.* and discord.webhook.*
2. Set discordSend: false on active contracts unless new draft session
3. Record gate_restored_hold: true in evidence
4. Do not leave bot connection open
5. Do not leave webhook client configured for auto-retry
6. productionReady stays false
7. execution stays disabled
```

Continuous mode remains **NOT_APPROVED**. Scheduled send remains **NOT_APPROVED**.

---

## 14. Failure and Rollback Policy

| Failure | Action |
|---|---|
| HTTP 4xx/5xx | Record `send_result_summary`; `actual_send_count` may be `0` or `1`; restore HOLD |
| Partial delivery | Treat as complete; no automatic resend |
| Wrong channel | Operator issues new GO; optional delete/edit requires separate GO |
| Token invalid | Fail closed; no token in logs; restore HOLD |
| Guard mismatch | Fail closed; no send; record preflight block reason |

Rollback of **code** is git revert per normal process. Rollback of **Discord message** (delete/edit) is a **new** external effect requiring a new GO.

---

## 15. Audit / Log Fields

Structured audit entry (future; redacted):

```text
timestamp_utc
goal_id
task_id
gate_id
human_go_reference
route_id
decision_before
decision_after
allowed_send_count
actual_send_count
target_channel_summary
target_user_or_role_summary
message_text_hash (optional; not raw if policy forbids)
send_result_summary
gate_restored_hold
token_not_logged
raw_values_reported
productionReady
execution
discord_send_attempted
webhook_used
bot_started
source_surface
```

Never store: bot token, webhook secret, full webhook URL, Authorization header, DM content from other users at full fidelity if policy says redacted.

---

## 16. STOP Conditions

Stop implementation and require human review if:

```text
- send route would run without GO_ONE_SHOT
- allowed_send_count != 1
- token appears in logs or evidence
- render contract sets sendReady: true by default
- webhook or bot starts without explicit GO
- auto-reply path is enabled
- continuous polling is enabled
- productionReady would become true
- execution would become enabled
- Human Gate Queue mutates without Queue Mutation GO
- package.json changes bundled with send wiring
- IPC exposes send without preload guard plan approval
- Discord preview is confused with send approval
```

---

## 17. Recommended Next Goals

Priority order (do not skip send gate design):

```text
1. /goal shikishima.push-discord-send-gate-plan-and-add-discord-send-preflight-contract
   - Push this plan + ledger (Push GO)
   - Add pure TypeScript discord-send-preflight contract (no network)
   - Preflight returns sendReady: false until explicit one-shot unlock shape exists

2. /goal shikishima.human-gate-queue-markdown-render-contract
   - Lower priority than send preflight
   - Repo-local queue Markdown render helper (string only; no file write)

Later (separate GOs; not implied):

   - Discord read route behind guard (READ_ONLY)
   - Discord send handler behind createExternalActionGuard facade
   - Actual one-shot send with evidence template
```

**Meaning:**

```text
First add a pure Discord send preflight contract.
Then add Human Gate Queue Markdown render.
Actual Discord send remains later and separate.
```

---

## Appendix: Contract ↔ Route Mapping

| Contract / artifact | Approves send? |
|---|---|
| `DiscordHumanGateMessageDraft` | **No** (`draftOnly: true`, `discordSend: false`) |
| `DiscordHumanGateDigestDraft` | **No** |
| `renderDiscordHumanGateMessagePreview()` | **No** (string only) |
| `DISCORD_SEND_GATE_PLAN.md` (this doc) | **No** (design only) |
| Future `discord-send-preflight` | **No** until GO unlock shape; still no network |
| Future send executor | **Only** with GO_ONE_SHOT + evidence |

---

## References

- `docs/shikishima/SHIKISHIMA_AUTONOMY_IMPLEMENTATION_MASTER_SPEC.md`
- `docs/shikishima/HUMAN_GATE_DISPLAY_TARGET_DESIGN.md`
- `docs/shikishima/HUMAN_GATE_READONLY_UI_INTEGRATION_PLAN.md`
- `docs/shikishima/IPC_EXTERNAL_SURFACE_GUARD_PLAN.md` (§7)
- `docs/shikishima/IPC_EXTERNAL_SURFACE_AUDIT.md`
- `src/shared/discord-human-gate-message-render/`
- `src/shared/discord-human-gate-digest-render/`
