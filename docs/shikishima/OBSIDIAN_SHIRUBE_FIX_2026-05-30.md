# しるべ Obsidian 書き込み修正（2026-05-30）

## 原因（ログ・README 照合）

| 項目 | 旧状態 | 修正後 |
|------|--------|--------|
| 既定 Vault | `Documents/Obsidian`（存在しないことが多い） | `Documents/Obsidian Vault` |
| セッション記録 | `docs/logs/` のみ（21:00 flush） | 同左 + **`しきしま/Daily/YYYY-MM-DD.md`** |
| 「記録して」 | LLM 返答のみ（Obsidian 未実行） | `detectToolCommand` → `writeObsidian` |
| README `local_write: HOLD` | **憲法証跡庫**（`shikishima-library/30_Evidence`）の OB-01 | ユーザー Vault へのしるべ書き込みは別経路で **稼働** |

## 確認コマンド

```powershell
node scripts/shikishima-obsidian-vault-check.mjs
node scripts/shikishima-obsidian-vault-check.mjs --json
```

`ready: true` かつ `vaultPath` が実際の Obsidian フォルダであること。

Discord: `!obsidian-status` / 「記録して」 / `@しるべ 記録して …`

## Cursor → StackChan（意図別）

- `.cursor/hooks.json` — `stop` で発火
- `scripts/lib/stackchan-operator-notify.mjs` — 完了 / プラン選択 / 判断 / 質問 など **別フレーズ**
- Doc: `STACKCHAN_OPERATOR_NOTIFY_2026-05-30.md`
- `SHIKISHIMA_STACKCHAN_HOLD=1` のときは音声スキップ

手動試験:

```powershell
node scripts/shikishima-operator-notify.mjs --intent plan_selection_needed --dry-run
node scripts/shikishima-cursor-response-complete.mjs --dry-run
```

## 人手

1. Bot 再起動: `node scripts/shikishima-process-preflight.mjs --clean --restart-dev`
2. Obsidian で `しきしま/Daily/` を開き、flush または「記録して」後にファイル増えるか確認
3. StackChan 音声が要る場合: `node scripts/shikishima-stackchan-resume.mjs`（HOLD 解除）
