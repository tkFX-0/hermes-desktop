# Human Gate Queue Mutation Plan

Date: 2026-05-26
Goal: `shikishima.push-queue-markdown-render-and-add-human-gate-queue-mutation-plan`
Mode: docs-only plan; no queue mutation, file write, or source changes

---

## 1. Purpose

This document defines the **gates, evidence, diff checks, rollback rules, and STOP conditions** required before `docs/shikishima/HUMAN_GATE_QUEUE.md` may ever be modified by an agent.

It answers:

```text
What exact gates, evidence, diff checks, rollback rules, and STOP conditions
are required before HUMAN_GATE_QUEUE.md may ever be modified by an agent?
```

This plan does **not** authorize actual queue mutation, file writing, append execution, queue item insertion, Obsidian vault write, Discord send, runtime start, or implementation in `src/**`.

```text
Obsidian actual write remains HOLD.
These files are repo-local Obsidian-compatible Markdown only.
No external write is approved by this plan.
```

---

## 2. Current Implemented Queue Pipeline

Implemented today (pure TypeScript; no file write; no queue mutation):

```text
WorkerTaskContract
  → dryRunGoalContract()
  → createGoalRunnerDryRunReport()
  → createHumanGateReportFromDryRunReport()
  → createHumanGateQueueDisplayTargetItem()
  → createHumanGateQueueMarkdownRenderModel()
  → renderHumanGateQueueMarkdownPreview()
  → (future one-shot queue append gate — NOT IMPLEMENTED)
```

Canonical input for Queue Markdown:

```text
HumanGateQueueDisplayTargetItem
```

Not canonical for Queue Markdown:

```text
DiscordHumanGateDigestDraft   (Discord-specific aggregation)
```

Parallel operator surfaces (display-only):

```text
  → createDiscordHumanGateMessageDraft() / renderDiscordHumanGateMessagePreview()
  → createDiscordSendPreflightIntentFromDraft() / evaluateDiscordSendPreflight()
```

**Strategic direction:** Discord is the primary operator **viewing** surface. Queue Markdown is the repo-local **canonical handoff** shape toward `HUMAN_GATE_QUEUE.md`. Ledger remains the source of truth for goal status.

---

## 3. Current Implemented Status

| Layer | Module / Doc | Status | Role |
|---|---|---|---|
| Human Gate report | `human-gate-report/` | PUSHED | review objects from dry-run |
| Queue display target | `human-gate-queue-display-target/` | PUSHED | repo-local queue display DTO |
| Legacy display preview | `renderHumanGateQueueDisplayTargetMarkdownPreview()` | PUSHED | string preview on display-target module |
| Queue Markdown render | `human-gate-queue-markdown-render/` | PUSHED (`7474049`) | structured model + `HUMAN_GATE_QUEUE.md` target preview |
| Queue mutation preflight | — | **FUTURE** | pure contract; no file write |
| Queue one-shot append | — | **HOLD** | separate Human GO |
| Queue rewrite / cleanup | — | **NOT_APPROVED** | bulk edit risk |
| Queue archive | — | **HOLD** | separate GO |
| `HUMAN_GATE_QUEUE.md` data | `docs/shikishima/HUMAN_GATE_QUEUE.md` | **UNMODIFIED** by autonomy contracts | gate table source of truth |

Pushed baseline: `origin/main` at `d73b88d` (queue markdown render + ledger).

---

## 4. Non-Approval Boundary

This plan does **not** approve:

- writing or appending to `HUMAN_GATE_QUEUE.md`
- changing gate table rows (status OPEN → APPROVED_ONCE / USED) without explicit Human GO
- Obsidian vault sync or export
- Discord send, webhook, or bot runtime
- IPC/preload exposure of mutation APIs
- React “Save to queue” buttons
- automated queue population from dry-run results
- `productionReady: true` or `execution: enabled`

**Required safety language (invariants):**

```text
Queue Markdown render does not approve queue mutation.
Queue Markdown preview does not approve queue mutation.
Queue mutation preflight does not approve file write.
Queue one-shot append remains HOLD.
HUMAN_GATE_QUEUE.md must not be modified without separate Human GO.
Queue rewrite / cleanup remains NOT_APPROVED.
Obsidian actual write remains HOLD.
Discord send remains HOLD.
Runtime remains HOLD.
External write remains HOLD.
productionReady remains false.
execution remains disabled.
```

---

## 5. Queue Mutation Route Separation

Queue capabilities must be modeled as **separate routes**. No route may imply approval of another.

| Route | Description | Default |
|---|---|---|
| Queue display target | Build `HumanGateQueueDisplayTargetItem` from report | **IMPLEMENTED** / pure contract |
| Queue Markdown preview | Render preview string for target document | **IMPLEMENTED** / pure render only |
| Queue mutation preflight | Validate future append metadata (no write) | **FUTURE** / pure contract only |
| Queue one-shot append | Append exact Markdown block once | **HOLD** |
| Queue rewrite / cleanup | Bulk edit, reorder, delete rows | **NOT_APPROVED** |
| Queue archive | Move closed gates to archive section | **HOLD** / separate GO |

Rules:

