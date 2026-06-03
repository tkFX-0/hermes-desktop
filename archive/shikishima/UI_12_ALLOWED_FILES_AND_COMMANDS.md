# UI-12 Allowed Files and Commands

## Allowed Files to Modify

```
REQUIRED:
  src/renderer/src/screens/Layout/Layout.tsx

OPTIONAL (only if compile requires it):
  src/renderer/src/screens/Layout/types.ts (if it exists)
```

## Forbidden Files

```
FORBIDDEN (must not touch):
  - src/renderer/src/App.tsx (unless Layout.tsx alone is impossible)
  - Any file outside src/renderer/src/screens/Layout/
  - package.json / package-lock.json
  - tsconfig.*.json
  - Any test file
  - Any shared type file (ui-page-types.ts, ui-safety-types.ts, etc.)
  - Any existing page component (Chat, Settings, Research, etc.)
  - Any shell component (SafetyStrip, PageTabs, PageShell — read only)
  - Any docs file (under docs/)
  - .gitignore, .claude/settings.json
```

## Allowed Commands

```
ALLOWED:
  npm run typecheck:node
  npm run typecheck:web
  npm test

FORBIDDEN:
  npm install
  npm run dev
  npx (any)
  git push
  Any external API call
  Any runtime start
```

## Allowed Imports to Add in Layout.tsx

```
ALLOWED (add as needed):
  import { PageShell } from '../../components/Shell/PageShell';
  import { OperatorPage } from '../Operator/OperatorPage';
  import { CommandChatPage } from '../CommandChat/CommandChatPage';
  import { StackChanPage } from '../StackChan/StackChanPage';
  import { OutboxPage } from '../Outbox/OutboxPage';
  import { QueuePage } from '../Queue/QueuePage';
  import { GoPage } from '../GoPage/GoPage';
  import { EvidencePage } from '../Evidence/EvidencePage';
  import { StopPage } from '../Stop/StopPage';
  import { PushPage } from '../Push/PushPage';
  import { CommandSettingsPage } from '../CommandSettings/CommandSettingsPage';
  import { CommandHelpPage } from '../CommandHelp/CommandHelpPage';
  import type { PageId } from '../../../../shared/ichikishima/ui-page-types';
  import type { SafetyStripDisplayData, ... } from '../../utils/snapshot-to-page';
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
