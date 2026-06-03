# iPhone Private Console — Phase 2C Pairing Token Spec
date: 2026-05-15
status: design_draft — not implemented

---

## Purpose

The pairing token is the authentication mechanism for Phase 2C same-LAN access.
It ensures only the device owner can read Shikishima status from iPhone.

---

## Token Specification

| Property | Value |
|---|---|
| Format | Hex string |
| Source | `crypto.randomBytes(32).toString('hex')` |
| Length | 64 characters |
| Storage | In-memory only (never disk, never git) |
| Lifetime | Single app session (rotates on restart) |
| Entropy | 256 bits |

---

## Generation

```typescript
import { randomBytes } from 'crypto';

export function generatePairingToken(): string {
  return randomBytes(32).toString('hex');
}
```

---

## Storage Policy

```text
ALLOWED:
  - In-memory variable in main process
  - Displayed in Electron UI (Control Center / MobileConsole settings)
  - Provided to HTTP request handler for validation

FORBIDDEN:
  - Written to any file (local-values.json, .env, etc.)
  - Committed to git
  - Logged to console in raw form
  - Included in any API response
  - Included in IPC response (only token_present: boolean is allowed)
  - Included in any doc or transcript
```

---

## Display Policy

The pairing token MUST be shown ONLY in:
- Electron Control Center UI (on the Windows host)
- Or: MobileConsole settings tab (in the Electron app, not iPhone side)

The iPhone side NEVER shows the full token.

The token is NEVER:
- Shown in ClaudeCode transcript
- Pasted into docs
- Committed to git
- Shown in ChatGPT conversation

For reports, use only:
```text
pairing_token_present:      true/false
pairing_token_length_bucket: long (64 chars)
pairing_token_raw_reported:  false
```

---

## HTTP Authentication

Phase 2C server requires token in every request (except `/mobile/health`):

```text
Authorization: Bearer <64-char-hex-token>
```

Responses for invalid/missing token:
```json
{ "ok": false, "error": "unauthorized", "rawValuesReported": false }
```
HTTP status: 401

The token MUST NOT appear in any API response under any circumstance.

---

## iPhone Connection Flow

```text
1. User starts Electron app (Phase 2C enabled)
2. App generates token in memory
3. User opens MobileConsole settings tab in Electron
4. Token shown with [Show] toggle button
5. User copies token
6. User navigates iPhone Safari to:
   http://[LAN_IP]:3030/mobile/setup
7. Setup page accepts token via form (not URL parameter)
8. Token stored in iPhone browser localStorage
9. PWA reads token from localStorage for subsequent requests
10. Main status: GET /mobile/status with Authorization: Bearer <token>
```

Note: Token in URL (`?token=...`) is NOT recommended (URL history risk).
Prefer form-based or localStorage-based token storage.

---

## Token Rotation

Token is NOT rotated automatically during a session.
Token DOES rotate when:
- App restarts
- User explicitly requests rotation (future feature)

After rotation, iPhone localStorage token becomes invalid and re-pairing is needed.

---

## Security Properties

| Property | Phase 2B-2 | Phase 2C |
|---|---|---|
| Network | localhost only | LAN (same Wi-Fi) |
| Auth required | No | Yes (pairing token) |
| Token entropy | N/A | 256 bits |
| Token lifetime | N/A | 1 session |
| CORS | None | None (or explicit narrow) |
| Brute force risk | None (localhost) | LOW (token space = 2^256) |

---

この範囲では問題を検出していません
