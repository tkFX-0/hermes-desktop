# Phase D — FX / EA Human GO Charter

Date: 2026-06-01 · Status: **F0 設計** · F2 本番 **HOLD**

## 目的

金融・EA 領域を段階的に開く前の憲章。本ファイル承認まで **既存 EA 改変・ライブ注文・口座情報の取扱いは禁止**。

## 許可スコープ（将来 GO 単位）

| 段階 | 内容 | G/H |
|------|------|-----|
| F0 | 本 charter + 監査 doc | **G**（doc のみ） |
| F1 | vitest モック · dry-run ラッパ | **G**（ネットワークなし） |
| F2 | MT5 接続 · EA 変更 · 自動売買 | **H**（別憲法） |

## 禁止（常時）

- 既存 EA ソースの変更
- `.env` / 口座番号 / API キーのチャット出力
- 人間 GO なしの git push
- `SHIKISHIMA_ALLOW_PAID_API=1` による執行系 API

## 受入（F1）

- `tests/hermes/zone/phase-d-fx-policy.test.ts` pass
- しずめ critical ゲート doc 参照
- `decision=HOLD` / `execution=disabled` グローバル維持

## 参照

- [JARVIS_PHASE_A_D_ROADMAP_2026-05-31.md](JARVIS_PHASE_A_D_ROADMAP_2026-05-31.md)
- [CODEX_WORKER_RESOURCE_REGISTRY.md](CODEX_WORKER_RESOURCE_REGISTRY.md)
- SHI-A3 `deferred`（DESIGN_INVENTORY）
