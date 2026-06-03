# XACC-01 Read-Only Auth Scope Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — XACC-01 GO required
**gate:** explicit xacc01_read_only_auth_go required

---

## Summary

HOLD until explicit XACC-01 GO.

Design and prepare the minimum OAuth 2.0 PKCE scope for read-only X access.
No connection. No token created. No OAuth flow started.

---

## Recommended Minimum Read-Only Scopes

| Scope | Purpose | Required for read-only? |
|---|---|---|
| `tweet.read` | Read posts, timelines, search results | YES |
| `users.read` | Read user profile info | YES |
| `offline.access` | Obtain refresh token for long-term sessions | Only if needed — adds complexity |
| `follows.read` | Read follows/followers | Optional — add only if needed |

Write scopes at this phase:

| Scope | Status |
|---|---|
| `tweet.write` | HOLD — not requested |
| `follows.write` | HOLD — not requested |
| `dm.read` | HOLD — not requested unless specifically approved |
| `dm.write` | HOLD — not requested |
| `like.write` | HOLD — not requested |
| Any other write scope | HOLD |

---

## OAuth 2.0 PKCE Flow Steps (design-only — not executed)

```text
1. Register app in X Developer Portal
2. Set callback URL (local only, e.g. http://localhost:3000/callback)
3. Request scopes: tweet.read users.read (minimum)
4. Generate PKCE code_verifier and code_challenge
5. Redirect user to X authorization URL
6. User approves in browser (human action)
7. Receive authorization code at callback
8. Exchange code + verifier for access token
9. Store token in local-only ignored file or environment variable
10. Use Bearer token for API calls
```

Steps 4–10 require human presence. ClaudeCode does not execute OAuth flow without explicit GO.

---

## Token Storage Design

```text
storage_method:    local ignored file (.xacc-token.local) OR environment variable XACC_BEARER_TOKEN
gitignore_entry:   .xacc-token.local
token_contents:    bearer token only (no password, no full auth.json with secrets)
rotation:          rotate immediately if token appears in any chat/log/commit
```

---

## Required GO Fields

```text
xacc01_read_only_auth_go:
  date:
  time_window_jst:
  account_type:          (sub-account or main — sub recommended)
  requested_scopes:      tweet.read users.read
  token_storage_method:  (local file or env var)
  callback_url:
  stop_if:
  evidence_file:
```

---

## STOP Conditions

STOP if:

- password is requested or entered
- token appears in any chat, log, doc, or screenshot
- OAuth starts without GO
- write scope is requested or granted during read-only setup
- token is accidentally committed
- account mutation occurs
- productionReady true appears
- execution enabled appears

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
token_created:      false
oauth_started:      false
x_connected:        false
write_scopes:       HOLD
```
