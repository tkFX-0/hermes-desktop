# Phase E External Reference Matrix — v1.9.0

## Purpose

Maps all `hermes-desktop` references that are external GitHub URLs and
classifies their Phase E disposition.

- matrixVersion: v1.9.0
- matrixDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## References by Category

### A. Build/Packaging — CHANGE in Phase E

| File | Field | Action |
|---|---|---|
| `electron-builder.yml` | `publish.repo: hermes-desktop` | Change to `shikishima-desktop` after GitHub rename |
| `dev-app-update.yml` | `repo: hermes-desktop` | Change to `shikishima-desktop` after GitHub rename |

**Critical**: These must ONLY change AFTER the GitHub repo is actually renamed.
Changing them before the GitHub rename will break auto-update.

---

### B. Documentation Links — CHANGE in Phase E

| File | Reference type | Action |
|---|---|---|
| `README.md` | GitHub repo URLs | Update to new repo URL |
| `README.zh-CN.md` | GitHub repo URLs | Update to new repo URL |
| `CONTRIBUTING.md` | GitHub repo URLs | Update to new repo URL |
| `CONTRIBUTING.zh-CN.md` | GitHub repo URLs | Update to new repo URL |

---

### C. Upstream References — KEEP (never change)

| File | Reference | Reason |
|---|---|---|
| `src/main/hermes.ts` | Upstream hermes-agent code | Upstream — keep |
| `src/main/installer.ts` | `HERMES_HOME`, `~/.hermes/` paths | Upstream tool directory |
| `src/main/ichikishima/hermes/` | Bridge to upstream hermes-agent | Upstream — keep |
| All README upstream attribution | Original project credit | Attribution — keep |

---

### D. GitHub Redirect Behavior

When a GitHub repo is renamed:
- The old URL `github.com/fathah/hermes-desktop` will redirect for ~30 days
- After redirect expires, old URLs will 404
- electron-builder update mechanism uses `publish.repo` to construct release URLs
- **Action required**: Update `publish.repo` and `dev-app-update.yml` before the redirect expires

---

### E. Phase E Execution Timing

| Step | Timing | Notes |
|---|---|---|
| GitHub repo rename (external) | External human action | Must happen first |
| Update `publish.repo` | Immediately after GitHub rename | Before redirect expires |
| Update `dev-app-update.yml repo` | Same commit as publish.repo | Atomic update |
| Update docs links | Same commit or follow-up | Low urgency |

---

## appId Note

`appId: com.nousresearch.hermes` is a macOS/Windows application identifier.
It is NOT related to the GitHub repo name. It must remain unchanged in Phase E.
Changing `appId` would break:
- macOS app registration
- Windows auto-update registration
- Existing user installations

この範囲では問題を検出していません。
