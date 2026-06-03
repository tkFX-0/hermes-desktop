# iPhone Private Console — API Contract
date: 2026-05-15
status: design_draft — not implemented
phase: Phase 2 (local API — not Phase 1)

---

## General Rules

- All endpoints: GET only (Phase 1-5)
- Authentication: Authorization: Bearer <pairing-token> (Phase 2+)
- Response format: JSON, UTF-8
- Binding: 127.0.0.1 or Tailscale interface only (NEVER 0.0.0.0 without auth)
- All responses pass through redaction layer before send
- No execution endpoint exists in Phase 1-5

---

## GET /mobile/status

**Purpose:** Overall Shikishima safety state.

```json
{
  "decision": "HOLD",
  "execution": "disabled",
  "productionReady": false,
  "rawValuesReported": false,
  "level3": "not_approved",
  "robotMotion": "HOLD",
  "appStatus": "[enum label]",
  "generatedAtUnixMs": 1234567890000,
  "blockersCount": 0,
  "warningsCount": 0,
  "nextRecommendedGoal": "[redacted summary]",
  "bridgeReadinessLabel": "[label]"
}
```

**Redaction requirements:**
- No absolute paths
- No API keys
- No raw config values
- All labels are enum strings or safe summaries

**Forbidden fields:** apiKey, token, secret, absolutePath, rawConfig

**STOP condition:** If decision != "HOLD" or execution != "disabled",
the server must return 503 with body `{"status":"safety_invariant_violation"}`.

---

## GET /mobile/b3-progress

**Purpose:** B3 session clean PASS progress.

```json
{
  "cleanB3Pass": {
    "current": 4,
    "required": 5,
    "nextSession": "Session-009",
    "timingRule": "window_start_plus_30_seconds"
  },
  "recentSessions": [
    { "id": "Session-007", "result": "CLEAN_B3_PASS", "date": "2026-05-14" },
    { "id": "Session-008", "result": "PASS_WITH_TIMING_CAVEAT", "date": "2026-05-15" },
    { "id": "Session-009", "result": "STOP", "date": "2026-05-15" }
  ],
  "level3Status": "not_approved",
  "level3Prerequisites": {
    "b3CleanPassRequired": 5,
    "b3CleanPassCurrent": 4,
    "humanGoRequired": true
  }
}
```

**Forbidden fields:** timeWindow raw values, session logs with paths

---

## GET /mobile/go-drafts

**Purpose:** Pre-generated GO template text for human to copy.

```json
{
  "drafts": [
    {
      "id": "session-009-go",
      "label": "Session-009 GO テンプレート",
      "text": "I explicitly approve this one Level B3 daily operation session only.\n\nApproved session:\nshikishima-session-2026-05-15-009\n\nApproved time_window:\n2026-05-15 HH:MM-HH:MM JST\n..."
    },
    {
      "id": "push-go",
      "label": "Push GO テンプレート",
      "text": "I explicitly approve git push for commit [HEAD] only.\n..."
    }
  ],
  "note": "copy only — no automatic execution"
}
```

**Redaction requirements:**
- No secrets embedded in template text
- No raw API keys
- time_window shown as `HH:MM-HH:MM` placeholder (human fills in)

---

## GET /mobile/evidence-summary

**Purpose:** Recent operations and evidence.

```json
{
  "recentAuditItems": [
    {
      "timestamp": "2026-05-15T11:07:00+09:00",
      "event": "Session-009 STOP — unexpected_external_operation",
      "safeLabel": "STOP"
    }
  ],
  "approvalQueueCount": 0,
  "auditLogCount": 12,
  "memoryCandidateCount": 3
}
```

**Forbidden fields:** raw paths, secrets, local-only values in event descriptions

---

## GET /mobile/stop-history

**Purpose:** STOP event log.

```json
{
  "stops": [
    {
      "sessionId": "shikishima-session-2026-05-15-009",
      "stopType": "unexpected_external_operation_appeared",
      "timestamp": "2026-05-15T11:07:00+09:00",
      "classified": true,
      "safeRemediationCompleted": false
    },
    {
      "sessionId": "shikishima-session-2026-05-15-002",
      "stopType": "raw_value_visible",
      "timestamp": "2026-05-15T21:17:00+09:00",
      "classified": true,
      "safeRemediationCompleted": true
    }
  ]
}
```

---

## GET /mobile/push-readiness

**Purpose:** Current push state.

```json
{
  "branch": "main",
  "head": "2e41032",
  "originMain": "2e41032",
  "commitsAhead": 0,
  "stagedFilesCount": 0,
  "modifiedTrackedCount": 0,
  "recommendation": "nothing_to_push",
  "pushGoRequired": true,
  "note": "push GO must be issued separately — this console cannot push"
}
```

**Forbidden fields:** full commit hashes beyond 7 chars is acceptable,
but never raw credentials or signing keys.

---

## GET /mobile/agent-team

**Purpose:** 10-agent status overview.

```json
{
  "schedulerEnabled": false,
  "agents": [
    {
      "id": "supervisor",
      "labelJa": "統括スーパーバイザ",
      "enabled": false,
      "dryRunOnly": true,
      "requiresUserApproval": true,
      "autoRun": false,
      "autoApprove": false
    }
  ],
  "blockerCountApprox": 0,
  "warningCountApprox": 0
}
```

---

## Forbidden Endpoints (must never exist in Phase 1-5)

```
POST   /mobile/*          — no write operations
PUT    /mobile/*          — no mutation
DELETE /mobile/*          — no deletion
GET    /mobile/execute    — BLOCK
GET    /mobile/push       — BLOCK
GET    /mobile/approve    — BLOCK
GET    /mobile/level3     — BLOCK
GET    /mobile/voice      — BLOCK
GET    /mobile/robot      — BLOCK
GET    /mobile/secret     — BLOCK
GET    /mobile/rawconfig  — BLOCK
WS     /mobile/*          — no WebSocket in Phase 1-5
```

---

## Error Response Format

```json
{
  "error": "not_found",
  "message": "Endpoint does not exist",
  "rawValuesReported": false
}
```

Never include stack traces, file paths, or internal state in error responses.

---

この範囲では問題を検出していません
