# Hermes WSL2 Wrapper — Local Value Validator Runbook

Status: prepared / redacted-only / no execution

Current redacted rerun (2026-05-06): local JSON exists, gitignored, untracked, unstaged. Counts: present=13 / missing=0 / placeholder=6 / rejected=0. Decision: `HOLD`. Raw values were not recorded.

## 1. Purpose

Validate the local-only WSL wrapper value file and produce a redacted report that can be reviewed or copied into Signoff without exposing raw local values.

## 2. Why Read The Local JSON

`wsl-wrapper-values.local.json` is the operator-owned local fill-in file. The validator may read it only to classify readiness as `GO`, `HOLD`, or `REJECT` and to generate counts and policy booleans.

## 3. Allowed Read Scope

- Only the fixed local-only path: `sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.json`
- JSON shape validation
- Human value packet coercion in memory
- Redacted validation report generation

The reader must not read arbitrary files, `.env`, secrets, directories, WSL paths, or any path supplied from a UI field.

## 4. Allowed Output

- `decision`: `GO` / `HOLD` / `REJECT`
- validation status
- present / missing / placeholder / rejected counts
- System32 exact match confirmed: yes/no
- Sysnative rejected in V1: yes/no
- wrapper path policy passed: yes/no/unknown
- `canRunWsl:false`
- `canRunHermes:false`
- `canRunOnce:false`
- `productionReady:false`
- redacted summary lines

## 5. Forbidden Output

- raw local JSON
- raw `distroName`
- raw `unixUser`
- raw `wrapperPath`
- raw `windowsWslExePath`
- raw argv
- raw payload
- stdout/stderr full text
- env values
- secrets

Validator failure must also be reported without raw values.

## 6. Placeholder Handling

Placeholder or unconfirmed values must not become `GO`.

Examples of placeholder handling:

- bracket placeholders are `HOLD`
- empty strings are `HOLD`
- `null` optional fill-in fields are `HOLD`
- missing required fields are `HOLD`

Invalid non-placeholder policy violations are `REJECT`.

## 7. Decision Criteria

| Decision | Criteria | Next action |
| --- | --- | --- |
| `GO` | all required values validate, no placeholders, no rejects | review redacted Signoff, then request a separate WSL execution Goal |
| `HOLD` | file missing, placeholder, missing, or unconfirmed values remain | fill local-only JSON and rerun validator |
| `REJECT` | shape error or policy violation | fix invalid local-only values and rerun validator |

`GO` still does not permit WSL execution.

## 8. Redacted Summary

Use `createHermesWsl2WrapperRedactedValidationReport()` or the fixed file reader. Only copy the returned redacted lines and counts. Do not copy local JSON content.

## 9. Signoff Transfer

Signoff may record:

- decision
- validation status
- counts
- System32 / Sysnative / wrapper policy booleans
- execution-not-run confirmations
- redacted summary lines

Signoff must not record raw values.

## 10. STOP GATE

Stop and request a separate explicit Goal before:

- running `wsl.exe`
- starting real Hermes
- running real `execFile`
- using `child_process`, `spawn`, `exec`, or `shell:true` for execution
- placing files inside WSL
- changing `productionReady:false`
- changing `pendingPackagingResolution:true`

## 11. Next Goal Handoff

- `HOLD`: user fills real local-only values, then reruns validator.
- `GO`: redacted Signoff review.
- `REJECT`: fix invalid local-only values, then rerun validator.

After `GO`, the next design handoff is `HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md`. It is still manual design only and does not permit WSL placement or execution.
## 2026-05-06 Discovery-Only Fill-In Note

- Bounded `wsl.exe` discovery-only was performed for local value fill-in.
- Distro discovery returned multiple candidates, so distro-dependent fields remain HOLD.
- Fixed non-ambiguous fields were written to the ignored local-only JSON without reporting raw values.
- Latest redacted result: present=13 / missing=0 / placeholder=3 / rejected=0 / decision=HOLD.
- Real Hermes, wrapper execution, WSL placement, real `execFile`, and packaged smoke were not performed.
## 2026-05-06 Intended Distro Slot Selection Note

- Multiple WSL distros are present, so automatic distro selection remains forbidden.
- A local-only ignored slot map was prepared for user selection.
- Redacted slots: slot-01 / slot-02 / slot-03.
- selectedSlot is none and decision remains HOLD.
- Unix user discovery, wrapperPath generation, `wsl.exe -d`, WSL placement, wrapper execution, dummy execution, real Hermes, and real `execFile` were not performed.
## 2026-05-06 Selected Slot Resolution Attempt

- selectedSlot=slot-02 was recorded in local-only slot map.
- Inventory comparison matched the local-only slot map before resolution.
- Unix user discovery-only failed, so distro/user/wrapper fields were not completed.
- Latest redacted result remains present=13 / missing=0 / placeholder=3 / rejected=0 / decision=HOLD.
- No raw distro name, unix user, wrapper path, stdout, stderr, or argv was recorded in docs.
- No WSL file creation, WSL placement, wrapper execution, dummy execution, real Hermes, or real `execFile` occurred.
## 2026-05-06 Selected Distro Availability Investigation

- selectedSlot=slot-02 remained resolved after inventory comparison.
- `whoami` discovery-only failed.
- Alternate `$USER` discovery-only also failed.
- failureCategory=whoami_failed_and_user_env_failed.
- Local JSON distroName/unixUser/wrapperPath were not updated.
- Latest redacted result remains present=13 / missing=0 / placeholder=3 / rejected=0 / decision=HOLD.
- No raw stdout, stderr, distro name, unix user, wrapper path, or argv was recorded in docs.
- No WSL file creation, WSL placement, wrapper execution, dummy execution, real Hermes, or real `execFile` occurred.
## 2026-05-06 Availability HOLD Hardening

- Availability failure is now represented as redacted HOLD status, not as GO or REJECT.
- selectedSlot=slot-02 is displayable; raw distro name, unix user, wrapper path, stdout, stderr, argv, and JSON remain non-reportable.
- failureCategory=whoami_failed_and_user_env_failed.
- nextRequiredHumanAction=verify_selected_slot_availability_locally.
- Do not retry WSL discovery or switch slots until the user replies with one of:
  - `slot-02 availability: ok`
  - `slot-02 availability: failed`
  - `slot-02 availability: choose_another_slot`
## 2026-05-07 Control Center HOLD Status Sprint

- Control Center now displays selected distro availability HOLD as slot-only redacted status.
- Displayable fields: selectedSlot, slotResolution, inventoryCountComparison=count_matched_content_unverified, unixUserDiscovery, alternateUnixUserDiscovery, failureCategory, localJsonUpdatedForDistroUserWrapper, nextRequiredHumanAction, rawValuesReported, and Execution=disabled.
- Local-only repair HOLD fields are displayable only as enums/counts: selectedSlot=unresolved, previousSelectedSlot=slot-01, slotSelectionFailureReason=distro_name_mismatch, inventoryContentConsistency=mismatched, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=update_local_only_slot_map_or_hold. Do not treat visual similarity, labels, memos, displayName, or operatorLabel as authoritative.
- Raw distro name, unix user, wrapper path, stdout, stderr, argv, local JSON, and slot map content remain non-reportable.
- No WSL command was rerun in this sprint.
