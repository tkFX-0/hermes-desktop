# WK-CODEX-01 Codex Availability Check

**date:** 2026-05-22
**status:** ACTIVE — checkCodexAvailability() 実装済み (codex-service.ts)

---

## チェック項目

```typescript
interface CodexAvailability {
  installed: boolean;        // native binary存在確認
  apiKeyPresent: boolean;    // OPENAI_API_KEY が .env.local に存在するか (値は出力しない)
  authMode: "openai_api_key" | "chatgpt_login" | "unknown";
  sandboxEnabled: boolean;   // codex sandbox デフォルト有効
  networkAllowed: false;     // 常にfalse — Codexはオフライン実行
  allowedScope: "stackchan_only";
  rawApiKeyReported: false;  // 不変条件
}
```

---

## APIキー確認ルール

- `.env.local` の `OPENAI_API_KEY=` 行の存在確認のみ
- **値は絶対に出力・ログ・返却しない**
- `rawApiKeyReported: false` は不変

---

## 認証モード判定

| 条件 | authMode |
|---|---|
| .env.local に OPENAI_API_KEY あり | openai_api_key |
| なし / 未確認 | unknown |
| ChatGPT loginは手動のみ (AWS headlessでは不推奨) | chatgpt_login |

---

## バイナリパス

```
/root/.hermes/node/lib/node_modules/@openai/codex
  /node_modules/@openai/codex-linux-x64
    /vendor/x86_64-unknown-linux-musl/bin/codex
```

確認日: 2026-05-22 / バージョン: v0.133.0

---

## 利用可否フロー

```
checkCodexAvailability()
  ↓
installed=true AND apiKeyPresent=true
  → Phase 2 CLI実行可能 (StackChan scope内)
installed=true AND apiKeyPresent=false
  → Phase 1 HOLD: Task.md出力 → 人間ブリッジ
installed=false
  → HOLD: ClaudeCodeへルーティング
```

---

## 安全不変条件

```yaml
rawApiKeyReported: false
apiKeyValuePrinted: false
networkAllowed: false
allowedScope: stackchan_only
```
