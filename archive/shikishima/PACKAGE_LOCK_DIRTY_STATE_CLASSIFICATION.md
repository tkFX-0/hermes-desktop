# Package-lock Dirty State Classification — v1.2.6

## Audit Overview

- auditVersion: v1.2.6
- auditDate: 2026-05-11
- auditType: audit-only / report-only / redacted-only
- roadmapVersion: v1.2.6
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

No `package-lock.json` was modified during this audit.
No `npm install` was executed. No build or test was run. No git push.

---

## Background

From `PACKAGE_NAME_MIGRATION_PLAN.md` (v1.2.5):

> Pre-migration caveat: existing `package-lock.json` unrelated dirty state must
> be resolved before v1.3.0 package name migration execution.

This audit classifies that dirty state and provides a recommended handling
decision for use as a v1.3.0 pre-condition checklist item.

---

## Dirty Diff Scope

- Files changed: 1 (`package-lock.json` only)
- Total changes: 4 lines (2 insertions + 2 deletions)
- Affected sections: root object header and root `packages[""]` entry

This is a minimal diff. No dependency tree changes were detected.

---

## Classification Table

| Category | Present | Detail |
|---|---|---|
| Root package `name` change | NO | `name` field is unchanged — remains `hermes-desktop` in dirty state |
| Root package `version` change | YES | version stamp drift (see below) |
| `lockfileVersion` change | NO | lockfileVersion remains 3 |
| Dependency version change | NO | No package version changes in `packages{}` |
| Dependency `resolved` URL change | NO | No URL changes detected |
| Dependency `integrity` hash change | NO | No integrity hash changes |
| `requires` field change | NO | `requires: true` unchanged |
| `hasInstallScript` change | NO | unchanged |
| Scripts / build config propagation | NO | lockfile changes do not affect scripts |
| Unknown / needs human review | NO | Classification is complete and well-understood |
| Package manager generated noise | LIKELY | See version stamp analysis below |

---

## Root Package Version Stamp Analysis

### Observed drift (redacted display)

```text
Root object:
  version: [old] → [new]

packages[""] entry:
  version: [old] → [new]
```

### Actual versions (internal classification — not raw values)

- `package.json` committed version: matches the `[new]` version in dirty state
- `package-lock.json` dirty `[old]` version: one minor version behind package.json

### Cause

`package.json` version was incremented (likely as part of a prior version bump
commit) but `npm install` was not run afterward to sync the lockfile version
stamp. This is a standard npm behavior: the lockfile root `version` is a
cosmetic stamp that reflects the last `npm install` run, not the current
`package.json` version.

### Impact

- **On dependency resolution**: NONE — version stamp does not affect resolution
- **On build**: NONE — version stamp is not read by electron-builder or vite
- **On package name migration**: NONE — the `name` field is separate and
  unchanged in the dirty state
- **On lockfile correctness**: LOW — lockfile is structurally valid; only the
  version stamp is stale

---

## Other Dirty Files (Out of Scope for This Audit)

The following files are also modified in the working tree but are **not**
part of this package-lock classification audit. They require separate
investigation before v1.3.0 execution.

| File | Dirty size | Scope |
|---|---|---|
| `.gitignore` | small | Unknown — needs review |
| `src/main/index.ts` | medium | Feature work — separate |
| `src/renderer/src/screens/Layout/Layout.tsx` | large | Feature work — separate |
| `src/main/claw3d.ts` | small | Feature work — separate |
| `src/main/installer.ts` | small | Feature work — separate |
| `src/preload/index.d.ts` | small | Feature work — separate |
| `src/preload/index.ts` | small | Feature work — separate |
| `src/shared/i18n/index.ts` | small | Feature work — separate |
| `src/shared/i18n/locales/en/navigation.ts` | minimal | Feature work — separate |
| `src/shared/i18n/locales/zh-CN/navigation.ts` | minimal | Feature work — separate |

These src/ dirty files appear to be in-progress feature work unrelated to
the package name migration. They must be handled (committed or reverted)
before v1.3.0 execution to ensure a clean migration baseline.

---

## Recommended Handling

### For `package-lock.json` specifically

**Recommended: Keep HOLD — handle together with v1.3.0**