```text
display_target != markdown_preview != preflight != append
preview != append
preflight != append
append requires one-shot Human GO + evidence
rewrite != append
archive != append
```

Alignment with `HUMAN_GATE_DISPLAY_TARGET_DESIGN.md`: display/handoff design does not authorize mutation.

---

## 6. Future One-Shot Queue Append Gate

Queue append may only be planned as **future one-shot** behavior per explicit Human GO (e.g. a future `Human Gate Queue Mutation GO` category).

Each approved append is exactly **one** mutation to `HUMAN_GATE_QUEUE.md` unless a new Human GO is issued.

### Gate decision shape (planned; not implemented)

```text
decision: GO_ONE_SHOT
effectType: human_gate_queue_append
routeId: queue.append.markdown_block
targetDocument: docs/shikishima/HUMAN_GATE_QUEUE.md
requiresHumanGo: true
allowedMutationCount: 1
```

### Required fields on the GO record

| Field | Requirement |
|---|---|
| `human_go_reference` | Link to Human Gate queue / GO phrase (scoped) |
| `source_preview_commit` | Commit hash where preview was generated and reviewed |
| `exact_markdown_to_append` | Full block to append; no template expansion without re-GO |
| `target_document` | Must be `docs/shikishima/HUMAN_GATE_QUEUE.md` |
| `allowed_mutation_count` | Must be `1` |
| `actual_mutation_count` | Evidence after attempt: `0` or `1` only |
| `pre_mutation_git_status_clean` | Must be `true` (no unrelated dirty files) |
| `post_mutation_git_diff_limited_to_human_gate_queue` | Must be `true` |
| `post_mutation_render_preview_matches_appended_text` | Must be `true` |
| `rollback_command_recorded` | Must be `true` (e.g. `git checkout -- docs/shikishima/HUMAN_GATE_QUEUE.md`) |
| `gate_restored_hold` | Must be `true` after operation |
| `raw_values_reported` | Must be `false` |
| `productionReady` | Must be `false` |
| `execution` | Must be `disabled` |

### Forbidden without new GO

- second append in same goal
- edit unrelated sections of `HUMAN_GATE_QUEUE.md`
- change gate definitions table structure without Documentation GO
- append derived from Discord digest instead of `HumanGateQueueDisplayTargetItem` pipeline

---

## 7. Required Pre-Mutation Evidence

Before any queue append effect may run (future implementation):

| Evidence | Content |
|---|---|
| Human GO | Explicit queue mutation GO recorded (new category or scoped phrase) |
| Pipeline parity | `HumanGateQueueDisplayTargetItem` built from same `HumanGateReport` as preview |
| Preflight PASS | Future `queue-mutation-preflight` returns `fileWriteReady: false` until GO applied |
| Git cleanliness | `git status --short` empty except allowed plan docs |
| Branch policy | On approved branch (typically `main` after Push GO) |
| STOP review | No open STOP from worker task contract / dry-run |
| Ledger note | `AUTONOMY_GOAL_LEDGER.md` records goal scope allowing queue append |
| Discord/Obsidian | No bundled Discord send or Obsidian write in same goal |

---

## 8. Required Exact Markdown Preview Evidence

The append text must match the **reviewed preview** from the canonical pipeline:

```text
item = createHumanGateQueueDisplayTargetItem(report)
model = createHumanGateQueueMarkdownRenderModel(item)
preview = renderHumanGateQueueMarkdownPreview(model)
```

Evidence must include:

| Evidence | Content |
|---|---|
| `preview_text_hash` or full text in GO bundle | Operator-reviewed preview |
| `exact_markdown_to_append` | Byte-for-byte match with approved excerpt (or documented diff reason) |
| `target_document` | `docs/shikishima/HUMAN_GATE_QUEUE.md` |
| Review marker | HTML comment `review-only` / `not an approval` preserved in preview |
| Safety lines | Preview includes no-mutation / HOLD language |

`renderHumanGateQueueDisplayTargetMarkdownPreview()` may be used for comparison only; canonical evidence path is `human-gate-queue-markdown-render/`.

---

## 9. Required Diff Verification

After mutation (future), before goal completion:

```text
git diff --name-only
  → must list only docs/shikishima/HUMAN_GATE_QUEUE.md (or approved path)

git diff --stat docs/shikishima/HUMAN_GATE_QUEUE.md
  → lines added bounded by GO (typically one section / one row block)

git diff docs/shikishima/HUMAN_GATE_QUEUE.md
  → no deletion of unrelated gate rows without separate GO
  → no secrets, tokens, raw PII

git diff --check
  → PASS (no conflict markers, whitespace errors)
```

Optional:

- Re-run `createHumanGateQueueMarkdownPreview(item)` and confirm appended section appears in logical preview (string compare).

---

## 10. Required Post-Mutation Evidence

After the one-shot append (success or failure):

| Evidence | Content |
|---|---|
| `actual_mutation_count` | `0` or `1` |
| `post_mutation_git_diff_limited_to_human_gate_queue` | `true` / `false` |
| `post_mutation_render_preview_matches_appended_text` | `true` / `false` |
| `gate_restored_hold` | `true` |
| `rollback_command_recorded` | command string in goal report |
| Ledger line | Goal completion: mutation performed yes/no |
| No follow-up | No auto-append; new GO required |

