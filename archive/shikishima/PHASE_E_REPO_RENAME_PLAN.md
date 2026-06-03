# Phase E Repo Rename Plan — v1.9.0

## Plan Overview

- planVersion: v1.9.0
- planDate: 2026-05-12
- planType: plan-only — no external action, no git push
- roadmapVersion: v1.9.0
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- targetExecutionVersion: v1.9.1 (requires explicit human GO + external GitHub action)

No external operations were performed during this plan creation.

---

## What Phase E Involves

Phase E is the GitHub repository rename from `hermes-desktop` to `shikishima-desktop`
(or a chosen name). This requires:

1. **External action**: GitHub rename via web UI or GitHub API
2. **Code changes**: `publish.repo` and `dev-app-update.yml repo` in the repo itself
3. **Coordination**: All existing URLs, CI badges, README links, CONTRIBUTING links

---

## Current References That Will Change

| File | Field | Current | After rename |
|---|---|---|---|
| `electron-builder.yml` | `publish.repo` | `hermes-desktop` | `shikishima-desktop` |
| `dev-app-update.yml` | `repo` | `hermes-desktop` | `shikishima-desktop` |

---

## References That Must Be Updated in Documentation

| File | Reference type | Current value |
|---|---|---|
| `README.md` | GitHub repo URL | upstream hermes-desktop references |
| `CONTRIBUTING.md` | GitHub repo URL | upstream hermes-desktop references |
| Any CI badge references | Badge URL | upstream badge URL |
| `docs/ichikishima/` | Various specs | references to upstream repo |

---

## References That Must NOT Change

| Reference | Reason |
|---|---|
| `appId: com.nousresearch.hermes` | macOS/Win app ID — changing breaks existing app installs |
| `publish.owner: fathah` | GitHub username — independent |
| Upstream hermes-agent references in src/main/ | Upstream tool — keep |
| `window.hermesAPI.*` | Upstream IPC bridge name |

---

## Execution Steps (HOLD — requires v1.9.1 GO)

| Step | Action | Risk | Notes |
|---|---|---|---|
| 0 | Confirm GitHub rename is planned and coordinated | — | External |
| 1 | **External**: rename GitHub repo `hermes-desktop` → `shikishima-desktop` | EXTERNAL | GitHub web UI or API |
| 2 | Update `electron-builder.yml` `publish.repo` | MEDIUM | Must match actual repo name |
| 3 | Update `dev-app-update.yml` `repo` | MEDIUM | Must match actual repo name |
| 4 | Update README.md GitHub links | LOW | Documentation |
| 5 | Update CONTRIBUTING.md GitHub links | LOW | Documentation |
| 6 | Verify auto-update mechanism works with new repo URL | — | After step 1-3 |
| 7 | Commit all changes atomically | — | Single rename commit |

---

## Rollback Plan

If Phase E causes issues:

1. **External**: GitHub supports renaming back (old URL redirects remain ~30 days)
2. **Code**: Revert `publish.repo` and `dev-app-update.yml repo` back to `hermes-desktop`
3. Revert documentation link changes

---

## GO Conditions

Before v1.9.1 Phase E execution:

- [ ] GitHub repo rename is confirmed and ready to execute
- [ ] Explicit human GO issued for Phase E
- [ ] Phase D (src rename) decision made — Phase E can proceed independently of Phase D
- [ ] All team members (if any) aware of URL change
- [ ] Redirect period understood (GitHub provides redirect ~30 days after rename)

---

## NG Conditions

- `appId` is changed (must remain `com.nousresearch.hermes`)
- `publish.owner` is changed
- Upstream hermes references in src/main/hermes.ts are changed
- git push happens without explicit approval

---

## Dependency on Phase D

Phase E (repo rename) is **independent** of Phase D (src rename).
They can be executed in any order. However:
- If Phase D is executed first, some docs may need Phase D + Phase E changes together
- If Phase E is executed first, repo references are updated; src paths remain ichikishima

Recommended order: Phase D first, then Phase E (cleaner audit trail).

---

## Note on `hermes-desktop` Directory Name

The root directory of the local clone is `hermes-desktop/`. This is the local
filesystem path and is independent of the GitHub repo name. After Phase E:
- GitHub repo: `shikishima-desktop`
- Local clone directory: can remain `hermes-desktop/` or be renamed locally

Renaming the local directory is Phase E-local and is optional/separate.

この範囲では問題を検出していません。
