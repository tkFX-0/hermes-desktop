# SLOT-09 Worker Status and Autonomy Boundary

## Purpose

SLOT-09 defines how Shikishima tracks worker availability, cooldowns, resume queues, and human-gated autonomy.

This document is design and policy only. It does not approve runtime execution, OAuth, x_search, external connections, git push, productionReady true, or execution enabled.

## Confirmed Autonomy Level

Shikishima autonomous development target is Level 4 maximum.

| Level | Meaning | Default |
| --- | --- | --- |
| Level 1 | instruction drafting | AUTO OK |
| Level 2 | worker implementation | AUTO OK when scoped |
| Level 3 | typecheck / lint / test | AUTO OK when local and safe |
| Level 4 | evidence creation and local commit | AUTO OK when scoped |
| Level 5 | push / runtime / OAuth / x_search / external connection / productionReady / execution enabled | HUMAN GO required |

Policy:

- Level 1-4 may be designed as autonomous worker flow.
- Level 5 is always human-gated.
- Level 5 is not permanently forbidden, but default status is HOLD / NEEDS_HUMAN.

## SLOT_WORKER_STATUS

```ts
type SlotWorkerStatus =
  | "READY"
  | "BUSY"
  | "COOLDOWN"
  | "DEGRADED"
  | "BLOCKED"
  | "FAILED"
  | "NEEDS_HUMAN";
```

| Status | Meaning |
| --- | --- |
| READY | Worker is available. |
| BUSY | Worker is currently working. |
| COOLDOWN | Usage limit or reset wait is active. |
| DEGRADED | Fallback / mini / light work only. |
| BLOCKED | Waiting for login, permission, missing context, or human operation. |
| FAILED | Task ended with error. |
| NEEDS_HUMAN | Human GO is required before continuing. |

## Worker Examples

| Worker | Typical Role | Boundary |
| --- | --- | --- |
| GPT | planning, review, instruction drafting | Level 1-2 unless explicit scoped execution |
| ClaudeCode | implementation worker | Level 2-4 when scoped |
| Codex | implementation, verification, docs, commits | Level 2-4 when scoped |
| Cursor / Composer later | IDE coding worker | Level 2-4 when scoped |
| Human | final GO, credentials, external actions, acceptance | Level 5 owner |

## Task Queue / Resume Queue Concept

The queue records what can resume safely after a worker hits cooldown, gets blocked, or requires human GO.

```yaml
task_id:
worker:
worker_status:
autonomy_level:
last_completed_step:
next_action:
cooldown_until:
resume_prompt:
evidence_file:
git_head:
commits_ahead:
dirty_state:
human_go_required:
stop_reason:
```

## Cooldown and Resume Behavior

- COOLDOWN means pause, record last completed step, and prepare a resume prompt.
- DEGRADED means route only low-risk work to the worker.
- BLOCKED means do not improvise around missing login, permission, or human-only action.
- NEEDS_HUMAN means stop and wait for explicit GO.

## Alternate Worker Routing

If a worker is unavailable:

1. Keep the existing task record.
2. Mark the worker COOLDOWN, DEGRADED, BLOCKED, FAILED, or NEEDS_HUMAN.
3. Route only Level 1-4 work to another worker.
4. Do not route Level 5 actions to another AI worker.
5. Require human GO for push, runtime, OAuth, x_search, external connection, productionReady, and execution enabled.

## Runtime Request / Report Flow

Runtime start is not permanently forbidden.

Default status is HOLD / NEEDS_HUMAN.

しるべ / recordkeeper must produce a runtime request report before runtime GO.

Required format:

```yaml
runtime_request:
  reason:
  command:
  time_window:
  observe:
  stop_if:
  shutdown:
  after:
  evidence_file:
```

Plain-language rule:

AIが勝手にアプリを起動するのは禁止。
ただし、人間GOがあり、なぜ起動するか・何を見るか・どう止めるかが記録されている場合はGO可能。

## OAuth Gate Summary

OAuth is not permanently forbidden.

Default status is HOLD / NEEDS_HUMAN.

Required human GO fields:

```yaml
oauth_go:
  provider_name:
  purpose:
  requested_scopes:
  time_window:
  token_storage_policy:
  raw_token_secret_redaction_policy:
  expected_result:
  stop_conditions:
  evidence_requirement:
```

Plain-language rule:

AIが勝手にログイン連携を始めるのは禁止。
ただし、人間が「今回はこのサービスにこの目的で連携してよい」と明示した場合のみGO可能。

## x_search / Social Read Gate Summary

x_search and social reading are future read-only GO targets.

Allowed future read-only actions:

- search X / social sources
- read posts
- collect public social information
- summarize
- suggest
- draft replies/posts for human review

Still forbidden without separate human GO:

- post
- reply
- DM
- like
- follow
- edit profile
- send message
- perform social write action

## Obsidian Local Note Gate Summary

Obsidian local Markdown note write is a future GO target.

Required human GO fields:

```yaml
obsidian_go:
  vault_path_scope:
  target_folder:
  target_file_or_naming_rule:
  allowed_content:
  raw_secret_exclusion:
  sync_api_status:
  evidence_requirement:
```

Obsidian Sync, external API, cloud writes, and plugin network actions remain separately gated.

## Hard Stop Actions

These remain HARD STOP unless a future policy explicitly changes them:

- post/reply/DM/send
- purchase
- payment
- reservation
- external write without separate GO
- productionReady true
- execution enabled
- secret/token/raw value output
- autonomous API use
- autonomous subscription web UI operation
- uncontrolled loop / auto-run without stop condition

## UI Display Proposal for Agent Theater

Agent Theater can display worker status without performing any action.

Suggested fields:

- worker name
- SLOT_WORKER_STATUS
- current task
- autonomy level
- cooldown / blocked reason
- next safe step
- human GO required
- evidence file

Allowed UI:

- status badges
- resume queue cards
- copyable GO templates
- HOLD / NEEDS_HUMAN indicators

Forbidden UI:

- push button that pushes
- runtime start button that starts runtime
- OAuth button that opens login
- x_search button that executes a query
- external write button

## Plain-Language Rule

AI may build.
AI may check.
AI may record.
AI may commit locally.

But AI must not press the outside-world buttons without human GO.

日本語:

AIは作っていい。
AIは確認していい。
AIは記録していい。
AIはローカルcommitしていい。

でも、外に出す・実際に動かす・ログインする・投稿する・買う・予約する、は人間GO。

## Safety Boundary

- productionReady: false
- execution: disabled
- rawValuesReported: false
- git push: human GO required
- runtime: human GO required
- OAuth: human GO required
- x_search / social read: future read-only GO required
- Obsidian local write: future local-only GO required
