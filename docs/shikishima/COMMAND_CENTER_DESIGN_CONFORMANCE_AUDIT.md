# Command Center Design Conformance Audit

## Audit Date

2026-05-18

## Source Materials

- Design: `docs/shikishima/design/final-command-center/source/*.jsx`
- Implementation: `src/renderer/src/` (UI-03 through UI-12)

## Baseline

```
branch:          main
head:            5160608 (UI-12 Layout wiring, local — not yet pushed)
origin_main:     7f7ea2a
commits_ahead:   1
staged:          0
tracked_dirty:   0
```

---

## CAVEAT-01 — Routing Gap (Resolved)

```
status:    RESOLVED by UI-12 (commit 5160608)
fix:       Layout.tsx now renders PageShell + 12 pages at "Control Center" nav
observed:  runtime observation confirmed Electron starts without crash
```

---

## CAVEAT-02 — Design Conformance Gap

```
status:    OPEN
summary:   Current implementation covers ~40% of shell infrastructure
           and deploys all 12 pages, but page layouts are simplified
           (single-column) compared to the multi-column design spec.
           Safety invariants are correct. Wording and safety chips are
           partially complete.
```

---

## P1 Findings — Safety / Wording Gaps

### P1-001: SafetyStrip has 2/7 chips

```
page:      SafetyStrip (all pages — always visible)
design:    7 SafetyChips: execution, productionReady, external_write,
           rawValues, runtime, stackchan_connection, HOLD_wording
current:   Only 2 chips shown: productionReady + execution
missing:   external_write chip
           rawValues chip
           runtime chip
           stackchan_connection chip
           canonical HOLD wording phrase ("安全境界 · 常時表示")
severity:  P1
safety:    Low (existing 2 chips ARE correct; missing chips reduce visibility)
design:    Medium (incomplete safety chip row)
fix:       Extend SafetyStrip props and render to include remaining chips
           when data is available (or show as HOLD placeholders)
impl_req:  yes
runtime_recheck: yes
```

### P1-002: PageShell missing footer disclaimer

```
page:      PageShell (all pages)
design:    Footer text: "しきしま · Private Console" +
           "このUIから外部実行は発生しません" (this UI never triggers external execution)
current:   No footer rendered in PageShell
severity:  P1
safety:    Low (safety is enforced in code; this is a visibility gap)
design:    Medium (canonical disclaimer always visible in design)
fix:       Add footer bar to PageShell with canonical disclaimer text
impl_req:  yes
runtime_recheck: yes
```

### P1-003: SafetyStrip covers only 5 of 9 decision states

```
page:      SafetyStrip (all pages)
design:    9 states with complete label + message + fallback rule:
           HOLD, GO_READY, PASS, PASS_WITH_CAVEAT, STOP, REJECT,
           UNKNOWN, STALE, ERROR
current:   5 states defined: HOLD, GO_READY, PASS, PASS_WITH_CAVEAT, STOP
missing:   REJECT, UNKNOWN, STALE, ERROR (fallback to HOLD label)
severity:  P1
safety:    Low (unknown states do fall back to HOLD via resolveDecision())
design:    Medium (REJECT and ERROR have distinct visual cues in design)
fix:       Add REJECT/UNKNOWN/STALE/ERROR to DECISION_LABELS in SafetyStrip
impl_req:  yes
runtime_recheck: yes
```

---

## P2 Findings — Layout / Missing Components

### P2-001: Operator page is single-column (design: 3-column)

```
page:      OperatorPage
design:    3-column layout:
           LEFT (280px): Session/Gate timeline, gate lamps
           CENTER (flex): LampGrid + NextActionCard + chat read-only + input bar
           RIGHT (320px): Safety chips panel + Copy buttons + StackChan mini card
current:   Single-column: safety strip → lamp grid → caveat section
missing:   Left rail (session/gate timeline)
           Right rail (safety chips + copy buttons + StackChan mini card)
           NextActionCard component
           Blocked-actions footer row (8 tags: send/push/pay/reserve/etc.)
severity:  P2
safety:    None (HOLD state is still shown correctly)
design:    High (core layout differs significantly from design)
fix:       Redesign OperatorPage with 3-column grid (with mobile fallback)
           Add NextActionCard component
           Add PageRightRail component
impl_req:  yes
runtime_recheck: yes
```

### P2-002: Chat page is single-column (design: 3-column)

```
page:      CommandChatPage
design:    3-column: LEFT lamp + ChatLegend | CENTER messages + input | RIGHT rail
current:   Single-column: STALE banner + messages + ChatInputBar
missing:   LEFT rail (decision lamp + ChatLegend with message type legend)
           RIGHT rail (PageRightRail with action context)
severity:  P2
safety:    None (local-chat-service send is correct)
design:    Medium (simplified layout but functional)
fix:       Add optional left/right rail columns; ChatLegend component
impl_req:  yes
runtime_recheck: yes
```

### P2-003: Missing Topbar / mode indicator

```
page:      PageShell
design:    Topbar: shows current mode (OPERATOR / INSPECTOR) + context breadcrumb
current:   No Topbar; only SafetyStrip → PageTabs
severity:  P2
safety:    None
design:    Medium (mode awareness)
fix:       Add Topbar component above PageTabs in PageShell
impl_req:  yes
runtime_recheck: yes
```

### P2-004: NextActionCard component not implemented

