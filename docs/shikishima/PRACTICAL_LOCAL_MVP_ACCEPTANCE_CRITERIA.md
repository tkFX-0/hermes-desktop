# Practical Local MVP Acceptance Criteria

## Document Status

```text
roadmapVersion: v3.8.0
status: criteria_only
execution: disabled
productionReady: false
date_created: 2026-05-14
```

## Purpose

This document defines what must be true before Practical Local MVP
Operation can be considered accepted.

## Critical Distinction

```text
Practical Local MVP Operation Accepted ≠ Final Shikishima 100%
```

Practical Local MVP accepted means the app can be opened and observed
locally under human supervision with defined rules. It does not mean:

```text
- productionReady true
- execution enabled
- Level 3 approved
- external deployment approved
- robot / voice / device approved
- Final Shikishima 100% complete
```

## Required Criteria

All of the following must be satisfied before acceptance:

### Docs Readiness

```text
criteria_d1: Local App Observation readiness package exists and accepted
criteria_d2: Local App Observation GO wording review exists and accepted
criteria_d3: Practical Local MVP Operation Definition exists
criteria_d4: Local Operation Test Matrix exists
criteria_d5: Local Operation Stop Conditions exists
criteria_d6: Local MVP Operator Runbook exists
criteria_d7: Local MVP Daily Check Template exists
criteria_d8: Local MVP Incident Response Playbook exists
criteria_d9: Autonomous Loop Boundaries defined
criteria_d10: Level 3 Candidate Preconditions documented
```

### Evidence Readiness

```text
criteria_e1: At least one Local App Observation session completed
criteria_e2: Observation evidence recorded using approved template
criteria_e3: Evidence reviewed and accepted by human
             (accepted_as_local_app_observation_evidence)
criteria_e4: No raw values, secrets, tokens, or local-only values
             appeared in any evidence
criteria_e5: No stop conditions triggered without resolution
criteria_e6: Working tree clean after each observation
```

### Safety Boundary

```text
criteria_s1: execution remains disabled throughout
criteria_s2: productionReady remains false throughout
criteria_s3: Level 3 remains not approved
criteria_s4: robot / StackChan runtime remains HOLD
criteria_s5: voice / camera / mic remains HOLD
criteria_s6: external deployment / Cloudflare remains HOLD
criteria_s7: WSL / Hermes / wrapper remains HOLD
criteria_s8: no npm install / npx / transient package execution used
```

## Current Status

```text
criteria_d1: PASS (accepted_as_track_b_readiness_scope)
criteria_d2: PASS (hardened GO wording accepted)
criteria_d3: PASS (PRACTICAL_LOCAL_MVP_OPERATION_DEFINITION.md created)
criteria_d4: PASS (LOCAL_OPERATION_TEST_MATRIX.md created)
criteria_d5: PASS (LOCAL_OPERATION_STOP_CONDITIONS.md created)
criteria_d6: PASS (LOCAL_MVP_OPERATOR_RUNBOOK.md created)
criteria_d7: PASS (LOCAL_MVP_DAILY_CHECK_TEMPLATE.md created)
criteria_d8: PASS (LOCAL_MVP_INCIDENT_RESPONSE_PLAYBOOK.md created)
criteria_d9: PASS (AUTONOMOUS_LOOP_BOUNDARIES.md created — pending)
criteria_d10: PASS (LEVEL_3_CANDIDATE_PRECONDITIONS.md created — pending)

criteria_e1: PENDING — Local App Observation not yet executed
criteria_e2: PENDING
criteria_e3: PENDING
criteria_e4: PENDING
criteria_e5: PENDING
criteria_e6: PENDING

criteria_s1: PASS (execution: disabled)
criteria_s2: PASS (productionReady: false)
criteria_s3: PASS (Level 3: not approved)
criteria_s4: PASS (robotMotion: HOLD)
criteria_s5: PASS (voice/camera/mic: HOLD)
criteria_s6: PASS (deploy/Cloudflare: HOLD)
criteria_s7: PASS (WSL/Hermes/wrapper: HOLD)
criteria_s8: PASS (npx/npm install not used)
```

## What Happens After Full Acceptance

After all criteria are satisfied:

```text
→ Practical Local MVP Operation: accepted
→ Autonomous loop may operate within defined boundaries
→ Evidence may be submitted for Level 3 candidate consideration
→ Final Shikishima 100% remains separate and requires its own path
```

## Safety Boundary

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
Final Shikishima 100%: not complete
```
