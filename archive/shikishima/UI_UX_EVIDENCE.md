# UI/UX Evidence

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** CODE_VERIFIED — human visual spot-check recommended

---

## Purpose

Confirm basic shell usability and that safety labels are never hidden by UI state.

---

## 1. Shell Structure

```
Layout.tsx
  ├── SafetyStrip          ← always at top, type-enforced safety props
  ├── Sidebar nav (NAV_ITEMS)
  │     controlCenter / mobileConsole / chat / sessions / agents /
  │     office / models / skills / soul / memory / tools /
  │     schedules / gateway / settings / research
  └── View area
        controlCenter → AgentTheaterPage + OperatorPage
        mobileConsole → MobileConsoleApp
        chat          → Chat
        ...
```

### SafetyStrip placement

`Layout.tsx` line 432: `<SafetyStrip ...>` is rendered unconditionally before
the view switcher. It cannot be hidden by any view change.

```tsx
// SafetyStrip always rendered first, before conditional view
<SafetyStrip decision={...} productionReady={false} execution="disabled" ... />

{/* Then: conditional view rendering */}
{view === "controlCenter" && <AgentTheaterPage ... />}
...
```

---

## 2. Window Bounds / Zoom

- Electron window: no explicit size lock observed in code
- CSS uses `flexShrink: 0` on SafetyStrip — strip never shrinks away
- View area has `overflowX: auto` — horizontal scroll available, not clip
- SafetyStrip uses `flexWrap: wrap` — chips wrap on narrow windows, don't disappear

### Overflow behavior

| Element | On narrow window |
|---|---|
| SafetyStrip chips | wrap to next line (still visible) |
| Pixel Room | horizontal scroll (`overflowX: auto`) |
| Nav sidebar | fixed left, scrollable |

---

## 3. Theme Toggle

- `useTheme()` hook controls `light | dark | system`
- SafetyStrip uses CSS vars (`--bar`, `--bar-text-2`) that adapt to theme
- Safety chip colors use hardcoded `#d97706`, `#dc2626`, `#16a34a` — visible in both themes
- No safety content is CSS-hidden by theme class

---

## 4. Navigation Order (Sidebar)

```
1. controlCenter   (default view on mount)
2. mobileConsole
3. chat
4. sessions
5. agents
6. office
7. models
8. skills
9. soul
10. memory
11. tools
12. schedules
13. gateway
14. settings
15. research
```

`controlCenter` is the default (`useState<View>("controlCenter")`).
The app opens to the control center / agent theater on launch.

---

## 5. No Hidden Safety Labels

Verified by grep across all 99 screen components:

| Pattern searched | Result |
|---|---|
| `display: "none"` on SafetyStrip | not found |
| `visibility: "hidden"` on SafetyStrip | not found |
| `opacity: 0` on SafetyStrip | not found |
| `SafetyStrip` inside conditional `{false && ...}` | not found |
| execution prop as non-literal | TypeScript error (literal type) |
| productionReady prop as non-literal | TypeScript error (literal type) |

---

## 6. Navigation — No Broken Primary Views

All views are imported and conditionally rendered in `Layout.tsx`.
TypeScript compilation passes (`typecheck:web: PASS`).
No missing imports or broken references.

---

## 7. Human Spot-Check Checklist

When the app is open, confirm:

- [ ] controlCenter tab is the first/default view
- [ ] SafetyStrip visible at top when switching tabs
- [ ] SafetyStrip still visible on narrow window (chips wrap, not hidden)
- [ ] Theme toggle (sun/moon) changes colors but keeps safety labels visible
- [ ] No overflow clips safety strip on any navigation change
- [ ] Pixel Room horizontal scroll works without hiding room controls

---

## Pass Condition

```yaml
safety_strip_always_visible: PASS  # code verified, no hide path
type_enforcement:            PASS  # literal types prevent override
default_view_controlCenter:  PASS  # confirmed in useState
theme_safety:                PASS  # CSS vars adapt, chip colors hardcoded
human_spotcheck:             PENDING (recommended but not blocking)
```

---

## Safety

```yaml
productionReady:   false
execution:         disabled
rawValuesReported: false
```
