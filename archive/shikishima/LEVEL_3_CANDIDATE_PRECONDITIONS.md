# Level 3 Candidate Preconditions

## Document Status

```text
roadmapVersion: v3.8.0
status: preconditions_only
Level 3: not approved
execution: disabled
productionReady: false
date_created: 2026-05-14
```

## Critical Statement

**This document does not approve Level 3.**

**Level 3 remains HOLD.**

This document only records what would be required before Level 3 is even
considered as a candidate. Listing these preconditions does not constitute
a GO, does not shorten the path, and does not imply that Level 3 will
automatically follow once preconditions are met.

Level 3 requires its own separate explicit human GO with a separate
validated scope and separate evidence review.

## What Level 3 Means

Level 3 is a future gate beyond Practical Local MVP Operation. It may involve:

```text
- Broader execution scope (beyond local-only observation)
- External API or service integration candidates
- Automated task execution within defined boundaries
- Repeated autonomous loops with human checkpoint intervals
```

Level 3 is NOT:

```text
- productionReady true (separate gate)
- WSL / Hermes / wrapper execution (separate gate)
- robot / StackChan runtime (separate gate)
- voice / camera / mic (separate gate)
- external deployment (separate gate)
- Final Shikishima 100% (requires all 10+ tracks)
```

## Required Before Level 3 Is Considered

All of the following must be satisfied:

### Observation Track

```text
pre_L3_o1: Local App Observation PASS (at least one session)
pre_L3_o2: Local App Observation Evidence accepted by human
            (accepted_as_local_app_observation_evidence)
pre_L3_o3: Multiple repeated local observations without regression
            (minimum: 3 independent sessions recommended)
pre_L3_o4: All sessions: no raw/secret/local-only value exposure
pre_L3_o5: All sessions: no unexpected execution behavior
pre_L3_o6: All sessions: working tree clean after each session
```

### Operational Track

```text
pre_L3_p1: Practical Local MVP Operation rules defined and in active use
            (PRACTICAL_LOCAL_MVP_ACCEPTANCE_CRITERIA.md all criteria met)
pre_L3_p2: Incident response playbook reviewed at least once
pre_L3_p3: Daily check template in active use
pre_L3_p4: Autonomous loop boundaries confirmed and respected
pre_L3_p5: No HOLD boundary has been crossed without a GO
```

### Human Decision Track

```text
pre_L3_h1: Human explicitly decides to nominate Level 3 candidate
pre_L3_h2: Separate Level 3 scope proposal created and reviewed
pre_L3_h3: Separate Level 3 GO wording reviewed by human
pre_L3_h4: Separate Level 3 validation plan created
pre_L3_h5: Separate explicit human GO with concrete time_window issued
```

## Current Status

```text
pre_L3_o1: PENDING — observation not yet executed
pre_L3_o2: PENDING
pre_L3_o3: PENDING
pre_L3_o4: PENDING
pre_L3_o5: PENDING
pre_L3_o6: PENDING
pre_L3_p1: PENDING — criteria E pending
pre_L3_p2: PENDING
pre_L3_p3: PENDING
pre_L3_p4: PASS (AUTONOMOUS_LOOP_BOUNDARIES.md created)
pre_L3_p5: PASS (no HOLD crossed)
pre_L3_h1: PENDING — human has not nominated
pre_L3_h2: PENDING
pre_L3_h3: PENDING
pre_L3_h4: PENDING
pre_L3_h5: PENDING
```

## What Is Not Required for Level 3

```text
- productionReady true (separate future gate)
- robot / StackChan / voice / camera / mic runtime
- WSL / Hermes / wrapper execution
- external deployment
- Final Shikishima 100%
```

## Safety Boundary

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
Level 3 remains HOLD until all pre_L3_h1-h5 are met
```
