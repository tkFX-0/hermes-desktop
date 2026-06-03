# Control Center V1 — Localhost Security（Read-only Snapshot）

**位置づけ**: `getControlCenterReadonlyData` 相当を **HTTP で読む**ときの最小脅威モデル。**V1 実装コード**は `local-api-server.ts`（**`127.0.0.1`・`GET /snapshot` のみ**。アプリ本体からの常駐起動は未配線）。

**Local API（HTTP）設計 — ソース・オブ・トゥルース**:

- Threat Model — `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md`
- Public Contract — `CONTROL_CENTER_LOCAL_API_CONTRACT.md`
- Implementation Gate — `CONTROL_CENTER_LOCAL_API_IMPLEMENTATION_GATE.md`
- Contract 型（コード）— `src/main/ichikishima/control-center/local-api-contract.ts`

**状態（2026-05）**: **Local HTTP V1（read-only）は実装済み**。**CORS なし**。**`HEAD` / `OPTIONS` は拒否**（405・本文無し）。**`0.0.0.0` bind は拒否**。Static Shell が **ブラウザ `fetch`** で読む運用は **同一 Origin が取れない限りクロスオリジン失敗となる**ことを前提にし、外部ページからは想定しない（V1）。V1.5 で token / Origin 追加を検討。

---

## 1. V1 Read-only は localhost のみ許容となりうる条件

すべて満たす場合に限り **認証なし**でも一時許容できる:

- **read-only のみ** — 応答本文に実行トリガや副作用 API を含まない。
- **secrets／生ログ／環境変数を含まない**（`CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`）。
- **外部への二次送信を UI が行わない**（telemetry 無し）。

## 2. Bind アドレス

| 許可 | 禁止 |
|------|------|
| `127.0.0.1` のみ（IPv4 localhost） | `0.0.0.0` |
| （任意）`::1` のみ明示 — 運用単純なら IPv4 に限定推奨 | LAN 公開インタフェースへの bind |

「localhost」の名札つきポートで **`0.0.0.0` にしない**ことを CI／Runbook で確認する。

## 3. LAN 公開

- Read-only と言いつつも **情報漏えい**（内部パス・IDs・運用状態）は残る。**意図的な LAN 公開は禁止**。個人開発マシンの同一ユーザーのみが前提。
- Tunnel / ngrok 等への橋渡しは **別承認・別チェックリスト**。

## 4. 将来 — Local Session Token（V1.5 候補）

- サーバ起動時に **短命トークン**を生成し、UI は `Authorization` またはカスタムヘッダで付与。
- ブラウザ拡張・他プロセスによる乱読を軽く抑止（銀河級ではない）。
- CSRF は **読み取りのみ GET** のまま運用できるが、実行系が入った瞬間には **nonce / SameSite / method 制約** が必須。

## 5. 実行系 API が追加される場合

以下を **すべて**満たすまで bind しない:

- 認証（少なくとも local token）。
- メソッド／ルートを **実行系のみ** に分離。
- 監査ログ方針の合意。
- 「read-only と同一ポートに混載しない」を推奨（論理または物理分離）。

## 6. 応答サイズ・ログ

- 巨大 JSON でメモリ圧迫を避ける（ページングまたはサマリのみ）。
- サーバ・アクセスログに **クエリ／Authorization を残さない**運用も検討（個人開発なら syslog への垂れ流しだけ注意）。

---

## 段階案（ユーザー合意済み）

| 段 | 認証 |
|----|------|
| V1 | localhost + read-only のみ・認証なし可 |
| V1.5 | 起動時生成ローカルトークン・ヘッダ必須 |
| V2+ | UI 操作が増えたら必須認証 + CSRF／nonce |

---

## 関連

- `CONTROL_CENTER_V1_IPC_CONTRACT.md`
- `CONTROL_CENTER_V1_UI_SHELL_SPEC.md`
