# Security and Safety Audit Notes

## Purpose

This document records security and safety signals found in the v1.1.0
Repository Hygiene Audit. Findings are redacted-only (no raw values, no local
paths, no secrets). This document does not approve any execution, connection,
or configuration change.

- auditVersion: v1.1.0
- auditDate: 2026-05-11
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Finding Legend

| Status | Meaning |
|---|---|
| PASS | No concern; safe for docs/static-only context |
| INFO | Noted; expected for upstream Electron app features |
| HOLD | Needs human review before approval |
| NG | Would block GO approval if not resolved |

---

## 1. Raw Value Output

| Check | Status | Notes |
|---|---|---|
| Raw API keys in src files | PASS | No API keys found hardcoded in source |
| Raw local paths in src files | INFO | Absolute path construction via os.homedir() — runtime only, not hardcoded raw values |
| Raw values in sandbox/ | PASS | `sandbox/hermes-autonomy-zone/local-only/` is gitignored |
| Raw values in docs/ | PASS | No raw values found in docs/shikishima/ |

---

## 2. Secret / Token / API Key Signals

Grepped for: `API_KEY`, `api_key`, `apiKey`, `secret`, `SECRET`, `token`,
`TOKEN`, `password`, `PASSWORD`.

| Location | Finding | Status | Notes |
|---|---|---|---|
| `src/main/installer.ts` | Reads API key from `~/.hermes/.env` at runtime | INFO | Expected: installer reads user's env file; not hardcoded |
| `src/renderer/src/screens/Gateway/Gateway.tsx` | Handles env vars including API key fields | INFO | Expected: settings UI shows key configuration fields |
| `src/main/ichikishima/hermes/hermes-wsl2-wrapper-config.ts` | `allowedExecutableId` field | INFO | Logical identifier only; no raw value |
| `src/renderer/src/screens/Setup/Setup.tsx` | API key input fields | INFO | Expected: setup wizard has API key entry |
| `src/shared/i18n/locales/en/constants.ts` | Token/API label strings | INFO | i18n strings only; not secrets |
| Overall | No raw API keys or secrets found in source | PASS | — |

---

## 3. External URL / CDN / API / Fetch / WebSocket

Grepped for: `fetch(`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `axios`,
`https?://`.

| Location | Finding | Status | Notes |
|---|---|---|---|
| `src/main/installer.ts` | fetch calls to hermes-agent upstream | INFO | Upstream installer downloads from GitHub; not custom code |
| `src/main/claw3d.ts` | fetch calls | INFO | Upstream claw3d integration |
| `src/main/ichikishima/hermes/hermes-bridge-pilot-dry-run.ts` | fetch | INFO | Dry-run only; no execution |
| `src/main/ichikishima/control-center/local-api-server.ts` | local HTTP server | HOLD | Local-only API server for Control Center; not external |
| `src/renderer/src/screens/Research/Research.tsx` | fetch calls | INFO | Research feature; upstream hermes-agent feature |
| i18n locale files | `https?://` URLs in i18n strings | INFO | Display strings only; not actual network calls |
| `src/renderer/src/constants.ts` | URL constants | INFO | Configuration constants; not direct calls |
| Overall | Fetch/network calls are upstream feature components | INFO | — |

