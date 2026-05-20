# X Account Token and Scope Policy

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — policy document only, no token created

---

## Password Policy

X account password must NEVER be shared with Shikishima or ClaudeCode.

```text
NEVER:
  - paste password into chat
  - paste password into any config file
  - commit password
  - write password in docs
  - share password in any form
```

Connection uses OAuth 2.0 PKCE only. No password is involved in the API flow.

---

## Token Policy

The OAuth access token (Bearer token) must never appear in:

```text
NEVER:
  - chat messages or conversation
  - committed files
  - screenshots
  - log output
  - evidence docs
  - README or other docs
  - shell history (if visible)
  - error messages
  - test output
```

If a token is accidentally exposed in any of the above, revoke it immediately via X Developer Portal.

---

## Token Storage Policy

Allowed future options (not yet activated):

```text
1. Local ignored file:
   e.g. .xacc-token.local
   must be listed in .gitignore
   content: bearer token only
   readable by: local process only

2. Environment variable:
   e.g. XACC_BEARER_TOKEN
   set in terminal session only
   not exported unnecessarily

3. OS secret manager:
   if separately approved (not currently approved)
```

Forbidden:

```text
FORBIDDEN:
  - committed config files
  - docs/ directory
  - any tracked file
  - package.json
  - chat exports
  - screenshots
  - shell history exports
```

---

## Scope Policy

### XACC-02 read-only (minimum):

| Scope | Allowed |
|---|---|
| `tweet.read` | YES |
| `users.read` | YES |
| `follows.read` | Optional (add only if needed) |
| `offline.access` | Optional (only for refresh token, adds complexity) |

### Write scopes (all HOLD until separate GO):

| Scope | Status |
|---|---|
| `tweet.write` | HOLD |
| `follows.write` | HOLD |
| `dm.read` | HOLD |
| `dm.write` | HOLD |
| `like.write` | HOLD |
| `bookmark.read` | HOLD |
| `bookmark.write` | HOLD |
| Any other write scope | HOLD |

Each write scope requires a separate explicit human GO before being requested.

---

## Scope Escalation Policy

```text
- do not request write scopes during read-only setup
- scope changes require a new OAuth flow + human GO
- narrow scope is always preferred over broad scope
- if a new scope is needed, stop and request human GO first
```

---

## Rate Limit Policy

X API has endpoint-level rate limits (HTTP 429 on exceed).

```text
rules:
  - check rate limit header before each call
  - stop on 429 — do not retry without human GO
  - do not run polling loops
  - do not batch calls beyond approved run count
```

---

## Token Rotation Policy

Revoke and rotate immediately if:

```text
- token appears in any chat/log/commit/screenshot
- unexpected API call occurs using the token
- token was used in a scope beyond approved
- token file was accidentally staged
- account behavior changes unexpectedly
```

After rotation:
- update local token storage only
- record rotation date in evidence (not the token value)
- do not commit new token

---

## Developer Guidelines Compliance

X API usage must comply with X Developer Platform guidelines.
Violations may result in app suspension, API access revocation, or account suspension.

Prohibited:
- using API to generate spam or manipulate engagement
- bulk data collection without authorization
- scraping beyond API-approved scope
- any automated action that violates X Terms of Service

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
token_created:      false
token_stored:       false
token_committed:    false
password_shared:    false
```
