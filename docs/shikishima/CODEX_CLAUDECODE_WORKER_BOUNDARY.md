# Codex / ClaudeCode Worker Boundary

## Document Status

```
date:            2026-05-18
status:          docs-only boundary policy
execution:       disabled
productionReady: false
```

---

## Purpose

Define what Codex and ClaudeCode are permitted to do as constrained dev workers
in the Shikishima Slot system.

Both workers share the same safety constraints. Neither is a privileged actor.
Human remains the final approver for push, runtime, OAuth, and external actions.

---

## Allowed Actions (with scoped GO)

Each task GO must specify:
- exact allowed files (by path)
- exact allowed commands
- allowed test targets
- commit scope (yes/no)
- push (always: no, separate GO required)

### File Operations

```
ALLOWED:
  - edit files listed in allowed_files (from task GO)
  - create new files if explicitly named in allowed_files
  - read any file for context

FORBIDDEN:
  - edit files outside allowed_files scope
  - delete files without explicit GO
  - modify package.json / package-lock.json without explicit package GO
  - modify .env / secrets / auth material
```

### Commands

```
ALLOWED (with GO):
  - npm run typecheck:node
  - npm run typecheck:web
  - npx vitest run (full suite or approved subset)
  - git add <specific approved files>
  - git commit -m "..." (after tests pass)
  - git log / git status / git diff (read-only)

FORBIDDEN:
  - npm run dev
  - npm install / npx (anything other than vitest run)
  - git push (separate explicit push GO required)
  - git push --force (never)
  - hermes (any subcommand)
  - hermes auth add
  - OAuth login
  - browser open
  - port 3030 open
  - any network request
  - any shell command not in the approved list
```

### Commit Scope

```
ALLOWED:
  - local commit of approved files only
  - commit message must state: what changed, why, safety invariants confirmed

FORBIDDEN:
  - push without separate push GO
  - amend published commits without GO
  - squash/rebase without GO
  - --no-verify
```

---

## Forbidden (Always — No Exception)

These actions are NEVER allowed regardless of GO:

```
- git push without explicit push GO naming this commit/branch
- npm run dev (starts runtime)
- runtime / Electron start
- port 3030 open
- hermes (any subcommand)
- OAuth login / browser auth
- API key read or print
- raw token print
- x_search execute
- external API write (email/calendar/GitHub-remote/social/payment)
- purchase / reservation / payment
- productionReady: true (type-level literal; must not change)
- execution: "enabled" (type-level literal; must not change)
- StackChan physical operation
- voice / camera / mic activation
- reading auth.json contents
- ChatGPT / Claude web chat automation
```

---

## Web Chat vs API Worker Distinction

```
ChatGPT web chat:      NOT a Shikishima worker
Claude web chat:       NOT a Shikishima worker
ClaudeCode CLI/API:    official worker surface — permitted within scope
Codex CLI/API:         official worker surface — permitted within scope
```

Human initiates all web chat sessions independently.
Shikishima does NOT automate web browser sessions.

---

## Dual-Worker Policy

When both Codex and ClaudeCode are candidates for a task:

```
1. Human (or task GO) specifies which worker handles the task
2. Only one worker edits files at a time (no concurrent edits to same file)
3. If workers overlap, STOP and human resolves
4. One worker → one commit per task cycle
```

---

## Output Redaction Before Commit

Any worker output included in docs/evidence must pass redaction check:

```
check_for:
  - Windows path (C:\, D:\) → if present, STOP
  - LAN IP (192.168.x.x, 10.x.x.x) → if present, STOP
  - API key (sk-, AIza, etc.) → if present, STOP
  - auth token → if present, STOP
  - raw account identifier if sensitive → STOP
```

ClaudeCode: `checkRedaction()` in `src/shared/ichikishima/ui-snapshot-helpers.ts`
Codex: same redaction logic must be applied before committing docs

---

## Reporting Format

After each scoped task, worker must produce:

```
status: PASS / STOP
changed_files: [exact list]
commands_run: [exact list]
tests_run: [pass/fail summary]
commit_hash: [if committed]
safety:
  productionReady: false
  execution: disabled
  rawValuesReported: false
  push_performed: false
  runtime_started: false
  external_write: false
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
