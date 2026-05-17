# Gate 007 — ClaudeCode UI-02 GO Draft

## Document Status

```text
roadmapVersion: v3.67.0
date: 2026-05-17
gate: Post-100 Gate 007
name: ClaudeCode UI-02 GO Draft
status: DRAFT — NOT an approval. Reading this file is NOT GO.
```

---

## CRITICAL: This Is Not Approval

```text
Reading this file is NOT GO.
Creating this file is NOT GO.
Gate 007 completion is NOT UI-02 approval.

UI-02 implementation requires a SEPARATE, EXPLICIT human GO
with concrete scope and time_window.

This draft is a template for the human to review, modify, and issue.
```

---

## Purpose

Provide a pre-reviewed GO template for UI-02 so the human can issue it
without having to write it from scratch. The human must review, fill in
the placeholders, and send the GO explicitly.

---

## UI-02 GO Template (FILL IN PLACEHOLDERS BEFORE SENDING)

```text
I approve UI-02 type and design contract scaffold.
date: [YYYY-MM-DD]

Scope:
  type_files_only:             approved
  no_rendered_components:      confirmed
  no_runtime:                  confirmed
  no_external_write:           confirmed
  no_productionReady_change:   confirmed
  no_execution_enablement:     confirmed
  no_push:                     confirmed (separate GO required for push)

Allowed files (new files only):
  src/shared/ichikishima/ui-page-types.ts
  src/shared/ichikishima/ui-safety-types.ts
  src/renderer/src/types/design-tokens.ts
  src/renderer/src/types/service-contracts.ts

Allowed commands:
  (none — type scaffold is file creation only; no npm commands needed)

Not approved:
  src/renderer/src/components/**   (no components yet)
  src/renderer/src/screens/**      (no screens yet)
  src/main/**                      (main process untouched)
  src/preload/**                   (preload untouched)
  package.json / package-lock.json (no dependency changes)

Expected tests after UI-02:
  typecheck:node — no errors
  typecheck:web  — no errors
  vitest run     — all pass (existing tests)
  eslint         — no errors

STOP conditions:
  any src/renderer/src/components/** created → STOP
  any src/renderer/src/screens/** created → STOP
  any package.json change → STOP
  any npm install → STOP
  any runtime start → STOP
  any external write → STOP
  any productionReady change → STOP
  any execution enablement → STOP
  any git push without separate GO → STOP
```

---

## What UI-02 Should Produce

```text
src/shared/ichikishima/ui-page-types.ts:
  type PageId = 'operator' | 'chat' | 'stackchan' | ... (12 pages)
  interface PageContract { id: PageId; services: string[]; ... }
  type LampState = 'HOLD' | 'GO_READY' | 'PASS' | ... (all states)

src/shared/ichikishima/ui-safety-types.ts:
  type ButtonPolicy = 'copy-only' | 'navigate' | 'refresh' | 'local-chat-send'
  type LockedSetting = 'productionReady' | 'execution' | ... (all locked)
  type FallbackState = 'HOLD' (stale/unknown/error all fall back to this)

src/renderer/src/types/design-tokens.ts:
  type CSSVar = '--paper' | '--ink' | '--hold' | ... (all CSS vars)
  type ThemeMode = 'light' | 'dark' | 'auto'
  type FontFamily = 'jp' | 'sans' | 'mono'

src/renderer/src/types/service-contracts.ts:
  interface SafeSnapshotData { decision: LampState; productionReady: false; ... }
  interface LocalChatMessage { ... }
  interface DraftOutboxItem { externalWrite: false; sent: false; ... }
  ...
```

---

## What UI-02 Must NOT Do

```text
Must NOT create React components
Must NOT modify ControlCenterAppShell.tsx
Must NOT modify App.tsx
Must NOT add npm packages
Must NOT start runtime
Must NOT open port 3030
Must NOT change productionReady
Must NOT enable execution
Must NOT perform any external write
Must NOT push without separate GO
```

---

## Sequence After UI-02

```text
UI-02 complete → tests pass → commit
→ push GO → UI-02 pushed
→ UI-03 GO → PageShell / PageTabs / SafetyStrip implementation
→ UI-04 GO → Operator View
→ ... (per UI_IMPLEMENTATION_PHASE_PLAN.md)
```

---

## Human Instructions Before Sending GO

```text
1. Read this draft.
2. Verify Gate 007 has been pushed to origin/main.
3. Verify COMMAND_CENTER_DESIGN_TO_IMPLEMENTATION_SAFETY_CHECKLIST.md sections A, B are checked.
4. Fill in [YYYY-MM-DD] with today's date.
5. Review the allowed files list — add/remove as needed.
6. Send the GO explicitly.

Do not send the GO if any of the following:
  Gate 007 has not been pushed
  Safety checklist sections A-B are not verified
  You are uncertain about the scope
```

---

この範囲では問題を検出していません。
