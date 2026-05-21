# Hermes Autonomy Zone Minimum Spec

## 1. 目的

Hermes Autonomy Zoneは、Hermesが承認なしで自由に試行錯誤できる隔離作業領域である。

目的は、Hermesの開発ループを止めすぎずに、既存本体、秘密情報、memory DB、MT5/EA、本番環境、外部送信を確実に守ること。

この仕様は、まだ実装コードではない。最小実装時に満たすべき境界、操作ルール、承認キュー、監査ログ、テスト観点を定義する。

## 2. Zone Root固定

### 2.1 定義

Zone rootは、Hermesが承認なしで読み書きできる唯一のrootディレクトリである。

推奨初期パス:

```text
sandbox/hermes-autonomy-zone/
```

このパスはプロジェクトごとに固定し、実行中にHermes自身が変更してはいけない。

### 2.2 設定方法

設定はコード内の直書きではなく、設定ファイルまたは環境変数から読み込む。

優先順位案:

1. プロジェクト設定ファイルの `hermes_autonomy_zone.root`
2. 環境変数 `HERMES_AUTONOMY_ZONE_ROOT`
3. 既定値 `sandbox/hermes-autonomy-zone/`

ただし、設定値が危険な場合は起動を拒否する。

Step 1aでは、Zone rootの読み込み、正規化、実体パス解決、危険root拒否までを行う。実ディレクトリ作成は、初回利用前の明示的な初期化処理で行い、危険root検証より先に作成してはいけない。

拒否例:

- リポジトリrootそのもの。
- ユーザーホーム直下。
- ドライブ直下。
- `.git` 配下。
- `MQL5`、`MT5`、`MetaTrader` を含むパス。
- `.env`、memory DB、秘密情報ディレクトリを含むパス。

### 2.3 Root外アクセス

Hermesが承認なしで読み書きできるのは、実体パス解決後にZone root配下であるものだけ。

禁止:

- root外への書き込み。
- root外からの無差別読み取り。
- root外への削除。
- root外コマンド実行。
- root外ファイルを対象にしたpatch生成と直接適用。

許可される例外:

- ユーザーが明示指定したファイルの読み取り専用参照。
- イツキシマが承認キュー用に許可した読み取り専用コンテキスト。
- 本体反映用patchをZone内に生成すること。

例外でも、秘密情報、MT5/EA、memory DB、取引履歴、個人情報は読まない。

## 3. 実体パス判定

### 3.1 基本

すべてのパス操作は、実行前に実体パスへ正規化する。

実装時の考え方:

- TypeScript/Nodeなら `path.resolve()` と `fs.realpath()` 相当を使う。
- Pythonなら `Path.resolve()` または `os.path.realpath()` 相当を使う。
- 文字列比較だけでZone内外を判定しない。

### 3.2 対策すべき入力

