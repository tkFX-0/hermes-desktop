# スコープ付き実行 GO（2026-05-30）

ユーザー承認: **MT5 バックテスト** と **自律開発ループ** を緩和。  
**本番 `decision=HOLD` / ライブ売買 / git push / production execute は不変。**

## 記録

```powershell
node scripts/shikishima-record-execution-scope-go.mjs
```

または `.env.local`:

```env
SHIKISHIMA_MT5_BACKTEST_GO=1
SHIKISHIMA_AUTONOMOUS_DEV_GO=1
SHIKISHIMA_AUTONOMOUS_DEV_AUTO_LOOP=1
SHIKISHIMA_DEV_PIPELINE_ENABLED=1
```

## 自律ワークフロー（7段階）

`指示 → 開発 → 研究 → 記録(BT) → 評価 → 人間 → ループ`

| Discord | 動作 |
|---------|------|
| `!workflow enqueue <指示>` | キューに追加 |
| `!workflow` / `!workflow status` | キュー一覧 |
| `!execution-scope` | 現在の G/H |

オーケストレータ tick（30分）で `dev.autonomous` ルートが 1〜3 ステップ進む。

```powershell
node scripts/shikishima-autonomous-dev-tick.mjs
```

## MT5 バックテスト

- `scripts/lib/mt5-backtest-runner.mjs`
- `*backtest*.json` を MT5 Files から検出・金額 redacted 保存
- ライブ注文は送らない

## まだ HOLD

- ライブ売買・口座操作
- git push
- `execution=enabled` / 憲法本番 execute
- 既存 EA ソースの無断変更（保護領域）
