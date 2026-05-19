# しきしま 残Task Registry — 100% まで

**Baseline:** 75e690b
**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)

凡例: Level = 1-4 (AI作業可) / 5 (人間GO必須)

---

## DONE — 完了済みタスク

| Task ID | タイトル | 状態 | commit |
|---|---|---|---|
| AT-07 | Control Room Layout + HandoffLane | DONE | fbaa0f5〜 |
| AT-08 | Worker Status Panel + SlotStatusBar | DONE | fbaa0f5 |
| AT-09 | Resume Queue / Cooldown Panel | DONE | 669b0f8 |
| AT-10 | Runaway Guard Panel | DONE | 72748ba |
| AT-11 | Worker Routing Panel | DONE | 5a63e0c |
| AT-12 | Gate Dashboard Panel | DONE | eb54a2b |
| AT-13 | Final Visual Polish / Responsive Pass | DONE | a8ef150 |
| AT-14-PKG | Runtime Visual Recheck Package (docs) | DONE | eaf102a |
| AT-15 | UI Scale-Up (font ×1.3) | DONE | b5e7aa4 |
| AT-05 | Sprite Asset Plan (docs) | DONE | existing |
| CC-01 | Control Center snapshot polling 接続 | DONE | 75e690b |
| CC-02 | PageShell / OperatorPage live data | DONE | 75e690b |
| UI-01 | ウィンドウサイズ記憶 (window-bounds.json) | DONE | 75e690b |
| UI-02 | テーマトグル ☀/🌙/🖥 | DONE | 75e690b |
| ZOOM | Ctrl+wheel zoom 全ページ | DONE | a1defa1 |
| NAV | Control Center / Mobile Console ナビ先頭 | DONE | 574131b |
| DOCS-DAILY | 2026-05-19 daily work summary | DONE | 75e690b |
| DOCS-L5 | Level 5 blocked tasks 記録 | DONE | 75e690b |

---

## HOLD — runtime 確認待ち (Level 5 runtime)

| Task ID | タイトル | Level | runtime? | 外部接続? | 人間GO? | evidence? | 次アクション |
|---|---|---|---|---|---|---|---|
| AT-14-RUN | Runtime Visual Recheck 実施 | **L5** | ✓ | ✗ | **必須** | 必要 | time_window 記入 → GO |
| CC-VIS | CC live data 目視確認 | L4〜L5 | △ | ✗ | AT-14と兼用可 | 必要 | Phase 2 内で確認 |
| UI-VIS | UI-01/02 目視確認 | L4 | △ | ✗ | 任意 | 必要 | Phase 4 内で確認 |

---

## BLOCKED — Level 5 人間GO必要

| Task ID | タイトル | Level | 外部接続? | 人間GO? | 承認フォーム |
|---|---|---|---|---|---|
| CC-03 | Command Chat 実送信 | **L5** | AI API | **必須** | `LEVEL5_BLOCKED_TASKS.md` |
| HB-01 | Hermes Bridge WSL2 接続 | **L5** | WSL2 | **必須** | `LEVEL5_BLOCKED_TASKS.md` |
| XS-01 | x_search read-only gate | **L5** | SNS/Web | **必須** | `LEVEL5_BLOCKED_TASKS.md` |

---

## DOCS NEEDED — docs 作業残 (Level 1-4)

| Task ID | タイトル | Level | runtime? | 外部接続? | 人間GO? | 次アクション |
|---|---|---|---|---|---|---|
| EV-AT14 | AT-14 evidence doc 作成 | L4 | ✗ | ✗ | ✗ | Phase 2 後に作成 |
| EV-CC | CC-01/02 live data evidence | L4 | ✗ | ✗ | ✗ | Phase 3 後に作成 |
| EV-UI | UI-01/02 evidence | L4 | ✗ | ✗ | ✗ | Phase 4 後に作成 |
| GATE-OAUTH | OAuth future gate plan (詳細) | L4 | ✗ | ✗ | ✗ | Phase 5 |
| GATE-OBS | Obsidian local note gate (詳細) | L4 | ✗ | ✗ | ✗ | Phase 5 |
| GATE-EXT | External write gate policy | L4 | ✗ | ✗ | ✗ | Phase 5 |
| GATE-PROD | productionReady 最終 gate policy | L4 | ✗ | ✗ | ✗ | Phase 5 |
| GATE-EXEC | execution enable 最終 gate policy | L4 | ✗ | ✗ | ✗ | Phase 5 |

---

## FUTURE — 将来 Gate (Level 5 + 物理)

| Task ID | タイトル | Level | 物理? | Gate |
|---|---|---|---|---|
| SC-DISP | StackChan display-only plan | L4 | ✗ | StackChan gate |
| SC-PHYS | StackChan 物理動作 | **L5+物理** | ✓ | 到着+設定後 |
| VOICE-OUT | 音声出力 | **L5** | △ | voice gate |
| MIC-IN | マイク入力 | **L5** | △ | media gate |
| CAM-IN | カメラ入力 | **L5** | △ | media gate |
| FINAL-ACC | 最終受け入れ記録 / 100% 宣言 | L4 (記録) / L5 (宣言) | ✗ | Phase 10 |

---

## 100% までの推奨実施順

```
Step 1  AT-14-RUN    → 人間 time_window GO → runtime visual recheck実施
Step 2  EV-AT14      → evidence doc 作成・commit
Step 3  EV-CC        → CC live data evidence 確認
Step 4  EV-UI        → UI-01/02 evidence 確認
Step 5  DOCS NEEDED  → Gate policy docs 整備 (Phase 5)
Step 6  CC-03        → 人間 GO 後に Command Chat 実送信テスト
Step 7  HB-01        → 人間 GO 後に Hermes Bridge 接続テスト
Step 8  XS-01        → XS-READ gate GO 後に x_search 実装
Step 9  SC/VOICE/MIC → 物理デバイス準備後 (FUTURE)
Step 10 FINAL-ACC    → 全完了後 100% 宣言
```

---

**この範囲では問題を検出していません。**
