# XACC-00 X Account Integration Gate Design

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — docs only, no token, no OAuth, no X connection
**gate:** HOLD — all XACC gates require explicit human GO

---

## Purpose

X Account Integration is a future gate that lets Shikishima connect to a user-owned X account in controlled phases — starting with read-only access, escalating only with explicit human GO per phase.

Shikishima may (after appropriate GO):
- read posts, timelines, search results
- summarize content
- classify and draft responses
- generate post/reply drafts locally

Shikishima must not (without explicit Level 5 GO):
- post, reply, DM, like, follow, or retweet
- mutate account profile or settings
- share or store X password in any form
- expose OAuth tokens in logs, docs, or chat
- run autonomous polling without time_window GO
- enable execution or productionReady

---

## Core Rule

```text
Xアカウントのパスワードを渡すことは禁止。
連携は OAuth / API token / scope 限定 / local-only secret管理 で行う。

AIは作るところまで。
鍵と発射ボタンは人間。
```

---

## Recommended Account Strategy

Start with a dedicated sub-account for Shikishima testing, not the main account.
This limits blast radius if something goes wrong.

```text
recommended:    dedicated X sub-account (しきしま verification account)
main_account:   connect only after sub-account tests pass
```

---

## Required Phases

### XACC-00: Design only (this document)

```yaml
token:         none
oauth:         not started
x_connection:  none
package:       not installed
runtime:       not started
```

### XACC-01: Read-only auth scope readiness

```yaml
purpose:       design minimum OAuth 2.0 PKCE scope for read-only
scopes:        tweet.read, users.read
write_scopes:  HOLD
connection:    HOLD until XACC-01 GO
```

### XACC-02: One controlled read-only execution

```yaml
purpose:       search / read / summarize — one controlled run
allowed:       search, read, summarize, evidence
write:         forbidden
run_count:     1 per GO
gate:          explicit xacc_read_go required
```

### XACC-03: Draft-only post/reply generation

```yaml
purpose:       generate draft text locally — no X write
level:         1-4
write:         forbidden (draft local only)
```

### XACC-04: Human GO write

```yaml
purpose:       one approved post or reply
level:         5
write_count:   1 per GO
exact_content: human-approved verbatim
gate:          explicit xacc_write_go required
```

### XACC-05: Limited automation

```yaml
status:        DEFERRED — not approved
level:         5+
```

---

## Gate Sequence

| Gate | Action | Level | Status |
|---|---|---|---|
| XACC-00 | Design docs | docs | DESIGN (this doc) |
| XACC-01 | Read-only scope plan | docs | HOLD |
| XACC-02 | Read-only execution (1 run) | 5-ish | HOLD |
| XACC-03 | Draft generation (local) | 1-4 | HOLD (after XACC-02) |
| XACC-04 | Human GO write (1 post/reply) | 5 | HOLD |
| XACC-05 | Limited automation | 5+ | DEFERRED |

Each gate requires a separate explicit human GO.

---

## OAuth 2.0 PKCE Policy

X API uses OAuth 2.0 Authorization Code Flow with PKCE.

```text
flow:          OAuth 2.0 Authorization Code + PKCE
scopes:        minimized per phase (see XACC_01)
token_type:    Bearer / Refresh (offline.access scope only if needed)
token_storage: local-only ignored file or environment variable
password:      NEVER shared
```

Scope escalation is not automatic. Each new scope requires human GO.

---

## Rate Limit Awareness

X API has endpoint-level rate limits. Exceeding limits returns HTTP 429.

```text
policy:
  - check current rate limit before each run
  - stop if 429 is received
  - do not retry without human GO
  - do not run autonomous polling
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
token_created:      false
oauth_started:      false
x_connected:        false
x_write_performed:  false
post_sent:          false
```
