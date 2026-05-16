# iPhone Private Console — Architecture Design
date: 2026-05-16
status: phase1_to_2b2_implemented — phase2c_disabled_pending_activation
level: docs-only

---

## 1. Purpose

Reduce operational dependency on RustDesk by providing a private, owner-only,
read-only iPhone UI for monitoring Shikishima state and drafting GO text.

The iPhone console is NOT an execution engine.
The Windows app remains the sole Shikishima host and execution authority.

---

## 2. Why Reduce RustDesk Dependency

| Issue | Detail |
|---|---|
| Screen sharing exposes full desktop | Raw values, file paths, and private state may be visible |
| Session setup overhead | RustDesk requires pairing on both devices every session |
| Not purpose-built for Shikishima | No structured status view, no redaction, no GO drafts |
| Fragile on mobile | Desktop-rendered remote screens are hard to use on iPhone |
| Always-on risk | Active screen-share sessions widen the attack surface |

Goal: replace RustDesk for read-only status checks with a purpose-built,
redacted-only, structured mobile view.

RustDesk remains appropriate for:
- B3 session human observation (requires visual app confirmation)
- Debugging Electron window issues
- Interactive desktop operations

---

## 3. Architecture

```
Windows PC (Shikishima host)
┌──────────────────────────────────────────────────────┐
│  Electron App                                        │
│  ┌────────────────────────────────────────────────┐  │
│  │  Control Center (read-only IPC)                │  │
│  │  Autonomy Zone / Safety Gates                  │  │
│  │  Agent Team (disabled / dry-run only)          │  │
│  └────────────────┬───────────────────────────────┘  │
│                   │ redacted snapshot only            │
│  ┌────────────────▼───────────────────────────────┐  │
│  │  Mobile Snapshot Producer                      │  │
│  │  (local-only, read-only, redacted-only)        │  │
│  └────────────────┬───────────────────────────────┘  │
└───────────────────┼──────────────────────────────────┘
                    │ GET /mobile/* (LAN or Tailscale)
                    │ redacted JSON only
                    │ no raw values / no execution
                    ▼
iPhone (operator surface)
┌──────────────────────────────────────────────────────┐
│  Safari / PWA — Shikishima Private Console           │
│  - Status / Safety invariants                        │
│  - B3 progress                                       │
│  - GO draft text (copy only)                         │
│  - Audit / evidence summary                          │
│  - Push readiness                                    │
│  - Agent team overview                               │
└──────────────────────────────────────────────────────┘
```

**Invariants:**
- The iPhone console cannot execute commands
- The iPhone console cannot approve Level 3
- The iPhone console cannot flip productionReady
- The iPhone console cannot enable execution
- The iPhone console cannot connect robot/voice/camera

---

## 4. Read-Only-First Policy

Phase 1 and Phase 2 are strictly read-only.

Read-only means:
- No HTTP POST/PUT/DELETE endpoints
- No WebSocket command channel
- No IPC execution calls
- No state mutation of any Shikishima variable
- GET endpoints return redacted snapshots only

---

## 5. Redacted-Only Snapshot Policy

All mobile API responses must apply redaction before sending.

Allowed in response:
- Enum values (HOLD, disabled, false, not_approved)
- Counts (number of agents, pass count, etc.)
- Status labels (string summaries, not raw values)
- GO template text (pre-generated, no secrets embedded)
- Boolean flags

Forbidden in any response:
- API keys / tokens / passwords
- Absolute local file paths
- WSL slot names / distro names
- Local-only config values
- Raw JSON from local config files
- Environment variable values
- Private IP configuration
- Credentials of any kind

---

## 6. Owner-Only Access Model

The console is for the single human owner only.

Access model must:
- Require authentication (minimum: pairing token displayed on Windows host)
- Not be publicly discoverable
- Not be accessible from the internet without explicit tunnel setup
- Expire sessions after inactivity
- Display access attempt log on Windows host

Multi-user access is not a goal and not designed for.

---

## 7. Network Access Options

| Option | When Safe | Notes |
|---|---|---|
| Same-LAN only | Phase 2 | Safest. iPhone and Windows on same Wi-Fi. |
| Tailscale private network | Phase 3 | Encrypted P2P, no public exposure. Recommended for remote. |
| Cloudflare Tunnel + Access policy | Phase 3+ | Public-facing but gated. Higher risk. Only after security review. |
| VPN (WireGuard/OpenVPN) | Phase 3 | Equivalent to Tailscale. More setup. |
| Direct port forward (router) | Never without review | High risk. Not recommended. |