---

## 11. Allowed Mutation Count and Target Restrictions

```text
allowed_mutation_count: 1 per Human GO
target_document: docs/shikishima/HUMAN_GATE_QUEUE.md only
max_append_blocks: 1
max_table_row_changes: 1 (if appending a row) unless GO lists explicit row ids
forbidden_in_same_go: Discord send, runtime start, package.json, src/**, .env
forbidden_targets: HUMAN_GATE_QUEUE.md bulk rewrite, other docs/shikishima/* without docs GO
```

Archive and rewrite remain **NOT_APPROVED** or **HOLD** with separate GO.

---

## 12. Rollback Policy

| Failure | Action |
|---|---|
| Wrong append content | `git checkout -- docs/shikishima/HUMAN_GATE_QUEUE.md` (record in evidence) |
| Dirty unrelated files | Abort before append; do not proceed |
| Diff includes extra files | Revert all mutation files; mark goal STOP |
| Partial apply | Revert entire file; no “fix forward” without new GO |

Rollback of **code** is normal git revert. Rollback of **queue meaning** (gate status semantics) may require human edit — treat as new GO.

Every GO bundle must record:

```text
rollback_command: git checkout -- docs/shikishima/HUMAN_GATE_QUEUE.md
```

---

## 13. Gate Restoration Policy

After every append attempt:

```text
1. Queue one-shot append route returns SAFETY_HOLD
2. fileWriteReady remains false on render/preflight contracts
3. humanGateQueueDocModified false on contracts until explicit future unlock
4. Record gate_restored_hold: true in evidence
5. Do not chain append with Discord send or runtime in same session
6. productionReady stays false
7. execution stays disabled
```

Continuous queue sync remains **NOT_APPROVED**.

---

## 14. Audit / Log Fields

Structured audit entry (future; redacted):

```text
timestamp_utc
goal_id
task_id
gate_id
human_go_reference
source_preview_commit
route_id
decision_before
decision_after
allowed_mutation_count
actual_mutation_count
target_document
preview_text_hash
append_byte_length
post_mutation_git_diff_limited_to_human_gate_queue
post_mutation_render_preview_matches_appended_text
rollback_command_recorded
gate_restored_hold
raw_values_reported
productionReady
execution
file_write_performed
human_gate_queue_doc_modified
```

Never store: secrets, tokens, unrelated trade/personal raw data if policy forbids.

---

## 15. STOP Conditions

Stop implementation and require human review if:

```text
- append would run without GO_ONE_SHOT
- allowed_mutation_count != 1
- exact_markdown_to_append does not match reviewed preview
- Discord digest used as canonical append source
- HUMAN_GATE_QUEUE.md modified outside approved GO
- git diff includes files other than HUMAN_GATE_QUEUE.md
- Queue rewrite / cleanup requested
- productionReady would become true
- execution would become enabled
- render contract sets fileWriteReady: true by default
- preflight approves file write without separate execution GO
- package.json changes bundled with mutation wiring
- IPC exposes mutation without guard plan approval
```

---

## 16. Recommended Next Goals

Priority order:

```text
1. /goal shikishima.push-human-gate-queue-mutation-plan-and-add-queue-mutation-preflight-contract
   - Push this plan + ledger (Push GO)
   - Add pure queue-mutation-preflight contract (no fs, no write)

2. /goal shikishima.push-queue-mutation-preflight-and-add-discord-send-readiness-digest
   - Cross-surface readiness digest (Discord / Queue / Ledger status strings only)
   - Still no send, no queue append
```

**Meaning:**

```text
First add a pure Queue mutation preflight contract.
Then add a cross-surface readiness digest for operator review.
Actual queue mutation remains later and separate.
```

---

## Appendix: Contract ↔ Route Mapping

| Contract / artifact | Approves mutation? |
|---|---|
| `HumanGateQueueDisplayTargetItem` | **No** |
| `HumanGateQueueMarkdownRenderModel` | **No** (`previewOnly: true`, `fileWriteReady: false`) |
| `renderHumanGateQueueMarkdownPreview()` | **No** (string only) |
| `HUMAN_GATE_QUEUE_MUTATION_PLAN.md` (this doc) | **No** (design only) |
| Future `queue-mutation-preflight` | **No** until separate execution GO |
| Future queue append executor | **Only** with GO_ONE_SHOT + evidence |

---

## References

- `docs/shikishima/SHIKISHIMA_AUTONOMY_IMPLEMENTATION_MASTER_SPEC.md`
- `docs/shikishima/HUMAN_GATE_QUEUE.md` (read only; do not modify in this goal)
- `docs/shikishima/HUMAN_GATE_DISPLAY_TARGET_DESIGN.md`
- `docs/shikishima/DISCORD_SEND_GATE_PLAN.md`
- `docs/shikishima/IPC_EXTERNAL_SURFACE_GUARD_PLAN.md`
- `src/shared/human-gate-queue-display-target/`
- `src/shared/human-gate-queue-markdown-render/`
