# iPhone Private Console — Next Tasks
date: 2026-05-15
status: planning

---

## Task 1 — Human Review of Architecture Docs

```
purpose:     Confirm design direction before any implementation
allowed:     Read docs, ask questions, request changes
forbidden:   Implementation, npm, git push
evidence:    Human explicitly states "docs reviewed / approved"
GO boundary: Human issues "docs accepted" before Task 2
```

Documents to review:
- IPHONE_PRIVATE_CONSOLE_ARCHITECTURE.md
- IPHONE_PRIVATE_CONSOLE_MVP_PHASES.md
- IPHONE_PRIVATE_CONSOLE_SECURITY_MODEL.md
- IPHONE_PRIVATE_CONSOLE_UI_SPEC.md
- IPHONE_PRIVATE_CONSOLE_API_CONTRACT.md
- IPHONE_PRIVATE_CONSOLE_IMPLEMENTATION_GO_DRAFT.md

---

## Task 2 — B3 Session-009 Clean PASS #5

```
purpose:     Complete the 5th clean B3 PASS to unlock Level 3 gate
allowed:     Electron launch within approved time_window, observation only
forbidden:   Level 3 approval, execution, push without GO
evidence:    Human reports PASS + observation checklist complete
GO boundary: Human issues explicit time_window GO (+30s rule)
notes:       Separate from iPhone console work. Do not mix.
```

---

## Task 3 — B3 5/5 Acceptance Record

```
purpose:     Record clean B3 5/5 completion evidence
allowed:     docs/shikishima/ evidence file creation
forbidden:   Level 3 approval (separate GO required)
evidence:    Acceptance doc created and reviewed
GO boundary: Human explicitly accepts the 5/5 record
```

---

## Task 4 — Phase 1 iPhone Console Implementation GO

```
purpose:     Implement static MobileConsole UI components
allowed:     src/renderer/src/screens/MobileConsole/ creation
             Layout.tsx tab addition
             i18n key additions
forbidden:   Server, network, auth, package changes, execution endpoints
evidence:    typecheck 0, test pass, human visual review on iPhone
GO boundary: Human issues Phase 1 GO (template in IMPLEMENTATION_GO_DRAFT.md)
```

---

## Task 5 — iPhone Width Visual Review

```
purpose:     Confirm Phase 1 UI renders correctly on iPhone portrait
allowed:     Open Vite dev server (same LAN), iPhone Safari check
             Resize desktop window to 390px for quick check
forbidden:   Production deployment, external exposure
evidence:    Human confirms safety banner, HOLD labels, no raw values on iPhone
GO boundary: Human visual confirmation required before Phase 2
```

---

## Task 6 — Phase 2 Redacted Snapshot API Design Review

```
purpose:     Review Phase 2 API contract before implementation
allowed:     Read IPHONE_PRIVATE_CONSOLE_API_CONTRACT.md, propose changes
forbidden:   Phase 2 implementation without GO
evidence:    Human reviews and accepts API contract
GO boundary: Separate Phase 2 GO required
```

---

## Task 7 — Phase 2 Local Snapshot API Implementation GO

```
purpose:     Add local HTTP server in Electron main for same-LAN iPhone access
allowed:     main process server (localhost binding), GET endpoints only
             pairing token generation + display in Control Center
             redaction layer implementation
forbidden:   0.0.0.0 binding without auth, POST endpoints, execution
evidence:    GET /mobile/status response reviewed (human confirms redaction)
             Pairing token visible only in Electron
             No raw values in any response
GO boundary: Phase 2 GO (separate from Phase 1 GO)
```

---

## Task 8 — Same-LAN iPhone Test

```
purpose:     Confirm iPhone on home Wi-Fi can read Shikishima status
allowed:     iPhone Safari access to local API, status read
forbidden:   Execution, push, Level 3, remote access (Phase 3 scope)
evidence:    Human confirms status screen loads on iPhone, no raw values
GO boundary: Human confirms after visual check
```

---

## Task 9 — Private Remote Access Option Review

```
purpose:     Choose between Tailscale / Cloudflare Tunnel / VPN for Phase 3
allowed:     Security comparison doc, option evaluation
forbidden:   Implementation without Phase 3 GO
evidence:    Human reviews and selects option
GO boundary: Separate Phase 3 security review GO
```

---

## Task 10 — External Access Security Review

```
purpose:     Before implementing Phase 3, verify security model holds
allowed:     Security audit of Phase 2 implementation
             Threat model update for Phase 3
forbidden:   Phase 3 implementation without security GO
evidence:    Security review complete, human accepts risk model
GO boundary: Explicit Phase 3 GO naming chosen tunnel option
```

---

## Execution Order

```
Task 1  → docs review (parallel with Task 2 prep)
Task 2  → B3 Session-009 (requires separate time_window GO)
Task 3  → B3 5/5 acceptance
Task 4  → Phase 1 implementation (requires Phase 1 GO)
Task 5  → iPhone visual review
Task 6  → Phase 2 API design review
Task 7  → Phase 2 implementation (requires Phase 2 GO)
Task 8  → Same-LAN iPhone test
Task 9  → Remote access option review
Task 10 → External access security review (before Phase 3 GO)
```

Tasks 1 and 2 can be prepared in parallel.
Tasks 4-10 are strictly sequential (each requires previous to complete).

---

この範囲では問題を検出していません
