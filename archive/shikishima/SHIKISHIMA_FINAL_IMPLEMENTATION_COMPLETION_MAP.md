# しきしま最終実装完了マップ

**Baseline:** aadea91 | **Prepared:** 2026-05-19

---

## 実装済み / push 済み (Goal A)

| 機能 | commit | 状態 |
|---|---|---|
| Agent Theater AT-07 Control Room + HandoffLane | dc2dcc5〜 | ✅ |
| Agent Theater AT-08 Worker Status + Slot Status | fbaa0f5 | ✅ |
| Agent Theater AT-09 Resume Queue / Cooldown | 669b0f8 | ✅ |
| Agent Theater AT-10 Runaway Guard | 72748ba | ✅ |
| Agent Theater AT-11 Worker Routing | 5a63e0c | ✅ |
| Agent Theater AT-12 Gate Dashboard | eb54a2b | ✅ |
| Agent Theater AT-13 Visual Polish | a8ef150 | ✅ |
| AT-14 Runtime Recheck Package (docs) | eaf102a | ✅ |
| Agent Theater AT-15 UI Scale-Up | b5e7aa4 | ✅ |
| Room Layout diamond (しきしま中央) | aadea91 | ✅ |
| Ctrl+wheel zoom | a1defa1 | ✅ |
| Sidebar nav order (CC/MC 先頭) | 574131b | ✅ |
| Theme toggle ☀/🌙/🖥 (UI-02) | 75e690b | ✅ |
| CC-01/02 snapshot polling live data | 75e690b | ✅ |
| UI-01 window bounds memory | 75e690b | ✅ |
| 100% Roadmap Design Package (docs) | 9bc78af | ✅ |
| Phase 5 Gate Policy docs | 65225fa | ✅ |
| AT-05 Sprite Asset Plan (docs) | existing | ✅ |

---

## evidence / 確認残 (Goal B に必要)

| 確認項目 | 状態 | 対応 |
|---|---|---|
| AT-14 + Room Layout 目視証跡 | **未作成** | Phase 1 runtime GO 後 |
| CC live data 動作証跡 | **未作成** | Phase 2 (Phase 1 と兼用可) |
| UX (zoom/theme/window) 証跡 | **未作成** | Phase 3 (Phase 1 と兼用可) |
| Phase 9 docs 完備 | pending | 本パッケージで完了 |
| 最終受け入れ記録 | **未作成** | Phase 10 |

---

## BLOCKED / Level 5 (Goal C)

| 機能 | 状態 | Gate |
|---|---|---|
| CC-03 Command Chat 実送信 | **BLOCKED** | CC-03 GO |
| HB-01 Hermes Bridge WSL2 | **BLOCKED** | HB-01 GO |
| XS-01 x_search read-only | **BLOCKED** | XS-READ GO |
| productionReady: true | LOCKED_FALSE | PRODUCTION-READY GO |
| execution: enabled | LOCKED_DISABLED | EXECUTION-ENABLE GO |
| StackChan 物理動作 | FUTURE | 到着 + SC-PHYS GO |
| voice output | FUTURE | VOICE-OUT GO |
| mic input | FUTURE | MIC-IN GO |
| camera input | FUTURE | CAMERA-IN GO |

---

## FUTURE / optional

| 機能 | 状態 |
|---|---|
| Obsidian local note write | FUTURE (OBS-LOCAL GO) |
| OAuth provider | FUTURE (OAUTH-GO) |
| 外部 API write | BLOCKED (EXT-WRITE GO) |
| SNS 投稿/返信/DM | BLOCKED (不可逆 Gate) |
| 購入/予約/決済 | BLOCKED (不可逆 Gate) |
| 高度な自律ループ | FUTURE (別途方針策定) |
