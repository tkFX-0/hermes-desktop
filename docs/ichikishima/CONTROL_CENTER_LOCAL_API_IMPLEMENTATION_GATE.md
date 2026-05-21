# Control Center — Local Read-only API Implementation Gate

**状態**: **V1 Local HTTP は実装済み**（`local-api-server.ts`）。依存は **`node:http` のみ**。bind は **`127.0.0.1`**。**CORS は付けず**。**`HEAD` / `OPTIONS` は 405・本文無し**。  
設計フェーズどおり本ゲートの条件が満たされたうえでの実装を正とする。  
**読み順**: Threat Model → 本ゲート → Local API Contract → Test Plan。

---

## 1. Local API **実装**に進む前の必須条件

| # | 条件 |
|---|------|
| G-01 | **`getControlCenterReadonlyData` 実装済み**（Snapshot ソースが一点に集約）。 |
| G-02 | **Static Shell** が存在し、Snapshot shape の **人手確認経路**がある。 |
| G-03 | **`control-center-readonly-snapshot-contract` 等 Snapshot 契約テスト**が緑維持。 |
| G-04 | **secrets／raw ログ禁止**ポリシーが `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md` と矛盾しない。 |
| G-05 | **公開許可パス／メソッドは V1 で `GET /snapshot` のみ**（論理別名との対応も Contract に書く）。 |
| G-06 | **禁止エンドポイント一覧**が文書および `CONTROL_CENTER_LOCAL_API_FORBIDDEN_*` と一致している。 |
| G-07 | **`127.0.0.1` のみ bind** の運用チェックリストが CI または Runbook に存在する構想。**`0.0.0.0` 禁止**。 |
| G-08 | **実装に外部依存通信が不要**（telemetry、Updater、npm registry への実行時参照なし）。 |
| G-09 | **実行系 API を同ポートに増やさない**（設計レビュアの署名または Issue クローズ証跡）。 |
| G-10 | **`npm install` / package 追加なしで実現できる案**がある。依存が不可避なら **停止して別 Goal**。 |
| G-11 | **人間レビュー** — Threat Model + Contract に対する異議ない（記録あること）。 |

---

## 2. 実装中の停止条件（即座に中止して再設計）

次のどれかに当たったら **マージしない／bind しない**。

- **`npm install` / ロックファイル変更**が必要になった。
- **外部サービスとの通信**（telemetry、CDN、ログ SaaS を含む）がランタイム必須になった。
- **広い `Access-Control-Allow-Origin`** が「とりあえず `*` で」入った。
- **token がないと進められないが token 実装 Goal が未定義** のまま差分が増えている。
- **bind アドレスが曖昧**（開発者マシンの「とりあえず listen」）。
- 「ついでに」**POST で pipeline 試したい**等の実行系欲求が同一サーバに入った。
- **secrets や全文ログを返していいか議論が再燃**している（返さない）。
- **stack trace や絶対パスの垂れ込み**を JSON に載せようとしている。

---

## 3. 実装 Goal を切るときの最小成果物チェックリスト

（**V1 minimal — 適用済み**）

- [x] **`127.0.0.1` + GET `/snapshot`** のみで動く（**`node:http`** のみ。`npm install` なし）。
- [x] **`local-api-contract.ts` の allowed/forbidden と乖離しない** — `local-api-contract.test.ts` と **`local-api-server.test.ts`**。
- [x] **例外時も stack を返さず**、`canExecuteDangerousActions:false` / `requiresUserApproval:true` を Snapshot で固定。
- [x] **`stopControlCenterLocalApiServer`** で **ポート解放**（同一プロセス **シングルトン** — 二重 listen は拒否）。
- [ ] Electron／アプリ本体からの **自動起動・常駐配線**は **別 Goal**（本実装は **ライブラリ/API**）。

---

## 関連

- `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md`
- `CONTROL_CENTER_LOCAL_API_CONTRACT.md`
- `CONTROL_CENTER_LOCAL_API_TEST_PLAN.md`
