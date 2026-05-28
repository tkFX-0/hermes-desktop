# Hermes Desktop / しきしま — 永久記憶（運用者向け）

最終更新: 2026-05-28

## 運用者プロフィール

- ユーザーは **バイブコーダー**（コーディングは主に AI に任せる）
- 実機作業は **電源・Wi‑Fi・許可GO・耳での判定・チャット報告** が中心
- 詳細手順: `docs/shikishima/STACKCHAN_REAL_DEVICE_GO_OPERATOR_GUIDE.md`

## StackChan 実機GO（要約）

| 段階 | 誰 | 内容 |
|------|-----|------|
| 準備 | 人間 | VOICEVOX 起動、StackChan 電源、同じ家の LAN（有線 PC + Wi‑Fi StackChan 可） |
| 設定 | AI | `.env.local` の `STACKCHAN_HOST` が実機 IP と一致（値はチャットに出さない） |
| 確認 | AI | 接続チェックのみ → **`connected: true` になるまで送信しない** |
| 送信 | 人間+AI | チャットで **「許可GO」** → voice one-shot **1回だけ** |
| 判定 | 人間 | `audible_clear` / `still_faint` / `silent` を報告。**送れた≠合格** |

## 有線 PC + Wi‑Fi StackChan（2026-05-28）

- **同じ Wi‑Fi である必要はない**。同じルーターの LAN（有線↔Wi‑Fi）なら通常つながる
- 2026-05-28: `connected: false` の主因は **TypeScript 側が `.env.local` の IP を読めず 127.0.0.1 固定**だった（Codex 用 `.mjs` は直接読んでいた）。`stackchan-local-service.ts` を `resolveStackChanHost()` に修正後 `connected: true`

## StackChan voice（2026-05-28）

- **Phase 1 voice pilot: PASS**（人間可聴確認。1回送信で2回音が聞こえた → マイルストーン連鎖が原因。`skipMilestone` を pilot に追加済み）
- `stackchan_resume` ゲート: **完了**（pilot 範囲）
- 接続: `connected: true`
- 本番自動発話・Discord 経路: **まだ HOLD**（別 GO）
- Burn-in 順序（人間判断）: **15分 smoke → 2時間**
- 現状レベル（コード評価）: **Level 6**（Limited Autonomous Exec）。Level 8（完全自律運用）は **未達**
- 解除ロードマップ: `docs/shikishima/FULL_AUTONOMY_ENABLEMENT_ROADMAP_2026-05-28.md`（Track A→D、各段階の許可GO文言）
- Track A1 15m smoke Burn-in: **PASS** (2026-05-28)
- Track B1 Discord→StackChan voice 1回: **PASS** + 人間聴取 **PASS** (`B1PASS` 2026-05-28)
- Track A2 2h Burn-in: **PASS** (2026-05-28, 120 ticks)
- FA-11 Burn-in: **PASS**
- **Level 8 宣言** (pilot scope, A4): **DONE** 2026-05-28
- Track B2 secretary bounded loop: **PASS** (2026-05-28, 3 cycles)
- Track B3 StackChan voice bounded loop: **PASS** (2026-05-28, 3 cycles)
- Track C2 Hermes shadow 1回: **PASS** (2026-05-28)
- Track C3 Hermes shadow bounded loop: **PASS** (2026-05-28)
- **PASS ledger**: `FULL_AUTONOMY_PILOT_PASS_LEDGER_2026-05-28.md`（A–C 全 PASS・人間確認バッチ）
- Track D + ops: execution/productionReady ON, **sidebotHoldReleased**, **hermesDaemonPilotEnabled**（local json）
- Status: `npx tsx scripts/shikishima-operational-status.mjs`
- 完全自律 Phase 2–10 コードは進んだが **Level 8 / 声の章は実機合格まで未完了**
- `FULL_AUTONOMY_STACKCHAN_DEFERRED.md` 参照

## 不変条件（触らない）

```text
decision = HOLD
execution = disabled
productionReady = false
rawValuesReported = false
humanGoApprovalRequired = true
```

## 許可GO

- 人間が **「許可GO」** と言ったときのみ、承認された one-shot を即実行（時間窓宣言不要）
- 人間の **可聴確認** がない限り phase1 voice は PASS にしない

## 実機GO 再開ゲート（stackchan_resume）

1. `connected: true`
2. 許可GO + one-shot + 人間が `audible_clear`
3. その後 doc / マトリクスで phase1 を再開検討（自動本番化なし）

## コード入口（AI 用・運用者は実行不要）

- パイプライン: `runFullAutonomyPipeline({ stackchanDeferred: true })`
- 手順書: `STACKCHAN_REAL_DEVICE_GO_OPERATOR_GUIDE.md`

## nextRequiredHumanAction

- 通常: `human_review_go_policy_prerequisites`
- StackChan 再開時: 上記実機GO手順書のステップ 1 から