Rationale:
1. The dirty state is version stamp only — no dependency or integrity changes.
2. The `name` field is unchanged (`hermes-desktop`) — no pre-existing name drift.
3. When v1.3.0 runs `npm install --package-lock-only`, it will:
   - Update the root `name` from `hermes-desktop` to `shikishima-desktop`
   - Simultaneously sync the `version` stamp to the current `package.json` value
   - This resolves both the name change and the version stamp drift in one atomic operation
4. Committing the version stamp separately adds an extra commit with no practical benefit.
5. Reverting the version stamp is not recommended — the `package.json` version is
   correct at the current value; reverting the lockfile would create a worse mismatch.

### Alternative A: Commit version stamp separately (before v1.3.0)

- Risk: LOW
- Benefit: Cleaner commit separation between "version sync" and "name migration"
- Downside: Requires running `npm install --package-lock-only` now, adding an
  extra pre-migration step and commit
- Verdict: Optional; not required for v1.3.0 safety

### Alternative B: Revert package-lock version stamp

- Risk: NOT RECOMMENDED
- Reason: Would make lockfile version older than `package.json` version, not fix it
- Verdict: Do not revert

---

## v1.3.0 GO Conditions (package-lock perspective)

These conditions must all be met before v1.3.0 package name migration can proceed:

| Condition | Current State | Status |
|---|---|---|
| package-lock dirty is version stamp only | confirmed | PASS |
| package-lock `name` field is `hermes-desktop` (no pre-existing drift) | confirmed | PASS |
| No dependency changes in package-lock dirty state | confirmed | PASS |
| No integrity hash changes | confirmed | PASS |
| src/ dirty files resolved (committed or reverted separately) | NOT resolved | BLOCK |
| `.gitignore` dirty state resolved | NOT resolved | BLOCK |
| Working tree clean before v1.3.0 execution | NOT clean | BLOCK |

---

## v1.3.0 BLOCK Conditions (Must Resolve First)

| Blocker | Type | Required Action |
|---|---|---|
| src/ dirty files (10 files) | Pre-migration blocker | Commit as feature work OR revert before migration |
| `.gitignore` dirty state | Pre-migration blocker | Commit or revert before migration |
| package-lock version stamp | NOT a blocker | Will auto-resolve in v1.3.0 migration step |

**The package-lock dirty state itself is NOT a blocker for v1.3.0.**
The src/ and `.gitignore` dirty files ARE blockers — they must be resolved first
to ensure the migration commit is clean and auditable.

---

## Risk Table

| Item | Risk | Status | Notes |
|---|---|---|---|
| package-lock version stamp drift | LOW | HOLD (merge with v1.3.0) | Auto-corrects in migration |
| package-lock name field | PASS | No issue | Remains `hermes-desktop` as expected |
| package-lock dependency tree | PASS | No issue | No changes detected |
| package-lock integrity hashes | PASS | No issue | No changes detected |
| src/ dirty files | CAUTION | BLOCK v1.3.0 | Need separate handling |
| `.gitignore` dirty state | CAUTION | BLOCK v1.3.0 | Need investigation |
| Structural lockfile validity | PASS | No issue | Lockfile is valid |

---

## Impact on PACKAGE_NAME_MIGRATION_PLAN.md

The v1.2.5 plan listed the package-lock dirty state as a "pre-migration caveat"
with recommended resolution before v1.3.0. This audit clarifies:

- The **package-lock dirty state itself is NOT a blocker** — it will be resolved
  atomically in the v1.3.0 migration.
- The **src/ and `.gitignore` dirty files are blockers** — they are unrelated
  feature work that should be committed or reverted before the migration.

The v1.2.5 plan's Step 0 ("Resolve package-lock.json dirty state") is now
reclassified: it is not "resolve the version stamp" but rather "ensure the
working tree is clean of unrelated changes before migration."

---

## Safety Boundary Confirmation

During this audit:

- No `package-lock.json` was modified
- No `package-lock.json` was committed or reverted
- No `npm install` was performed
- No build or test was executed
- No external network connections were made
- No git push was performed
- No directory was renamed or deleted
- No source files were modified
- No raw values, secrets, or local paths were reported
- No dependency versions were changed

この範囲では問題を検出していません。
