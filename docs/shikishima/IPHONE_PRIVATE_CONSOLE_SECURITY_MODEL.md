# iPhone Private Console — Security Model
date: 2026-05-15
status: design_draft — not implemented

---

## 1. Threat Model

The iPhone Private Console sits between the Shikishima host (Windows PC)
and the operator (human owner on iPhone). The primary threats are:

1. Raw value / secret leakage through the API
2. Unauthorized access to the console
3. Execution being triggered remotely
4. Network-level interception (LAN or tunnel)
5. Lost/stolen iPhone with active session
6. Tunnel misconfiguration exposing the console publicly

Attacker profiles considered:
- External network attacker (Phase 3 threat)
- LAN-local attacker (Phase 2 threat)
- Physical device theft (all phases)
- Prompt injection via API response (theoretical)

---

## 2. SSRF Risk

Risk: The mobile API server runs inside the Electron main process.
If the API proxies any user-supplied URL to a backend, SSRF is possible.

Mitigation:
- The mobile API must NOT proxy any URL supplied by the client
- All data comes from the in-process redacted snapshot producer
- No outbound HTTP calls triggered by mobile API requests
- The same validateRemoteUrl() pattern used in hermes.ts must apply
  to any future URL handling in the mobile API

Status: No SSRF risk in Phase 1 (no server). Phase 2 requires explicit
no-proxy enforcement in implementation.

---

## 3. Local Network Exposure Risk

Risk: If the API server binds to 0.0.0.0 without authentication,
any device on the LAN can read Shikishima state.

Mitigation:
- Phase 2 testing only: bind to 127.0.0.1 (localhost), confirm before LAN
- Phase 2 production: require pairing token in all requests
- Never bind to 0.0.0.0 without authentication
- Log all access attempts in Electron Control Center

Status: Phase 1 has no server (no risk). Phase 2 requires explicit binding
policy and auth before LAN exposure.

---

## 4. Authentication Risk

Risk: Weak or missing authentication allows unauthorized access.

Mitigation by phase:

Phase 2 — Pairing token:
- Generate cryptographically random token on app start (e.g. 6 words or 32 hex chars)
- Display in Electron Control Center UI only (never in URL, never in logs)
- Required in Authorization: Bearer <token> header for all requests
- Token rotates on app restart
- Token never stored in plaintext in source code or config files

Phase 3 — Tailscale:
- Tailscale provides device-level authentication
- Only enrolled devices can reach the host
- App-level token still recommended as defense-in-depth

Phase 3+ — Cloudflare Access (if chosen):
- Requires email/SSO gate before reaching the API
- Provides audit log
- TLS termination at Cloudflare edge

Recommendation: Start with pairing token (Phase 2). Add Tailscale (Phase 3).
Cloudflare only if remote access without Tailscale is needed.

---

## 5. Secret Leakage Risk

Risk: API response accidentally includes API keys, tokens, or local-only values.

Mitigation:
- Redaction layer is mandatory and must run on every response before send
- Redaction must be a function that strips known sensitive field names
- All API response types must be defined in TypeScript with forbidden fields absent
- Integration test: assert that known secret field names are absent from any response
- Never log API responses that contain raw snapshot data

Forbidden fields (must never appear in any API response):
```
apiKey, api_key, token, secret, password, privateKey, credential,
absolutePath, localPath, wslSlotName, distroName, rawConfig,
envValue, localOnlyValue, placeholderValue, hermesApiKey
```

---

## 6. Raw / Local-Only Value Leakage Risk

Risk: Snapshot data contains local-only values (WSL paths, distro names,
local config file contents) that must not leave the Windows host.

Mitigation:
- The redacted snapshot producer (in Electron main) must transform all
  raw values to safe enum labels before the data reaches the mobile API
- The mobile API must never read raw config files directly
- wsl2LocalValueValidationSummary must present counts and enums only
  (same policy as the existing Control Center IPC contract)

---

## 7. Tunnel / VPN Risk

Risk: Tunnel misconfiguration exposes the private console to the internet.

Mitigation:
- Phase 2 is LAN-only (no tunnel)
- Phase 3 tunnel choice requires separate security review GO
- Tailscale is preferred: no public IP, device enrollment required
- Cloudflare Tunnel requires Access policy (SSO gate) — not default-open
- Direct port forward on router: NOT recommended (no auth, no encryption)

Tunnel implementation GO template (draft — not approved):
```
I explicitly approve Phase 3 tunnel setup with:
- Tunnel type: [Tailscale / Cloudflare Tunnel + Access / other]
- Authentication: [device enrollment / Access policy / other]
- Allowed hosts: [iPhone only / named devices only]
- Forbidden: public anonymous access
```

---

## 8. iPhone Lost / Stolen Risk

Risk: Lost iPhone with active session allows attacker to read Shikishima state.

Mitigation:
- Session timeout: auto-expire after N minutes of inactivity (configurable)
- Token rotation on app restart (Windows host)
- iPhone Face ID / passcode required (OS-level, not app-level)
- Pairing token visible only on Windows host — attacker needs Windows access
  to get a new token

Note: In Phase 1 (static UI), there is no session to expire.
Phase 2+ must implement session expiry.

---

## 9. Session Hijack Risk

Risk: Attacker intercepts pairing token in network traffic.

Mitigation:
- Phase 2 (LAN): Token in Authorization header, not in URL (not logged by default)
- Phase 3 (remote): HTTPS required (Tailscale provides TLS, Cloudflare provides HTTPS)
- LAN-only operation over HTTP is acceptable for Phase 2 on trusted home LAN
- Do not implement Phase 3 without HTTPS

---

## 10. Authentication Options Comparison

| Option | Phase | Risk | Setup Complexity | Recommended |
|---|---|---|---|---|
| No auth, localhost only | Phase 2 test | LOW (LAN-only) | None | Testing only |
| Pairing token (random, shown on Windows) | Phase 2 production | LOW | Minimal | YES for Phase 2 |
| Tailscale device auth | Phase 3 | VERY LOW | Moderate | YES for Phase 3 |
| Cloudflare Tunnel + Access policy | Phase 3+ | LOW (with policy) | Higher | Alternative to Tailscale |
| OAuth / external SSO | Phase 4+ | LOW | High | Not needed early |
| No auth, 0.0.0.0 binding | Never | HIGH | None | NEVER |

**Recommendation:** Pairing token for Phase 2. Tailscale for Phase 3.

---

## Required Security Invariants (all phases)

```
1. No execution endpoint exists
2. No raw values in any API response
3. No absolute local paths in any API response
4. No tokens/secrets in any API response
5. API binds to localhost or Tailscale interface only (never 0.0.0.0 without auth)
6. Pairing token never appears in URL
7. No productionReady mutation endpoint
8. No Level 3 mutation endpoint
9. No robot/voice/camera endpoint
10. Session expires after inactivity
```

---

この範囲では問題を検出していません