```
page:      OperatorPage (and others)
design:    Context-aware card: state-specific text, estimated time
           (e.g., "約30秒", "90秒", "5分"), next human action
current:   nextHumanAction shown as plain text if provided
severity:  P2
safety:    None
design:    High (primary operator UX element)
fix:       Implement NextActionCard with state-based content + time estimate
impl_req:  yes
runtime_recheck: yes
```

### P2-005: PageRightRail not implemented

```
page:      OperatorPage, CommandChatPage
design:    Right rail: safety boundary chips + COPY/SHOW/OPEN buttons (3 types)
current:   No right rail; copy buttons are inline where present
severity:  P2
safety:    None
design:    High (primary action area for copy-only operations)
fix:       Implement PageRightRail component with typed copy buttons
impl_req:  yes
runtime_recheck: yes
```

### P2-006: InactiveStamp component not implemented

```
page:      Multiple pages (Settings locked section, OperatorPage footer)
design:    "[OFF] · label · inactive by design" (dashed border, struck-through text)
current:   Settings locked items use lock icon + opacity; no InactiveStamp pattern
severity:  P2
safety:    Low (locked capabilities do appear non-interactive)
design:    Medium (visual pattern differs from spec)
fix:       Create InactiveStamp component and use in locked areas
impl_req:  yes
runtime_recheck: yes
```

### P2-007: Mobile safe-area padding not verified

```
page:      All pages
design:    iPhone 15 Pro (393×852), env(safe-area-inset-*) padding for notch
current:   Standard padding values; no safe-area CSS
severity:  P2
safety:    None
design:    Low (affects iOS Web view, if applicable)
fix:       Add safe-area-inset padding in PageShell or global CSS
impl_req:  yes (if iOS web view is a target)
runtime_recheck: yes
```

---

## P3 Findings — Polish / Visual Fidelity

### P3-001: Colors hardcoded as hex fallbacks, not pure CSS var

```
component: All page components
design:    All colors via CSS token references (sk.* → var(--*))
current:   Colors in TypeScript as var(--hold, #d97706) — hex fallbacks present
           CSS variables ARE defined in command-center-tokens.css (UI-10)
severity:  P3
safety:    None
design:    Low (fallbacks ensure correct display; CSS vars work in runtime)
fix:       Remove hex fallbacks from TypeScript; rely on command-center-tokens.css
impl_req:  yes (low priority)
runtime_recheck: no
```

### P3-002: Language system uses inline ternary, not T() wrapper

```
component: All page components
design:    T(ja, en) wrapper function; language from useLang() hook
current:   lang === "ja" ? "日本語" : "English" inline ternaries
severity:  P3
safety:    None
design:    Low (bilingual output is correct; harder to audit for missing strings)
fix:       Consider extracting to a helper or adopting T() pattern
impl_req:  no (low priority)
runtime_recheck: no
```

### P3-003: StackChan face expression glyphs not implemented

```
page:      StackChanPage
design:    ASCII art face expressions per state:
           (･_･;) HOLD, (･ω･) GO_READY, (´ᴗ`) PASS, (！_！) STOP, (×_×) REJECT
current:   Connection status text + HOLD banner (no face expressions)
severity:  P3
safety:    None
design:    Low (visual delight, not safety-critical)
fix:       Add faceGlyph mapping to StackChanPage
impl_req:  yes (low priority)
runtime_recheck: no
```

---

## What IS Correctly Implemented

```
[PASS] SafetyStrip decision lamp + HOLD/GO_READY/PASS/PASS_WITH_CAVEAT/STOP colors
[PASS] PageTabs 12-tab navigation, scrollable, keyboard focus ring
[PASS] PageShell wrapping SafetyStrip + PageTabs + body
[PASS] All 12 pages accessible and rendering (single-column layouts)
[PASS] HOLD fallback logic: null/stale → HOLD (snapshot-to-page.ts)
[PASS] TypeScript literal safety types (productionReady:false, execution:"disabled")
[PASS] STALE badge in SafetyStrip and page banners
[PASS] EmptyState/LoadingState/ErrorState/StaleWarning components
[PASS] ToastContainer (4 variants, auto-dismiss)
[PASS] CommandPalette (Ctrl+K, keyboard-driven navigation)
[PASS] CommandSettingsPage: 6 settings + 5 locked capabilities (aria-disabled)
[PASS] CommandHelpPage: safety invariant table, decision state glossary
[PASS] OnboardingFlow: 5-step wizard
[PASS] StackChan physicalOperation:false + voice/camera/mic:false literals
[PASS] Outbox/Queue/GO/Evidence/Stop/Push pages with correct HOLD data
[PASS] CSS variables defined globally (command-center-tokens.css)
[PASS] No external write buttons in any page
[PASS] checkRedaction() blocking raw values at IPC boundary
```

---

## Summary

```
P0:  0 findings
P1:  3 findings (P1-001, P1-002, P1-003)
P2:  7 findings (P2-001 through P2-007)
P3:  3 findings (P3-001, P3-002, P3-003)

Safety violations: NONE
Implementation gaps that affect safety visibility: P1-001 (5 chips missing)
Implementation gaps that affect UX: P2-001 through P2-005 (layout simplification)
```

---

## Safety Boundary Confirmation

```
productionReady:              false
execution:                    disabled
rawValuesReported:            false
externalWrite:                false
physicalOperation (StackChan): false
voice/camera/mic:             inactive
external API write:           false
push from UI:                 false
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
