# AI-USAGE-00: Model Usage Cockpit Design

**date:** 2026-05-21
**status:** DESIGN — display-only, no API calls, no token read/write
**productionReady:** false / **execution:** disabled

---

## Purpose

AI Usage Cockpit は、複数の生成AIプロバイダーの**利用状態・制限・クールダウン・ルーティング推奨**を
一元表示するダッシュボードです。

外部APIへの接続・トークン読取・スクレイピングは一切行いません。
表示データはすべて **手動入力・ユーザー報告・推定値** です。

---

## Core Principle

```text
FACT / MANUAL_REPORTED / ESTIMATED / UNKNOWN は絶対に混在させない。
データソースを常に明示する。
「制限を回避する」ための機能は一切持たない。
```

---

## Data Sources

| Source | Description | Trust Level |
|---|---|---|
| official_api | 公式 API からの自動取得 | High (将来実装) |
| cli_manual | CLI 出力を人間が手動で転記 | Medium |
| screen_manual | 管理画面のスクリーンショット / 目視転記 | Medium |
| user_reported | ユーザーが報告した値 | Low-Medium |
| estimated | 使用量推計 (経験則ベース) | Low |
| unknown | 不明 | N/A |

**現在の実装: manual / user_reported / estimated のみ**

---

## Providers (Initial)

| Provider | Role | Status Source | Routing |
|---|---|---|---|
| ClaudeCode | Shikishima 実装ワーカー | cli_manual | 実装/docs/typecheck/evidence |
| Claude | 設計・レビュー・計画 | manual | 設計相談 |
| Codex | StackChan 専用 | user_reported | StackChan のみ |

## Providers (Future)

```text
ChatGPT / OpenAI API / Cursor / Gemini / Grok / local LLM / other
→ future adapter 経由 / デフォルト UNKNOWN
```

---

## Routing Rules (Summary)

```text
ClaudeCode READY → Shikishima 実装に使う
ClaudeCode COOLDOWN → Claude で計画のみ / 実装は延期
Codex READY → StackChan のみ
Codex COOLDOWN → StackChan タスクを延期
全プロバイダー UNKNOWN → 人間が手動判断
```

---

## Forbidden

```text
- プロバイダーへの接続ボタン
- ログインボタン / 認証UI
- スクレイピング機能
- トークン入力フィールド
- APIキーフィールド
- 自動リフレッシュ
- 制限回避 / アカウント切り替え促進
```

---

## Implementation Phases

```text
Phase A: docs + type definitions (今回)
Phase B: display-only UI panels (今回)
Phase C: manual input form (将来 / 追加 GO 必要)
Phase D: official API adapter (将来 / 高リスク / 別途 GO)
```

---

## Safety

```yaml
token_stored:       false
api_called:         false
scraping:           false
login_automation:   false
productionReady:    false
execution:          disabled
rawValuesReported:  false
```
