# アプリのみ運用ロードマップ（Control Center 収束）

**方針**: **通常運用は単一 Windows アプリ**。Cursor / Composer2 / Codex は **開発・レビュー専用**。

---

## 1. なぜアプリだけで管理するか

IDE を開くと権限・シェル・拡張の攻撃面が増える。**状態・門・準備ラベル**は固定契約のアプリ側に閉じ、実行は許可リストと別フェーズで扱う。

---

## 2. Cursor / Composer / Codex の役割

コード編集・spec ドラフト・ローカルテスト。**本番状態の単一ソースではない**。Goal / Sign-off は `docs/` と queue で固定。

---

## 3. 将来アプリでできること（段階的）

read-only Snapshot、部屋カード、集計ヒント、次 Goal の短文。**後続**: Sandbox 許可パイプラインのみ実行 UI。

---

## 4. まだアプリでやらないこと

実 Hermes 常駐、WSL wrapper 自動起動、`execFile` 任意パス、承認からの自動実行、外部送信、secrets 露出、stdout 全文ペイン。

---

## 5. Read-only phase（現在）

`ControlCenterAppSnapshot` + main **`registerControlCenterReadonlyIpcHandlers`** + preload **`window.ichikishimaControlCenter.getAppSnapshot()` のみ**。**Renderer** に **`ControlCenterAppShell`** — **読取のみ**。Renderer に実行系・raw IPC・fs を渡さない。**path resolver 済み**。**packaged path smoke は `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md` + Signoff でゲート**。**実 packaged 短命起動は未**。

---

## 6. Controlled action phase

`Run Local Pilot` 等。**Runner が Sandbox 許可のみ**・ボタンは別 Goal で gate。

---

## 7. Agent room phase

Hermes / Ichikishima / Approval / Audit / Memory を **視覚レイアウト**。操作は読取優先。

---

## 8. WSL2 Hermes wrapper phase

`ADR_REAL_HERMES_WSL2_CONNECTION.md` / wrapper 契約通過後。**argv 固定・人手 sign-off**。

---

## 9. Approval execution phase

**別チャンネル・別監査**。自動橋渡しは最終段で最小許可のみ。

---

## 10. Memory persistence phase

Governance SPEC 済み・マスク恒久化のみ。

---

## 11. Visualization phase

Flow は **状態可視化**。操作の主導権はユーザー。

---

## 12. EA / MT5 phase

**Hermes メインとは分離**。タッチは専門 Goal。

---

## 13. スマホ / PWA phase

read-only メタの閲覧程度から。機微は載せない。

---

## 14. 完全自律エージェントチームへの段階

1. Registry / capability-matrix / dry-run メッセージ型（**自動実行無し**。`tests/ichikishima/agent-team/`）
2. Scheduler **契約常時 OFF**（`AGENT_TEAM_SCHEDULER_ENABLED`）
3. 人手 Sign-off 済み Goal のみ **tick 許可検討**（STOP GATE）

---

## 15. STOP GATE 一覧（本ロードマップで越えない）

| ID | GATE | 状態 |
|----|------|------|
| SG-1 | 実 Hermes 本体プロセス常駐 / 自動起動 | **禁止** |
| SG-2 | `wsl.exe` 実実行 | **禁止** |
| SG-3 | Controlled `execFile` 実機 | **別 Goal** |
| SG-4 | Control Center IPC **本配線**（main・read-only のみ） | **2026-05-03 到達**（実行系は未追加） |
| SG-5 | preload/renderer **実行 API**（Hermes 起動・Approval 実行・任意 shell 等） | **禁止**（**read-only `getAppSnapshot` のみ解禁済み**） |
| SG-6 | Electron UI Shell 製品ウィンドウ（単独・アプリのみの常駐） | **別 Goal** |
| SG-7 | Approval **自動適用実行** | **禁止** |
| SG-8 | memory DB/SQLite 本番書込 | **禁止** |
| SG-9 | EA/MT5 実接続 | **別フェーズ** |
| SG-10 | 外向き通信／依存自動インストール | **禁止** |
| SG-11 | Agent Team **自律 tick / 常駐ワーカー** | **禁止** |

---

## 関連

- `CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md`
- `APP_ONLY_OPERATION_RUNBOOK.md`
- `FINAL_READINESS_MATRIX.md`
- `NEXT_GOALS.md`
- `ROADMAP_STATUS.md`
