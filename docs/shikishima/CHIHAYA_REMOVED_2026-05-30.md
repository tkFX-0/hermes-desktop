# ちはやエージェント廃止（2026-05-30）

## 理由

- EA/MT5 開発依頼がちはやに横取りされ、無関係な FX 応答になることがあった
- 正規設計は **AT-AGENT-00 の5体**（しきしま / しずめ / つむぎ / はじめ / しるべ）

## 振り分け（Discord SideBot）

| 依頼 | エージェント |
|------|----------------|
| EA / MT5 / MQL5 / バックテスト / 実装 | **つむぎ** |
| 計画・ロードマップ・タスク分解 | **はじめ** |
| GitHub 探索・調査・記録・相場リサーチ | **しるべ** |
| GO/HOLD・安全 | **しずめ** |
| 全体・窓口 | **しきしま** |

## 廃止した機能

- Discord ペルソナ `chihaya` / 専用 Webhook（6体→5体）
- `chihayaHandleCommand` の poll 横取り（`/^!?ea/` 等）
- `isChihayaHeld` による `ea` 文字列ブロック（誤爆の原因）
- キルゾーン定期 Discord 通知
- `!chihaya-*` / `!fx-on|off` → しずめが廃止案内を返す

## コード

- 正規一覧: `scripts/lib/canonical-agent-team.mjs`
- 旧モジュール: `scripts/shikishima-chihaya.mjs`（**import 禁止**）

## Bot 再起動

```powershell
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
```
