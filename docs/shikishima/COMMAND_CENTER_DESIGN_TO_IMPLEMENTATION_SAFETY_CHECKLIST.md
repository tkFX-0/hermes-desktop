# Command Center Design to Implementation Safety Checklist

## Document Status

```text
roadmapVersion: v3.67.0
date: 2026-05-17
gate: Post-100 Gate 007
name: Design to Implementation Safety Checklist
status: DEFINED — ClaudeCode must run this checklist before UI-02
```

---

## Purpose

ClaudeCode must verify all items before beginning UI-02 source implementation.
Any unchecked item = STOP.

---

## Section A: Design Package Intake Confirmed

```text
[✓] A-1. Design package extracted to docs/shikishima/design/final-command-center/source/
[✓] A-2. DESIGN_PACKAGE_INTAKE_REPORT.md created and reviewed
[✓] A-3. DESIGN_TO_IMPLEMENTATION_MAPPING.md created
[✓] A-4. FRONTEND_BACKEND_UI_CONTRACT.md created
[✓] A-5. UI_SAFETY_AND_BUTTON_POLICY_REVIEW.md created
[✓] A-6. UI_IMPLEMENTATION_PHASE_PLAN.md created
[✓] A-7. CLAUDECODE_IMPLEMENTATION_HANDOFF.md created
[ ] A-8. All A-* docs have been pushed to origin/main before UI-02 starts
```

---

## Section B: Source Implementation Preconditions

```text
[ ] B-1. branch = main
[ ] B-2. origin/main is at expected commit (verify by CLI, not pasted state)
[ ] B-3. commits_ahead = 0 (clean start for each UI phase)
[ ] B-4. staged = 0
[ ] B-5. tracked_dirty = 0
[ ] B-6. vitest: all pass (run before starting UI-02)
[ ] B-7. typecheck:node: no errors
[ ] B-8. typecheck:web: no errors
[ ] B-9. eslint: no errors
[ ] B-10. No unresolved TypeScript errors in existing src/
```

---

## Section C: Button Wording Check

```text
[ ] C-1. No "Send" button that triggers external email/message
[ ] C-2. No "Create" button that creates remote GitHub resources
[ ] C-3. No "Push" button that triggers git push
[ ] C-4. No "Approve" button that executes external action
[ ] C-5. No "Reject" button that executes external action
[ ] C-6. No "Execute" or "Run" button
[ ] C-7. No "Deploy" button
[ ] C-8. No "Connect" button for StackChan physical connection
[ ] C-9. No "Move" or motion button for StackChan
[ ] C-10. No "Start voice" / "Enable voice" button
[ ] C-11. No "Start camera" / "Enable camera" button
[ ] C-12. No "Start mic" / "Enable mic" button
[ ] C-13. No "Purchase" / "Pay" / "Reserve" button
[ ] C-14. Chat send button sends to local-chat-service ONLY
[ ] C-15. Chat send button shows safety note: "チャット送信のみ。外部送信・push・実行は行いません。"
[ ] C-16. COMMAND_CENTER_UI_BUTTON_WORDING_POLICY.md consulted for all new buttons
```

---

## Section D: State Label Check

```text
[ ] D-1. HOLD displayed in amber with code text (not color alone)
[ ] D-2. GO_READY displayed with "実行はしません" / "System will not execute" phrase
[ ] D-3. PASS displayed in green with code text
[ ] D-4. STOP displayed in red with code text + "人間の解除が必要" phrase
[ ] D-5. REJECT displayed in dark red with code text
[ ] D-6. STALE shows last-known values + STALE badge (no blank)
[ ] D-7. UNKNOWN/missing snapshot falls back to HOLD (not blank)
[ ] D-8. ERROR falls back to HOLD + error badge
[ ] D-9. Loading state preserves last-known lamp values (skeleton OK)
[ ] D-10. COMMAND_CENTER_UI_STATE_LABEL_POLICY.md consulted for all new state displays
```

---

## Section E: Redaction Check

```text
[ ] E-1. No raw pairing token displayed in UI
[ ] E-2. No raw API key displayed in UI
[ ] E-3. No raw password displayed in UI
[ ] E-4. No raw LAN IP displayed in static UI text
[ ] E-5. rawValuesReported: false confirmed in any snapshot display
[ ] E-6. REDACTED placeholder used where raw value would otherwise appear
[ ] E-7. Evidence files: all raw values replaced with [REDACTED] or similar
```

---

## Section F: iPhone Breakpoint Check (393px)

```text
[ ] F-1. All primary lamp/status text ≥ 13px at 393px
[ ] F-2. All tap targets ≥ 44px at 393px
[ ] F-3. Safe-area padding applied (notch / home indicator)
[ ] F-4. Horizontal scroll (no clipping) on PageTabs
[ ] F-5. SafetyStrip visible on iPhone viewport
[ ] F-6. Chat input accessible above keyboard
```

