# Hermes Autonomy Zone Tasks

## 1. Zone Root設定

### 目的

Hermesが承認なしで自由に作業できる唯一の領域を固定し、実行中に勝手に変更できないようにする。

### 実装対象ファイル候補

- `src/main/ichikishima/autonomy-zone/config.ts`
- `src/main/ichikishima/autonomy-zone/types.ts`
- `src/main/ichikishima/autonomy-zone/index.ts`

### 入力

- プロジェクト設定の `hermes_autonomy_zone.root`
- 環境変数 `HERMES_AUTONOMY_ZONE_ROOT`
- 既定値 `sandbox/hermes-autonomy-zone/`

### 出力

- 正規化済みZone root
- 実体パス解決済みZone root
- Zone設定オブジェクト
- 拒否時の理由コードと説明

### Step 1aの範囲

Step 1aでは、Zone rootの読み込み、正規化、実体パス解決、危険root拒否までを実装する。
実ディレクトリの作成は、検証済みrootだけを対象にした初期化処理で行う。危険root検証より先にディレクトリを作成してはいけない。

### 禁止事項

- リポジトリrootそのものをZone rootにしない。
- ユーザーホーム直下をZone rootにしない。
- ドライブ直下をZone rootにしない。
- `.git`、`.env`、MT5、EA、memory DBを含むパスをZone rootにしない。
- Hermes自身に実行中のZone root変更を許可しない。

### テスト観点

- 既定値でZone rootが決まる。
- 環境変数でrootを指定できる。
- 危険なrootが拒否される。
- Windowsパスの大小文字差と区切り文字差を吸収できる。
- `../`、絶対パス、symlink/junctionでZone外へ出るroot指定が拒否される。
- `.env`、`.git`、MT5、memory DB、secrets、token、秘密鍵拡張子を含むroot指定が拒否される。
- `~` や環境変数展開構文を含む曖昧なroot指定が拒否される。

### 完了条件

- Zone rootが単一の実体パスとして固定される。
- 危険なroot指定で起動または初期化が失敗する。
- 後続のpath guardが同じZone rootを参照できる。

## 2. 実体パス判定 / Path Guard

### 目的

相対パス、`../`、絶対パス、symlink、junction、Windowsパス差異によるZone外脱出を防ぐ。

### 実装対象ファイル候補

- `src/main/ichikishima/autonomy-zone/path-guard.ts`
- `src/main/ichikishima/autonomy-zone/path-guard.test.ts`

### 入力

- 操作対象パス
- Zone root
- 操作種別

### 出力

- 許可/拒否/承認待ちの判定
- 正規化済みパス
- 実体パス
- 拒否理由

### 禁止事項

- 文字列prefix比較だけでZone内外を判定しない。
- `../` を含むパスをそのまま通さない。
- symlinkやjunctionでZone外へ抜けるパスを許可しない。
- `.env`、MT5、memory DBなど拒否対象を実体パス解決前だけで判断しない。

### テスト観点

