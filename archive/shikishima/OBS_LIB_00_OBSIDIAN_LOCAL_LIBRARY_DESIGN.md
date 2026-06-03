# OBS-LIB-00 Obsidian Local Library Design

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** IMPLEMENTED — UI preview + design docs
**gate:** OB-01 local write gate HOLD

---

## Purpose

Define and implement a safe local Obsidian-compatible library for Shikishima record storage.

```text
しきしまアプリ:  管制室 (control center)
ライブラリ:       記録庫 (record storage) — Obsidian Vault
GitHub docs:    公式証跡 (official evidence)
将来 RAG:        検索補助 (search assistant)
```

---

## Why External Library

- Shikishima app is a control room, not a knowledge store
- Markdown is human-readable, durable, and Obsidian-compatible
- GitHub docs are for official evidence; daily notes need a lighter home
- Obsidian Vault is local, no cloud dependency, searchable

---

## Obsidian-Compatible Strategy

```text
ShikishimaLibrary/
  00_Inbox/       — 未分類仮置き
  10_Research/    — 調査・x_search 結果
  20_Development/ — 実装・commit ログ
  30_Evidence/    — PASS/HOLD/STOP 証跡
  40_Decisions/   — GO/HOLD/DEFER 判断
  50_Handoffs/    — 次回引き継ぎ
  60_Reports/     — レポート出力
  90_Archive/     — 完了・非アクティブ
```

All Markdown files use YAML frontmatter with:
- id, type, status, date, related_gate, related_commit
- productionReady: false, execution: disabled, rawValuesReported: false

---

## Markdown + PNG Report Concept

Each library item generates two outputs:

1. `.md` — Markdown note for Obsidian vault
2. `.png` — Article-style report image (implemented as HTML/React preview now; PNG export in OBS-LIB-03)

---

## Categories

```text
research    — 調査・外部情報・x_search 結果
development — 実装・変更・commit ログ
evidence    — PASS/HOLD/STOP 証跡
decision    — GO/HOLD/DEFER 判断
handoff     — 次回引き継ぎ・作業再開
```

---

## Phase Plan

```text
Phase 1 (current): human manually saves Markdown
Phase 2:           Shikishima generates Markdown → human saves
Phase 3 (OB-01):   Shikishima writes to approved vault folder
Phase 4:           App reads vault → index display
Phase 5:           RAG search
```

---

## Safety

```yaml
productionReady:     false
execution:           disabled
rawValuesReported:   false
obsidian_connected:  false
local_write:         HOLD (OB-01 not yet opened)
cloud_sync:          disabled
external_api:        none
```
