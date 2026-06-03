# iPhone Private Console — Phase 2C Same-LAN Checklist
date: 2026-05-15
status: design_draft

---

## Pre-Implementation Checklist

```
[ ] Phase 2B-1 IPC path working (d51f498 pushed)
[ ] Phase 2B-2 server module complete (50d414c pushed)
[ ] Phase 2C design reviewed by human
[ ] Phase 2C pairing token spec reviewed
[ ] No 0.0.0.0 binding anywhere in proposed code
[ ] Pairing token generation uses crypto.randomBytes
[ ] Token not persisted to disk
[ ] Token not committed to git
[ ] LAN IP discovered dynamically (not hardcoded)
[ ] GET-only endpoints confirmed
[ ] No execution/push/Level3 endpoints
[ ] typecheck: 0 errors
[ ] Human issues Phase 2C implementation GO
```

---

## Implementation Checklist

```
[ ] mobile-console-pairing.ts created
    [ ] generatePairingToken() uses crypto.randomBytes(32)
    [ ] token stored in-memory only
    [ ] getTokenForValidation() returns token for HTTP check
    [ ] isTokenValid() validates bearer token
    [ ] no raw token in any log line

[ ] mobile-console-local-server.ts updated
    [ ] validateBearerToken() added
    [ ] /mobile/health exempted from auth (connectivity check)
    [ ] /mobile/ui serves paired read-only HTML without embedding token
    [ ] /mobile/ui lets iPhone Safari send Bearer token to /mobile/snapshot
    [ ] /mobile/status requires valid token
    [ ] /mobile/snapshot requires valid token
    [ ] 401 response on invalid/missing token
    [ ] token never in error response

[ ] Phase 2C activation module created
    [ ] discoverLanIp() uses os.networkInterfaces()
    [ ] assertPhase2cBindHost() rejects 0.0.0.0 and localhost
    [ ] startPhase2cServer() starts on LAN IP with pairing token
    [ ] MOBILE_CONSOLE_PHASE_2C_ENABLED = false by default

[ ] main/index.ts updated
    [ ] Phase 2C server started only if ENABLED flag is true
    [ ] disabled by default
    [ ] Phase 2C LAN IP shown in Console output (not raw in transcript)

[ ] MobileConsole settings updated
    [ ] pairing_token_present: shown (not raw token by default)
    [ ] show/hide toggle for token (in Electron UI only)
    [ ] LAN connection URL shown (http://[LAN_IP]:3030)
    [ ] connection status shown
```

---

## iPhone Connection Checklist (Phase 5)

```
[ ] Windows app running with Phase 2C enabled
[ ] iPhone on same Wi-Fi network as Windows PC
[ ] Pairing token manually entered in /mobile/ui
[ ] iPhone Safari navigated to /mobile/ui
[ ] Token entered in form (not URL param, not persisted)
[ ] iPhone confirms GET /mobile/snapshot via Bearer header:
    [ ] decision: HOLD visible
    [ ] execution: disabled visible
    [ ] productionReady: false visible
    [ ] rawValuesReported: false visible
    [ ] level3: not_approved visible
    [ ] B3: 4/5 visible before Session-009
    [ ] Session-009: not countable visible before separate time_window GO
    [ ] dataSource: redacted_snapshot_phase2c_same_lan visible
[ ] No raw values visible
[ ] No token visible in response
[ ] No absolute paths visible
```

---

## Session-009 Eligibility Checklist

```
[ ] Phase 2C iPhone connection confirmed (Phase 5 PASS)
[ ] Human issues Session-009 time_window GO
[ ] Server activation at least +30s after window start
[ ] iPhone observation:
    [ ] decision = HOLD visible
    [ ] execution = disabled visible
    [ ] productionReady = false visible
    [ ] raw_values = hidden visible
    [ ] Level 3 = not_approved visible
[ ] RustDesk NOT used
[ ] PC screen NOT required
[ ] Human reports PASS or STOP
```

---

## Post-Session Checklist

```
[ ] Session-009 evidence doc created
[ ] B3 5/5 acceptance record created
[ ] Phase 2C server disabled or left as-is
[ ] No new raw values in any doc
[ ] Token rotation if needed
[ ] Push readiness check for evidence docs
[ ] Push GO issued
```

---

この範囲では問題を検出していません
