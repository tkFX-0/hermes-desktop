# Discord コマンド一覧（ピン留め用）

Date: 2026-05-30  
司令部・対話・ポートフォリオの **! コマンド** まとめ。Discord では `!help` でも同内容（要約版）を返します。

---

## 使い方

1. このファイルの「ピン用短文」を司令部に貼る、または Bot 再起動後に `!help` を送信してピン留め
2. 開発指示は **司令部** で `!kaihatu` / 通常 `@しきしま`
3. 成果物は **ポートフォリオ**、エージェント読み合いは **対話**（`!` 付きのみ自動）

---

## 司令部 — 状況・開発（G）

| コマンド | 説明 |
|----------|------|
| `!help` / `!コマンド` | コマンド一覧 |
| `!status` | Bot 簡易ヘルス |
| `!部屋状況` / `!room-status` | スレッド記憶 + 全エージェント状況 |
| `!reply-status` | Groq / WSL-Claude 応答経路 |
| `!dev-pipeline` | WSL 開発レーン状態 |
| `!kaihatu <指示>` | WSL 開発 + 自動レビュー |
| `!kaihatu-test` / `!kaihatu test` | レビューのみ（開発未実行） |
| `!kaihatuslot <指示>` | スロット自律（本番適用 **H**） |
| `!multi-room-test` | マルチルーム配線テスト |
| `!human-go` | Human GO readiness |
| `!governance` | 統制ログ |
| `!obsidian-status` | Obsidian vault |
| `!エージェント状態` | agent-log 直近 |

---

## エージェント・記憶

| コマンド | 説明 |
|----------|------|
| `!agent-test` / `順番での回答` | 6体順番（API 課金なし） |
| `!memory` | 長期記憶表示 |
| `!remember key: value` | 長期記憶保存 |

---

## ちはや / FX

| コマンド | 説明 |
|----------|------|
| `!chihaya-status` | ちはや状態 |
| `!chihaya-start` / `!fx-on` | FX 再開 |
| `!chihaya-stop` / `!fx-off` | FX HOLD |
| `killzone` / `ea報告` / `リスク計算` | 自然言語（HOLD 時停止） |

---

## スロット・コード（本番 H）

| コマンド | 説明 |
|----------|------|
| `スロット開始 <タスク>` | 隔離スロット |
| `スロット開発 <file> <指示>` | スロット内生成 |
| `スロット自律 <目標>` | 自律ループ |
| `スロット確認` / `適用` / `キャンセル` | 差分・HOLD 適用 |
| `コード提案 <file> <指示>` | Coding-HOLD |
| `コード承認` / `コード却下` | 本番ゲート |

---

## StackChan

| コマンド | 説明 |
|----------|------|
| `!sc help` | 身体操作一覧 |
| `!sc status` | 接続・VOICEVOX |

---

## メンション・部屋

| 操作 | 説明 |
|------|------|
| `@しきしま` `@つむぎ` … | 担当指定 |
| `@Bot`（本文なし） | 要約 + 次の一手 |
| 通常文（司令部） | スレッド記憶付き会話 |
| 対話部屋 | **`!` で始まるもののみ** |
| ポートフォリオ | 成果置き場（受領 1 通） |

---

## ピン用短文（Discord にコピペ）

```
🏯 しきしま — 司令部コマンド（2026-05-30）
!help !部屋状況 !reply-status !dev-pipeline
!kaihatu / !kaihatu-test / !kaihatuslot / !multi-room-test
!human-go !governance !agent-test !エージェント状態 !status
@しきしま / @つむぎ — 担当指定 · @Bot のみ可
対話部屋=「!」のみ · ポートフォリオ=成果置き
安全: HOLD · 本番GOは人間承認 · 詳細は !help
Cursor Skills: docs/shikishima/REFERENCE_SKILLS_KARAAGE.md
```

---

## 安全（不変）

- `decision = HOLD`
- `execution = disabled`
- 自動売買・本番 push は **H**