---

## Section G: Desktop Breakpoint Check (1200px / 1400px)

```text
[ ] G-1. Layout renders correctly at 1200px (desktop base)
[ ] G-2. Inspector layout renders at 1400px (wide)
[ ] G-3. No horizontal overflow at 1200px
[ ] G-4. PageTabs visible and scrollable if needed
```

---

## Section H: Accessibility Check

```text
[ ] H-1. Color + code text + phrase on all state lamps (never color alone)
[ ] H-2. WCAG AA contrast on primary text
[ ] H-3. Keyboard focus rings preserved (no outline: none without replacement)
[ ] H-4. Locked controls: aria-disabled + aria-label includes "HOLD" or "locked"
[ ] H-5. Lock icon visible on all locked settings
[ ] H-6. No tiny critical status text (< 11px)
```

---

## Section I: Backend Contract Check

```text
[ ] I-1. Renderer never calls Node.js API directly
[ ] I-2. All data flows through preload IPC (window.shikishima.*)
[ ] I-3. Safe-snapshot-service used for all lamp data
[ ] I-4. Local-chat-service used for chat send only
[ ] I-5. No direct file system access from renderer
[ ] I-6. No external HTTP call from renderer
[ ] I-7. FRONTEND_BACKEND_UI_CONTRACT.md consulted for each page
```

---

## Section J: Runtime Boundary Check

```text
[ ] J-1. No "start runtime" button in UI
[ ] J-2. No button opens port 3030
[ ] J-3. MOBILE_CONSOLE_PHASE_2C_ENABLED remains false as const in origin/main
[ ] J-4. Runtime start requires separate explicit GO (not from UI)
[ ] J-5. Runtime observation is read-only when active
```

---

## Section K: External Write Boundary Check

```text
[ ] K-1. No send path (email_sent must remain false)
[ ] K-2. No approve-execute path (approval is display/copy only)
[ ] K-3. No reject-execute path (rejection is display/copy only)
[ ] K-4. No GitHub remote creation path (github_remote_created must remain false)
[ ] K-5. No git push path from UI (git_push_performed must remain false)
[ ] K-6. No payment/reservation path (purchase_or_reservation_made must remain false)
[ ] K-7. Draft Outbox: copy-only, no send action
[ ] K-8. Approval Queue: display-only, no execute action
```

---

## Section L: StackChan Boundary Check

```text
[ ] L-1. No robot motion / physical operation path
[ ] L-2. No serial/USB/Wi-Fi device activation from UI
[ ] L-3. StackChan page shows display-only status
[ ] L-4. StackChan_physical_operation remains false
```

---

## Section M: Voice / Camera / Mic Boundary Check

```text
[ ] M-1. No voice activation path in UI
[ ] M-2. No camera activation path in UI
[ ] M-3. No microphone activation path in UI
[ ] M-4. Sensor status display is read-only
[ ] M-5. voice_camera_mic_activation remains false
```

---

## Section N: Test Expectations

```text
[ ] N-1. vitest run passes after UI-02 implementation
[ ] N-2. typecheck:node passes
[ ] N-3. typecheck:web passes
[ ] N-4. eslint passes
[ ] N-5. No new TypeScript any[] or @ts-ignore added without comment
[ ] N-6. New components have at least one render test
```

---

## Section O: STOP Conditions

```text
STOP immediately if any of these occur during implementation:
[ ] O-1. src/ contains send/post/push/execute/deploy action path
[ ] O-2. package.json is modified
[ ] O-3. Runtime is started
[ ] O-4. Port 3030 is opened
[ ] O-5. productionReady changes to true
[ ] O-6. execution changes to enabled
[ ] O-7. External write occurs
[ ] O-8. StackChan physical operation is triggered
[ ] O-9. Voice/camera/mic is activated
[ ] O-10. Raw value (token, IP, secret) is output to UI
[ ] O-11. Dependency is installed without explicit GO
[ ] O-12. git push occurs without explicit GO
```

---

## Sign-Off Format (for each UI phase)

```text
ClaudeCode confirms before starting UI-[NN]:
  Sections A-O reviewed: all required items checked
  Any unchecked items: [list or "none"]
  Known exceptions: [list or "none"]
  Source of truth docs consulted:
    COMMAND_CENTER_UI_BUTTON_WORDING_POLICY.md ✓
    COMMAND_CENTER_UI_STATE_LABEL_POLICY.md ✓
    FRONTEND_BACKEND_UI_CONTRACT.md ✓
```

---

この範囲では問題を検出していません。
