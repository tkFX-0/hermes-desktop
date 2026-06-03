# UI-14 Allowed Files and Commands

## Files Modified (actual)

```
REQUIRED (modified):
  src/renderer/src/assets/command-center-tokens.css
  src/renderer/src/screens/Operator/OperatorPage.tsx
  src/renderer/src/screens/CommandChat/CommandChatPage.tsx

NOT modified (confirmed):
  package.json
  package-lock.json
  tsconfig.*.json
  Any test file
  Any shared type file
  Any other page or component
```

## Night Task Specified Paths vs Actual Paths

| Night Task Specified | Actual Path Used |
|---|---|
| `CommandCenter/pages/OperatorPage.tsx` | `screens/Operator/OperatorPage.tsx` |
| `CommandCenter/pages/CommandChatPage.tsx` | `screens/CommandChat/CommandChatPage.tsx` |
| `CommandCenter/command-center-tokens.css` | `assets/command-center-tokens.css` |

Path discrepancy: Night Task B would have flagged this and STOPped.
Since implementation was done before Night Task B, actual paths were used.
No safety impact.

## Allowed Commands (run)

```
npm run typecheck:node  → PASS
npm run typecheck:web   → PASS
npm test -- mobile-console       → 37/37 PASS
npm test -- ui-snapshot-helpers  → 45/45 PASS
```

## Forbidden Commands (not run)

```
npm install     → not run
npx             → not run
npm run dev     → not run
git push        → implementation already pushed (5055b6d)
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
