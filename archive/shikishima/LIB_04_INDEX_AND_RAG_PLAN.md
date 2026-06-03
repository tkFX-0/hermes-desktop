# LIB-04 Index and RAG Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — design only, no index built, no RAG running
**gate:** HOLD — requires LIB-03 (OB-01) PASS first + separate index GO

---

## Purpose

Design a future capability for Shikishima to search and retrieve library content.

```text
Phase 4: しきしまアプリから vault を読み取り index 表示
Phase 5: RAG 検索 / タグ検索 / 過去証跡検索
```

---

## Phase 4: Vault Index Display (HOLD)

### What it would show

```text
- 最近追加されたノート
- ゲート別証跡一覧
- PASS/HOLD/STOP 分類
- 未解決 HOLD 一覧
- 作業ログ時系列
```

### Implementation approach (design only)

```text
- ファイルシステム read (vault path configured locally)
- frontmatter YAML parse
- display-only table/list in Shikishima app
- no write, no delete, no rename
```

### Required GO fields

```text
lib04_index_go:
  date:
  vault_path:
  read_only_confirmation: true
  allowed_folders:
  display_target:
  stop_if:
```

---

## Phase 5: RAG Search (HOLD — further future)

### Concept

```text
- vault Markdown → chunk → embedding
- embedding stored locally (no cloud upload without GO)
- user query → similarity search → relevant notes
- Shikishima cites past evidence / decisions / research
```

### Required before RAG

```text
- LIB-04 index working
- embedding model selected (local preferred)
- cloud upload: HOLD (requires separate data-export GO)
- vector DB location: local only (Phase 5 default)
```

### What RAG would enable

```text
「過去の XS-01 証跡を見せて」
「HOLD 中の Gate 一覧は？」
「2026-05 の開発ログをまとめて」
「Android Halo 調査と関係する過去記録は？」
```

---

## Not Approved Now

```text
- vault index display
- Shikishima reading vault filesystem
- embedding generation
- vector DB creation
- cloud upload of vault content
- RAG query execution
```

All require separate explicit GO per phase.

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
index_active:       false
rag_active:         false
cloud_upload:       HOLD
```
