# Control Center Static Shell — Snapshot JSON 運用ガイドライン

**対象**: `docs/ichikishima/mockups/control-center-v1-static-shell.html` が **ユーザー自身の環境で**読み込みうる Snapshot JSON。**本番 UI でも Hermes にも接続していない**読取専用ビューアである。

English banner（画面にも表示）:

- **Do not load sensitive JSON.**（機密を含む JSON をドラッグ＆ドロップしない）
- **Read-only mock viewer.**（実行・IPC・ネットワークなし）
- **No execution.**（ボタンは disabled。解析ボタンは DOM 書き換えのみ）
- **No external network.**（外部 fetch / CDN を使わない構成）

---

## 1. 読み込ませてよいもの

| 種別 | 例 |
|------|-----|
| リポジトリ同梱のサンプル | `control-center-v1-snapshot.sample.json` |
| `getControlCenterReadonlyData` 由来で **マスク済み・要約のみ** にした Snapshot | （将来の导出パイプラインが承認済みの場合のみ） |
| secrets を含まない **read-only summary** のみの JSON | 件数・ラベル・パス短文程度 |
| audit / approval の **集計**（件数、`parseFailures` 等）のみ | 本文・生ログは載せない |
| 任意 **`appShellParityPreview`** | Renderer `ControlCenterAppShell` と **構成を揃えた短文**のみ。**`allowedApis` / `forbiddenApis` の識別子配列は載せない**（静的サンプルは **件数フィールド** と整合させる）。 |

## 2. 読み込ませてはいけないもの

- `.env` 全文、環境依存の認証情報
- APIキー、`Authorization` ヘッダ相当、長いランダムトークン原文
- secrets、パスワード、プライベート鍵
- memory DB のダンプ、`better-sqlite3` 経路のデータ
- MT5口座情報、口座番号、証券会社ログイン情報
- 取引履歴、約定一覧の生データ
- 個人情報（氏名・住所・電話など）
- **raw audit log 全文**（JSONL をそのまま貼ったもの）
- **raw approval report 全文**（Markdown 本文を載せた export）
- LLM の内部チェーンオブソートや「内部思考」を意図した長文ログ
- プロジェクトや Hermes が返した **コード全文**のアーカイブ

## 3. secrets を画面に載せない

- Snapshot 構築時に **値を入れない**。どうしてもプレースホルダは `[redacted]` 等の固定文字列に限定する。
- 「キーっぽい文字列」（`sk-` 開始等）は **自動マスクされていない UI** でも表示しない運用とする。

## 4. raw log を読み込ませない

- Shell は **オブジェクト単位の Snapshot**のみ想定。**テキストログの貼り付けモードはない。**（誤って貼っても構造検証で弾けるよう配慮済みでも、運用では避ける）

## 5. approval report 全文を避ける

- `latestReports` は **パス参照・ID のみ**。本文はユーザーが別 editor で開く前提（SPEC 順守）。

## 6. 「snapshot」のみを扱う

- `$schema` が無くてよいが、**契約済みフィールド以外**が大量に増えた JSON はレビューを経ずに読み込まない。

## 7. ローカル個人利用前提

- 共有ディスクリーンや録画配信で **読み込み操作を見せない**。機密が写り込むリスクがある。

## 8. 誤って機密 JSON を読み込んだ場合の対処

1. **配信やスクリーンショットを取っていたら削除**する。
2. ブラウザの履歴／一時ファイルに残っていれば破棄（ブラウザ依存）。
3. **キーを含むファイルならキーローテーション**を検討（組織ルール順守）。
4. 問題のファイルを **Hermes／共有チャネルに貼らない**。

## 9. 将来 localhost read-only API へ移行する際の注意

- **ホスト結合**（127.0.0.1）、**トークン**、ポート固定、ライフサイクル（起動／停止）、CORS が論点となる（`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`）。
- 移行後も **read-only**。危険操作は **自動実行しない**。
- Renderer に **Snapshot だけ**を渡し続ける構成を優先する。

---

## 関連

- `CONTROL_CENTER_V1_UI_SHELL_SPEC.md`
- `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`
- `CONTROL_CENTER_V1_UI_SHELL_TEST_PLAN.md`
- `CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`
