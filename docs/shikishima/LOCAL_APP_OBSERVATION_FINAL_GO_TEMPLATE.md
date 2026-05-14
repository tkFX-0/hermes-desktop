# Local App Observation Final GO Template

## Document Status

```text
roadmapVersion: v3.6.0
status: template_only
GO_issued: false
time_window: required — must be filled by human before sending
date_created: 2026-05-14
```

## Purpose

This is a ready-to-copy GO template for Local App Observation.

The human must fill all placeholder values before sending this as the actual GO.

A GO sent with any placeholder value remaining (especially time_window) is not
valid and will be STOPped.

Reading this template is not GO.

---

## Ready-to-Copy GO Block

```text
I explicitly approve Local App Observation only.

Approved time_window:
<YYYY-MM-DD HH:MM-HH:MM JST>

Approved purpose:
Observe the local app UI/status only and record redacted evidence.

Approved command scope:
npx electron .

Allowed:
- start local app in Electron dev-mode within the approved time_window only
- observe UI screens: layout, navigation, status labels
- record screen names and PASS / HOLD / NG results
- record console error categories only (no raw output)
- record working tree before/after (staged and diff counts only)
- take screenshots only if no secrets / raw values / local-only values visible

Forbidden:
- productionReady true
- execution enabled
- Level 3
- external deploy
- Cloudflare
- WSL / Hermes / wrapper execution
- robot / StackChan runtime
- robot connection
- robot motion
- voice / camera / mic
- raw values / secrets / local-only values in any output
- package changes
- src / tests changes
- staging or committing source changes during observation
- future git push

Stop immediately if:
- any secret, token, raw value, or local-only value appears in output
- unexpected external network request is triggered
- deploy, Cloudflare, or external push prompt appears
- robot / StackChan / device / voice / camera / mic prompt appears
- app crash reveals private paths or config
- unexpected file changes appear
- scope ambiguity is detected
- time_window expires

Evidence format after observation:
- use docs/shikishima/LOCAL_APP_OBSERVATION_EVIDENCE_TEMPLATE.md
- all fields redacted only
- no raw values in any field
```

---

## Placeholder Checklist Before Sending GO

Before copying and sending this GO block, confirm:

```text
placeholder_01: <YYYY-MM-DD HH:MM-HH:MM JST> filled with concrete value
placeholder_02: no other placeholder values remain
wording_review_confirmed: LOCAL_APP_OBSERVATION_GO_WORDING_REVIEW.md reviewed
checklist_13_items_confirmed: all 13 items in wording review checklist PASS
pre_run_checks_confirmed: all 13 pre-run checks reviewed
```

If placeholder_01 is not filled, sending this block is NOT a valid GO.

## Safety Boundary

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
Local App Observation execution: not approved by this document
Electron dev-mode: not approved by this document
Final Shikishima 100%: not complete
future_git_push: not approved
```

This template is not GO. It becomes a valid GO only after the human fills
the time_window and sends it as an explicit message.
