# WK-CODEX-05 Codex Failure Fallback Policy

**date:** 2026-05-22
**status:** ACTIVE — agent-router.ts に実装済み

---

## フォールバック判定フロー

```
codexTask() / codexReview() 呼び出し
    ↓
[1] OPENAI_API_KEY未設定?
    → Phase 1 HOLD: Task.md生成 → 人間ブリッジ
    (Ollamaへのフォールバックは行わない)

[2] Codex CLI実行エラー?
    → ClaudeCodeへフォールバック (StackChan scope内)
    → コンソールにwarning出力

[3] ClaudeCodeも失敗?
    → しきしまへ HOLD返答
    → 人間確認待ち

[4] どちらも不可?
    → しきしまが状況報告 → はじめがTaskを再設計
```

---

## Ollamaフォールバック禁止の理由

```
Ollama (llama3.2等)
  ↓
ローカルLLM — 実装品質が不安定
  ↓
証跡・責任境界が不明確
  ↓
安全性崩壊のリスク

→ Ollamaは「下書き・要約・判断補助」にのみ使用
→ 実装Workerの代替としては使わない
```

---

## 正しいフォールバックチェーン

| 状況 | フォールバック |
|---|---|
| Codex API key なし | Phase 1 HOLD → Task.md |
| Codex 実行エラー | ClaudeCode |
| ClaudeCode 失敗 | HOLD → 人間確認 |
| 両方不可 | しきしまがHOLD報告 |
| Ollama のみ | 補助のみ、実装Workerとして使わない |

---

## 実装済みコード (agent-router.ts)

```typescript
if (avail.apiKeyPresent) {
  const result = await codexTask(message);
  if (result.success) return codexResult;
  // Codex失敗 → ClaudeCode fallback (not Ollama)
  console.warn("[つむぎ] Codex failed, falling back to ClaudeCode:", result.error);
} else {
  // No API key → Task.md (Phase 1 human bridge)
  return exportCodexTaskMd(...);
}
// ClaudeCode fallback
return claudeCodeTask(message);
```

---

## 安全不変条件

```yaml
ollama_as_fallback: forbidden
auto_retry_on_failure: false
escalation_to_production: forbidden
rawValuesReported: false
```
