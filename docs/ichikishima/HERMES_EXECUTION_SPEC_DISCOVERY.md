# Hermes Execution Spec Discovery（Controlled Pilot 前の確認リスト）

実 Hermes の**実行ファイルパスをユーザーが渡す前**に確認すべき事項を固定する。これは Hermes の内部実装詳細ではなく、**Hermes-desktop 側の Controlled Pilot と整合するために必要な観点**だけを列挙する。

---

## 0. プラットフォーム前提（NousResearch hermes-agent / Windows）

- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) の README 上、**ネイティブ Windows 用の Quick Install は対象外**で、**WSL2** 等での利用が示される。**`hermes.exe` を `%USERPROFILE%\.hermes\` に期待する前提は破棄**する（過去の候補探索は参考に留める）。
- Windows で Controlled Pilot を行う本筋は **`C:\Windows\System32\wsl.exe`（例）** + **固定 argv** + **WSL 内 wrapper**（stdout 単一 JSON）。**`adapterKind: "wsl_wrapper"`** と **argv 厳格形**は `hermes-controlled-pilot-config` で検証可能。
- **`--mode bridge-payload-once`** は **本リポの ingress 用推奨候補**であり、**公式 `hermes` CLI が同一フラグを解釈するかは未確認**。`bridge-payload-once` を **公式バイナリに直渡ししない**（TUI/ログ混在リスク）— **WSL wrapper 契約**を先に満たす（`ADR_REAL_HERMES_WSL2_CONNECTION.md` / `HERMES_WSL2_WRAPPER_CONTRACT.md`）。

---

## 1. 実行ファイルパス

- OS 上実在し、ユーザーが読み実行できることを確認する（本リポのコードでの自動チェックとは別）。
- **Windows（NousResearch 本流）**: **ネイティブ `hermes.exe` を仮定しない**。**`wsl.exe` + WSL 内スクリプト**を許可する場合は **`HERMES_WSL2_WRAPPER_CONTRACT.md`** および **`adapterKind: wsl_wrapper`**。
- **絶対パス**で指定する。
- アダプター allowlist と **完全一致**（正規化・realpath 後）で検証される。
- `.env`、`secrets`、`credential` に相当する名前やパスのバイナリは対象としない。
- **`cmd.exe` / `powershell` / `bash` を executable にしない**。

---

## 2. allowedExecutableId

- 短文の **安定キー**（例: `hermes-production-build-YYYYMMDD`）。
- 証跡とテンプレの **相互参照** に使う。パスとは別フィールド。
- 英数字、`-` / `_` 中心（長すぎない）。

---

## 3. 固定 argv（候補と注意）

推奨候補（**Hermes 側／WSL wrapper 側が解釈できない場合は使用禁止** — ユーザーが別 Goal で明示するまで確定しない）:

```text
["--mode", "bridge-payload-once"]
```

- **これは hermes-desktop 側のドキュメント候補**であり、**公式 `hermes` CLI に存在が確認できていない**。**stdout 単一 JSON が取れない限り実機しない**。
- **`wsl.exe` を allowlist する場合**は **別形**（`["-d", "<Distro>", "--", "/abs/wrapper.sh"]` **ちょうど 4 トークン**）が必須 — `HERMES_WSL2_WRAPPER_CONTRACT.md`。

- **任意ユーザー入力や任意ファイルパスを argv に混入しない**。
- `--prompt`、`--file`、実行・ネットワーク・削除・インストール類のフラグは **Controlled Pilot の初回では禁止**。
- Hermes がこの argv を認識しない場合:**実機実行はしない** → 実行仕様の再確認 Goal へ。

---

## 4. stdout payload（形式）

- **単一オブジェクト JSON 1 本のみ** stdout に書く運用であること（余計なログ混在無し）。
- **JSON でないログ行が混じる運用では実機しない**。
- 出力はサイズ上限内に収める（テンプレ側で上限を明示）。

---

## 5. payloadSchemaVersion

- `hermes-bridge-payload/v1` と一致することが必須（フラット `"v1"` は不可）。
- `validateHermesBridgePayload` が成功する構成であること。

---

## 6. stderr

- stderr は短文・上限付き。全文を Audit / Approval / Snapshot に載せない。
- 実機後も stderr 全文をファイルに恒久保存しない方針。

---

## 7. exitCode / signal

- 非ゼロ exit は **failure / fail-closed** 側に分類される前提。
- シグナル・timeout で **単発処理が終了**すること（常駐化しない）。

---

## 8. timeoutMs の候補

- **初回実機では短め**から（例: 8s〜30s 帯）。
- アダプター内部は上限（例最大 3600s）により拒否がある。

---

## 9–11. stdout / stderr バイト上限

- `maxStdoutBytes` / `maxStderrBytes` は両方とも **256 バイト以上**のポリシー（実装）。
- Payload サイズ見積もりに合わせて **余裕なくても読みきれる範囲**をユーザーが明示。

---

## 12. cwd 候補

- **`sandbox/hermes-autonomy-zone` または Zone root 配下のみ**がコード上許される。
- プロジェクト任意ディレクトリは不可。

---

## 13. env

- `.env` 読み込み禁止。process.env を丸ごと渡さない。
- 最小環境のみ（プラットフォームで必要な極小数 + ユーザー許可のみ）。

---

## 14. 実機 1 回前の No-Go（例）

- 上記のどれかが未確認・未明示。
- argv が固定でなく、Hermes が未対応の `--mode` である。
- secrets / 外部ネットワーク / 長時間常駐が前提。
- **Signoff とテンプレ未記入**。

---

関連: **`HERMES_CONTROLLED_PILOT_RUNBOOK.md`**、`HERMES_ALLOWED_EXECUTABLE_TEMPLATE.md`、`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`、**`ADR_REAL_HERMES_WSL2_CONNECTION.md`**、**`HERMES_WSL2_WRAPPER_CONTRACT.md`**。
