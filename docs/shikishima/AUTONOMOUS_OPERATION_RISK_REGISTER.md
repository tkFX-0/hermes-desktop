# Autonomous Operation Risk Register

**date:** 2026-05-21
**status:** PLANNING — not execution approval

---

| ID | Risk | Cause | Impact | Detection | Mitigation | STOP Condition | Owner |
|---|---|---|---|---|---|---|---|
| R-01 | External write loop | Retry logic + no loop prevention | Spam / account ban / data corruption | send_count > 1 | send-count limiter + HOLD-restore | > 1 send in session | ClaudeCode + tk |
| R-02 | Discord auto-reply loop | Bot replies to its own messages | Channel flood / ban | bot author == self | bot-self ignore (DIS-08) | Bot replies to self | ClaudeCode |
| R-03 | Token leakage | .env read → result/log/UI output | Credential exposure | token string in any output | rawTokenReported: false literal / regex filter | Token in any output | ClaudeCode |
| R-04 | Raw local path leakage | vault/path in result/log/UI | Privacy / path traversal hint | homedir() in output | redactedPath only / never return raw root | Raw path in UI/log | ClaudeCode |
| R-05 | Arbitrary file write | Path traversal in filename | Data corruption / OS damage | containment check failure | ALLOWED_ROOT + sep check (library-export.ts) | Path outside allowed root | ClaudeCode |
| R-06 | Arbitrary command execution | HB-01 command boundary breach | System compromise | command not in whitelist | allowed_commands explicit list (hb01_hermes_wsl_go) | Unknown command attempted | ClaudeCode + tk |
| R-07 | WSL bridge abuse | HB-01 open + unintended command | System modification | process outside expected list | bridge shutdown procedure (HB-06) | Unexpected process spawned | ClaudeCode + tk |
| R-08 | X account mutation | Write scope granted unintentionally | Public post without approval | xacc scope != read-only | tweet.read users.read only (XACC-01) | Write scope in OAuth flow | tk |
| R-09 | StackChan physical motion | MOTION/DANCE triggered unintentionally | Physical injury / device damage | motion output detected | motion_dance_allowed: false (typed) | Any motion command sent | tk |
| R-10 | productionReady set too early | Rushing before blockers resolved | Unsafe autonomous operation | BLOCKER-005 / LMO not done | explicit checklist (PRODUCTION_READY_TRUE_GO_REQUIREMENTS.md) | Blockers not resolved | tk |
| R-11 | execution enabled without kill switch | EXE-01 not implemented | No emergency stop | kill switch absent | kill switch required before execution_go | Kill switch not tested | ClaudeCode |
| R-12 | Rate limit / 429 errors | Too many requests to external API | Account suspension | HTTP 429 response | rate limit policy per gate + cooldown | 429 received | ClaudeCode |
| R-13 | XACC token stored insecurely | Token written to tracked file | Credential in git history | .env not in .gitignore | token storage policy (local, gitignored) | Token in any commit | ClaudeCode |
| R-14 | Obsidian write to wrong folder | Path manipulation in filename | Vault corruption | containment check | ALLOWED_SUBFOLDER: 30_Evidence only | Path outside 30_Evidence | ClaudeCode |
| R-15 | Runaway search automation | XS-AUTO recurring + no stop | Cost / rate limit / IP ban | search_count > limit | max_count per session + cooldown | Count exceeds limit | ClaudeCode |

---

## Mitigations Already Implemented

```text
R-03: rawTokenReported: false (TypeScript literal in DiscordIntakeResult)
R-04: redactedPath = 30_Evidence/filename only (library-export.ts)
R-05: normalize(join(ALLOWED_ROOT, filename)).startsWith(ALLOWED_ROOT + sep) check
R-08: DIS01_HOLD=true / OB01_DRY_RUN=true restore after each one-shot
R-09: motion_dance_allowed: false (SC-FACE-05 GO form explicit field)
```

## Open Mitigations (HOLD)

```text
R-01: send-count limiter not yet automated — manual count in GO form only
R-06: allowed_commands whitelist in GO form only — not enforced in code
R-11: kill switch not yet implemented
R-12: rate limit not yet enforced in code — only in GO form policy
```
