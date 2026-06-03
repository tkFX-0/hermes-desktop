# iPhone Private Console — Phase 2B Implementation GO Draft
date: 2026-05-15
status: draft — NOT approved
note: These are candidates only. No source file is approved by this design task.

---

## This document does NOT approve Phase 2B implementation.

Each gate below requires a separate explicit human GO.

---

## Candidate Files (not approved — design only)

```
src/main/mobile-console/
  mobile-console-snapshot-service.ts   ← builds redacted snapshot from live state
  mobile-console-ipc-handler.ts        ← registers IPC channel (2B-1)
  mobile-console-local-server.ts       ← localhost HTTP server (2B-2)
  mobile-console-security.ts           ← bind validation, header policy
  index.ts

src/preload/
  mobile-console.ts                    ← exposes IPC invoke to renderer (2B-1)
  index.ts / index.d.ts               ← updated type declarations

src/renderer/src/screens/MobileConsole/
  MobileConsoleApp.tsx                 ← replace static snapshot with IPC/fetch call

src/shared/mobile-console/
  mobile-console-types.ts             ← minor type updates if needed
```

---

## Gate 1: Phase 2B-1 — IPC-only Read Path

**Purpose:** Renderer gets live redacted snapshot via IPC. No network.

**Allowed files (if GO issued):**
```
src/main/mobile-console/mobile-console-snapshot-service.ts
src/main/mobile-console/mobile-console-ipc-handler.ts
src/main/mobile-console/index.ts
src/preload/mobile-console.ts
src/preload/index.ts (IPC registration only)
src/preload/index.d.ts (type declaration update only)
src/renderer/src/screens/MobileConsole/MobileConsoleApp.tsx
```

**Forbidden files:**
```
mobile-console-local-server.ts (Phase 2B-2)
Any file outside above list
package.json / package-lock.json
.github/workflows/
```

**Allowed commands (after GO):**
```
npm run typecheck:web
npm run typecheck:node
npm test
```

**Expected tests:**
- IPC handler returns MobileConsoleSnapshot shape
- productionReady is always false
- rawValuesReported is always false
- No forbidden fields in response

**STOP conditions:**
- IPC handler causes any state mutation
- Any forbidden field appears in response
- Any execution side effect in handler

**Rollback plan:**
```
git revert <2B-1 commit hash>
All new files isolated in src/main/mobile-console/ — safe to remove
```

**Human GO boundary:** Phase 2B-1 GO (separate from this design task)

---

## Gate 2: Phase 2B-2 — localhost GET Path

**Purpose:** Main process exposes localhost-only HTTP endpoint.
Required for eventual iPhone access path.

**Allowed files (if GO issued):**
```
src/main/mobile-console/mobile-console-local-server.ts
src/main/mobile-console/mobile-console-security.ts
src/main/mobile-console/index.ts (updated)
```

**Forbidden files:**
```
LAN-binding code (Phase 2C)
Any pairing token implementation (Phase 2C)
package.json (no new HTTP library unless approved)
```

**Allowed commands (after GO):**
```
npm run typecheck:node
npm test
```

**Expected tests:**
- Server listens on 127.0.0.1 only
- GET /mobile/status returns redacted snapshot
- GET /mobile/health returns ok
- GET /mobile/execute returns 404
- POST /mobile/status returns 405
- Response contains no forbidden fields
- Server does NOT respond on 0.0.0.0:port

**STOP conditions:**
- Server binds to 0.0.0.0
- Any write method returns 2xx
- Any forbidden field in response
- Execution triggered by request

**Rollback plan:**
```
git revert <2B-2 commit hash>
Local server code is isolated — safe to remove
```

**Human GO boundary:** Phase 2B-2 GO (after Phase 2B-1 stable)

---

## Gate 3: Phase 2B-3 — Renderer/MobileConsole Live Wiring

**Purpose:** MobileConsoleApp switches from static snapshot to live IPC
or localhost fetch call based on context (Electron vs browser).

**Allowed files (if GO issued):**
```
src/renderer/src/screens/MobileConsole/MobileConsoleApp.tsx
src/renderer/src/screens/MobileConsole/useMobileSnapshot.ts (new hook)
```

**Pattern:**
```typescript
// In Electron context: use IPC
// In browser context (Phase 2C): use fetch('http://127.0.0.1:3030/mobile/snapshot')
// Fallback: use static default from Phase 2A
```

**STOP conditions:**
- Renderer calls any execution IPC
- Renderer calls any non-mobile-console IPC for this purpose

**Human GO boundary:** Phase 2B-3 GO (after Phase 2B-1 and 2B-2 stable)

---

## Gate 4: Phase 2B-4 — Test / Typecheck / Evidence

**Purpose:** Record evidence that Phase 2B works safely.

**Allowed commands:**
```
npm run typecheck:web
npm run typecheck:node
npm test
```

**Evidence required:**
- typecheck: 0 errors
- All Phase 2B tests pass
- Security checklist from PHASE_2B_SECURITY_REVIEW.md confirmed
- Human visual review: MobileConsole shows live HOLD/disabled/false

**Human GO boundary:** Phase 2B-4 GO (evidence recording)

---

## Phase 2B-1 GO Template (not approved)

```
I explicitly approve Phase 2B-1 iPhone Private Console IPC implementation.

Approved scope:
  IPC-only redacted snapshot read path. No HTTP server.

Approved files:
  src/main/mobile-console/mobile-console-snapshot-service.ts
  src/main/mobile-console/mobile-console-ipc-handler.ts
  src/main/mobile-console/index.ts
  src/preload/mobile-console.ts
  src/preload/index.ts (IPC registration only)
  src/preload/index.d.ts (type declaration only)
  src/renderer/src/screens/MobileConsole/MobileConsoleApp.tsx

Required pre-implementation checks:
  branch = main / commits_ahead = 0 / staged = 0 / dirty = 0

Forbidden:
  HTTP server / WebSocket / LAN binding / pairing token
  package changes / execution endpoint / push endpoint
  Level 3 / productionReady true / execution enabled
  robot / voice / camera / raw values / secrets

After implementation:
  typecheck: 0 errors / test: pass
  Security checklist from PHASE_2B_SECURITY_REVIEW.md confirmed
  commit + push readiness + push GO
```

---

## Phase 2B-2 GO Template (not approved)

```
I explicitly approve Phase 2B-2 localhost HTTP server implementation.

Approved scope:
  127.0.0.1-only HTTP server with GET /mobile/status and /snapshot.
  No LAN binding. No pairing token.

Approved files:
  src/main/mobile-console/mobile-console-local-server.ts
  src/main/mobile-console/mobile-console-security.ts
  src/main/mobile-console/index.ts (updated)

Forbidden:
  0.0.0.0 binding / LAN access / pairing token
  POST/PUT/PATCH/DELETE endpoints / execution endpoint
  package changes (use Node built-in http only)

After implementation:
  Server bind test: 127.0.0.1 only confirmed
  Forbidden endpoint test: /execute /push /approve all return 404
  typecheck: 0 errors / test: pass
  commit + push readiness + push GO
```

---

この範囲では問題を検出していません