**Content Security Policy (index.html):**

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:
```

Status: PASS — No external CDN, no external script sources. `unsafe-inline`
for styles is standard Electron practice.

---

## 4. Execution Buttons / Forms / Inputs

Grepped for: `execFile`, `spawn`, `exec`, `child_process`.

| Location | Finding | Status | Notes |
|---|---|---|---|
| `src/main/installer.ts` | `spawn`, `execSync`, `execFile` from child_process | INFO | Upstream installer; expected for hermes-agent install |
| `src/renderer/src/screens/Install/Install.tsx` | `startInstall()` button | INFO | Upstream: starts hermes-agent installation |
| `src/renderer/src/screens/Gateway/Gateway.tsx` | `toggleGateway()` button | INFO | Upstream: start/stop hermes messaging gateway |
| `src/main/ichikishima/` files | References to execFile in typing, no direct calls | INFO | Design contracts; execFile is not called directly from shikishima layer |
| WSL2 wrapper files | `willInvokeWsl: false` hardcoded | PASS | Explicitly blocked; no WSL execution |
| Overall | Execution capability is upstream hermes-agent feature; not shikishima additions | INFO | — |

**Shikishima Layer Boundary:**

The `src/main/ichikishima/` custom layer does NOT add new execution capability
beyond what the upstream hermes-desktop provides. The WSL2 wrapper logic
contains only validation and design contracts, with `willInvokeWsl: false`
hardcoded. Execution gating (`autonomy-zone/`, approval system) is a
safety-adding layer, not an execution-enabling layer.

---

## 5. Audio / Video / Canvas

| Check | Status | Notes |
|---|---|---|
| `<audio>` elements | PASS | None found in renderer HTML/TSX files |
| `<video>` elements | PASS | None found in renderer HTML/TSX files |
| `<canvas>` elements | PASS | None found in renderer HTML/TSX files |
| MediaDevices API | PASS | No calls found in src/renderer/ |

---

## 6. WSL / Hermes Backend / Wrapper / Dummy / RunPod / StackChan / Robot

| Check | Finding | Status |
|---|---|---|
| WSL execution | `hermes-wsl2-wrapper-config.ts`: `willInvokeWsl: false` | PASS |
| Hermes backend execution | installer.ts starts hermes-agent as subprocess | INFO |
| Dummy wrapper | `sandbox/hermes-autonomy-zone/dummy-hermes/` exists | INFO (test only) |
| RunPod | No RunPod code found in src/ | PASS |
| StackChan | StackChan referenced in docs/shikishima only (design docs) | PASS |
| Robot motion | No robot control code in src/ | PASS |
| External network from ichikishima layer | No direct external calls from ichikishima/ | PASS |

---

## 7. GO / productionReady / execution enabled Misread Risk

| Check | Finding | Status |
|---|---|---|
| `productionReady: true` in src | Not found | PASS |
| `execution: enabled` in src | Not found | PASS |
| `GO approved` in src | Not found | PASS |
| Control center status cards | `READY_FOR_*` card types exist | HOLD |

The `ControlCenterReadinessCard` type includes values like:
- `READY_FOR_LOCAL_PILOT`
- `READY_FOR_LOCAL_FULL_LOOP`
- `SHADOW_MODE_READY`

These are UI display cards for the Control Center dashboard. They represent
readiness states for display, NOT execution approval. Misread risk exists if
these values are shown without sufficient safety labeling in the UI.

**Recommendation (for future human review):**
Ensure Control Center UI shows explicit safety disclaimer that readiness cards
are display-only and do not approve execution.

---

## 8. .gitignore Coverage Review

| Protected Item | Gitignored? | Status |
|---|---|---|
| `.env` files | YES (`/.env`, `/.env.*`) | PASS |
| `sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.json` | YES | PASS |
| `sandbox/hermes-autonomy-zone/local-only/wsl-distro-selection.local.json` | YES | PASS |
| `.task-start-time.local.txt` | YES | PASS |
| `node_modules/` | YES | PASS |
| `dist/`, `out/`, `release/` | YES | PASS |
| `.claude/worktrees` | YES | PASS |

All sensitive local files have confirmed .gitignore protection.

---

## 9. Risks Summary

| Risk | Level | Notes |
|---|---|---|
| API key leakage via git | LOW | .gitignore protects .env; no raw keys in src |
| Unintended WSL execution | LOW | willInvokeWsl: false hardcoded |
| ControlCenter readiness cards misread as GO approval | LOW | Mitigated in v1.1.1 — safety banner + inline labels added |
| docs/ichikishima/ path references in src becoming stale | LOW | After rename, ICHIKISHIMA_READONLY_DOC_PATHS must update |
| External network from installer | INFO | Upstream feature; expected behavior |

---

## Safety Boundary Confirmation

During this audit:

- No WSL command was executed
- No Hermes backend command was executed
- No wrapper or dummy wrapper was executed
- No external network connections were made
- No git push was performed
- No raw values were reported
- No execution was enabled

この範囲では問題を検出していません。
