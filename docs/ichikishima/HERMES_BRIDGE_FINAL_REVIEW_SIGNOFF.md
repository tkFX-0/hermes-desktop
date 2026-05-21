# Hermes Bridge Final Review — 人手レビュー記録（Sign-off）

**位置づけ**: `HERMES_BRIDGE_FINAL_REVIEW.md` とコード正の突合を、**運用できる形で閉じる**ためのテンプレート。**実装義務や実 Hermes 接続は生じさせない**。  
**前提**: **`HERMES_BRIDGE_FINAL_REVIEW.md` §8**、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`

---

## 1. レビュー対象

- Hermes Bridge 許可／禁止境界、Pilot dry-run、`routeHermesOperation` 分類、将来 **Registry IPC の論理名（`hermesBridge.registry.getReadiness` のみ）**。
- Control Center Local API との **非混載**。

---

## 2. レビュー済み文書一覧（チェック）

| 文書 | 読了・異議なし |
|------|----------------|
| `HERMES_BRIDGE_FINAL_REVIEW.md` | [ ] |
| `HERMES_BRIDGE_API_REGISTRY.md` | [ ] |
| `HERMES_BRIDGE_OPERATION_MATRIX.md` | [ ] |
| `HERMES_BRIDGE_PILOT_SPEC.md` | [ ] |
| `HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md` | [ ] |
| `HERMES_BRIDGE_OWNERSHIP_MODEL.md` | [ ] |
| `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md` | [ ] |
| `CONTROL_CENTER_OWNERSHIP_MODEL.md` | [ ] |

---

## 3. コード正として確認した定数（参照のみ・転記二重管理しない）

| 定数 | ファイル |
|------|----------|
| `HERMES_BRIDGE_ALLOWED_APIS` | `hermes-bridge-api-registry.ts` |
| `HERMES_BRIDGE_FORBIDDEN_APIS` | 同上 |
| `HERMES_BRIDGE_READINESS_REQUIREMENTS` | 同上 |
| `HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS` | 同上（**要素は `hermesBridge.registry.getReadiness` のみ**） |
| `HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS` | 同上 |

---

## 4. Readiness gate

| 項目 | 確認 |
|------|------|
| `DOC_REL` **9** 本が `docs/ichikishima/` に存在（`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` / **`HERMES_BRIDGE_RECEIVER_QUEUE.md`** 含む） | [ ] |
| `getHermesBridgePilotReadiness` が `READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN` / `NOT_READY` を返せる | [ ] |

---

## 5. Operation Matrix 分類

| 項目 | 確認 |
|------|------|
| read/write ↔ `allowed_zone_candidate` | [ ] |
| delete / execute / network / git ↔ `blocked_zone_sensitive` | [ ] |
| dependency_install 既定／external_ai ↔ `bridge_requires_approval` | [ ] |
| dependency_install `policy_blocked` ↔ `forbidden_boundary`（`DEPENDENCY_INSTALL_POLICY_BLOCKED`） | [ ] |
| memory_db / mt5 / env_secret / raw / production_config ↔ `forbidden_boundary` | [ ] |

---

## 6. IPC 候補（論理のみ・`ipcMain.handle` は未実装）

| 項目 | 確認 |
|------|------|
| **V1 候補は `hermesBridge.registry.getReadiness` のみ**（状態・要約。完全 API 一覧は返さない方針） | [ ] |
| `HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS` に **getAllowedApis / getForbiddenApis / pilot.getReadiness** が含まれる | [ ] |

---

## 7. 禁止 RPC（論理チャネル名）

Pilot 実行系・`route` 露出など：`HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS` を正とする。

---

## 8. 未実装のまま残すもの

- 実 Hermes プロセス起動・完全接続
- `ipcMain.handle` / preload への Bridge Registry 公開
- Local HTTP の追加経路・Bridge との混載
- 承認済み操作の自動実行エンジン

---

## 9. 人手確認項目（必須）

- [ ] Registry 定数と Final Review §1–2 の意図が一致している
- [ ] Operation Matrix と `routeHermesOperation` が一致している
- [ ] `dependency_install` 境界が妥当である
- [ ] `external_ai_escalation` 境界が妥当である
- [ ] forbidden 系が妥当である
- [ ] **`ipcMain.handle` が未実装**であることを確認した
- [ ] raw fs / shell / network / git が Renderer／preload に露出していないことを確認した（レビュー時点）
- [ ] Local HTTP と Bridge が混線していない
- [ ] **実 Hermes 接続はまだ行わない**
- [ ] **次 Goal は Hermes Bridge Pilot dry-run／Preflight で明示された順序に限定**する（別文書 `HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`）。

---

## 10. 承認 / 保留 / 却下（記録）

| 日付 | 判定 | レビュア | メモ |
|------|------|----------|------|
| YYYY-MM-DD | 承認 / 保留 / 却下 | （氏名または handle） | |

**保留／却下時**: 問題点をメモし、`HERMES_BRIDGE_FINAL_REVIEW.md` または関連 SPEC を更新してから **再レビュー**。

---

## 11. 実 Hermes 接続直前（Preflight・文書のみ）

対象：**`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`** / **`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`** / **`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`** / Payload §15  

| 項目 | 確認 |
|------|------|
| Ingress `payloadSchemaVersion` が **`hermes-bridge-payload/v1`** のみ（フラット **`"v1"`** 拒否） | [ ] |
| Receiver Queue（TTL／retry／duplicate／maxQueue）が **運用との整合**がある | [ ] |
| **`production_fail_closed`** lane が **dry_run・partial 系ノブ禁止**である | [ ] |
| **`validated payload` をログ・UI・Snapshot に丸ごと渡さない**方針が契約書に明記済みである | [ ] |
| raw JSON wire を **恒久保持しない** | [ ] |
| Control Center と Bridge が **ADR どおり混線していない** | [ ] |
| **`HERMES_CONNECTION_ADAPTER_CONTRACT.md`** 済み。Stage 0 **in-memory のみ**実装（`hermes-connection-adapter.ts`）。**Stage 1** **`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`**済み（`hermes-file-handoff-adapter.ts`。marker のみ・**marker 上書き禁止（UTC suffix＋連番）**・inbox 自動削除なし・**手動 cleanup Runbook**）。**実 Hermes 常駐・socket・HTTP listen は追加しない**。**Stage 0/1 は `child_process` 不使用**（**`execFile` は `hermes-real-process-adapter.ts` のゲート付き短命経路のみ**）。Control Center 向け `hermes-bridge-readiness-summary` は **詳細 API 配列・validated 全文を返さない** | [ ] |
| **`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`** 済み（`runHermesRealPilotMinimalFromFileHandoff`。Stage 1 handoff→Receiver→Local Pilot→承認／監査／Review。**`runRealHermesProcessAdapter` は既定 `disabled` のミニ実装**（**`execFile` のみ**・ゲート。**主経路は実プロセス起動しない**）。**実 Hermes READY・常許可・Controlled Run 済みとはみなさない**） | [ ] |

---
## 12. Real Hermes Process Adapter — Final Gate（`execFile` 安全枠・Controlled Pilot 直前にも再適用）

対象：**`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`**（**`execFile` ミニ実装および Controlled Run に入る直前の人手ゲート**）。

| 項目 | 確認 |
|------|------|
| Final Gate がリポ **`docs/ichikishima/`** に存在し、レビュアが読了した | [ ] |
| **`shell:true` 禁止**・**任意コマンド／任意 shell 禁止**が明記されている | [ ] |
| **許可バイナリ／引数ホワイトリスト**方針が明記されている | [ ] |
| **`cwd`** は Sandbox Zone または文書明示の安全ディレクトリのみ | [ ] |
| **env は最小**・**`.env`/secrets を子プロセスに渡さない** | [ ] |
| **stdin** は既定で閉鎖または空。**payload を stdin に流さない** | [ ] |
| **stdout/stderr はサイズ上限**。**全文を Audit／Approval／CC に載せない** | [ ] |
| **timeout 必須・kill（timeout 時）方針**あり | [ ] |
| **`ChildProcess`/PID/process handle を API 外向けに返さない** | [ ] |
| **`hermes-real-process-adapter.ts`** は **`execFile` のみ**。**`spawn`/`exec`/shell は使わない**。**既定 `disabled`**。**process handle を API 外向けに返さない** | [ ] |
| **`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md` E-25** を満たす | [ ] |
| **`Real Hermes Process Adapter Controlled Pilot Run` はユーザー明示別 Goal でのみ**（短命・許可バイナリ・再 Signoff）。本 § の禁止（任意コマンド・常駐・全文ログ流出等）と矛盾させない | [ ] |

**運用メモ（2026-05-03）**：上記 Controlled Pilot に至る **実機「前」の** 文書一式（実行仕様受け皿、Runbook、許可／結果テンプレ）および **検証のみ** のコード（config／preflight／summary）が整備済み。**実Hermes起動および実 `execFile` は、その Goal でユーザーがパス・argv・signoff を揃えるまで実行しない**。`GO_READY` でもコードはプロセスを起動しない。

---

関連: `HERMES_BRIDGE_FINAL_REVIEW.md`、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`、`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`、`HERMES_CONNECTION_ADAPTER_CONTRACT.md`、`GOAL_COMPLETION_REPORT.md`
