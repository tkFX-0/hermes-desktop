# Cursor To ChatGPT Review Protocol

## 1. 目的

Cursor側の変更レポートをChatGPTへ渡す時に、ChatGPTが判断すべき内容をすぐ理解できるようにする。

## 2. 標準フォーマット

```text
【ChatGPTレビュー依頼】

現在のStep:

今回やったこと:

ChatGPTに判断してほしいこと:
- 承認してよいか
- 次に進むべきStepは何か
- Cursorへ投げる次の指示文が必要か
- 危険な見落としがあるか

今回の変更レポート:
--- Cursorの変更レポート ---

次にCursorが提案しているStep:

制約:
- 既存EA本体には触らない
- MT5関連には触らない
- .env / APIキー / secrets / memory DBには触らない
- 外部送信しない
- git pushしない
- 本番反映しない
```

## 3. ChatGPTに求める返答

ChatGPT側には次を返してもらう。

- 承認 / 保留 / 却下。
- 理由。
- 次にやること。
- Cursorに投げる次の指示文。
- 次回レポートで見るべき確認ポイント。

## 4. Cursor変更レポート必須項目

- 何をしたか。
- なぜ必要だったか。
- どこを変更したか。
- 触っていない重要領域。
- ユーザーに見える変化。
- リスク。
- 実行したテスト。
- 実行していないテスト。
- 戻し方。
- イツキシマの判定。
- 次に進むべき実装ステップ。
- ChatGPTに判断してほしいこと。

## 5. 自動継続してよい条件

- `docs/ichikishima/` 内の文書更新。
- `src/main/ichikishima/autonomy-zone/` 内の小さな安全実装。
- `tests/hermes/zone/` 内の単体テスト追加。
- `IMPLEMENTATION_HANDOFF.md` 更新。
- 禁止領域に触れていない。
- 外部通信していない。
- `git push`していない。

## 6. ChatGPTレビュー必須条件

- write wrapperに入る前。
- delete wrapperに入る前。
- execute wrapperに入る前。
- network制御に入る前。
- git制御に入る前。
- 承認キュー実行に入る前。
- 監査ログ本体保存に入る前。
- Hermes本体連携に入る前。
- 既存EA本体やMT5関連へ触る可能性がある時。
- 依存追加が必要な時。
- 外部通信が必要な時。

## 7. 今回の扱い

この文書はレビュー依頼プロトコルの定義のみである。実装コード、write wrapper、外部通信、依存追加には進まない。
