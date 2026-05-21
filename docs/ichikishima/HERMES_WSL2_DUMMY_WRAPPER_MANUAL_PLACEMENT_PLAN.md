# Hermes WSL2 Dummy Wrapper — Manual Placement Plan

Status: design only / manual future step / no WSL execution
Review date: 2026-05-06

Current gate (2026-05-06): local-only validator rerun is `HOLD` because placeholders remain. Manual placement remains blocked until a later redacted Signoff review.

Execution status: WSL placement not performed; dummy wrapper not executed; `wsl.exe` not executed; real Hermes not started; real `execFile` not used.

## 1. Purpose

Prepare the future manual placement procedure for a dummy WSL wrapper that emits one bridge payload line for contract validation. This plan is not a placement instruction for the current Goal.

## 2. Why Manual Placement

- WSL file placement crosses the Windows / WSL boundary and must stay human controlled.
- Automated placement could hide raw local values, path mistakes, newline issues, or permission problems.
- Manual placement preserves an audit point before any later `wsl.exe` execution Goal.

## 3. Candidate Path

The only V1 candidate is the fixed policy path:

```text
/home/<UnixUser>/.hermes-bridge/hermes-bridge-payload-once.sh
```

`<UnixUser>` is a placeholder. Do not record the raw local user value in repo docs, reports, or chat.

## 4. Recommended Path

Use the same fixed path required by the WSL2 wrapper policy:

```text
/home/<UnixUser>/.hermes-bridge/hermes-bridge-payload-once.sh
```

This path must match the local-only validator policy before any later execution review.

## 5. Forbidden Locations

Do not place the wrapper in:

- `/tmp`
- `/var/tmp`
- `/mnt/c`
- Downloads folders
- shared world-writable locations
- paths containing `..`, `~`, `$HOME`, shell variables, spaces, glob tokens, or brackets
- any repo-tracked file path containing raw local values

## 6. Permission Policy

Use owner-only access for the wrapper directory and script. Permissions are a future manual step and must not be changed by this Goal.

## 7. Newline Policy

The future WSL script should use LF line endings. Do not use CRLF for the placed WSL script.

## 8. Owner Policy

The future WSL script should be owned by the local WSL user who owns the target home directory. Do not use root ownership unless a later dedicated Goal explicitly approves it.

## 9. chmod Policy

Future manual placement should use owner-only executable permissions. This plan does not run `chmod`.

## 10. Delete / Rollback Policy

Rollback is manual removal of the single wrapper file and, if empty, the `.hermes-bridge` directory. Do not automate deletion from Windows in this phase.

## 11. Validation Policy

Validation order:

1. local-only JSON validator returns `GO`
2. redacted Signoff review
3. manual placement review
4. separate WSL execution preflight

This Goal stops before placement and before execution.

`GO` from the local-only validator is not permission to execute. It only means the redacted Signoff review can begin.

## 12. Raw Value Policy

Do not record raw local values in:

- repo docs
- chat
- reports
- Git commits
- Control Center renderer
- stdout/stderr captures

Only redacted decision, counts, and policy booleans may be recorded.

## 13. wsl.exe STOP GATE

Stop before:

- running `wsl.exe`
- running `C:\Windows\System32\wsl.exe`
- starting real Hermes
- executing the dummy wrapper
- running real `execFile`
- using `spawn`, `exec`, or `shell:true`
- placing files inside WSL

## 14. Next Goal Handoff

- `HOLD`: user fills remaining local-only values and reruns validator.
- `GO`: redacted Signoff review, then manual placement review.
- `REJECT`: fix invalid local-only values and rerun validator.

Manual placement and WSL execution remain separate explicit Goals.
## 2026-05-06 Discovery-Only Fill-In Note

- Local values remain HOLD because distro selection is ambiguous.
- Manual placement remains blocked.
- No WSL files or directories were created.
- No wrapper script, dummy wrapper, real Hermes, or real `execFile` was executed.
