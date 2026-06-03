# Shikishima Claude Code Goal Definitions

## Document Status

- roadmapVersion: v3.1.2
- status: goal_definitions / HOLD
- execution: disabled
- productionReady: false
- date: 2026-05-14

## Purpose

This document defines `/goal` style blocks for use in Claude Code task
instructions. Each goal includes allowed scope, forbidden scope, human approval
requirements, STOP conditions, result log requirements, and next gate.

Invoking a goal by name does not approve execution. Execution goals require a
separate explicit human GO with time window and exact command list.

## Universal Rules Applying To All Goals

1. This goal does not approve execution unless the goal is explicitly an
   execution GO and the human has provided an exact time window and exact
   command list.
2. Git push always requires a separate explicit human approval.
3. productionReady true is never inferred from validation success.
4. External services, deploy, Cloudflare, WSL/Hermes/wrapper, Electron dev-mode,
   StackChan, robot, voice, camera, mic, secrets, raw values, and local-only
   values remain HOLD unless the specific goal explicitly scopes and receives
   separate human GO.

---

## /goal shikishima.push-readiness

**Purpose:** Perform a read-only git push readiness check for the current
committed HEAD. Confirm branch, remote URL, commit hash, staging, diff, and
working tree state. Do not push.

**Allowed scope:**
- git status --short
- git log --oneline -5
- git branch --show-current
- git remote -v
- git diff --name-status
- git diff --cached --stat
- git ls-files --others --exclude-standard

**Forbidden scope:**
- git push
- any file edit, stage, or commit
- npm install / update / npx / build / test / lint / typecheck
- WSL / Hermes / wrapper / Electron dev-mode / device / robot / voice / camera / mic
- secrets / raw values / local-only values in output

**Required human approval:** None — read-only only. No push approval needed here.

