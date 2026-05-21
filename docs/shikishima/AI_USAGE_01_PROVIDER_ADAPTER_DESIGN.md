# AI-USAGE-01: Provider Adapter Design

**date:** 2026-05-21
**status:** DESIGN — future interface definition

---

## Adapter Interface (future)

```typescript
// Future adapter interface — not yet implemented
// Each provider implements AIUsageAdapter
interface AIUsageAdapter {
  readonly providerId: AIUsageProvider;
  readonly dataSource: AIUsageDataSource;
  fetchStatus(): Promise<AIUsageProviderState>;  // future — requires API GO
  isAvailable(): boolean;
  getRoutingRecommendation(): AIUsageRoutingDecision;
}
```

---

## Current Adapters (manual/static only)

### ClaudeCodeManualAdapter

```text
source:    cli_manual / user_reported
fetch:     no API call — human reads CLI output
fields:    status / usageSummary / resetHint
update:    manual (user reports via Shikishima UI in future)
```

### ClaudeManualAdapter

```text
source:    manual
fetch:     no API call
fields:    status (READY / UNKNOWN)
update:    manual
```

### CodexManualAdapter

```text
source:    user_reported
fetch:     no API call
fields:    status / routing restriction (StackChan only)
update:    manual
```

---

## Future Adapters (all HOLD)

| Provider | API Type | Risk | Gate Required |
|---|---|---|---|
| OpenAI API | REST | High | openai_api_go |
| Cursor | No public API | High | cursor_scrape_go (不推奨) |
| Gemini | REST | High | gemini_api_go |
| Grok | REST | High | grok_api_go |
| ChatGPT | No public usage API | High | screen_manual_only |
| local LLM | localhost | Low | local_llm_go |

**全て現時点で HOLD。実装には追加の設計+人間GO が必要。**

---

## Data Flow

```text
現在:
  Human → (観察) → Manual Input → AIUsageProviderState → Display

将来 (official_api):
  Adapter → API call → response → AIUsageProviderState → Display
  ↑ requires: API key + separate GO + rate limit policy
```

---

## Safety Invariants

```text
- adapter は display state を返すのみ
- adapter は外部への書き込みをしない
- adapter は token をログに出力しない
- status は推定・手動 = 常にデータソース明示
```
