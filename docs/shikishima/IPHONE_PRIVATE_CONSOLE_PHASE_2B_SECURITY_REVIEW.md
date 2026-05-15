# iPhone Private Console — Phase 2B Security Review
date: 2026-05-15
status: design_draft — not implemented

---

## 1. localhost Exposure Risk

**Risk:** Even 127.0.0.1 endpoints are reachable by any process on
the same Windows machine.

**Impact:** Other local apps could read Shikishima status.

**Mitigation:**
- localhost is acceptable for Phase 2B because the response is
  redacted-only (no secrets, no raw values)
- Reading status is not execution — an attacker learns HOLD/disabled/false
  which is not sensitive
- Phase 2C adds pairing token before LAN exposure

**Residual risk:** LOW for Phase 2B (read-only, redacted)

---

## 2. LAN Exposure Risk

**Risk:** If server accidentally binds to 0.0.0.0, any device on the
LAN can reach the snapshot endpoint.

**Impact:** MEDIUM — status readable by LAN devices without auth

**Mitigation:**
- Explicit `listen(port, '127.0.0.1')` call in implementation
- Integration test: assert server does not respond on LAN interface
- Phase 2C required before LAN rebind

**Residual risk:** HIGH if bind not enforced — this must be verified
in implementation review.

---

## 3. Browser Access Risk

**Risk:** A browser tab on the same machine could fetch
`http://127.0.0.1:3030/mobile/snapshot` if the user visits a
malicious page.

**Impact:** Status data exposed to the page's JavaScript.

**Mitigation:**
- No CORS header: browser enforces same-origin policy, so cross-origin
  fetch is blocked by default
- Do NOT add `Access-Control-Allow-Origin: *`
- Only add CORS for Electron's own renderer origin if needed

**Residual risk:** LOW with no CORS header

---

## 4. CORS Risk

**Risk:** `Access-Control-Allow-Origin: *` would allow any website to
read the snapshot via browser.

**Mitigation:**
- Default: no CORS header
- If CORS is needed for Electron renderer: add exact Electron origin only
  (`app://` or `file://` scheme, not wildcard)
- Never add wildcard CORS in Phase 2B or Phase 2C

**Implementation rule:**
```typescript
// NEVER do this:
// res.setHeader('Access-Control-Allow-Origin', '*');

// If needed for renderer, do this:
// res.setHeader('Access-Control-Allow-Origin', 'app://.');
```

---

## 5. SSRF Risk

**Risk:** The mobile console server could be tricked into making
outbound requests to internal services if it proxies any URL.

**Mitigation:**
- The server must NOT proxy any client-supplied URL
- All responses come from in-process `buildMobileSnapshot()` only
- No `fetch()` or `http.request()` triggered by incoming requests
- Same pattern as `validateRemoteUrl()` in hermes.ts

**Residual risk:** None if server is pure read-only.

---

## 6. Token Leakage Risk

**Risk:** Pairing token (Phase 2C) or other tokens appear in responses.

**Mitigation (Phase 2B):**
- No pairing token exists in Phase 2B
- `buildMobileSnapshot()` strips all token-pattern fields
- `isForbiddenField()` catches `token`, `apiKey`, `secret`, etc.

**Residual risk:** LOW — token not added until Phase 2C

---

## 7. Raw Value Leakage Risk

**Risk:** Live Shikishima snapshot contains raw local-only values
(WSL paths, distro names, API keys) that must not reach mobile UI.

**Impact:** HIGH if raw values appear

**Mitigation:**
- Mandatory: `buildMobileSnapshot()` runs on every response
- Forbidden fields list covers all known sensitive field names
- Any unknown field defaults to `"redacted"`
- Integration test: assert no forbidden field names in response

**Required test (future):**
```typescript
const snapshot = await getRedactedSnapshot();
for (const key of FORBIDDEN_FIELD_PATTERNS) {
  expect(JSON.stringify(snapshot)).not.toMatch(key);
}
```

---

## 8. Electron Main Process Risk

**Risk:** The IPC handler runs in the main process with full Node.js
access. A bug could expose filesystem, run commands, etc.

**Mitigation:**
- IPC handler is read-only: it calls `buildMobileSnapshot()` and returns
- No `execFile`, `spawn`, `exec`, `fs.readFile` in the handler path
- Handler does not accept any parameters from renderer (no input surface)
- Code review required before Phase 2B-1 GO

---

## 9. Renderer Trust Boundary

**Risk:** The renderer is sandboxed but can call IPC. If renderer is
compromised (e.g., via XSS in AI content), IPC could be misused.

**Mitigation:**
- Renderer can only invoke `mobile-console:get-redacted-snapshot`
- This channel returns data only — no state mutation possible
- Context isolation is enabled (standard Electron practice)

---

## 10. Future Tailscale Risk

**Risk:** If Tailscale is added in Phase 2D without auth, the snapshot
becomes reachable from any enrolled device.

**Mitigation:**
- Phase 2D requires its own security GO
- Pairing token from Phase 2C is the minimum auth before Tailscale
- Tailscale device enrollment is an additional layer

---

## Security Invariant Checklist (must pass before Phase 2B-1 GO)

```
[ ] IPC handler is read-only (no state mutation)
[ ] buildMobileSnapshot() called on every IPC response
[ ] No forbidden fields in IPC response (tested)
[ ] productionReady always false in response
[ ] rawValuesReported always false in response
[ ] execution always "disabled" in response
```

## Security Invariant Checklist (must pass before Phase 2B-2 GO)

```
[ ] Server binds to 127.0.0.1 only (tested)
[ ] No CORS wildcard
[ ] No write methods respond with 2xx
[ ] No stack traces in error responses
[ ] No absolute paths in any response
[ ] No env values in any response
[ ] GET /mobile/execute returns 404
[ ] GET /mobile/push returns 404
[ ] GET /mobile/approve returns 404
```

---

この範囲では問題を検出していません
