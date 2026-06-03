# LMO Session Design 2026-05-21

status: DRAFT / NOT APPROVED
productionReady: false
execution: disabled
rawValuesReported: false

LMO means limited manual operation. This document prepares a human-supervised
session design only.

## Required Fields

```text
date:
time_window:
operator:
allowed_gate:
allowed_run_count: 1
evidence_file:
stop_conditions:
shutdown_method:
after_action_verification:
```

## Rules

- one gate at a time
- no background daemon
- no retry loop
- all gates return to HOLD after run
- productionReady remains false
- execution remains disabled

