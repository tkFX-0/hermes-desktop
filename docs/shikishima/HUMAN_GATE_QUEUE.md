# Human Gate Queue

Date: 2026-05-26
Mode: repo-local Obsidian-compatible Markdown
Actual Obsidian write: HOLD

---

## 0. Purpose

This queue collects actions that require explicit human approval before execution.

It does not approve any action by itself.

```text
Obsidian actual write remains HOLD.
These files are repo-local Obsidian-compatible Markdown only.
No external write is approved by this queue.
```

---

## 1. Gate Fields

Each gate entry must include:

```text
gate_id
requested_by_goal
required_human_phrase
risk
status
evidence_required
```

Allowed statuses:

```text
OPEN
HOLD
APPROVED_ONCE
USED
CLOSED
REJECTED
```

---

## 2. Active Gate Queue

| gate_id | requested_by_goal | required_human_phrase | risk | status | evidence_required |
|---|---|---|---|---|---|
| PUSH-GO | any committed goal | `Push GO: <commit hash / scope>` | medium | HOLD | branch, HEAD, origin/main, diff scope, post-push verification |
| RUNTIME-GO | runtime observation goals | `Runtime GO: <command> <time_window>` | high | HOLD | command, time window, stop method, post-run checks |
| DISCORD-SEND-GO | Discord one-shot send | `Discord Send GO: <target> <exact text>` | high | HOLD | target, exact text, send_count=1, gate restored HOLD |
| OBSIDIAN-WRITE-GO | local note write | `Obsidian Write GO: <scoped path>` | high | HOLD | scoped folder, redaction, diff/evidence |
| STACKCHAN-CONNECTION-GO | StackChan status/device work | `StackChan Connection GO: <route> <time_window>` | high | HOLD | route, duration, stop method, evidence |
| STACKCHAN-FIRMWARE-GO | firmware build/upload | `StackChan Firmware GO: <env> <rollback plan>` | critical | HOLD | build result, port/device, rollback, post-flash check |
| DEPENDENCY-GO | package changes | `Dependency GO: <package/change>` | high | HOLD | package diff, lockfile diff, reason, rollback |
| PRODUCTION-READY-GO | final acceptance | `ProductionReady GO` | critical | HOLD | final acceptance record, blocker review |
| EXECUTION-ENABLE-GO | final execution enablement | `Execution Enablement GO` | critical | HOLD | productionReady accepted, stop/rollback method |
| CONTINUOUS-AUTONOMY-GO | semi-autonomous loop | `Continuous Autonomy GO: <bounded mode>` | critical | HOLD | scheduler bounds, kill switch, evidence, review window |

---

## 3. Gate Rules

General rules:

- A gate approval is not reusable unless it explicitly says so.
- One-shot gates default to one run only.
- Push GO does not imply runtime GO.
- Runtime GO does not imply Discord send GO.
- Discord read does not imply Discord send.
- StackChan status does not imply voice, motion, STT, camera, or firmware permission.
- Obsidian-compatible repo docs do not imply actual Obsidian write.
- productionReady and execution are final acceptance gates only.

---

## 4. Current Pending Gates

Current likely pending gate after this ledger foundation:

| gate_id | reason | status |
|---|---|---|
| PUSH-GO | push local ledger foundation commit after review | HOLD |

No runtime, Discord send, Obsidian write, StackChan, productionReady, or execution gate is open.
