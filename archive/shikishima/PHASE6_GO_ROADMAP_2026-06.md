# Phase 6 — 別 GO 完成ロードマップ

Date: 2026-06-01 · Status: 実行ガイド

## 波と状態

| GO | 内容 | 状態 |
|----|------|------|
| **GO-B** | dev-pipeline 仕上げ（DEP0190 · composer leg · probe） | done（コード） |
| **GO-C** | SC-013 Electron `guardedStackchanSayLocal` | done（コード） |
| **GO-D** | 本 doc + PLAYBOOK/HANDOFF 同期 | done |
| **GO-E** | constitutional scopes ≥8 · readiness READY | activate 済み想定 |
| **GO-F** | PHASE_D charter + mock vitest · EA 本番 HOLD | F0/F1 done |
| **全てGO** | `shikishima-zenbu-go-activate.mjs` · automation **GO** · 進捗 100% 設計 | 2026-06-01 |

## 毎日（プロジェクト root 必須）

```powershell
Set-Location "C:\Users\81903\Desktop\プロジェクトファイル\hermes-desktop"
node scripts/shikishima-autonomy-status.mjs
node scripts/shikishima-run-autonomy-gap-tasks.mjs
node scripts/shikishima-run-ordered-tasks.mjs --skip-stackchan-resume
```

## dev-pipeline

```powershell
node scripts/shikishima-wsl-dev-preflight.mjs --json
node scripts/shikishima-dev-pipeline-probe.mjs
node scripts/shikishima-human-go-readiness.mjs
```

## 憲法 GO（スコープ単位 · グローバル execution は開けない）

```powershell
node scripts/shikishima-constitutional-go-activate.mjs
npx tsx scripts/shikishima-constitutional-go-execute.mjs
node scripts/shikishima-orchestrator-gates-audit.mjs
```

## 残 HOLD（別 GO）

- グローバル `execution=enabled` · 24h 無制限 Discord/dev
- FX/MT5 本番 · 既存 EA 改変 — [PHASE_D_FX_EA_GO_CHARTER_2026-06.md](PHASE_D_FX_EA_GO_CHARTER_2026-06.md)
- git push — 明示 GO のみ

関連: [PHASE5_HUMAN_GO_BACKLOG.md](PHASE5_HUMAN_GO_BACKLOG.md) · [POST_HUMAN_GO_NEXT_STEPS_2026-05-31.md](POST_HUMAN_GO_NEXT_STEPS_2026-05-31.md)