Default: same-LAN in Phase 2. Tailscale for Phase 3 remote access.

---

## 8. Authentication Options

| Option | Phase | Risk | Notes |
|---|---|---|---|
| No auth (LAN-only) | Phase 2 testing only | MEDIUM | Acceptable only on trusted home LAN |
| Random pairing token (shown on Windows host) | Phase 2 production | LOW | Simple, effective, owner-only |
| Tailscale device auth | Phase 3 | LOW | Network-level auth, no app-level needed |
| Bearer token in header | Phase 2+ | LOW | Requires HTTPS for safety |
| OAuth / external auth | Phase 4+ | Complex | Not needed in early phases |

Recommendation: Phase 2 uses random 6-word pairing token displayed in
Electron Control Center, never embedded in URL, cleared on app restart.

---

## 9. UI Screens (overview)

See IPHONE_PRIVATE_CONSOLE_UI_SPEC.md for detail.

| Screen | Purpose |
|---|---|
| Home / Safety Status | Safety invariants, decision/execution/productionReady |
| B3 Session Progress | Clean PASS count, next session, timing rule |
| GO Drafts | Pre-generated GO templates (copy only) |
| Evidence / Audit Summary | Session history, STOP records |
| Push Readiness | Current HEAD, ahead commits, readiness status |
| Agent Team Overview | 10 agents, enabled/disabled status |
| Settings / Access | Pairing token, access log |

---

## 10. API Design (overview)

See IPHONE_PRIVATE_CONSOLE_API_CONTRACT.md for detail.

All endpoints:
- Method: GET only (Phase 1-4)
- Response: JSON, redacted
- Authentication: bearer token (Phase 2+)
- Binding: localhost or Tailscale interface only (never 0.0.0.0 without auth)

---

## 11. Forbidden Endpoints (永久禁止)

```
POST /execute/*
POST /push
POST /approve
POST /level3/*
POST /voice/*
POST /robot/*
POST /camera/*
PUT  /config/productionReady
PUT  /config/execution
PUT  /config/level3
DELETE /*
WS   /command-stream
```

These endpoints must never be implemented in any phase without:
1. Explicit human Level 3+ GO
2. Separate security review
3. Authentication hardening

---

## 12. Security Risks

| Risk | Severity | Mitigation |
|---|---|---|
| LAN exposure without auth | HIGH | Phase 2: require pairing token |
| Raw value leakage in API response | HIGH | Redaction layer mandatory before send |
| Tunnel misconfiguration | HIGH | Cloudflare only after separate security review |
| iPhone lost/stolen with active session | MEDIUM | Session expiry + token rotation |
| SSRF via API proxy | MEDIUM | No outbound proxy in mobile API |
| Man-in-the-middle on LAN | LOW | Tailscale provides E2E encryption for Phase 3 |

See IPHONE_PRIVATE_CONSOLE_SECURITY_MODEL.md for full threat model.

---

## 13. MVP Phases (summary)

See IPHONE_PRIVATE_CONSOLE_MVP_PHASES.md for detail.

```
Phase 0: RustDesk + ClaudeCodeRemote (current)
Phase 1: Static iPhone-width UI mock (no server)
Phase 2: Local redacted snapshot API (same-LAN only)
Phase 3: Private remote access (Tailscale)
Phase 4: GO draft console (copy text, no execution)
Phase 5: Approval queue viewer (read-only)
Phase 6: Limited command relay (not approved — requires Level 3+)
```

---

## 14. Acceptance Criteria

Phase 1 complete when:
- Mobile-width UI renders in Electron (or standalone browser)
- All safety banners display correctly (HOLD, disabled, false)
- No raw values appear in any component
- Human visual review on iPhone Safari passes

Phase 2 complete when:
- GET /mobile/status returns redacted snapshot
- iPhone on same LAN can read status
- Pairing token required
- No execution endpoint exists

---

## 15. Human GO Boundaries

| Action | GO Required |
|---|---|
| Phase 1 implementation | Separate Phase 1 GO |
| Phase 2 local API | Separate Phase 2 GO after Phase 1 review |
| Phase 3 remote access | Separate Phase 3 GO after security review |
| Phase 4 GO draft console | Separate GO after Phase 3 stable |
| Any execution endpoint | Level 3+ + dedicated security GO |
| productionReady mutation | Permanently forbidden without total policy revision |

---

この範囲では問題を検出していません
