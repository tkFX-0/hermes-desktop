# AI-USAGE-04: Unsupported Provider Policy

**date:** 2026-05-21

---

## Policy

未対応プロバイダーは **UNKNOWN** として表示し、実装を急がない。

---

## Unsupported Providers (current)

| Provider | Reason | Status | Path to Support |
|---|---|---|---|
| ChatGPT | No public usage API | UNKNOWN | screen_manual_only |
| OpenAI API | Requires API key + GO | FUTURE | openai_api_go |
| Cursor | No public API | UNKNOWN | manual only |
| Gemini | Requires API key + GO | FUTURE | gemini_api_go |
| Grok | Requires API key + GO | FUTURE | grok_api_go |
| local LLM | Requires local config | FUTURE | local_llm_go |

---

## Display Rule

```text
未対応プロバイダーのカードは:
  - status: UNKNOWN
  - dataSource: unknown
  - label: "future adapter"
  - grayed out / disabled appearance
  - no connect / login button
```

---

## Adding a New Provider

```text
1. AIUsageProvider 型に追加
2. AIUsageAdapter 実装 (手動 or API)
3. 設計書 AI_USAGE_01 を更新
4. typecheck PASS
5. commit (push GO 別途)
6. API 接続を伴う場合: 追加の Level 5 GO が必要
```

---

## Never

```text
- 未対応プロバイダーへの接続を試みない
- 公式サポートのない API エンドポイントを使わない
- プロバイダーのログイン状態を自動操作しない
```
