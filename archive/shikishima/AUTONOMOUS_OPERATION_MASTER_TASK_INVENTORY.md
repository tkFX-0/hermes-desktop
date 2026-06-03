# Autonomous Operation Master Task Inventory

**date:** 2026-05-21
**status:** PLANNING — not execution approval
**productionReady:** false / **execution:** disabled

---

## A. Core Safety / Governance

| ID | Task | Status | Risk | Worker | Evidence |
|---|---|---|---|---|---|
| PRD-00 | productionReady precheck | COMPLETE | — | ClaudeCode | PRODUCTION_READY_PRECHECK_2026-05-21.md |
| PRD-01 | Final blockers list | COMPLETE | — | ClaudeCode | AUTONOMOUS_OPERATION_REMAINING_BLOCKERS.md |
| PRD-02 | Human review session (BLOCKER-005) | HOLD | High | tk (human) | TBD |
| PRD-03 | LMO (Limited Manual Operation) session | HOLD | High | tk + ClaudeCode | TBD |
| PRD-04 | Incident response drill | HOLD | Medium | ClaudeCode + tk | TBD |
| PRD-05 | Rollback / disable all gates procedure | HOLD | Medium | ClaudeCode | TBD |
| PRD-06 | productionReady_go template | COMPLETE (draft) | Critical | tk (final GO) | LEVEL_5_HUMAN_GO_TEMPLATE.md |
| EXE-00 | execution enabled precheck | HOLD | Critical | ClaudeCode | TBD |
| EXE-01 | Kill switch implementation | HOLD | Critical | ClaudeCode | TBD |
| EXE-02 | Execution scope limiter | HOLD | Critical | ClaudeCode | TBD |
| EXE-03 | Auto-close gates after run | HOLD | High | ClaudeCode | TBD |
| EXE-04 | Evidence required per Level 5 | COMPLETE (policy) | — | ClaudeCode | LEVEL_5_HUMAN_GO_TEMPLATE.md |
| EXE-05 | execution_enabled_go template | COMPLETE (draft) | Critical | tk (final GO) | LEVEL_5_HUMAN_GO_TEMPLATE.md |

## B. Runtime / Health / Control Loop

| ID | Task | Status | Risk | Worker | Evidence |
|---|---|---|---|---|---|
| RT-00 | Runtime observation precheck | PARTIALLY DONE | — | ClaudeCode | AT-14/AT-15 PASS |
| RT-01 | Health monitor (persistent) | HOLD | Medium | ClaudeCode | TBD |
| RT-02 | Heartbeat / alive check | HOLD | Medium | ClaudeCode | TBD |
| RT-03 | Failure detection | HOLD | Medium | ClaudeCode | TBD |
| RT-04 | Retry policy (max retries, backoff) | HOLD | Medium | ClaudeCode | TBD |
| RT-05 | No infinite loop guarantee | HOLD | High | ClaudeCode | TBD |
| RT-06 | Stuck task detector | HOLD | High | ClaudeCode | TBD |
| RT-07 | Background process inventory | HOLD | Low | ClaudeCode | TBD |
| RT-08 | Manual shutdown procedure | PARTIAL (STOP conditions docs) | Medium | tk | LEVEL_5_STOP_CONDITIONS_MASTER.md |
| RT-09 | Runtime session evidence template | HOLD | Low | ClaudeCode | TBD |

## C. Obsidian / Library

| ID | Task | Status | Risk | Worker | Evidence |
|---|---|---|---|---|---|
| OB-01 | One-shot local write | ONE_SHOT_PASS → HOLD | — | ClaudeCode | OB01_WRITE_EVIDENCE_2026-05-20.md |
| OB-02 | Recurring local write plan | HOLD | Low | ClaudeCode | TBD |
| OB-03 | Library index design | HOLD (LIB-04) | Low | ClaudeCode | TBD |
| OB-04 | Report image export (PNG) | HOLD (OBS-LIB-03) | Low | ClaudeCode | TBD |
| OB-05 | Overwrite prevention | HOLD | Low | ClaudeCode | TBD |
| OB-06 | Raw path redaction audit | COMPLETE (policy in place) | — | ClaudeCode | library-export.ts (redactedPath only) |
| OB-07 | Local library search / index | HOLD | Low | ClaudeCode | TBD |
| OB-08 | Obsidian write recurring HOLD gate | HOLD | Medium | tk (GO) | TBD |

