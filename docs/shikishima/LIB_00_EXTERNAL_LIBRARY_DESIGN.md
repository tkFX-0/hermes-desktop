# LIB-00 External Library Design

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — docs only, no Obsidian connection, no local write
**gate:** HOLD — all LIB gates require explicit human GO

---

## Purpose

Define a sustainable external knowledge library for Shikishima operation.

```text
正本:  Obsidian / Markdown Vault  (外部記録庫)
証跡:  GitHub repo docs           (公式証跡)
表示:  しきしまアプリ              (管制室)
検索:  将来 RAG / index           (検索補助)
```

---

## Core Principle

```text
しきしまは管制室。
ライブラリは記録庫。
AIは作るところまで。
鍵と発射ボタンは人間。

rawValuesReported: false — ライブラリに書く場合も同じルールを適用する。
保存禁止: token / password / secret / raw API key / local-only path生値 / 個人情報
```

---

## Role of Each Agent

| Agent | 役割 | Library担当 |
|---|---|---|
| しきしま | 管制・判断 | どの記録を残すか決定 |
| しずめ | ブレーキ | raw値/secret/Level 5漏れチェック |
| むすび | 接続・分類 | research/dev/evidence/handoff に分類 |
| つむぎ | 実装・記録 | 開発ログ・変更点まとめ |
| しるべ | 記録と道標 | Markdown化・ライブラリ保存候補作成 |

---

## Recommended Architecture

```text
Phase 1 (current):
  しきしまはまだ直接書かない
  人間が Obsidian に貼る
  ClaudeCode が docs 出力

Phase 2:
  しきしまがライブラリ用 Markdown を生成
  人間が保存

Phase 3:
  Obsidian local write gate (OB-01) 開放後
  しきしまが指定フォルダにだけ書く

Phase 4:
  しきしまアプリから vault を読み取り index 表示

Phase 5:
  RAG 検索 / タグ検索 / 過去証跡検索
```

---

## Comparison of Storage Options

| 保存先 | 向いている用途 | メリット | 注意 |
|---|---|---|---|
| Obsidian / Markdown | 記録庫の正本 | 見やすい・検索・ローカル管理 | 自動書き込みは Gate 化 |
| GitHub docs | 公式証跡 | commit で履歴が残る | 日常メモには少し重い |
| Notion | DB 管理 | テーブル管理しやすい | 外部サービス・API 連携は HOLD |
| SQLite | アプリ内部検索 | 高速・構造化 | 人間が直接読みにくい |
| Vector DB / RAG | AI 検索 | 過去ログ引用に強い | まず Markdown が必要 |

**選択: Obsidian Vault (Phase 1-2) → OB-01 gate (Phase 3) → index (Phase 4) → RAG (Phase 5)**

---

## Note Types (5 categories)

```text
1. Research Note     — 調査・外部情報・x_search 結果
2. Development Note  — 実装完了・変更ファイル・commit
3. Evidence Note     — PASS/HOLD/STOP 証跡
4. Decision Note     — GO/HOLD/DEFER 判断・人間サインオフ
5. Handoff Note      — 次回引き継ぎ・作業再開
```

---

## Forbidden in Library

```text
token / password / secret / raw API key
local-only path 生値
個人情報 (third-party PII)
Discord / X 認証情報
raw IP アドレス
```

---

## Gate Status

```yaml
LIB-00:  DESIGN (this doc)
LIB-01:  Vault structure plan — DESIGN
LIB-02:  Note templates — DESIGN
LIB-03:  Obsidian local write gate (OB-01) — HOLD
LIB-04:  Index / RAG plan — HOLD
LIB-05:  Shikishima app vault display — HOLD
```

---

## Safety

```yaml
productionReady:     false
execution:           disabled
rawValuesReported:   false
obsidian_connected:  false
local_write:         HOLD (OB-01 gate未開放)
```
