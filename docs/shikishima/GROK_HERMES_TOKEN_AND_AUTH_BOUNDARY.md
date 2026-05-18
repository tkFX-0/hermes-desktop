# Grok-Hermes Token and Auth Boundary

## Status

```
date:            2026-05-18
status:          docs-only boundary definition
oauth_performed: false
token_present:   not_applicable (no auth performed yet)
```

---

## auth.json — Local Secret Material

`~/.hermes/auth.json` contains OAuth bearer token material.

### Absolute Rules

```
NEVER commit auth.json to git
NEVER print raw token to terminal, log, or chat
NEVER paste token into any UI surface
NEVER expose account identifier if account is sensitive
NEVER display auth.json contents in any output
```

If any of these are violated → STOP immediately.

---

## Gitignore Requirement

Before GHG-03 (OAuth login), confirm:

```
- ~/.hermes/ is NOT in any git-tracked directory
- .gitignore or global gitignore excludes auth.json material
- git status shows no auth.json or hermes token file as tracked
```

If auth.json appears in `git status` as tracked or staged → STOP.

---

## Redacted Status Protocol

When reporting provider auth state, use redacted format only:

```yaml
provider:           xai-oauth
auth_status:        configured | not_configured | expired | revoked | unknown
token_present:      [redacted — boolean not disclosed]
subscription_tier:  unverified | verified_by_human
model:              grok-4.3 (per official integration docs)
```

### Never Report

```
- Raw token string
- Token expiry timestamp
- Account username or email
- Account ID
- Any OAuth code or state parameter
```

---

## STOP Conditions (Token Safety)

```
STOP if:
  - auth.json appears in git status (tracked or staged)
  - Raw token appears in any terminal output
  - Raw token appears in any log file
  - Raw token appears in any chat message
  - Raw token appears in any UI surface
  - Account email or username appears in any output when sensitivity unconfirmed
  - hermes auth add is run by ClaudeCode (must be human-only)
```

---

## Refresh Policy

Hermes refreshes xai-oauth tokens automatically.

### Shikishima Boundary

```
- ClaudeCode MUST NOT trigger refresh manually
- ClaudeCode MUST NOT read auth.json to check expiry
- Token expiry is reported as auth_status: expired (redacted boolean)
- Human decides whether to re-run OAuth (GHG-03 repeat)
```

---

## Credential Rotation

If token is revoked, expired, or compromised:

```
1. Human runs: hermes auth remove xai-oauth (in their own terminal)
2. Human re-runs OAuth login (GHG-03 procedure)
3. ClaudeCode does NOT automate steps 1 or 2
```

---

## Token Scope Assumption

Bearer token obtained via xai-oauth is assumed to grant access to:
- Hermes chat (primary conversation)
- Auxiliary task surfaces

Separate verification required for:
- TTS
- Image generation
- Video generation (HOLD — off by default)
- Transcription
- X Search (HOLD — off by default)

Do NOT assume all surfaces are activated by a single token until verified locally.

---

## Subscription Tier Verification

Official integration assumes Grok subscription.
Exact tier (X Premium / SuperGrok / Developer / etc.) determines model and quota access.

```
tier_status:     unverified
verified_by:     human — must confirm after GHG-03
action_if_tier_unclear:
  - Do not proceed to GHG-04 until tier is confirmed
  - Record tier name in evidence (no account details)
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
