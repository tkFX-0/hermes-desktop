# iPhone Private Console — MVP Phases
date: 2026-05-16
status: phase1_complete / phase2a_complete / phase2b1_complete / phase2b2_complete_not_auto_wired / phase2c_disabled_pending_activation

---

## Phase 0 — Current Remote Operation (now)

**Purpose:** Operate Shikishima remotely using existing tools.

| Allowed | Forbidden |
|---|---|
| RustDesk visual observation | Execution without GO |
| ClaudeCodeRemote command/audit | Push without GO |
| GPT for decision/GO wording | Level 3 approval |
| Manual GO text entry | productionReady true |

**Evidence required:** None (current state)
**STOP conditions:** Raw value visible / execution escapes
**Human GO boundary:** All actions require explicit GO per operation

---

## Phase 1 — Read-Only iPhone PWA Mock

**Purpose:** Build a static, mobile-width UI that renders Shikishima status
without a backend server. Design review and visual confirmation only.

**Allowed actions:**
- Create `src/renderer/src/screens/MobileConsole/` with static components
- Use hardcoded mock data (no runtime API calls)
- Render in Electron desktop window for visual check
- Check layout on iPhone Safari via local Vite dev URL (same LAN)

**Forbidden actions:**
- Network listener or server
- Runtime data fetching
- Any IPC execution calls
- Authentication implementation
- Package / dependency changes

**File scope (proposed):**
```
src/renderer/src/screens/MobileConsole/
  MobileConsoleApp.tsx       ← root container
  MobileStatusCard.tsx       ← safety invariants banner
  MobileB3Progress.tsx       ← B3 session progress
  MobileGoDrafts.tsx         ← GO template text (copy only)
  MobileAuditSummary.tsx     ← evidence / session summary
  MobileAgentTeam.tsx        ← 10 agents read-only overview
  MobilePushReadiness.tsx    ← push state display
```

**Evidence required:**
- Human visual review on iPhone Safari (or portrait-width desktop window)
- Safety banner confirmed (HOLD / disabled / false visible)
- No raw values visible in any component
- typecheck: 0 errors

**STOP conditions:**
- Any component fetches live data
- Any raw value appears
- Safety banner missing

**Human GO boundary:** Phase 1 GO required before implementation

---

## Phase 2 — Local Redacted Snapshot API

**Purpose:** Windows host exposes a local read-only API that iPhone on the
same LAN can read. No execution endpoint. Redacted responses only.

**Allowed actions:**
- Add local HTTP server (localhost or LAN interface) in main process
- Implement GET /mobile/status, /b3-progress, /go-drafts, etc.
- Apply redaction layer before all responses
- Implement pairing token (random, displayed in Control Center, not in URL)
- Same-LAN iPhone test

**Forbidden actions:**
- POST / PUT / DELETE endpoints
- Execution or state mutation
- Cloudflare / public exposure
- Tailscale setup (Phase 3)
- Auth outside pairing token

**Evidence required:**
- GET /mobile/status response review (human verifies redaction)
- Pairing token confirmed visible only in Electron UI
- No execution endpoint responds
- No raw values in any response
- typecheck: 0 errors / test: pass

**STOP conditions:**
- Any raw value appears in API response
- Execution endpoint accidentally responds
- Server binds to 0.0.0.0 without auth
- Pairing token appears in URL or logs

**Human GO boundary:** Phase 2 GO required after Phase 1 review passes

---

## Phase 3 — Private Remote Access from Outside Home

**Purpose:** Allow iPhone to reach the console from outside the home LAN
through an encrypted private tunnel.

**Allowed actions (after GO):**
- Evaluate Tailscale / WireGuard / Cloudflare Tunnel options
- Select one option based on security review
- Implement chosen tunnel
- Document access URL (redacted — no raw credentials in docs)

**Forbidden actions:**
- Direct router port-forward (too risky)
- Cloudflare Tunnel without Access policy
- Public endpoint without authentication
- Any execution endpoint

**Evidence required:**
- Security option comparison reviewed by human
- Tunnel implementation reviewed
- iPhone remote access confirmed (status only)
- No raw values / no execution reachable

**STOP conditions:**
- Public endpoint accessible without authentication
- Any execution endpoint reachable remotely
- API key or token visible in network traffic

**Human GO boundary:** Phase 3 GO requires Phase 2 stable + security review

---

## Phase 4 — GO Draft Console

**Purpose:** iPhone can generate and copy GO template text.
Human pastes the text into ClaudeCode or another interface manually.
No automatic execution.

**Allowed actions:**
- GET /mobile/go-drafts returns pre-generated GO templates
- Copy-to-clipboard button in iPhone UI
- Template variables filled from redacted snapshot (no raw values)

**Forbidden actions:**
- Automatic submission of GO text
- POST /execute
- Any execution relay

**Evidence required:**
- GO draft text reviewed by human before copy-paste use
- No execution triggered automatically
- Template correctly includes safety invariants

**STOP conditions:**
- GO text contains raw values or secrets
- Any auto-submission path exists

**Human GO boundary:** Phase 4 GO after Phase 3 stable

---

## Phase 5 — Approval Queue Viewer

**Purpose:** iPhone shows pending approval items in read-only mode.
Human reviews on iPhone, then issues approval via desktop or ClaudeCode.

**Allowed actions:**
- GET /mobile/approval-queue returns redacted queue summary
- Display pending items with redacted descriptions
- No approve/deny button in Phase 5

**Forbidden actions:**
- POST /approve
- POST /deny
- Any queue mutation

**Evidence required:**
- Queue display reviewed (no raw values)
- No approval action reachable

**Human GO boundary:** Phase 5 GO after Phase 4 stable

---

## Phase 6 — Limited Command Relay (Not Approved)

**Purpose:** iPhone relays specific pre-approved, non-destructive read commands.

**Status:** NOT APPROVED. Requires Level 3+ and dedicated security review.

Minimum prerequisites before this phase can even be designed:
- B3 5/5 + Level 3 GO
- Phase 5 stable and audited
- Authentication hardened (not pairing token)
- Execution scope strictly limited and audited
- Human explicitly approves Phase 6 design

---

この範囲では問題を検出していません
