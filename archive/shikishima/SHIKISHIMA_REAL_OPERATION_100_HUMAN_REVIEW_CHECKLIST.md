# しきしま実運用100% — Human Review Checklist

**Baseline:** aadea91 | **Prepared:** 2026-05-19
**レビュアー:** (人間が記入)
**日付:** 

---

## 使い方

各項目を「accept / hold / reject / deferred / n/a」で記入してください。
notes には判断の根拠や課題を記録してください。

---

## A. ベースライン確認

| 項目 | 判断 | notes |
|---|---|---|
| HEAD == origin/main == aadea91 | | |
| commits_ahead == 0 | | |
| tracked_dirty == 0 | | |
| productionReady: false | | |
| execution: disabled | | |
| rawValuesReported: false | | |

---

## B. Runtime Visual Evidence (Phase 1)

| 項目 | 判断 | notes |
|---|---|---|
| Agent Theater diamond room layout | | |
| AT-07 Control Room (5 agents + HandoffLane) | | |
| AT-08 Worker Status Panel | | |
| AT-09 Resume Queue / Cooldown | | |
| AT-10 Runaway Guard | | |
| AT-11 Worker Routing | | |
| AT-12 Gate Dashboard (12 gates) | | |
| AT-13 Visual Polish | | |
| AT-15 UI Scale-Up (font readability) | | |
| テーマトグル ☀/🌙/🖥 | | |
| Ctrl+wheel zoom | | |
| STOP 条件 未発生 | | |
| runtime 正常停止 (Ctrl+C) | | |
| git status clean 後 | | |

---

## C. Control Center Live Data (Phase 2)

| 項目 | 判断 | notes |
|---|---|---|
| PageShell live snapshot 表示 | | |
| OperatorPage live data 表示 | | |
| Stale/Fresh 切り替え動作 | | |
| raw value 非表示確認 | | |
| IPC エラー時 fallback 動作 | | |

---

## D. Local UX (Phase 3)

| 項目 | 判断 | notes |
|---|---|---|
| ウィンドウサイズ復元 | | |
| Ctrl+0 zoom リセット | | |
| dark/light/system テーマ | | |
| ナビ順序 (CC/MC 先頭) | | |
| critical layout 崩れなし | | |

---

## E. Level 5 Gate 書類 (Phase 4)

| 項目 | 判断 | notes |
|---|---|---|
| CC-03 承認フォーム完備 | | |
| HB-01 承認フォーム完備 | | |
| XS-01 承認フォーム完備 | | |
| OAuth gate policy 完備 | | |
| Obsidian gate policy 完備 | | |
| productionReady gate policy 完備 | | |
| execution gate policy 完備 | | |
| StackChan/Voice/Mic/Camera gate docs 完備 | | |

---

## F. Level 5 個別判断 (Phase 5–9)

| Task | 判断 | date | notes |
|---|---|---|---|
| CC-03 Command Chat 実送信 | | | |
| HB-01 Hermes Bridge WSL2 | | | |
| XS-01 x_search read-only | | | |
| Obsidian local note write | | | |
| OAuth/login | | | |
| StackChan 物理動作 | | | |
| voice output | | | |
| mic input | | | |
| camera input | | | |
| productionReady 最終決定 | | | |
| execution enable 最終決定 | | | |

---

## G. 最終受け入れ (Phase 10)

| 項目 | 判断 | notes |
|---|---|---|
| Phase 1–4: 全 DONE/PASS | | |
| Phase 5–9: PASS or DEFERRED (明示) | | |
| rawValuesReported: false 維持 | | |
| productionReady: false (宣言まで) | | |
| rollback/停止手順 完備 | | |
| 最終受け入れ記録 作成 | | |
| **実運用準備100% 宣言** | | |
