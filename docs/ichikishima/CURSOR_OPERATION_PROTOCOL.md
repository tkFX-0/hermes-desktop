# Cursor Operation Protocol

## 1. 目的

Cursor Agent / Composer2が、イツキシマ/Hermes実装を安全に自走するための進行プロトコルを定義する。

## 2. 参照順序

作業開始時は次を確認する。

1. `AGENTS.md`
2. `.cursor/rules/ichikishima-*.mdc`
3. `docs/ichikishima/IMPLEMENTATION_HANDOFF.md`
4. 関連する仕様書

## 3. 自動継続してよい作業

- `docs/ichikishima/` の文書追加・修正。
- `src/main/ichikishima/autonomy-zone/` の小さな安全実装。
- `tests/hermes/zone/` の単体テスト追加。
- 型定義追加。
- 安全判定ロジック追加。
- 仕様テスト追加。
- `IMPLEMENTATION_HANDOFF.md` 更新。

条件:

- 禁止領域に触れない。
- 外部通信しない。
- `git push`しない。
- 実装範囲外へ進まない。

## 4. 停止して確認すべき作業

- 既存EA本体へ触る。
- MT5関連へ触る。
- `.env`、APIキー、secrets、memory DBへ触る。
- 本番設定を変える。
- 外部通信する。
- `git push`する。
- 自動売買、取引履歴、個人情報に関わる。
- 大きな依存追加。
- UIやElectron起動まわりを変える。
- write/delete/execute/network/git制御へ入る。
- 承認キュー実行、監査ログ本体保存、Hermes本体連携へ入る。

## 5. 進行ルール

- 変更は小さなStep単位にする。
- 仕様書またはテストを先に作る。
- 実装後は関連テスト、typecheck、対象lintを可能な範囲で実行する。
- 実行していないテストは明示する。
- 完了後は変更レポートを出す。
- 次に進むべきStepを提示する。
- 高リスク境界ではChatGPTレビュー依頼フォーマットを使う。

## 6. 変更レポートテンプレート

```text
【変更レポート】

1. 何をしたか
2. なぜ必要だったか
3. どこを変更したか
4. 触っていない重要領域
5. ユーザーに見える変化
6. リスク
7. 実行したテスト
8. 実行していないテスト
9. 戻し方
10. イツキシマの判定
11. 次に進むべき実装ステップ
12. ChatGPTに判断してほしいこと
```

## 7. Composer2引き継ぎ

Composer2へ切り替わった場合:

- `IMPLEMENTATION_HANDOFF.md` の最新Stepから再開する。
- 直前の変更レポートとテスト状況を確認する。
- 禁止領域に触れない。
- 低リスクStepだけ進める。
- 高リスク境界ではChatGPTレビューを挟む。

## 8. 今回の扱い

この文書は運用ルールの定義のみである。実装コード、依存追加、外部通信、write wrapperには進まない。
