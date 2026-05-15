# iPhone Private Console — Phase 2B API Boundary
date: 2026-05-15
status: design_draft — not implemented

---

## IPC Channel (Phase 2B-1)

### `mobile-console:get-redacted-snapshot`

**Purpose:** Renderer requests a redacted MobileConsoleSnapshot from
the main process without any network exposure.

**Direction:** renderer → main (invoke), main → renderer (response)

**Allowed response:**
```json
{
  "decision": "HOLD",
  "execution": "disabled",
  "productionReady": false,
  "rawValuesReported": false,
  "level3": "not_approved",
  "robotMotion": "HOLD",
  "appStatus": "initialized",
  "phase": "iphone_private_console_phase_2b",
  "dataSource": "redacted_snapshot_phase2b",
  "b3Progress": {
    "current": 4,
    "required": 5,
    "nextSession": "Session-009",
    "timingRule": "window_start_plus_30_seconds",
    "rustDeskDeprecated": true
  },
  "pushReadiness": {
    "branch": "main",
    "headShort": "dbb26c7",
    "originMainShort": "dbb26c7",
    "commitsAhead": 0,
    "stagedFiles": 0,
    "dirtyTracked": 0,
    "recommendation": "nothing_to_push"
  },
  "agentTeam": {
    "schedulerEnabled": false,
    "blockerCount": 0,
    "warningCount": 0
  },
  "generatedAt": "2026-05-15T00:00:00+09:00"
}
```

**Forbidden fields in response:**
```
apiKey, api_key, token, secret, password, privateKey, credential,
absolutePath, localPath, wslSlotName, distroName, rawConfig,
envValue, localOnlyValue, rawJson, command, exec, shell,
gitRemoteWithToken, hermesApiKey, process.env.*
```

**Redaction requirements:**
- Pass all data through `buildMobileSnapshot()` before IPC send
- Never pass raw ControlCenter snapshot directly
- agentTeam.agents array: id + labelJa + safety flags only

**STOP condition:**
- Any forbidden field present → reject and return error response
- Any execution side effect triggered → STOP

**Test expectations:**
- IPC handler returns MobileConsoleSnapshot shape
- `productionReady` is always `false`
- `rawValuesReported` is always `false`
- `execution` is always `"disabled"`

---

## HTTP Endpoints (Phase 2B-2 — localhost only)

### `GET /mobile/health`

**Purpose:** Health check / connectivity test.

**Binding:** 127.0.0.1 only

**Response:**
```json
{ "status": "ok", "phase": "2b", "rawValuesReported": false }
```

**Forbidden fields:** all sensitive fields
**No auth required** (localhost-only, no LAN in Phase 2B)

---

### `GET /mobile/snapshot`

**Purpose:** Full redacted snapshot for MobileConsole display.

**Binding:** 127.0.0.1 only

**Response:** same shape as IPC response above

**Redaction requirements:** identical to IPC — buildMobileSnapshot() mandatory

**Forbidden fields:** identical to IPC list

**STOP condition:**
- Response contains any forbidden field → reject before send
- Bind address is not 127.0.0.1 → STOP (do not respond)

---

### `GET /mobile/status`

**Purpose:** Minimal safety status for quick check.

**Binding:** 127.0.0.1 only

**Response:**
```json
{
  "decision": "HOLD",
  "execution": "disabled",
  "productionReady": false,
  "rawValuesReported": false,
  "level3": "not_approved",
  "dataSource": "redacted_snapshot_phase2b"
}
```

**Note:** This is the minimum viable response for Session-009 eligibility
check — if iPhone shows these 4 fields from real data, B3 #5 is countable.

---

## Forbidden Endpoints (must never exist)

```
POST  /mobile/*        — no mutation
PUT   /mobile/*        — no mutation
PATCH /mobile/*        — no mutation
DELETE /mobile/*       — no deletion
GET   /mobile/execute  — BLOCK
GET   /mobile/push     — BLOCK
GET   /mobile/approve  — BLOCK
GET   /mobile/level3   — BLOCK
GET   /mobile/secret   — BLOCK
GET   /mobile/config   — BLOCK (raw config risk)
WS    /mobile/*        — no WebSocket in Phase 2B
```

---

## Error Response Contract

All error responses must use this format:

```json
{
  "error": "not_found",
  "rawValuesReported": false
}
```

Never include:
- Stack traces
- File paths
- Internal variable names
- Error messages from Node.js that contain paths
- Raw exception messages

---

## Phase 2C Extension Point

When Phase 2C (same-LAN) is approved, the same endpoints extend by:
1. Rebinding from 127.0.0.1 to LAN interface
2. Adding `Authorization: Bearer <pairing-token>` requirement
3. Adding pairing token generation + display in Control Center UI

Phase 2B endpoints must be designed so Phase 2C can add auth
without changing the response schema.

---

この範囲では問題を検出していません
