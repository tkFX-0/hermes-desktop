# Hermes Connection Pre-Review

## 1. 目的

Hermes Autonomy ZoneをHermes本体へ接続する前に、許可するAPI、禁止する操作、連携前チェック項目を固定する。

この文書は接続実装ではない。Hermes本体への完全接続、外部通信、git操作、本番反映はまだ行わない。

## 2. Hermes本体連携で許可すること

Hermes本体から呼び出してよい候補は、Autonomy Zoneの境界APIに限定する。

- `readZoneFile`
- `writeZoneFile`
- `deleteZoneFile`
- `executeCommand`
- `requestNetworkAccess`
- `requestGitOperation`
- `createApprovalRequest`

許可範囲:

- Zone内safe read。
- Zone内safe write。
- delete / execute / network / gitの明示ブロック。
- approval request candidate生成。
- auditEventCandidate生成。

## 3. Hermes本体連携で禁止すること

- Zone外アクセス。
- raw `fs` の直接利用。
- raw `child_process` の直接利用。
- raw network APIの直接利用。
- raw git操作。
- 既存EA/MT5接続。
- memory DB直接操作。
- `.env`、APIキー、secrets参照。
- 本番反映。
- 外部通信。
- git push。

## 4. 連携前チェックリスト

- [x] `READY_FOR_LOCAL_PILOT` に到達している。
- [x] smoke testが成功している。
- [x] local pilot smoke testが成功している。
- [x] `runLocalPilotFullLoop` Sandbox 単体テスト (`tests/ichikishima/pilot/`)。
- [x] typecheckが成功している。
- [x] 対象ESLintが成功している。
- [x] 禁止領域に触れていない。
- [x] 外部通信していない。
- [x] 依存追加していない。
- [x] git pushしていない。

## 5. Hermesから直接呼ばせないもの

- `fs.readFile` / `fs.writeFile` などのraw fs。
- `child_process`。
- `fetch` / HTTP client。
- git CLI / git library。
- memory DB。
- MT5/EA本体。
- `.env` / APIキー / secrets。

## 6. 接続前に必要なレビュー

接続前に人間が確認すること:

- Hermes本体から呼び出すAPIが境界APIだけになっているか。
- Zone rootが固定されているか。
- approval request candidateがユーザー判断可能な粒度か。
- auditEventCandidateにcontent本文や秘密情報が含まれないか。
- delete / execute / network / gitが実行に進まないか。

## 7. 判定

現時点では `READY_FOR_LOCAL_PILOT` であり、`READY_FOR_LOCAL_FULL_LOOP` / `READY_FOR_CONTROL_CENTER_V1_DESIGN`（read-only カード）は **コード上のテストで到達可能**。Hermes本体完全接続は未承認。

詳細は別紙:

- `HERMES_BRIDGE_CONTRACT.md`
- `ROADMAP_STATUS.md`
- `HERMES_BRIDGE_FINAL_REVIEW.md`（**本体接続直前の許可／禁止／停止条件ゲート**）

次に進む場合は、「Hermes本体連携IPC」または「Control Center read-only に UI を載せない可視化（CLI/ログ）」から始める。

## 参考

- **`src/main/ichikishima/hermes/`** — HermesBridge + LocalPilot スタブ
- **`src/main/ichikishima/orchestrator/`** — イツキシマ統括
- **`RUNBOOK`**: `HERMES_LOCAL_PILOT_RUNBOOK.md`
