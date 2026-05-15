# iPhone Private Console — Phase 2C Same-LAN Prep
date: 2026-05-15
status: design_draft — not implemented
prerequisite: Phase 2B-1 and 2B-2 stable

---

## 1. Why Phase 2C Is Separate

Phase 2B-2 binds to 127.0.0.1 (localhost only).
Phase 2C rebinds to the LAN interface so iPhone on the same Wi-Fi
can reach the snapshot endpoint.

This is a distinct security boundary:
- Phase 2B: no network exposure beyond localhost
- Phase 2C: LAN-accessible endpoint with authentication

Mixing these phases risks forgetting auth before exposing to LAN.
They must be implemented and approved separately.

---

## 2. Pairing Token Requirement

Before Phase 2C binds to the LAN interface, a pairing token
must be in place.

Pairing token specification:
- Generated with `crypto.randomBytes(32).toString('hex')` on app start
- Displayed ONLY in the Electron Control Center UI (never in API response)
- Required in every Phase 2C+ request: `Authorization: Bearer <token>`
- Rotates on app restart
- Never stored in source code, env files, or logs
- Never included in mobile API responses

Without the pairing token, Phase 2C MUST NOT bind to LAN interface.

---

## 3. Bind Address Requirement

Phase 2B-2: `server.listen(port, '127.0.0.1')`
Phase 2C: `server.listen(port, lanIpAddress)` — only after token in place

LAN IP must be discovered dynamically (not hardcoded):
```typescript
import { networkInterfaces } from 'os';
// find first non-loopback IPv4 address
```

Do NOT hardcode a private IP in source code.

---

## 4. URL Access Options for iPhone

### Option A — Manual URL entry
User reads the LAN IP from the Windows host (Control Center displays it),
types it into iPhone Safari:
```
http://192.168.x.x:3030/mobile/status
```
With Authorization header (tricky in Safari without app or shortcut).

### Option B — QR code in Control Center
Control Center displays a QR code containing the LAN URL.
iPhone scans with camera app, opens in Safari.
The Authorization header challenge remains.

### Option C — PWA with pre-loaded token
A local HTML page served from the Windows host includes the
pairing token as a JavaScript variable (shown only while on LAN).
iPhone visits once, saves as Home Screen app.

Recommendation: Option B (QR) for the URL, plus Option C (PWA with
token pre-loaded) for auth. Details to be finalized in Phase 2C GO.

---

## 5. iPhone Safari Check Procedure (target)

```
1. Windows app running (Electron or server mode)
2. iPhone on same Wi-Fi network
3. User scans QR code from Control Center
4. Safari opens: http://192.168.x.x:3030/mobile/status
5. Authorization header sent (via PWA/shortcut mechanism)
6. Response: JSON with decision=HOLD, execution=disabled, etc.
7. iPhone MobileConsole PWA loads real snapshot
8. Human visually confirms all safety labels
```

No RustDesk required for this procedure.

---

## 6. No RustDesk Requirement

Once Phase 2C is working, Session-009 does NOT require:
- RustDesk
- PC screen observation
- Remote desktop of any kind

The iPhone Private Console replaces PC screen observation for B3
status confirmation purposes.

---

## 7. STOP Conditions for Phase 2C

Stop immediately if:
- Server binds to LAN interface without pairing token in place
- Pairing token appears in any API response
- Pairing token appears in any log output
- Any execution endpoint responds on LAN
- Any absolute path appears in response
- Any raw value appears in response

---

## 8. Session-009 Eligibility Criteria

The new Session-009 (iPhone observation) may be counted as
**clean B3 PASS #5** when ALL of the following are true:

```
[ ] Phase 2B-1 implemented and tested
[ ] Phase 2B-2 implemented and tested (localhost server)
[ ] Phase 2C implemented and tested (LAN + pairing token)
[ ] iPhone on same Wi-Fi can reach /mobile/status
[ ] iPhone displays response with:
      decision:         HOLD
      execution:        disabled
      productionReady:  false
      rawValuesReported: false
      level3:           not_approved
      dataSource:       redacted_snapshot_phase2b (or 2c)
[ ] No raw values visible on iPhone screen
[ ] No secrets visible on iPhone screen
[ ] Human explicitly issues time_window GO (+30s rule)
[ ] Launch occurs at least +30 seconds after window start
[ ] Human observes iPhone screen (not PC screen)
[ ] Human reports PASS
```

**What does NOT count as B3 #5:**
- Phase 1 or 2A static UI display (no real data)
- PC screen observation via RustDesk (deprecated)
- Partially real data (some fields still static)

---

## 9. Phase 2C GO Template (not approved)

```
I explicitly approve Phase 2C same-LAN iPhone access implementation.

Prerequisites confirmed:
[ ] Phase 2B-2 localhost server stable and tested
[ ] Pairing token generation implemented (not yet LAN-exposed)

Approved scope:
  LAN interface binding (after pairing token in place)
  Pairing token display in Control Center
  QR code generation for LAN URL

Approved files:
  src/main/mobile-console/mobile-console-local-server.ts (updated)
  src/main/mobile-console/mobile-console-pairing.ts (new)
  src/renderer/src/screens/ControlCenterAppShell/* (pairing display only)

Forbidden:
  Binding before pairing token implemented
  Token in any API response
  Token in any log
  Execution endpoint
  Package changes beyond QR library approval
```

---

この範囲では問題を検出していません
