# WK-04 Worker Prompt Export Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN + display-only implementation

---

## Purpose

Shikishima generates copy-only prompts for human to manually pass to ClaudeCode or Codex.
No external send. No automatic dispatch. Human bridge only.

---

## Prompt Contents

Every generated prompt must include:

```text
1. Worker target (ClaudeCode / Codex / Human Gate)
2. Task title
3. Objective
4. Allowed files or scope
5. Forbidden actions
6. Safety boundary statement
7. Evidence target
8. Human bridge notice
```

---

## Required Safety Statement

Every prompt must end with:

```text
このプロンプトは人間がコピーして渡すことを前提としています。
Shikishima は自動的にワーカーを起動しません。

This prompt is for human copy/manual use only.
Shikishima does not start the worker automatically.

productionReady: false
execution: disabled
rawValuesReported: false
push: 未実施 (push GO 別途)
```

---

## Forbidden in Prompts

Prompts must not include:

```text
- raw tokens or credentials
- raw local IP addresses or private paths
- instructions to push without human GO
- instructions to enable productionReady
- instructions to enable execution
- instructions to start runtime without GO
- instructions to connect external services without GO
```

---

## Human Bridge

```text
1. Shikishima displays the prompt (copy-only block)
2. Human reads and decides to use it
3. Human copies manually into ClaudeCode / Codex
4. Worker executes under human supervision
5. Human brings result back to Shikishima
6. Shikishima records in evidence
```

No copy button sends to an external service.
If a copy-to-clipboard function exists, it copies text locally only.

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
external_send:      none
auto_dispatch:      HOLD
```
