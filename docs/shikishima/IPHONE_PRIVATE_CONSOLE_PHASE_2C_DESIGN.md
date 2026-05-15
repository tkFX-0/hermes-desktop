# iPhone Private Console — Phase 2C Design
date: 2026-05-15
status: design_draft — implementation not approved

---

## 1. Purpose

Enable the user's iPhone Safari / PWA to view real redacted Shikishima status
over same-LAN without RustDesk.

Phase 2C is the bridge to new Session-009 clean B3 PASS #5.

---

## 2. Why Phase 2C Is Separate from Phase 2B-2

| Aspect | Phase 2B-2 | Phase 2C |
|---|---|---|
| Bind address | 127.0.0.1 only | LAN interface |
| iPhone access | Not possible | Yes (same Wi-Fi) |
| Authentication | None needed | Pairing token required |
| Network exposure | localhost only | LAN only (no public) |
| RustDesk needed | Still needed | No longer needed |

Phase 2B-2 established the server code safely.
Phase 2C activates same-LAN access with authentication.

---

## 3. Architecture

```text
Windows PC (home Wi-Fi)
┌────────────────────────────────────────────────────────┐
│  Electron App                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  MobileConsole settings: show pairing token      │  │
│  │  (token displayed in Electron UI only)           │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Phase 2C Server                                 │  │
│  │  bind: LAN IP (e.g. 192.168.x.x)                │  │
│  │  port: 3030                                      │  │
│  │  auth: Authorization: Bearer <pairing-token>    │  │
│  │  endpoints: GET /mobile/health + /status         │  │
│  └────────────────┬─────────────────────────────────┘  │
└───────────────────┼────────────────────────────────────┘
                    │ same Wi-Fi network
                    ▼
iPhone (Safari / PWA)
┌────────────────────────────────────────────────────────┐
│  http://[LAN_IP]:3030/mobile/status                    │
│  Authorization: Bearer <token>                         │
│  ─────────────────────────────────────────────────── │
│  Response: {                                           │
│    "decision": "HOLD",                                 │
│    "execution": "disabled",                            │
│    "productionReady": false,                           │
│    "rawValuesReported": false,                         │
│    "level3": "not_approved",                           │
│    "dataSource": "redacted_snapshot_phase2c_same_lan"  │
│  }                                                     │
└────────────────────────────────────────────────────────┘
```

---

## 4. Pairing Token Design

See IPHONE_PRIVATE_CONSOLE_PHASE_2C_PAIRING_TOKEN.md for full spec.

Summary:
- 32-byte hex string (64 chars) via `crypto.randomBytes(32)`
- In-memory only — not persisted to disk or git
- Shown in Electron Control Center / MobileConsole settings
- Required in `Authorization: Bearer <token>` header
- Rotates on app restart
- Never in any API response
- Never logged to raw docs
- Never committed to git

---

## 5. Allowed Bind Host Rules

```typescript
// Phase 2C: discover first non-loopback IPv4
import { networkInterfaces } from 'os';

function getLanIp(): string | null {
  for (const iface of Object.values(networkInterfaces())) {
    for (const addr of iface ?? []) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }
  }
  return null;
}
```

Must NOT use:
- `0.0.0.0` (binds to all interfaces)
- Hardcoded IP addresses
- Public internet interface

If no LAN IP found → server does not start, reports `lan_unavailable`.

---

## 6. Forbidden 0.0.0.0 Rule

```typescript
// assertBindHost is already enforced in Phase 2B-2
// Phase 2C extends this:

function assertPhase2cBindHost(host: string): void {
  if (host === '0.0.0.0' || host === '::') {
    throw new Error('phase2c:forbidden_bind_host:' + host);
  }
  if (host === '127.0.0.1') {
    throw new Error('phase2c:use_lan_ip_not_localhost');
  }
}
```

---

## 7. iPhone Safari Procedure

```text
1. Windows app running with Phase 2C enabled
2. iPhone on same Wi-Fi as Windows PC
3. User opens MobileConsole settings in Electron
4. Pairing token displayed in Electron UI (copy button)
5. User creates iPhone bookmark or PWA shortcut:
   URL: http://[LAN_IP]:3030/mobile/status
6. User sets up Authorization header via:
   - PWA initialization page (token setup flow)
   - Or browser extension (devtools)
   - Or token included in URL setup page (one-time only)
7. iPhone confirms status display:
   judgment: HOLD / execution: disabled / productionReady: false
8. No RustDesk needed
```

---

## 8. No RustDesk Requirement

Once Phase 2C is active:
- Session-009 B3 observation does NOT require RustDesk
- PC screen visual is NOT required
- iPhone Safari / PWA showing live redacted status is sufficient
- The human observer is the iPhone user (same person, different device)

---

## 9. Session-009 Eligibility (repeat from Phase 2C prep doc)

Session-009 may be counted as clean B3 PASS #5 when:
- Phase 2B-1 (IPC), Phase 2B-2 (module), Phase 2C (same-LAN) all complete
- iPhone shows live redacted snapshot from Phase 2C source
- `decision=HOLD / execution=disabled / productionReady=false` confirmed on iPhone
- No raw values visible on iPhone
- Human issues time_window GO (+30s rule)
- Launch (server enable) at least +30s after window start

---

## 10. STOP Conditions

```
STOP if:
  - Token visible in any API response
  - Token appears in git commit or doc
  - Server binds to 0.0.0.0
  - Raw values appear in API response
  - Absolute paths appear in API response
  - Execution endpoint responds
  - Push endpoint responds
  - iPhone can access without token (unauthenticated)
  - LAN IP hardcoded in source
  - package.json changed without approval
```

---

## 11. Rollback Plan

```bash
# Phase 2C server can be disabled by flipping:
MOBILE_CONSOLE_PHASE_2C_ENABLED = false

# Server module files are isolated in src/main/mobile-console/
# Removing Phase 2C does not affect Phase 2B-1 IPC path
# git revert <phase2c commit hash>
```

---

## 12. Evidence Format (Phase 5)

```text
iphone_observation:  PASS / STOP
device:              iPhone
network:             same-LAN
rustdesk_used:       false
decision_visible:    HOLD
execution_visible:   disabled
productionReady_visible: false
raw_values_visible:  false
level3_visible:      not_approved
dataSource_visible:  redacted_snapshot_phase2c_same_lan
pairing_token_raw:   [not reported]
lan_ip_raw:          [not reported]
```

---

この範囲では問題を検出していません
