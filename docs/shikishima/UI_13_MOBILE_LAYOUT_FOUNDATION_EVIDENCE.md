# UI-13 Mobile Layout Foundation Evidence

## Implementation Summary

UI-13 establishes the mobile layout foundation for the Command Center UI.

Scope: mobile-responsive chrome + CSS variable-based page padding.
This is Phase 1 of mobile adaptation (P2-007 base). P2-001/P2-002 deferred.

---

## Git State

```
commit:      c48675c
subject:     feat: mobile layout adaptation (UI-13)
branch:      main
origin/main: c48675c (HEAD == origin/main — pushed)
commits_ahead: 0
staged:      0
tracked_dirty: 0
```

---

## Changed Files (14)

| File | Change |
|---|---|
| `src/renderer/src/assets/command-center-tokens.css` | Responsive CSS vars + safe-area utilities |
| `src/renderer/src/components/Shell/PageShell.tsx` | isMobile state + compact propagation + safe-area classes |
| `src/renderer/src/components/Shell/Topbar.tsx` | compact prop (height 30px → 24px) |
| `src/renderer/src/screens/CommandHelp/CommandHelpPage.tsx` | padding → CSS var |
| `src/renderer/src/screens/CommandHelp/OnboardingFlow.tsx` | padding + maxWidth → CSS var |
| `src/renderer/src/screens/CommandSettings/CommandSettingsPage.tsx` | padding + maxWidth → CSS var |
| `src/renderer/src/screens/Evidence/EvidencePage.tsx` | padding → CSS var |
| `src/renderer/src/screens/GoPage/GoPage.tsx` | padding → CSS var |
| `src/renderer/src/screens/Operator/OperatorPage.tsx` | padding → CSS var |
| `src/renderer/src/screens/Outbox/OutboxPage.tsx` | padding → CSS var |
| `src/renderer/src/screens/Push/PushPage.tsx` | padding → CSS var |
| `src/renderer/src/screens/Queue/QueuePage.tsx` | padding → CSS var |
| `src/renderer/src/screens/StackChan/StackChanPage.tsx` | padding → CSS var |
| `src/renderer/src/screens/Stop/StopPage.tsx` | padding → CSS var |

---

## Mobile Breakpoint Behavior

```
breakpoint: 600px (window.innerWidth < 600)
detection:  useState + useEffect resize listener in PageShell
```

| Element | Desktop (≥600px) | Mobile (<600px) |
|---|---|---|
| Topbar height | 30px | 24px |
| SafetyStrip height | 36px | 28px |
| SafetyStrip chips | 10px font | 9px font |
| PageTabs padding | 11px/14px | 8px/10px |
| Page padding | 18px 22px | 12px 14px |
| Page maxWidth | 700px / 560px | 100% |
| Footer padding | 5px 16px | 4px 14px |

---

## CSS Variables Added

```css
/* command-center-tokens.css */
--page-pd-v: 18px   /* mobile: 12px */
--page-pd-h: 22px   /* mobile: 14px */
--page-max-w: 700px /* mobile: 100% */

/* @media (max-width: 599px) override */
/* @supports safe-area utility classes */
.cc-safe-area-bottom  /* padding-bottom: env(safe-area-inset-bottom) */
.cc-safe-area-sides   /* padding-left/right: env(safe-area-inset-*) */
```

---

## Safe-Area Support

```
implementation: @supports (padding: env(safe-area-inset-bottom))
PageShell body: cc-safe-area-sides (mobile only)
PageShell footer: cc-safe-area-bottom (always)
target: iPhone notch / home indicator on iOS web view
```

---

## Compact Mode Propagation

```
PageShell detects isMobile → passes compact={isMobile} to:
  Topbar (height adjustment)
  SafetyStrip (font + height reduction)
  PageTabs (padding reduction)
```

---

## Tests

```
typecheck:node:      PASS (exit 0)
typecheck:web:       PASS (exit 0)
mobile-console:      37/37 PASS
ui-snapshot-helpers: 45/45 PASS
```

---

## Remaining P2 Mobile Items (deferred)

```
P2-001: Operator page — 3-column → mobile 1-column layout
        Requires: NextActionCard + PageRightRail + responsive grid
        Scope: separate GO

P2-002: Chat page — 3-column → mobile vertical stack
        Requires: ChatLegend + PageRightRail responsive
        Scope: separate GO
```

---

## Safety Invariant Confirmation

```
productionReady:              false — unchanged
execution:                    disabled — unchanged
rawValuesReported:            false — unchanged
externalWrite:                false — unchanged
physicalOperation (StackChan): false — unchanged
voiceActive:                  false — unchanged
cameraActive:                 false — unchanged
micActive:                    false — unchanged
```

---

## Boundary Confirmation

```
runtime_started:   false
port_3030_opened:  false
npm_install_run:   false
package_changed:   false
dependency_changed: false
external_api_write: false
git_push_performed: c48675c was pushed before evidence (pre-evidence push)
```

---

_Recorded: 2026-05-18_
_productionReady: false_
_execution: disabled_