## D. Discord

| ID | Task | Status | Risk | Worker | Evidence |
|---|---|---|---|---|---|
| DIS-01 | Read-only intake | ONE_SHOT_PASS → HOLD | — | ClaudeCode | DIS01_READ_EVIDENCE_2026-05-21.md |
| DIS-02 | Draft response | IMPLEMENTED | — | ClaudeCode | DiscordDraftPanel.tsx |
| DIS-03 | One-shot reply | ONE_SHOT_PASS → HOLD | — | ClaudeCode | DIS03_REPLY_EVIDENCE_2026-05-21.md |
| DIS-04 | Reply templates whitelist | HOLD | Low | ClaudeCode | TBD |
| DIS-05 | Channel / user whitelist | HOLD | Medium | ClaudeCode | TBD |
| DIS-06 | Rate limit / cooldown policy | HOLD | Medium | ClaudeCode | TBD |
| DIS-07 | Loop prevention | HOLD | High | ClaudeCode | TBD |
| DIS-08 | Bot-self reply ignore | HOLD | Medium | ClaudeCode | TBD |
| DIS-09 | Limited auto-reply design | HOLD (DIS-04) | Medium | ClaudeCode | DIS_04_DISCORD_LIMITED_AUTO_REPLY_DEFERRED.md |
| DIS-10 | Limited auto-reply GO candidate | HOLD | High | tk (GO) | TBD |
| DIS-11 | Discord incident rollback | HOLD | High | ClaudeCode | TBD |

## E. x_search / Research Automation

| ID | Task | Status | Risk | Worker | Evidence |
|---|---|---|---|---|---|
| XS-01 | Read-only (1 run) | PASS / closed | — | ClaudeCode | XS_01_READ_ONLY_EXECUTION_EVIDENCE_2026-05-20.md |
| XS-AUTO-00 | Design | COMPLETE | — | ClaudeCode | XS-AUTO-00 docs |
| XS-AUTO-01 | Watchlist definition | COMPLETE (display) | — | ClaudeCode | XSearchAutomationPanel.tsx |
| XS-AUTO-02 | Scheduler HOLD plan | COMPLETE (plan) | — | ClaudeCode | XS_AUTO_02_PATROL_SCHEDULER_HOLD_PLAN.md |
| XS-AUTO-03 | One-shot scheduled read-only run | HOLD | Low-Med | ClaudeCode + tk | TBD |
| XS-AUTO-04 | Recurring read-only patrol | HOLD | Medium | ClaudeCode + tk | TBD |
| XS-AUTO-05 | Rate limit / cooldown evidence | HOLD | Low | ClaudeCode | TBD |
| XS-AUTO-06 | No autonomous escalation rule | HOLD | High | ClaudeCode | TBD |
| XS-AUTO-07 | Research-to-Obsidian pipeline | HOLD | Medium | ClaudeCode | TBD |

## F. X Account

| ID | Task | Status | Risk | Worker | Evidence |
|---|---|---|---|---|---|
| XACC-00 | Design | COMPLETE | — | ClaudeCode | XACC-00 docs |
| XACC-01 | Read-only OAuth decision | HOLD | High | tk (decision) | TBD |
| XACC-02 | Read-only scope test | HOLD | High | ClaudeCode + tk | TBD |
| XACC-03 | Draft-only post generation | HOLD | Medium | ClaudeCode | TBD |
| XACC-04 | One-shot write GO | HOLD | High | tk (GO) | TBD |
| XACC-05 | X account incident rollback | HOLD | High | ClaudeCode | TBD |
| XACC-06 | Account separation decision | HOLD | Medium | tk (decision) | TBD |
| XACC-07 | No password / token redaction audit | HOLD | High | ClaudeCode | TBD |