- `../` でZone外へ出ようとすると拒否される。
- 絶対パスでZone外を指定すると拒否される。
- symlink/junction経由でZone外へ出ようとすると拒否される。
- Windowsの `C:\path` と `c:/path` を同等に扱う。
- `\\?\` プレフィックスや8.3短縮名で迂回できない。

### 完了条件

- すべてのファイル操作がpath guardを通る。
- 実体パスがZone root配下である場合だけZone内扱いになる。
- 拒否時に監査ログへ渡せる理由が返る。

## 3. 拒否パス判定

### 目的

Zone内外に関係なく、秘密情報、MT5/EA、memory DB、`.git`、個人情報などへのアクセスを止める。

### 実装対象ファイル候補

- `src/main/ichikishima/autonomy-zone/denylist.ts`
- `src/main/ichikishima/autonomy-zone/denylist.test.ts`

### 入力

- 実体パス
- 操作種別
- ファイル名
- パス構成要素

### 出力

- 拒否対象かどうか
- 拒否カテゴリ
- 拒否理由

### 禁止事項

- `.env`、APIキー、secrets、SSHキー、ブラウザCookieを読まない。
- MT5関連、EA本体、取引履歴を読まない。
- memory DBを直接読まない、書かない。
- `.git` 内部を書き換えない。
- 個人情報らしきファイルを自動要約しない。

### テスト観点

- `.env` と `.env.local` が拒否される。
- `credentials.json`、`token.txt`、`*.pem`、`*.key` が拒否される。
- `MQL5`、`MT5`、`MetaTrader`、`terminal64.exe` が拒否される。
- `sessions.db`、`MEMORY.md`、`USER.md`、`SOUL.md` が拒否される。
- `.git/config` が拒否される。
- 大小文字違いでも拒否される。

### 完了条件

- denylistが中央管理される。
- read/write/delete/executeすべてにdenylistが適用される。
- 拒否カテゴリが承認キューや監査ログに渡せる。

## 4. 操作ラッパー

### 目的

Hermesのファイル操作、実行、ネットワーク、git操作を直接実行させず、Zone policyを通した安全なAPIに集約する。

### 実装対象ファイル候補

- `src/main/ichikishima/autonomy-zone/operations.ts`
- `src/main/ichikishima/autonomy-zone/operations.test.ts`

## 4.1 read

### 目的

Zone内の安全なファイルだけを読み取る。

### 入力

- 対象パス
- offset/limit

### 出力

- ファイル内容
- 読み取りメタデータ
- 拒否理由

### 禁止事項

- Zone外の無差別読み取り。
- 秘密情報、MT5/EA、memory DB、`.git` の読み取り。

### テスト観点

- Zone内の通常ファイルを読める。
- Zone外ファイルは拒否される。
- denylist対象はZone内でも拒否される。

### 完了条件

- readがpath guardとdenylistを必ず通る。

## 4.2 write

### 目的

Zone内にファイルを作成・更新する。

### 入力

- 対象パス
- 書き込み内容
- overwrite可否

### 出力

- 書き込み結果
- 作成/更新メタデータ
- 拒否理由

### 禁止事項

- Zone外書き込み。
- denylist対象への書き込み。
- 本体repoへの直接反映。

### テスト観点

- Zone内の新規ファイル作成が成功する。
- Zone外書き込みが拒否される。
- `.env` への書き込みが拒否される。

### 完了条件

- writeがZone内限定で動く。
- 本体反映候補はZone内patchまたは承認キューへ出る。

## 4.3 delete

### 目的

初期実装では削除操作を原則禁止し、必要な場合もZone内限定の承認対象にする。

### 入力

- 対象パス

### 出力

- 拒否または承認待ち

### 禁止事項

- Zone外削除。
- denylist対象削除。
- 再帰削除。
- 本体repo削除。

### テスト観点

- deleteが既定で拒否される。
- Zone外削除が拒否される。
- 再帰削除コマンドが拒否される。

### 完了条件

- 初期MVPではdeleteは実行されない。
- 削除要求は監査ログに残る。

## 4.4 execute

### 目的

Zone内テストや検証だけを許可し、破壊的操作、外部送信、MT5起動を止める。

### 入力

- コマンド
- 作業ディレクトリ
- timeout

### 出力

- 実行結果
- stdout/stderr
- return code
- 拒否理由

### 禁止事項

- Zone外作業ディレクトリでの実行。
- `terminal64.exe` 起動。
- MT5/EA操作。
- 外部通信コマンド。
- 破壊的コマンド。
- secret読み取りコマンド。

### テスト観点

- Zone内の安全なテストコマンドが実行できる。
- `curl`、`wget`、外部送信が拒否される。
- `git push` が拒否される。
- `rm -rf` 相当が拒否される。

### 完了条件

- executeがcommand guardを通る。
- 実行ログがHermes作業ログに残る。
- 拒否はイツキシマ監査ログに残る。

## 4.5 network

### 目的

外部通信を既定OFFにし、必要な要求だけ承認キューへ送る。

### 入力

- URL
- 目的
- 取得範囲
- 送信内容

### 出力

- 拒否または承認キューJSON

### 禁止事項

- 承認なしのURL取得。
- 承認なしのWebhook送信。
- 任意URLクロール。
- 秘密情報を含む送信。

### テスト観点

- URL取得要求が直接実行されない。
- 承認キューにURL、目的、リスクが残る。
- 秘密情報を含む可能性がある送信が拒否される。

### 完了条件

- networkは既定でdisabled。
- すべての外部通信要求が承認キュー化される。

## 4.6 git

### 目的

状態確認は可能にしつつ、pushや本体反映を勝手に行わせない。

### 入力

- gitサブコマンド
- 対象パス

### 出力

- 実行結果または拒否理由

### 禁止事項

- `git push`
- `git reset --hard`
- `git clean`
- `git checkout --`
- `git rebase`
- `.git` 直接編集
- ユーザー指示なしのcommit

### テスト観点

- `git status`、`git diff`、`git log` は許可される。
- `git push` は拒否される。
- 破壊的git操作は拒否される。

### 完了条件

- git操作が安全な読み取り系に限定される。
- commitはユーザー明示指示時のみ別フローになる。

## 5. 外部通信OFF

### 目的

HermesがSandbox内から外部へ情報を送受信しないようにする。

### 実装対象ファイル候補

- `src/main/ichikishima/autonomy-zone/network-policy.ts`
- `src/main/ichikishima/autonomy-zone/network-policy.test.ts`

### 入力

- 外部通信要求
- URL
- method
- payload有無

### 出力

- 拒否
- 承認キューJSON

### 禁止事項

- 承認なしのWeb検索。
- 承認なしのURL取得。
- 承認なしのAPI呼び出し。
- 承認なしの依存インストール。
- 承認なしのリモート送信。

### テスト観点

- network disabled時にすべて拒否される。
- 拒否ではなく承認待ちにすべき要求はJSON化される。
- URL、目的、取得範囲、リスクが必須になる。

### 完了条件

- 外部通信は既定OFF。
- 直接通信せず承認キューへ送れる。

## 6. 承認キューJSON

### 目的

境界越え操作を、ユーザーが判断できる構造化データとして保存する。

### 実装対象ファイル候補

- `src/main/ichikishima/approval/queue.ts`
- `src/main/ichikishima/approval/schema.ts`
- `src/main/ichikishima/approval/queue.test.ts`

### 入力

- action_type
- target_paths
- commands
- external_urls
- risk_level
- reason
- expected_result
- rollback_plan
- test_plan
- requires_user_approval

### 出力

- 承認キューJSON
- approval_id
- 保存結果

### 禁止事項

- 秘密情報をJSONへ保存しない。
- 必須項目が欠けた要求を保存しない。
- `risk_level=reject_by_default` を通常承認へ流さない。

### テスト観点

- 必須項目ありで承認JSONが作られる。
- 必須項目欠落で拒否される。
- 秘密情報らしき値が含まれると拒否される。
- approval_idが一意になる。

### 完了条件

- 境界越え操作が承認キューに保存される。
- ユーザー向け変更レポートへ変換できる情報が揃う。

## 7. 監査ログ

### 目的

Hermes作業ログとイツキシマ監査ログを分離し、拒否・承認待ち・本体反映を追跡可能にする。

### 実装対象ファイル候補

- `src/main/ichikishima/audit/audit-log.ts`
- `src/main/ichikishima/audit/audit-log.test.ts`

### 入力

- actor
- event_type
- action_type
- target_paths
- in_zone
- reason
- approval_id

### 出力

- 追記専用監査ログ
- event_id

### 禁止事項

- 監査ログを上書きしない。
- 秘密情報をログへ保存しない。
- Hermes作業ログと混ぜない。

### テスト観点

- 拒否イベントが記録される。
- 承認待ちイベントが記録される。
- 本体反映イベントが記録される。
- ログにsecretらしき値が残らない。

### 完了条件

- deny/approval/appliedイベントが追跡できる。
- イツキシマ監査ログは追記専用として扱われる。

## 8. テスト項目

### 目的

Sandbox境界、拒否パス、操作ラッパー、承認キュー、監査ログが実際に効いていることを確認する。

### 実装対象ファイル候補

- `tests/ichikishima-autonomy-zone.test.ts`
- 各モジュール横の `*.test.ts`

### 入力

- テスト用Zone root
- テスト用ファイル
- テスト用symlink/junction
- テスト用コマンド

### 出力

- テスト結果

### 禁止事項

- 実ユーザーホームを使わない。
- 実 `.env` を使わない。
- 実MT5/EAファイルを使わない。
- 実memory DBを使わない。
- 外部通信しない。

### テスト観点

- Zone内read/write成功。
- Zone外read/write拒否。
- `../` 脱出拒否。
- symlink/junction脱出拒否。
- denylist拒否。
- network拒否。
- `git push`拒否。
- delete拒否。
- 承認キュー必須項目検証。
- 監査ログ追記。

### 完了条件

- 主要ガードの単体テストがある。
- 外部通信なしでテストが完了する。
- 実環境の秘密情報やMT5に触れない。

## 9. 実装順序

### 目的

安全境界を先に作り、Hermesの自由度はZone内に限定してから広げる。

### 順序

1. Zone root設定。
2. 実体パス判定 / path guard。
3. 拒否パス判定。
4. read/writeラッパー。
5. delete拒否。
6. executeラッパー。
7. network disabled。
8. git操作制限。
9. 承認キューJSON。
10. 監査ログ。
11. ユーザー向け変更レポート連携。

### 禁止事項

- path guard前にwrite/executeを公開しない。
- network disabled前に外部通信機能を公開しない。
- denylist前にZone内自由操作を公開しない。
- 監査ログなしで本体反映を実装しない。

### テスト観点

- 各ステップで拒否すべき操作が拒否される。
- 次ステップへ進む前にテストが通る。
- 失敗時に前ステップへ戻せる。

### 完了条件

- 上記順序でMVPが組める。
- どの段階でも秘密情報、MT5/EA、memory DB、外部送信、git push、本番反映に触れない。

## 10. 失敗時の戻し方

### 目的

実装途中でガードが壊れた場合でも、本体や高リスク領域に影響を出さずに戻せるようにする。

### 入力

- 失敗ログ
- 監査ログ
- 承認キュー
- 変更ファイル一覧

### 出力

- 復旧手順
- 保留状態の承認キュー
- 失敗原因メモ

### 禁止事項

- 監査ログを削除しない。
- 失敗を成功扱いしない。
- 本体反映済みか未反映かを曖昧にしない。
- 秘密情報を復旧ログへ書かない。

### テスト観点

- Zone機能を無効化できる。
- Zone内生成物を隔離できる。
- 承認キューを未処理のまま保持できる。
- 本体未反映なら本体に差分がないことを確認できる。

### 完了条件

- 失敗時にZone機能を止められる。
- 本体反映前なら本体repoへ影響が残らない。
- 監査ログに失敗原因が追記される。
