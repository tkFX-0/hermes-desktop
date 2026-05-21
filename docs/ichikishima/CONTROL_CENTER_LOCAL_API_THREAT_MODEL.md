# Control Center — Local Read-only API Threat Model

**状態**: **127.0.0.1 read-only Local HTTP は V1 実装済み**（`local-api-server.ts`）。Threat Model と契約との一致を本書が引き続き束ねる。**実装詳細・HTTP コード**は **`CONTROL_CENTER_LOCAL_API_CONTRACT.md`** / **`local-api-server.test.ts`** を正とする。  
**関連**: `CONTROL_CENTER_LOCAL_API_CONTRACT.md`、`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`、`CONTROL_CENTER_STATIC_SHELL_JSON_GUIDELINES.md`

---

## 1. 目的

- Static Shell／将来の Control Center UI が **read-only Snapshot** で運用状態を見られるようにする経路を用意できるようにする。
- **実行系 API は持たない**（変更・削除・実行・外向きネットワーク・git 等）。
- **secrets／生ログ／レポート全文を返さない**（データ契約順守）。
- **インターネットまたは LAN への意図的公開をしない**（個人用ローカル限定）。

---

## 2. 想定利用

| 項目 | 内容 |
|------|------|
| 環境 | 個人 Windows ローカル（同一ユーザー操作が前提）。 |
| クライアント | ブラウザ（将来的に固定 Origin の UI）または Electron 製 UI（別契約での IPC と二重経路になりうる）。 |
| ホスト結合 | **127.0.0.1 のみ**。 |
| LAN | **共有しない**（他マシンから到達させない）。 |
| クラウド | **外部サービスからアクセスしない**（tunnel / ngrok は別承認）。 |

---

## 3. 攻撃面（脅威）

| ID | 脅威 |
|----|------|
| T-BIND-ALL | **`0.0.0.0` / `*` bind** で同一 LAN または VPN 経由の傍受／スキャン対象になる。 |
| T-LAN | 意図しない **LAN 公開**または OS ファイアウォール設定ミスによる到達可能性。 |
| T-LOCAL-PROC | **同一ホスト上の別プロセス**が localhost にアクセスして Snapshot を読む。 |
| T-WEB-XSRF | **悪意ある Web ページ**がユーザーのブラウザ経由で `http://127.0.0.1:PORT/snapshot` を読みに行く（**ブラウザで Shell を開いた場合に顕在化**）。 |
| T-CORS | **誤った CORS 設定**により任意 Origin からの読み取りが許可される。 |
| T-SECRET | Snapshot 組み立てまたは直列化経路での **secrets 混入**。 |
| T-RAW-LOG | **raw audit / approval / report 全文**の混入。 |
| T-ACTION-SLIP | 実装段階で **POST での実行系エンドポイント**が同じポートに増殖する。 |
| T-CSRF-WRITE | （将来）**CSRF に相当するトリガー**が write 実行を伴う経路につながる。※V1 は GET read-only で副作用なしでも、ページ跨ぎ読取は論点に残る。 |
| T-PORT | **ポート衝突**による誤別プロセスへの接続、または起動失敗の未定義動作。 |
| T-ZOMBIE | **常駐プロセスの停止漏れ**（ポート占有・開発者が別アプリと混同）。 |

---

## 4. 防御方針（要件）

| 方針 | 内容 |
|------|------|
| bind | **`127.0.0.1` のみ**。**`0.0.0.0` とワイルドカード IPv4 は禁止**。IPv6 が要る場合は **`::1` のみ明示**までに限定し、既定は IPv4 でよい（`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md` 整合）。 |
| エンドポイント | **V1 は read のみ 1 本** — **`GET /snapshot`**。**POST / PUT / PATCH / DELETE 禁止**。**`HEAD` / `OPTIONS` も許可しない**（405・本文無し）。 |
| ペイロード | `getControlCenterReadonlyData` と **論理同一の Snapshot**（フィールドセットは `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`）。 **`requiresUserApproval: true`、`canExecuteDangerousActions: false` 固定**。 |
| 経路混入禁止 | secrets、`.env`、`raw` path 連打、ログ本文、実行 RPC を **載せない**（Contract の禁止リスト）。 |
| RPC 対応 | Canonical IPC 論理名は **`controlCenter.readonly.getAppSnapshot`**。Legacy `getSnapshot` is retired. |
| CORS | **V1 はレスポンスに CORS 許可ヘッダを載せない**（`CONTROL_CENTER_LOCAL_API_CORS_ORIGINS_V1_DENYLIST` が空）。V1.5 で Origin allowlist と token をセットで設計レビュー。 |
| Token | **V1 では認証なしでも許容されうるが、外部公開はしない前提**。**V1.5 で local token を推奨**。 |
| 運用 | **起動・停止を明示**（ドキュメントと CLI／スクリプトの双方で）。アクセスログに **Authorization 値やクエリを残さない**方針を検討。 |

---

## 5. V1 で許容するリスク（合意済みとして残す論点）

- **認証なし**の **`127.0.0.1` read-only** に限定できる場合に限り、**個人 PC 内**の読取リスクは許容候補（`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md` §1 と同一精神）。
- **別プロセス・同一ユーザー権限**による Snapshot の読み取りは、完全には防げない（OS のローカル脅威モデル）。
- **実行系エンドポイントが 1 本でも増える**見込みが出たら、**別ポートまたは認証必須**へ移行しない限り **`GET /snapshot` だけでは足りない**。

---

## 6. V1.5 以降で追加検討するもの

| 項目 | 目的 |
|------|------|
| 起動時 **local token** | ブラウザ横取り・他プロセス読取のわずかな緩和。 |
| **Origin / Referer** 制限 | 悪意あるページからの単純読取の難化（完全ではない）。 |
| **nonce / session** | 将来実行系や複数読取チャネルを分離するときに必須。 |
| **access audit**（API 側） | いつ・誰が「read」したかの最小ログ（ログに secrets を載せない）。 |
| **ポート方針** | 固定番号／起動ごとランダム＋ロックファイルなど **衝突と誤結線の軽減**。 |

---

## 7. 関連ドキュメント

- `CONTROL_CENTER_LOCAL_API_CONTRACT.md`
- `CONTROL_CENTER_LOCAL_API_IMPLEMENTATION_GATE.md`
- `CONTROL_CENTER_LOCAL_API_TEST_PLAN.md`
- `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`
- `CONTROL_CENTER_V1_IPC_CONTRACT.md`
## 2026-05-07 B-1 Cleanup Addendum

- Canonical IPC is `controlCenter.readonly.getAppSnapshot`.
- Legacy `controlCenter.readonly.getSnapshot` is retired.
- Threat model assumption: raw API arrays stay internal and are not exported through IPC/HTTP wire payloads.
