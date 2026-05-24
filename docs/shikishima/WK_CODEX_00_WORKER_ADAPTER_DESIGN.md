# WK-CODEX-00 Codex Worker Adapter Design

**date:** 2026-05-22
**status:** ACTIVE — Phase 1 (human-mediated) / Phase 2 (CLI, OPENAI_API_KEY required)
**scope:** StackChan専用Worker

---

## 基本設計方針

Codexはしきしまの「内蔵AI」ではなく、**外部Worker / CLI Worker**として扱う。

| Worker | 担当scope | 認証 |
|---|---|---|
| Codex | StackChan専用 | OPENAI_API_KEY or ChatGPT login |
| ClaudeCode | しきしまCore | Claude Pro subscription |
| Ollama | 下書き・要約・判断補助のみ | なし |

**Ollamaは実装Workerではない。** Codexのフォールバックとして使わない。

---

## Codex役割定義

```yaml
codex_role:
  worker_type: external_cli_worker
  scope: stackchan_only
  allowed_actions:
    - StackChan firmware review
    - VOICEVOX/WebSocket code review
    - pet-fw関連実装提案
  forbidden_actions:
    - shikishima_core_edit
    - git_push
    - production_ready_true
    - execution_enabled
    - auto_repeated_queries
    - cloud_task_without_go
```

---

## つむぎの振り分けルール

```
StackChan task + coding → つむぎ → Codex (API key present?) → ClaudeCode fallback
しきしまCore task       → つむぎ → ClaudeCode
Code review (StackChan) → つむぎ → Codex
Code review (Core)      → つむぎ → ClaudeCode
Codex unavailable       → Phase 1 HOLD: Task.md生成 → 人間ブリッジ
ClaudeCode unavailable  → しきしま → HOLD / 人間確認
```

---

## 3フェーズ計画

### Phase 1 — 現在 (人間ブリッジ)
```
しきしま → Task.md生成 → 人間がCodexへ貼る → Codexが実行 → 結果をしるべへ
```

### Phase 2 — 現在 (CLI Worker, OPENAI_API_KEY必要)
```
しきしま → つむぎ → codex exec → 結果回収 → しるべ証跡化
```

### Phase 3 — HOLD
```
しきしまからCodexを完全自動起動
→ execution: enabled 寄り → 別途人間GO必要
```

---

## 安全不変条件

```yaml
productionReady: false
execution: disabled
rawApiKeyReported: false
codex_auto_launch: phase3_hold
codex_allowed_scope: stackchan_only
codex_git_push: forbidden
ollama_as_codex_fallback: forbidden
```
