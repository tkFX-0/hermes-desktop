# iPhone Private Console — Phase 2B Design
date: 2026-05-15
status: design_draft — not implemented
phase: 2B

---

## 1. Purpose

Enable MobileConsole to receive real Shikishima status through a
local redacted-only snapshot path, replacing the static default
snapshot built in Phase 2A.

Phase 2B is the first step that touches live Shikishima state.
It must not expose execution, mutation, or network surface.

---

## 2. Why Phase 2B Is Needed

Phase 2A established the type system and redaction layer using static
hardcoded data. This data does not change as the app runs. Phase 2B
replaces the static source with a live redacted read from the real
Shikishima Control Center snapshot.

Without Phase 2B:
- MobileConsole always shows Phase 2A defaults (4/5 B3, static dates)
- No verification that safety invariants (HOLD/disabled/false) are
  actually live state

With Phase 2B:
- MobileConsole receives the real decision, execution, productionReady
  values from Shikishima's in-process state
- The redaction layer guarantees no raw values escape to the UI
- This creates the precondition for Session-009 iPhone observation

---

## 3. Phase 2A vs Phase 2B

| Aspect | Phase 2A | Phase 2B |
|---|---|---|
| Data source | Static hardcoded default | Live Shikishima snapshot |
| Network | None | IPC only (Phase 2B-1) / localhost optional (2B-2) |
| src/main changes | No | Yes (2B-1 and 2B-2) |
| Preload changes | No | Yes (2B-1) |
| Runtime data | No | Yes |
| Redaction layer | Defined | In use with live data |
| Risk level | LOW | MEDIUM (new IPC/API boundary) |

---

## 4. Local Real-Status Data Flow (target)

```
Shikishima main process state
  (Control Center snapshot / agent state / safety invariants)
           │
           ▼
  mobile-console-snapshot-service.ts
  (main process — builds MobileConsoleSnapshot from live state)
  (applies redaction before leaving main process)
           │
           ├─── Phase 2B-1: IPC channel ──────────────────────►
           │    mobile-console:get-redacted-snapshot           │
           │                                                    ▼
           │                                           MobileConsoleApp.tsx
           │                                           (renderer — displays only)
           │
           └─── Phase 2B-2: localhost GET (optional) ──────────►
                GET /mobile/status                              │
                (127.0.0.1 only — not LAN)                     ▼
                                                       Phase 2C: same-LAN iPhone
```

---

## 5. Recommended Architecture

**Conservative split:**

Phase 2B-1 — IPC-only read path (safer, no network):
- Main process builds redacted snapshot and exposes it via IPC
- Renderer calls IPC, displays live data
- No network surface added
- Proves redaction layer works with live data

Phase 2B-2 — localhost GET path (required for iPhone path):
- Main process runs a minimal HTTP server on 127.0.0.1 only
- One GET endpoint: /mobile/snapshot
- Not accessible from LAN (127.0.0.1 binding)
- No execution endpoints
- Requires separate implementation GO

Phase 2C — same-LAN access (Phase 2C scope, not Phase 2B):
- Rebind from 127.0.0.1 to LAN interface
- Add pairing token
- iPhone Safari access

Recommendation: Implement Phase 2B-1 first. It delivers live data
to the renderer without any network exposure. Phase 2B-2 adds the
network surface required for eventual iPhone access but is a
distinct risk level and requires its own GO.

---

## 6. API vs IPC Decision

| Path | Pros | Cons |
|---|---|---|
| IPC only (2B-1) | No network, Electron sandbox, easiest | Not accessible from iPhone Safari |
| localhost GET (2B-2) | iPhone-accessible path, standard HTTP | New network surface, CORS risk |
| WebSocket | Bidirectional, push updates | Complexity, execution risk |

Decision: IPC first (2B-1), then localhost GET (2B-2) in separate GO.
Never WebSocket in Phase 2 scope.

---

## 7. localhost-Only Policy (Phase 2B-2)

If a localhost HTTP server is added:
- Bind address: 127.0.0.1 exclusively
- Never 0.0.0.0 until Phase 2C pairing token is in place
- Port: configurable, default 3030 (non-privileged, avoid conflicts)
- No CORS wildcard (empty CORS header by default)
- CORS may be added only for Electron's own renderer origin
- No write methods (POST/PUT/PATCH/DELETE)
- GET only

---

## 8. Redacted-Only Policy

All data leaving the main process — whether via IPC or HTTP —
must pass through `buildMobileSnapshot()` from Phase 2A.

The redaction contract:
- No absolute paths
- No API keys or tokens
- No raw WSL slot names
- No environment variable values
- No local-only config values
- No command strings
- No secrets of any kind

If a field is unknown, output `"redacted"` or safe enum fallback.
`productionReady: false` and `rawValuesReported: false` are literal
types that cannot be overridden.

---

## 9. No-Execution Policy

Phase 2B adds a read path only. No endpoint may trigger any:
- git operation
- npm/npx operation
- Electron process spawn
- Hermes agent activation
- WSL command
- File write
- State mutation of any Shikishima variable

If a request arrives that would imply execution, return 405 Method Not Allowed.

---

## 10. No-Push, No-Level-3, No-ProductionReady Policy

These fields must never be mutable via the mobile console path:
- productionReady
- Level 3 status
- execution enabled flag
- decision (HOLD must remain unless separate safety gate opens)

There must be no endpoint, IPC channel, or side effect that changes
any of these values in response to a mobile console request.

---

## 11. Implementation Boundaries

| Layer | Phase 2B-1 allowed | Phase 2B-2 allowed | Forbidden always |
|---|---|---|---|
| src/main/mobile-console/ | Yes — snapshot service | Yes — local server | execution calls |
| src/preload/ | Yes — IPC handler | No additional | secret passthrough |
| src/renderer/MobileConsole/ | Yes — IPC call | Yes — fetch call | execution triggers |
| src/shared/mobile-console/ | Yes — type updates | Yes | raw value types |
| package.json | No | No | always |
| .github/workflows | No | No | always |

---

## 12. Risks

| Risk | Level | Mitigation |
|---|---|---|
| IPC channel exposes raw values | HIGH | Redaction layer mandatory before IPC send |
| localhost server binds to 0.0.0.0 | HIGH | Explicit bind to 127.0.0.1 only |
| CORS wildcard allows any origin | MEDIUM | No CORS header by default |
| Error response leaks stack trace or path | MEDIUM | Generic error handler, no passthrough |
| IPC handler accidentally triggers execution | HIGH | Handler is read-only, no side effects |
| Phase 2B-2 scope creep into Phase 2C | MEDIUM | Separate GO required for LAN rebind |

---

## 13. STOP Conditions

Stop immediately if:
- Any raw value appears in IPC response or HTTP response
- Any absolute path appears in any response
- Any API key, token, or secret appears in any response
- localhost server accidentally binds to 0.0.0.0
- Any execution endpoint responds
- Any write method responds with 2xx
- productionReady or execution fields become mutable

---

## 14. Human GO Boundaries

| Step | GO Required |
|---|---|
| Phase 2B-1 IPC implementation | Separate Phase 2B-1 GO |
| Phase 2B-2 localhost server | Separate Phase 2B-2 GO after 2B-1 review |
| Phase 2C LAN rebind + pairing | Separate Phase 2C GO after 2B-2 stable |
| Session-009 new B3 PASS | Time window GO after Phase 2C working |
| Any execution endpoint | Level 3+ + security GO (never in Phase 2) |

---

この範囲では問題を検出していません
