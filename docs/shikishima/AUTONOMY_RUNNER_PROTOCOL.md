# Autonomy Runner Protocol

Date: 2026-05-26
Mode: repo-local Obsidian-compatible Markdown
Actual Obsidian write: HOLD

---

## 0. Purpose

This protocol defines how Codex should self-drive Shikishima `/goal` work with less human/GPT back-and-forth.

It is a repo-local operating protocol only.

```text
Obsidian actual write remains HOLD.
No external write is approved by this protocol.
```

---

## 1. Required Reading Order

Before selecting work, Codex must read:

1. `docs/shikishima/SHIKISHIMA_AUTONOMY_IMPLEMENTATION_MASTER_SPEC.md`
2. `docs/shikishima/AUTONOMY_GOAL_LEDGER.md`
3. `docs/shikishima/HUMAN_GATE_QUEUE.md`
4. goal-specific source-of-truth docs

---

## 2. Goal Selection Rules

Codex may select the next goal only when:

- status is `TODO`
- dependencies are satisfied
- no required human gate is missing
- allowed files and forbidden files are clear
- verification commands are known

Codex must not select:

- `HOLD`
- `STOP`
- `DEFERRED`
- goals requiring push/runtime/external/device approval without GO

---

## 3. Permission Scope Rules

For each goal, Codex must confirm:

```text
allowed files
forbidden files
allowed commands
forbidden commands
external effects
runtime status
commit policy
STOP conditions
```

Default forbidden actions:

- git push
- runtime start
- Discord send
- Obsidian actual write
- StackChan connection
- StackChan firmware upload
- external API write
- package/dependency changes
- productionReady true
- execution enabled

---

## 4. Execution Rules

Codex may:

- inspect repository state
- edit allowed files
- run allowed verification commands
- run typecheck/tests when allowed
- create a local commit when checks pass and commit policy allows

Codex must:

- keep changes scoped
- avoid unrelated refactors
- preserve user/Claude changes
- report blockers
- stop at human gates

---

## 5. Verification Rules

Every goal must report:

```text
branch
HEAD
origin/main
commits_ahead
staged
tracked_dirty
changed files
tests run
source changes
package changes
runtime_started
external_write
Discord_send
Obsidian_write
StackChan_connection
productionReady
execution
commit hash
push status
next recommended goal
```

Minimum checks:

- `git status --short`
- `git diff --name-status`
- `git diff --check`
- relevant typecheck/tests for source tasks

---

## 6. Commit Rules

Codex may create a local commit only if:

- goal allows it
- checks pass
- staged files match goal scope
- no forbidden files are staged
- no raw secrets or local-only values are included

Codex must not push after committing unless a separate Push GO is present.

---

## 7. Human Gate Stop Rules

Codex must stop and write/report a gate request when work requires:

- Push GO
- Runtime GO
- Discord Send GO
- Obsidian Write GO
- StackChan Connection GO
- StackChan Firmware GO
- Dependency Change GO
- ProductionReady GO
- Execution Enablement GO
- Continuous Autonomy GO

Gate requests should be reflected in `HUMAN_GATE_QUEUE.md` only in goals that allow docs updates.

---

## 8. STOP Conditions

Stop immediately if:

- scope is unclear
- forbidden files become necessary
- package changes become necessary
- runtime start becomes necessary
- Discord send becomes necessary
- Obsidian actual write becomes necessary
- StackChan connection becomes necessary
- external API write becomes necessary
- productionReady or execution mutation is requested
- raw secrets or credentials would be printed or stored
- tests require dependency installation

---

## 9. Output Discipline

Final reports must be concise but complete.

Codex should always state:

- what was created or changed
- what was verified
- what was not done
- whether push is pending
- the next recommended goal
