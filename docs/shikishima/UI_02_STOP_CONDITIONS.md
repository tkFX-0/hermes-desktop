# UI-02 STOP Conditions

## Document Status

```text
roadmapVersion: v3.69.0
date: 2026-05-17
task: UI-02
status: DEFINED — check before and during implementation
```

---

## Immediate STOP Conditions

If any of the following occur, STOP immediately. Do not commit. Do not push. Report the condition.

### Source Scope Violations

```text
[STOP] Any file outside the allowed list is modified:
  - src/renderer/src/App.tsx
  - src/renderer/src/screens/**
  - src/renderer/src/components/**
  - src/main/**
  - src/preload/**
  - src/shared/ichikishima/control-center-*.ts (existing files)
  - tsconfig*.json (stop and report if change needed; wait for GO)

[STOP] package.json is modified

[STOP] package-lock.json is modified

[STOP] Any npm install or npx runs
```

### Safety Invariant Violations

```text
[STOP] productionReady: true appears anywhere in new type files
  — types must use productionReady: false (literal) for SafeSnapshotData

[STOP] execution: 'enabled' appears as a valid type variant
  — execution must only be typed as 'disabled' (literal)

[STOP] Any raw value (token, API key, LAN IP, password, secret) appears
  in a type file or evidence document

[STOP] A type definition introduces a path that could enable:
  - external send/post/create/pay/reserve
  - git push from UI
  - runtime start from UI
  - StackChan physical operation
  - voice/camera/mic activation
  — if such a type is needed for documentation purposes,
    mark it with: readonly forbidden: true
```

### Runtime / Port Violations

```text
[STOP] npm run dev runs for any reason

[STOP] Port 3030 opens

[STOP] Electron runtime starts
```

### TypeScript Violations

```text
[STOP] typecheck:node reports errors that cannot be fixed within allowed files

[STOP] typecheck:web requires tsconfig modification
  — report the error; wait for human GO on tsconfig change

[STOP] New type uses `any` without a justifying comment

[STOP] New type uses @ts-ignore without a justifying comment
```

### Git Violations

```text
[STOP] git push is attempted without explicit separate push GO

[STOP] Commits include files outside the allowed scope

[STOP] Unexpected commits appear ahead of origin/main before starting
  (run git rev-list --count origin/main..HEAD — expect 0)
```

### Test Violations

```text
[STOP] vitest run reports failures after type files are added
  — do not commit if tests fail
  — report which tests failed and why
```

---

## STOP Response Protocol

```text
When a STOP condition is triggered:
  1. Halt all further actions immediately
  2. Do NOT commit, push, or modify additional files
  3. Report:
     - which STOP condition was triggered
     - exact file/line/command that triggered it
     - current git state (status --short, commits_ahead)
     - recommended resolution path
  4. Wait for human decision before resuming
```

---

## Conditions That Are NOT a STOP

```text
typecheck:web warning (not error): continue; note in evidence
New directory src/renderer/src/types/ creation: allowed (it's in scope)
CRLF/LF warning from git: not a STOP; proceed normally
Untracked local files (e.g., .runtime-session-001.log): not a STOP; leave unstaged
```

---

この範囲では問題を検出していません。
