# AI-USAGE-03: Cooldown & Routing Policy

**date:** 2026-05-21

---

## Routing Decision Matrix

| ClaudeCode | Codex | Claude | Recommended Action |
|---|---|---|---|
| READY | any | any | ClaudeCode で Shikishima 実装 |
| COOLDOWN | READY | any | StackChan のみ Codex / Shikishima は延期 |
| COOLDOWN | COOLDOWN | READY | Claude で設計・計画のみ / 実装延期 |
| LIMITED | any | any | 残量節約 / 軽量タスクのみ |
| BLOCKED | BLOCKED | any | 人間が手動で判断 |
| UNKNOWN | UNKNOWN | UNKNOWN | 人間が手動で確認してから決定 |

---

## Routing Rules

### ClaudeCode

```text
READY:
  → Shikishima 実装 / docs / typecheck / evidence commit

COOLDOWN:
  → 実装タスクを延期
  → Claude で設計相談のみ可
  → 重要度が低い場合は翌セッション以降に延期

LIMITED:
  → 残り制限内で最小限の commit のみ
  → 大きな機能実装は次セッションへ

NEEDS_MANUAL_UPDATE:
  → ユーザーが状態を確認してから再開
```

### Codex

```text
READY:
  → StackChan 専用タスクのみ使用
  → Shikishima core タスクには使わない

COOLDOWN:
  → StackChan タスクを延期
  → Shikishima core には影響なし
```

### Claude (API)

```text
READY:
  → 設計相談 / 文書レビュー / 計画立案
  → 実装タスクは ClaudeCode に委譲

UNKNOWN:
  → 設計相談は可 (Claude は対話ベースなので常時利用可能と仮定)
```

---

## Never

```text
- 制限を回避するためにアカウントを切り替えない
- 残量を消費しないように重要タスクを後回しにして品質を下げない
- プロバイダーの利用規約に違反する方法でクォータを節約しない
- BLOCKED 状態を無視して強行実行しない
```

---

## Cooldown Display

```text
cooldown_warning: true のとき:
  → UIに「⚠ クールダウン中」バッジを表示
  → ルーティング推奨に「実装延期推奨」を表示
  → 自動的にタスクを止めない (表示のみ)
```
