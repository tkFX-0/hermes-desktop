# UI-02 Allowed Files and Commands

## Document Status

```text
roadmapVersion: v3.69.0
date: 2026-05-17
task: UI-02
status: DEFINED — reference before and during UI-02 implementation
```

---

## Allowed Source Files (new files only)

```text
src/shared/ichikishima/ui-page-types.ts         NEW
src/shared/ichikishima/ui-safety-types.ts       NEW
src/renderer/src/types/design-tokens.ts         NEW (new directory)
src/renderer/src/types/service-contracts.ts     NEW (new directory)
```

If implementation requires ANY file outside this list, STOP and report.

---

## Allowed Docs Files

```text
docs/shikishima/UI_02_IMPLEMENTATION_SCOPE_REVIEW.md     (already created)
docs/shikishima/UI_02_ALLOWED_FILES_AND_COMMANDS.md      (this file)
docs/shikishima/UI_02_TEST_PLAN.md                       (already created)
docs/shikishima/UI_02_STOP_CONDITIONS.md                 (already created)
docs/shikishima/UI_02_IMPLEMENTATION_EVIDENCE.md         (created after implementation)
docs/shikishima/ROADMAP_CHANGELOG.md                     (update allowed)
docs/shikishima/DEVELOPMENT_TEMPO_DASHBOARD.md           (update allowed)
```

---

## Allowed Commands During Implementation

```text
ALLOWED (verification only — before and after):
  git branch --show-current
  git rev-parse HEAD
  git rev-parse origin/main
  git rev-list --count origin/main..HEAD
  git status --short
  git diff --stat
  git diff --name-only --cached
  git log --oneline origin/main..HEAD

ALLOWED (after all type files created):
  npm run typecheck:node
  npm run typecheck:web
  npm test (existing test suite only — no new test files needed for type-only changes)

ALLOWED (commit — docs + type files only):
  git add src/shared/ichikishima/ui-page-types.ts
  git add src/shared/ichikishima/ui-safety-types.ts
  git add src/renderer/src/types/design-tokens.ts
  git add src/renderer/src/types/service-contracts.ts
  git add docs/shikishima/UI_02_IMPLEMENTATION_EVIDENCE.md
  git add docs/shikishima/ROADMAP_CHANGELOG.md
  git add docs/shikishima/DEVELOPMENT_TEMPO_DASHBOARD.md
  git commit -m "feat: add ui type contracts for command center"
  git commit -m "docs: record ui 02 implementation evidence"
```

---

## Forbidden Commands

```text
npm install           — FORBIDDEN (no new dependencies)
npm update            — FORBIDDEN
npx *                 — FORBIDDEN
npm run dev           — FORBIDDEN (no runtime)
npm run build         — FORBIDDEN (not needed for type-only)
electron *            — FORBIDDEN
git push              — FORBIDDEN (separate push GO required)
port 3030 open        — FORBIDDEN
any shell command that modifies src/ outside allowed list — FORBIDDEN
any command that contacts external services — FORBIDDEN
```

---

## Forbidden File Modifications

```text
src/renderer/src/App.tsx                             FORBIDDEN
src/renderer/src/screens/**                          FORBIDDEN
src/renderer/src/components/**                       FORBIDDEN
src/main/**                                          FORBIDDEN
src/preload/**                                       FORBIDDEN
src/shared/ichikishima/control-center-*.ts           FORBIDDEN (existing files)
package.json                                         FORBIDDEN
package-lock.json                                    FORBIDDEN
tsconfig*.json                                       FORBIDDEN unless typecheck error requires it
  — if tsconfig change needed, STOP and report before making it
```

---

## Edge Cases

```text
If tsconfig.web.json does not include src/renderer/src/types/:
  → Check if the types directory is auto-included by existing tsconfig.
  → If a tsconfig change is required, STOP and report before making it.
  → Do not modify tsconfig without explicit GO.

If typecheck:web fails due to src/renderer/src/types/ not being in scope:
  → Report the failure and exact error.
  → Do not silently add tsconfig include paths.
  → Wait for human decision.
```

---

この範囲では問題を検出していません。