## G. Hermes / WSL

| ID | Task | Status | Risk | Worker | Evidence |
|---|---|---|---|---|---|
| HB-01 | Controlled connection | HOLD | Med-High | ClaudeCode + tk | HB01_WSL_GO_FORM_2026-05-21.md |
| HB-02 | Redacted status summary | HOLD | Low | ClaudeCode | TBD |
| HB-03 | Command boundary definition | HOLD | High | ClaudeCode | TBD |
| HB-04 | No arbitrary exec guarantee | HOLD | High | ClaudeCode | TBD |
| HB-05 | WSL process inventory | HOLD | Low | ClaudeCode | TBD |
| HB-06 | Bridge shutdown procedure | HOLD | Medium | ClaudeCode | TBD |
| HB-07 | Hermes connection evidence | HOLD | Low | ClaudeCode | TBD |
| HB-08 | Repeatable connection GO template | HOLD | Medium | ClaudeCode | TBD |

## H. Command Chat

| ID | Task | Status | Risk | Worker | Evidence |
|---|---|---|---|---|---|
| CC-03 | One-shot send | HOLD | Medium | ClaudeCode + tk | CC03_COMMAND_CHAT_GO_FORM_2026-05-21.md |
| CC-04 | Exact command/message content rule | HOLD | High | ClaudeCode | TBD |
| CC-05 | Send-count limiter | HOLD | High | ClaudeCode | TBD |
| CC-06 | Retry loop prevention | HOLD | High | ClaudeCode | TBD |
| CC-07 | Wrong target prevention | HOLD | High | ClaudeCode | TBD |
| CC-08 | Evidence / rollback | HOLD | Low | ClaudeCode | TBD |
| CC-09 | Limited recurring command design | HOLD | High | ClaudeCode | TBD |

## I. Worker Environment

| ID | Task | Status | Risk | Worker | Evidence |
|---|---|---|---|---|---|
| WK-00 | Controlled worker environment display | IMPLEMENTED | — | ClaudeCode | WorkerEnvironmentPanel.tsx |
| WK-01 | ClaudeCode boundary | COMPLETE (policy) | — | ClaudeCode | WK_02_CLAUDECODE_WORKER_BOUNDARY.md |
| WK-02 | Codex boundary | COMPLETE (policy) | — | ClaudeCode | WK_01_CODEX_WORKER_BOUNDARY.md |
| WK-03 | Worker task queue display | IMPLEMENTED | — | ClaudeCode | WorkerTaskQueuePanel.tsx |
| WK-04 | Prompt export (copy-only) | IMPLEMENTED | — | ClaudeCode | WorkerPromptPreview.tsx |
| WK-05 | Auto-execution adapter | HOLD | High | ClaudeCode + tk | TBD |
| WK-06 | Remote control | HOLD | High | ClaudeCode + tk | TBD |
| WK-07 | MCP / hook / daemon | HOLD | High | ClaudeCode + tk | TBD |
| WK-08 | Worker cooldown / rate state | HOLD | Medium | ClaudeCode | TBD |

## J. StackChan (deferred)

| ID | Task | Status | Risk | Note |
|---|---|---|---|---|
| SC-PC-02 | Firmware write evidence | PASS_CANDIDATE | Low | deferred |
| SC-FACE-05 | Display-only face test | ONE_SHOT_PASS → HOLD | Low | deferred |
| SC-FACE-06 | Shikishima 320x240 asset | HOLD | Low | deferred — needs face asset design |
| SC-FACE-07 | Display-only custom face | HOLD | Low | deferred |
| SC-MOTION-01 | Motion gate | HOLD | High | deferred — physical risk |
| SC-VOICE-01 | Voice gate | HOLD | High | deferred |
| SC-CAM-01 | Camera gate | HOLD | High | deferred |

---

## Summary Count

```text
Total tasks:       ~70
COMPLETE:          ~20
ONE_SHOT_PASS:      6
HOLD:              ~40
DEFERRED:           7
```