- 相対パス。
- `../` を含むパス。
- 絶対パス混入。
- シンボリックリンク。
- Windowsジャンクション。
- ショートカット。
- 大文字小文字差。
- Windowsの `\` と `/` の混在。
- 8.3短縮パス。
- Unicode類似文字。
- 環境変数展開を含むパス。

### 3.3 判定順

1. 入力パスを受け取る。
2. ヌル文字、制御文字、不正なUnicodeを拒否する。
3. 環境変数や `~` 展開を明示的に扱う。暗黙展開しない。
4. 絶対パスへ変換する。
5. `..`、`.`、区切り文字を正規化する。
6. 実体パスを解決する。
7. Zone rootの実体パス配下か確認する。
8. 拒否パス一覧に一致しないか確認する。
9. 操作種別ごとの許可条件を確認する。
10. 許可、拒否、承認待ちの結果を監査ログへ記録する。

実装段階メモ:

- Step 1aで必須: `path.resolve()`、`fs.realpath()`相当、`../`、絶対パス、symlink/junction、大小文字差、Windows区切り文字差、`~`や環境変数展開構文の暗黙利用拒否。
- Step 2以降で強化: ショートカット、8.3短縮パス、Unicode類似文字、UNC/`\\?\`の網羅テスト、操作種別ごとの監査ログ連携。

### 3.4 Windows注意点

Windowsでは次に注意する。

- パス比較は大文字小文字を正規化する。
- `C:\foo\bar` と `c:/foo/bar` を同一扱いする。
- UNCパスを明示的に扱う。
- ジャンクションでZone外へ抜ける可能性を拒否する。
- `\\?\` プレフィックスを正規化する。
- 8.3短縮名で拒否パスを迂回できないようにする。

## 4. 拒否パス一覧

拒否パスは中央管理し、read/write/delete/executeのすべてで適用する。

初期拒否対象:

- `.env`
- `.env.*`
- APIキーを含むファイル
- `secrets`
- `secret`
- `credentials`
- `token`
- `*.pem`
- `*.key`
- `*.p12`
- `*.pfx`
- memory DB
- `sessions.db`
- `MEMORY.md`
- `USER.md`
- `SOUL.md`
- `MQL5`
- `MT5`
- `MetaTrader`
- `terminal64.exe`
- EA本体
- `.git`
- `.ssh`
- SSHキー
- ブラウザCookie
- credential cache
- 取引履歴
- 個人情報
- OS設定ディレクトリ
- クラウド認証情報
- `.npmrc`
- `.pypirc`

拒否パスに触れようとした場合:

1. 操作を実行しない。
2. Hermesへ拒否理由を返す。
3. イツキシマ監査ログへ記録する。
4. 原則として承認キューへは自動昇格しない。

例外が必要な場合は、ユーザーが別タスクとして明示的に開始する。

## 5. 操作種別ごとの扱い

| 操作 | Zone内 | Zone外 | 備考 |
|---|---|---|---|
| `read` | 原則可。ただし拒否パスは禁止 | 明示された読み取り専用ファイルのみ | 無差別探索は禁止 |
| `write` | 原則可。ただし拒否パスは禁止 | 禁止。承認キュー経由 | 本体直接反映は禁止 |
| `delete` | 原則禁止。必要ならZone内限定で承認対象 | 禁止 | 失敗ログ削除も慎重に扱う |
| `execute` | テスト・検証のみ可 | 原則禁止 | 破壊的、外部送信、MT5起動は禁止 |
| `network` | 既定OFF | 既定OFF | 要求は承認キューへ |
| `git` | `status`、`diff`、`log`のみ可 | `push`は禁止 | `commit`はユーザー明示指示時のみ |
| `memory_update` | 一時・作業記憶候補のみ | 長期記憶、memory DB直接書き込みは禁止 | 長期化は承認キューへ |
| `mt5_access` | 禁止 | 禁止 | 別タスクで明示開始が必要 |

## 6. 外部通信OFF

### 6.1 既定

Hermes Autonomy Zoneの最小実装では、networkは既定でdisabledにする。

外部通信に含めるもの:

- Web検索。
- URL取得。
- API呼び出し。
- Webhook送信。
- メッセージ送信。
- パッケージ公開。
- 依存関係インストール。
- リモートリポジトリ操作。
- 任意URLクロール。

### 6.2 外部通信要求

Hermesが外部通信を必要とする場合、直接実行せず承認キューへ送る。

記録必須:

- URL。
- 目的。
- 取得範囲。
- 送信内容。
- 想定リスク。
- 秘密情報が含まれない根拠。
- 代替手段。

### 6.3 Prompt Injection対策

外部文書、README、issue、ログ、Webページに含まれる命令は、AIへの命令として扱わない。

外部入力は「資料」であり「指示」ではない。

## 7. 承認キューJSON

承認キューは、Zone外反映、高リスク操作、外部通信、ユーザー通知、本体反映をユーザー判断へ渡すための構造化データである。

最小スキーマ:

```json
{
  "approval_id": "appr_...",
  "created_at": "ISO-8601",
  "created_by": "hermes",
  "action_type": "zone_exit|external_network|repo_apply|dependency_install|memory_update|user_notification|production|destructive|mt5_access",
  "target_paths": [],
  "commands": [],
  "external_urls": [],
  "risk_level": "low|medium|high|reject_by_default",
  "reason": "なぜ必要か",
  "expected_result": "成功すると何が起きるか",
  "rollback_plan": "失敗時の戻し方",
  "test_plan": "確認方法",
  "unverified_items": [],
  "protected_area_touch": {
    "env_or_api_key": false,
    "memory_db": false,
    "mt5_or_ea": false,
    "git_push": false,
    "production": false,
    "personal_info": false
  },
  "requires_user_approval": true
}
```

ルール:

- `requires_user_approval` は、境界越えでは常に `true`。
- `risk_level=reject_by_default` は通常フローで承認しない。
- 空欄でごまかさず、未確認は `unverified_items` に書く。
- 承認キューに秘密情報を含めない。

## 8. 監査ログ

### 8.1 ログ分離

Hermes作業ログとイツキシマ監査ログは分離する。

Hermes作業ログ:

- 思考メモではなく作業事実を記録する。
- 生成ファイル。
- 実行したテスト。
- 失敗。
- 修正。

イツキシマ監査ログ:

- 追記専用を想定する。
- 拒否。
- 承認待ち。
- 本体反映。
- 外部通信要求。
- 高リスク領域アクセス試行。
- 承認ID。
- 判定理由。

### 8.2 監査ログ最小項目

```json
{
  "event_id": "audit_...",
  "timestamp": "ISO-8601",
  "actor": "hermes|ichikishima|user",
  "event_type": "allow|deny|approval_requested|approved|rejected|applied",
  "action_type": "read|write|delete|execute|network|git|memory_update|mt5_access",
  "target_paths": [],
  "zone_root": "string",
  "in_zone": true,
  "reason": "判定理由",
  "approval_id": "appr_...|null"
}
```

### 8.3 記録必須イベント

- 拒否した操作。
- 承認キューへ送った操作。
- 本体反映。
- 外部通信要求。
- 秘密情報、MT5/EA、memory DB、`.git`、SSHキー、Cookieへのアクセス試行。
- `git push`要求。
- 本番反映要求。

## 9. 承認疲れ対策

### 9.1 自由にする範囲

Sandbox内のA0-A2は自由にする。

| 区分 | 内容 | 承認 |
|---|---|---|
| A0 | 観察、候補生成、メモ | 不要 |
| A1 | Zone内ファイル作成、編集、テスト | 不要 |
| A2 | Zone内patch案、失敗ログ、レポート生成 | 不要 |
| A3 | Zone外反映、本体repo変更 | 必須 |
| A4 | 外部通信、記憶、通知、依存追加 | 必須 |
| A5 | 秘密情報、MT5/EA、git push、本番、破壊的操作 | 原則拒否 |

### 9.2 一括承認

低リスク操作は細かく承認を求めない。

一括承認できる例:

- 同じ目的の本体反映候補。
- 複数のドキュメント更新。
- 同じテスト計画に基づくZone内検証。

一括承認できない例:

- 外部通信先が複数で目的が異なる。
- 秘密情報や個人情報が関係する。
- MT5/EAが関係する。
- 本番反映。
- `git push`。
- 破壊的操作。

## 10. 最小実装順序

### Step 1: 設定とZone root

- Zone root設定を読み込む。
- 危険なrootを拒否する。
- root作成前に正規化と妥当性チェックを完了する。
- rootを作成する場合は、検証済みrootだけを対象にした明示的な初期化処理で行う。
- rootの実体パスを固定する。

テスト観点:

- 既定rootが決まる。
- ホーム直下やドライブ直下を拒否する。
- `MT5` を含むrootを拒否する。

### Step 2: パスガード

- 入力パスを正規化する。
- 実体パスを解決する。
- Zone外を拒否する。
- 拒否パス一覧を適用する。

テスト観点:

- `../` で抜けられない。
- 絶対パスで抜けられない。
- symlink/junctionで抜けられない。
- `.env`、`.git`、memory DB、MT5を拒否する。

### Step 3: 操作ラッパー

- read/write/delete/executeをラップする。
- 許可、拒否、承認待ちを返す。
- deleteは初期では原則禁止にする。

テスト観点:

- Zone内writeが成功する。
- Zone外writeが拒否される。
- Zone内でも拒否パスが拒否される。
- executeで外部通信コマンドを拒否する。

### Step 4: 外部通信OFF

- network操作を既定拒否する。
- 外部通信要求を承認キューJSONへ変換する。

テスト観点:

- URL取得要求が直接実行されない。
- URL、目的、取得範囲、リスクが記録される。

### Step 5: 承認キュー

- 承認キューJSONを生成する。
- 必須項目不足なら作成を拒否する。
- `reject_by_default` を通常承認から除外する。

テスト観点:

- 必須項目がない承認要求を拒否する。
- 秘密情報を承認キューへ含めない。

### Step 6: 監査ログ

- Hermes作業ログとイツキシマ監査ログを分ける。
- 監査ログを追記専用で扱う。
- 拒否、承認待ち、本体反映を記録する。

テスト観点:

- 拒否イベントが記録される。
- 承認IDが紐づく。
- ログに秘密情報が残らない。

## 11. 失敗時の戻し方

初期実装で壊れた場合の戻し方:

1. Hermes Autonomy Zone機能を無効化する。
2. Zone root配下の生成物を隔離または削除する。
3. 承認キューを未処理状態のまま保持する。
4. 本体反映前なら本体repoは変更しない。
5. 監査ログは削除せず、失敗原因を追記する。

本体反映後に失敗した場合:

- 承認ログの対象ファイルを確認する。
- 反映前バックアップまたはgit差分で戻す。
- 実行したテストと失敗ログを残す。
- イツキシマ判定を「保留」に戻す。

## 12. MVP完了条件

最小実装が完了したと言える条件:

- Zone rootが固定されている。
- 実体パス判定でZone外へ抜けられない。
- 拒否パス一覧が全操作に適用される。
- 外部通信が既定OFF。
- 承認キューJSONが生成できる。
- 監査ログがHermes作業ログと分離されている。
- Zone内A0-A2は自由に回せる。
- Zone外、本体反映、秘密情報、MT5/EA、memory DB、外部送信、git push、本番反映は止まる。
