# Controlled Pilot Plan

## Purpose

This design-only plan defines how a future controlled pilot could be reviewed.
It does not approve execution or define a runnable production command.

## Pilot Levels

| Level | Meaning | Current state |
|---|---|---|
| Level 0 | documentation-only | current |
| Level 1 | local dry-run only | HOLD |
| Level 2 | local controlled validation | HOLD |
| Level 3 | external/device operation | HOLD |

## Entry Conditions

Before any pilot level above Level 0:

- Human Review Decision Sheet must be accepted.
- Pre-Operation Readiness Gate must be accepted.
- validation evidence must be accepted as official PASS.
- rollback and incident stop conditions must be accepted.
- exact scope must be written down.
- raw/secret/local-only policy must be confirmed.

## Exit Conditions

A pilot exits safely when:

- output is redacted;
- stop conditions were not triggered;
- no forbidden system was touched;
- no productionReady true was set;
- no execution remains running;
- the human records the result.

## Stop Conditions

Stop immediately if:

- execution scope expands;
- output may include raw values or secrets;
- an external service or device is required;
- WSL/Hermes/wrapper/dummy/RunPod is required;
- StackChan/robot/voice/camera/mic is required;
- install, npx, dependency update, or package change is required;
- productionReady true, git push, or deploy is requested.

## Rollback Conditions

Rollback means returning to HOLD and recording the incident redacted-only.

Reference:

- `REAL_OPERATION_ROLLBACK_AND_INCIDENT_PLAN.md`
- `V9_PILOT_STOP_AND_ROLLBACK_CARD.md`

## Human GO Wording

Any future pilot approval must be explicit and scoped. Examples:

- approve Level 1 local dry-run only;
- approve this exact command group only;
- approve this exact time window only;
- approve no git push;
- approve no productionReady true.

## Not Allowed Yet

- production operation;
- git push;
- deploy or Cloudflare;
- OpenSpec CLI;
- npm install or npx;
- dependency update;
- WSL/Hermes/wrapper/dummy/RunPod;
- StackChan/robot;
- voice/camera/mic;
- secret/token/raw/local-only value handling.

## Current Conclusion

Current pilot level remains Level 0: documentation-only. The next step is human
review of the Pre-Operation Readiness Candidate, not operation.
