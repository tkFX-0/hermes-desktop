# Post-100 Gate 006 — Runtime Observation Evidence Template

## Document Status

```text
roadmapVersion: v3.60.0
date: 2026-05-17
gate: Post-100 Gate 006
name: Runtime Observation Evidence Template
status: design_ready — not yet executed
```

---

## Purpose

Gate 006 の各ランタイム観察セッションの証跡を記録するテンプレート。
セッションごとにこのファイルをコピーして使用する。

---

## Evidence Template (copy for each session)

```text
# Gate 006 Runtime Observation Evidence — Session [NNN]

## Session Info

session_id:   gate006-session-[NNN]
date:         [YYYY-MM-DD HH:MM JST]
time_window:  [HH:MM-HH:MM JST]
go_reference: [date and scope of GO provided by human]

## Pre-Observation State

origin_main:    [commit hash]
commits_ahead:  [number]
ENABLED_flag_before_session: false (confirmed)
backup_branch_created: [branch name]

## Runtime Start

runtime_started:      [true]
runtime_start_time:   [HH:MM JST]
port_3030_observed:   [open — local only]
electron_process:     [confirmed running]

## iPhone Console Connection

connection_attempted: [true / false]
connection_result:    [connected / failed / not_attempted]
pairing_token:        [not_reported — raw value never in transcript]
snapshot_visible:     [yes / no]

## Observations (redacted)

```
[Describe what was observed without raw values]
[E.g.: "komashikiState field visible in snapshot", "safety invariants visible as expected"]
[E.g.: "productionReady: [redacted — value present but not reported]"]
```

raw_values_reported:  false (confirmed)

## Runtime Stop

runtime_stopped:     [true]
runtime_stop_time:   [HH:MM JST]
port_3030_closed:    [true — confirmed after stop]
session_within_time_window: [true / false]

## ENABLED Flag Revert

ENABLED_flag_after_session: false (confirmed)
local_commit_reverted: [true / manually reverted / n/a]
origin_main_unchanged: [true]

## Post-Observation Safety Invariants

productionReady:              false ✓
execution:                    disabled ✓
runtime_started:              false ✓ (after stop)
port_3030_closed:             true ✓
rawValuesReported:            false ✓
external_api_write:           false ✓
email_sent:                   false ✓
calendar_event_created:       false ✓
github_remote_created:        false ✓
social_posted:                false ✓
purchase_or_reservation_made: false ✓

## Session Result

result:   [PASS / FAIL / PASS_WITH_CAVEAT]
caveats:  [none / describe]
notes:    [free text]

## Next Required Human Action

result_candidate: [PASS / FAIL / PASS_WITH_CAVEAT]
next_action:      [human review this evidence, then decide push GO]
```

---

## Naming Convention

```text
POST_100_GATE_006_RUNTIME_OBSERVATION_EVIDENCE_[YYYYMMDD]_[NNN].md

Example:
  POST_100_GATE_006_RUNTIME_OBSERVATION_EVIDENCE_20260517_001.md
```

---

## Evidence Review: Human Decision Options

```text
accepted_as_gate_006_pass  → approve push of evidence commit
accepted_as_gate_006_pass_with_caveat → approve push; note caveats
needs_revision             → identify what must change
rejected                   → state reason
```

---

この範囲では問題を検出していません。
