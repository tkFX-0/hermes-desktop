# P3-003 Allowed Files and Commands

## Task

P3-003 StackChan face expression glyphs (in P2-007 workday slot)

---

## Allowed Source Files

| File | Change |
|---|---|
| `src/renderer/src/screens/StackChan/StackChanPage.tsx` | Add FACE_GLYPH map + render glyph in face state section |

**All other source files: FORBIDDEN.**

---

## Forbidden Files

- `package.json`
- `package-lock.json`
- Any `src/main/` file
- Any `src/preload/` file
- Any `src/shared/` file
- Any other renderer file not listed above

---

## Allowed Commands

```
npm run typecheck:node
npm run typecheck:web
npx vitest run --reporter=verbose
```

Do not use `--fix`.

---

## Forbidden Commands

```
npm run dev
npm install
npx (anything other than vitest run)
git push
port 3030 open
```

---

## Package / Dependency Change

FORBIDDEN. No npm install. No new imports from external packages.
Only internal project imports allowed.

---

## Runtime

FORBIDDEN. Do not start the Electron application during this task.

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
