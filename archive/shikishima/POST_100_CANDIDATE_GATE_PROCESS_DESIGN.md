# Post-100 Candidate Gate Process Design

date: 2026-05-20
status: DESIGN
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document defines the first post-100 candidate gates after Shikishima
reaches real-operation readiness acceptance.

It does not approve any post-100 action.
It does not start runtime.
It does not approve external writes.
It does not approve productionReady true.
It does not enable execution.

---

## 1. Purpose

After the 100% readiness acceptance, the next work must remain gated and
sequential. The goal is to avoid opening several Level 5 or polish tracks at
once.

The first post-100 candidates are:

1. Pixel Room / character design polish
2. AT-14 runtime visual confirmation
3. CC-03 Command Chat real-send gate
4. HB-01 Hermes / WSL gate process
5. XS-01 x_search read-only gate

Each candidate can move only with explicit human GO.

---

## 2. Global Post-100 Rules

Default state:

```text
all_post_100_candidates: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
external_write: blocked
runtime: HOLD
OAuth: HOLD
x_search: HOLD
Hermes/WSL: HOLD
```

Global requirements before opening any candidate:

- identify exactly one gate to open
- define scope and time window
- define allowed files or allowed runtime command
- define expected evidence
- define stop conditions
- keep raw tokens, secrets, raw LAN IPs, local-only paths, and credentials out
  of logs and reports
- do not combine unrelated gates in one GO

---

## 3. Recommended Order

| Order | Candidate | Why |
|---|---|---|
| 1 | AT-14 runtime visual confirmation | verifies current UI before expansion |
| 2 | Pixel Room / character design polish | presentation improvement, no Level 5 required by default |
| 3 | XS-01 x_search read-only gate | read-only social awareness, still external surface |
| 4 | HB-01 Hermes / WSL gate | local bridge complexity and environment risk |
| 5 | CC-03 Command Chat real-send gate | external/write-like operational impact; open last |

If human availability is limited, AT-14 should be first because it validates the
current UI state without committing to new external capability.

---

## 4. Candidate 1: Pixel Room / Character Design Polish

### Goal

Polish Pixel Room and agent character design after readiness acceptance.

### Allowed With Explicit GO

- CSS/SVG character redesign
- sprite asset planning
- limited image asset import only if an asset GO explicitly allows it
- layout polish
- handoff motion polish
- visual evidence docs

### Default Forbidden

- package changes
- runtime start unless separately approved
- generated image asset commit without asset GO
- external image URL dependency
- productionReady true
- execution enabled

### Required GO Fields

```text
pxr_polish_go:
  target:
  allowed_files:
  image_asset_allowed:
  asset_source:
  license_or_originality_note:
  runtime_allowed:
  package_change_allowed:
  expected_result:
  stop_conditions:
  evidence_file:
```

### STOP If

- asset source is unclear
- package changes become required
- runtime becomes required without time window GO
- raw/local-only values would be captured in evidence

---

## 5. Candidate 2: AT-14 Runtime Visual Confirmation

### Goal

Open the app in a controlled runtime session and visually confirm Agent Theater,
Pixel Room, Gate Dashboard, worker panels, and safety labels.

### Allowed With Explicit GO

- one runtime session
- one approved command
- visual inspection
- screenshots or written evidence if they do not reveal secrets or raw values
- shutdown and post-run checks

### Required GO Fields

```text
runtime_visual_go:
  date:
  time_window:
  command:
  reason:
  observe:
  stop_if:
  shutdown:
  after:
  evidence_file:
```

### Required Evidence

- runtime started intentionally
- observed screens
- safety labels visible
- no raw token / raw LAN IP / secret / local-only value visible
- runtime stopped
- ports closed if applicable
- repo unchanged or changes documented

### STOP If

- unexpected external connection starts
- raw/secret/local-only data appears
- runtime cannot be shut down cleanly
- UI exposes execution/push/OAuth/x_search controls as actionable buttons

---

## 6. Candidate 3: CC-03 Command Chat Real-Send Gate

### Goal

Move Command Chat from display-only/draft behavior toward a controlled real-send
test only after explicit approval.

### Default State

```text
Command Chat real send: HOLD
draft display: allowed
external write: blocked
```

### Required GO Fields

```text
cc03_real_send_go:
  date:
  time_window:
  exact_target:
  allowed_message:
  command_or_ui_path:
  dry_run_completed:
  stop_if:
  rollback_or_disable:
  evidence_file:
```

### Required Prechecks

- Draft Outbox path works.
- target is explicit and non-ambiguous
- message content is human-approved
- no autonomous send loop
- no broad broadcast
- no secrets

### STOP If

- target is unclear
- message content is not explicitly approved
- any send loop or auto-dispatch appears
- external API write scope expands
- logs would expose credentials or local-only data

---

## 7. Candidate 4: HB-01 Hermes / WSL Gate Process

### Goal

Open Hermes / WSL bridge work only as a controlled post-100 candidate.

### Default State

```text
Hermes bridge: HOLD
WSL: HOLD
wrapper/dummy process: HOLD
external provider integration: HOLD
```

### Required GO Fields

```text
hb01_hermes_wsl_go:
  date:
  time_window:
  purpose:
  allowed_environment:
  allowed_commands:
  forbidden_commands:
  token_policy:
  expected_result:
  stop_if:
  shutdown:
  evidence_file:
```

### Required Prechecks

- no repo dirty state unless explicitly scoped
- no token/env file printed
- command list is explicit
- installer/update operation is separated from bridge runtime operation
- rollback or shutdown path is known

### STOP If

- installer requires credentials unexpectedly
- WSL or bridge process cannot be controlled
- token/env contents might be exposed
- command scope expands beyond the approved list
- external service write becomes necessary

---

## 8. Candidate 5: XS-01 x_search Read-Only Gate

### Goal

Allow future x_search / social awareness as a read-only capability.

### Allowed With Explicit XS-READ GO

- search public social sources
- read public posts
- summarize
- collect source notes
- draft reply/post suggestions for human review

### Still Forbidden Without Separate GO

- post
- reply
- DM
- like
- follow
- edit profile
- send message
- social write action

### Required GO Fields

```text
xs_read_go:
  date:
  time_window:
  query_scope:
  source_scope:
  read_only_confirmation:
  output_format:
  attribution_policy:
  stop_if:
  evidence_file:
```

### STOP If

- login/OAuth is required but not approved
- write/social action is requested
- private or sensitive data appears
- source attribution cannot be summarized safely

---

## 9. Cross-Gate Conflict Rules

Do not combine:

- runtime GO + x_search GO
- Hermes/WSL GO + Command Chat real send GO
- Pixel Room asset import + runtime observation
- OAuth/provider connection + social write
- productionReady true + any exploratory gate

Each gate must produce its own evidence.

---

## 10. Acceptance Rule

A post-100 candidate may be marked complete only if:

- the exact gate was approved
- scope remained unchanged
- stop conditions did not trigger
- evidence was recorded
- no forbidden action occurred
- human reviewed the result

Completion of one candidate does not approve another candidate.

---

## 11. Next Recommended Action

Recommended first post-100 action:

```text
AT-14 runtime visual confirmation GO
```

Recommended HOLD items:

```text
CC-03 real send
HB-01 Hermes/WSL
XS-01 x_search read-only
Pixel Room asset import
```