**STOP conditions:**
- origin URL does not match expected
- branch is not main
- latest commit does not match expected
- staged files exist unexpectedly
- actual semantic content diffs remain
- package.json / src/** / tests/** is staged

**Result log requirement:** PASS/HOLD/NG, commit hash, branch, remote (sanitized),
staged count, modified unstaged count, untracked count, actual content diff count,
CRLF-only count, recommendation.

**Next gate:** /goal shikishima.push-approved (if readiness is PASS)

---

## /goal shikishima.push-approved

**Purpose:** Execute git push for the current committed HEAD after explicit human
GO. Pre-push verification must pass before push is executed.

**Allowed scope:**
- Pre-push verification (same as push-readiness)
- git push origin main (only if all verification passes)

**Forbidden scope:**
- git add / commit / stash / reset / restore / checkout
- npm install / update / npx / build / test / lint / typecheck
- WSL / Hermes / wrapper / Electron dev-mode / device / robot / voice / camera / mic
- file edits
- secrets / raw values / local-only values in output

**Required human approval:** Explicit GO naming remote URL, branch, expected
commit hash, and scope: "push committed history only."

**STOP conditions:**
- Any pre-push verification check fails
- Staged files exist
- Actual semantic diffs remain
- Origin URL mismatch
- Commit hash mismatch

**Result log requirement:** PASS/HOLD/NG, pushed yes/no, commit before/after,
all verification checks, safety boundary.

**Next gate:** Next planned docs task or /goal shikishima.level2-final-go

---

## /goal shikishima.level2-final-go

**Purpose:** Issue Level 2 local controlled validation GO after human fills
in time window and issues explicit approval.

**Allowed scope:**
- pre-run verification (branch, commit, staged, diff)
- Level 2 command execution if and only if human GO includes filled time window
- Redacted structured output report only

**Forbidden scope:**
- execution without filled time window
- git push
- npm install / update / npx
- WSL / Hermes / wrapper / Electron dev-mode / device / robot / voice / camera / mic
- secrets / raw values / local-only values in output or report
- raw stdout/stderr transcript

**Required human approval:** Explicit GO stating:
- level: Level 2 local controlled validation
- exact command list (5 commands)
- filled time_window: YYYY-MM-DD HH:MM-HH:MM JST
- output policy: redacted structured summary only
- stop conditions acknowledgment

**STOP conditions:**
- time window is blank, invalid, or passed
- any pre-run verification fails
- any stop condition triggered during run (install, external, WSL, device, raw value, scope expansion)

**Result log requirement:** PASS/HOLD/NG, time window, pre-run verification
table, all 5 commands with exit code/elapsed/redacted summary/structured
category summary, working tree before/after, stop condition status,
safety boundary.

**Next gate:** /goal shikishima.level2-evidence

---

## /goal shikishima.level2-run

**Purpose:** Execute the Level 2 local controlled validation run after human GO.
This is the actual execution goal — identical in scope to level2-final-go.

**Allowed scope:**
- Pre-run verification
- npm run typecheck:node
- npm run typecheck:web
- npm run lint
- npm test
- npm run build
- Redacted structured output report only

**Forbidden scope:**
- npm install / update / npx
- Electron dev-mode / WSL / Hermes / wrapper / device / robot / voice / camera / mic
- git push
- file edits / staging / commits
- secrets / raw values / raw stdout/stderr

**Required human approval:** Explicit GO with exact command list, filled time
window, output policy, and stop conditions. See /goal shikishima.level2-final-go.

**STOP conditions:** Same as level2-final-go.

**Result log requirement:** Same as level2-final-go.

**Next gate:** /goal shikishima.level2-evidence

---

## /goal shikishima.level2-evidence

**Purpose:** Record the Level 2 local controlled validation result as a docs-only
evidence file. This is a docs-only task — no commands are run.

**Allowed scope (docs-only):**
- Create docs/shikishima/LEVEL_2_LOCAL_CONTROLLED_VALIDATION_EVIDENCE.md
- Update ROADMAP_CHANGELOG.md, DEVELOPMENT_TEMPO_DASHBOARD.md,
  REAL_OPERATION_ROADMAP.html, README.md for version consistency
- git add (allowed docs only)
- git commit (allowed docs only)

**Forbidden scope:**
- git push (requires separate GO)
- npm commands / WSL / device / robot / voice / camera / mic
- src/** / tests/** / package.json edits
- secrets / raw values in report

**Required human approval:** None for docs creation and local commit.
Git push requires separate explicit push GO.

**STOP conditions:**
- Any non-docs file staged
- Any forbidden approval wording in evidence doc
- Any wording implies Level 3 is approved

**Result log requirement:** PASS/HOLD/NG, commit hash, changed files, all
verification checks, safety boundary.

**Next gate:** /goal shikishima.push-readiness → push → /goal shikishima.app-observation-readiness

---

## /goal shikishima.app-observation-readiness

**Purpose:** Review whether the project is ready to consider a Local App
Observation proposal. This is a read-only review task.

**What "Local App Observation" means:** Checking the project as one running
local app through a separately approved local UI observation path. May include
Electron dev-mode only if separately scoped and approved. Does not include
external services, deploy, WSL/Hermes/wrapper, StackChan/robot, voice/camera/mic,
raw/local-only values, productionReady true, or autonomous execution.

**Allowed scope:**
- Read relevant docs
- Read git state (status, log, remote, branch)
- Produce assessment of readiness for Track B

**Forbidden scope:**
- Electron dev-mode launch
- Any execution
- Any file edits / staging / commits / push
- npm commands / WSL / device / robot

**Required human approval:** None — read-only assessment only.

**STOP conditions:**
- Any doc implies Electron dev-mode is already approved
- Any raw values appear
- Assessment would require running commands

**Result log requirement:** PASS/HOLD/NG, readiness assessment, missing docs
list, next required docs/actions, safety boundary.

**Next gate:** /goal shikishima.app-observation-go-wording

---

## /goal shikishima.app-observation-go-wording

**Purpose:** Create a docs-only GO wording review template for Local App
Observation. Defines the exact wording the human would use for an Electron
dev-mode observation run.

**Allowed scope (docs-only):**
- Create docs/shikishima/APP_OBSERVATION_GO_WORDING_REVIEW.md
- Update version/status docs for consistency
- git add / commit (allowed docs only)

**Forbidden scope:**
- Electron dev-mode launch
- Any execution
- git push (requires separate GO)
- npm commands / WSL / device / robot / voice / camera / mic
- src/** / tests/** / package.json edits

**Required human approval:** None for docs creation and local commit.
Push requires separate explicit push GO.

**STOP conditions:**
- Any wording implies Electron dev-mode is already approved
- Any wording implies execution is enabled

**Result log requirement:** PASS/HOLD/NG, commit hash, changed files,
verification checks, safety boundary.

**Next gate:** /goal shikishima.push-readiness → push → /goal shikishima.app-observation-run

---

## /goal shikishima.app-observation-run

**Purpose:** Execute the Local App Observation run (Electron dev-mode or
equivalent) after human issues explicit scoped GO.

**Allowed scope:**
- Pre-run verification
- Electron dev-mode launch only if separately scoped and approved
- Output: redacted observation summary only (what was visible, what was observed)
- No autonomous interaction or data capture beyond UI observation

**Forbidden scope:**
- External services / API calls
- WSL / Hermes / wrapper
- StackChan / robot / voice / camera / mic
- Raw/local-only values in report
- productionReady true
- git push

**Required human approval:** Explicit GO stating:
- exact observation scope (what to look at)
- time window
- stop conditions
- redacted observation policy
- no external services or device access

**STOP conditions:**
- App attempts external service connection
- Raw values appear in output
- Human cannot monitor in real time
- Scope expands beyond approved observation

**Result log requirement:** PASS/HOLD/NG, observation summary (redacted),
what was visible (sanitized), working tree unchanged confirmation, safety boundary.

**Next gate:** /goal shikishima.local-mvp-operation

---

## /goal shikishima.local-mvp-operation

**Purpose:** Define and document how the human uses Shikishima locally for real
work. Includes review logs, Obsidian-ready records, human decisions, and daily
checklists. This is a planning and docs task, not an execution task.

**Allowed scope (docs-only):**
- Create operation planning docs
- Define daily checklist structure
- Define review log format
- Update version/status docs

**Forbidden scope:**
- Autonomous operation
- External services
- productionReady true
- git push (without separate GO)
- WSL / device / robot / voice / camera / mic

**Required human approval:** None for docs creation and local commit.
Actual operation requires human decision per session.

**STOP conditions:**
- Any wording implies autonomous execution
- Any wording implies productionReady true

**Result log requirement:** PASS/HOLD/NG, commit hash, changed files,
safety boundary.

**Next gate:** Human decides per-session operations as Track C matures.

---

## /goal shikishima.external-device-hold

**Purpose:** Document and confirm that all external, device, WSL, Hermes,
wrapper, StackChan, robot, voice, camera, and mic tracks remain HOLD.

**This goal exists to make Track E explicit.** It does not unblock anything.

**Allowed scope:**
- Read existing HOLD documentation
- Confirm all Track E items remain HOLD
- Produce HOLD confirmation record if needed

**Forbidden scope:**
- Any Track E execution
- WSL / Hermes / wrapper
- StackChan / robot / voice / camera / mic
- External services / Cloudflare / deploy
- productionReady true

**Required human approval:** Separate explicit human GO required per Track E
component before any Track E execution may begin.

**STOP conditions:** Any attempt to execute Track E content without separate GO.

**Result log requirement:** PASS/HOLD/NG, confirmation that all Track E items
remain HOLD, safety boundary.

**Next gate:** Track E remains HOLD until human explicitly approves a specific
Track E component with separate scoped GO.

---

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- Level 2: not approved
- Level 3: not approved
- Track B/C/D/E: not approved
- future_git_push: not approved
