# しきしま実運用100% — Task Registry

**Baseline:** aadea91 | **Prepared:** 2026-05-19

凡例: L=Level / GO=人間GO必要 / RT=runtime必要 / EXT=外部接続 / EV=evidence必要

| Task ID | タイトル | Phase | L | 状態 | GO | RT | EXT | EV | 次アクション |
|---|---|---|---|---|---|---|---|---|---|
| BASELINE-00 | aadea91 baseline 確認 | 0 | 1 | **DONE** | - | - | - | - | 確認済み |
| AT14-EVIDENCE | runtime visual recheck evidence | 1 | 4/5 | **HOLD** | ✓ | ✓ | - | ✓ | time_window GO |
| ROOM-VISUAL | room layout 目視確認 | 1 | 4/5 | **HOLD** | ✓ | ✓ | - | ✓ | Phase 1 内で確認 |
| CC-LIVE-EV | CC live snapshot evidence | 2 | 4/5 | evidence残 | △ | △ | - | ✓ | Phase 1 内で兼用可 |
| UX-EV | zoom/theme/window evidence | 3 | 4/5 | evidence残 | △ | △ | - | ✓ | Phase 1 内で兼用可 |
| PHASE9-DOCS | StackChan/Voice/Mic/Camera docs | 4 | 4 | **pending** | - | - | - | - | 本パッケージで完了 |
| L5-REVIEW | Level 5 gate 書類確認 | 4 | 4 | ほぼ完了 | - | - | - | - | 最終確認 |
| CC-03 | Command Chat 実送信テスト | 5 | **5** | **BLOCKED** | **必須** | - | AI API | ✓ | GO フォーム記入 |
| HB-01 | Hermes Bridge WSL2 接続 | 6 | **5** | **BLOCKED** | **必須** | - | WSL2 | ✓ | GO フォーム記入 |
| XS-01 | x_search read-only gate | 7 | **5** | **BLOCKED** | **必須** | - | SNS | ✓ | XS-READ GO |
| OBS-LOCAL | Obsidian local note gate | 8 | **5** | **FUTURE** | **必須** | - | - | ✓ | vault 準備後 |
| OAUTH-GATE | OAuth/login 将来 gate | 8 | **5** | **FUTURE** | **必須** | - | OAuth | ✓ | provider 決定後 |
| EXT-WRITE | external write 最終 policy | 4 | **5** | blocked | **必須** | - | 外部 | - | 既存 policy 参照 |
| SC-DISP | StackChan display-only plan | 9 | 4 | **FUTURE** | - | - | - | - | Phase 9 docs |
| SC-PHYS | StackChan 物理動作 gate | 9 | **5+物理** | **FUTURE** | **必須** | - | 物理 | ✓ | 到着後 |
| VOICE-OUT | voice output gate | 9 | **5** | **FUTURE** | **必須** | - | △ | ✓ | Phase 9 後 |
| MIC-IN | mic input gate | 9 | **5** | **FUTURE** | **必須** | - | △ | ✓ | Phase 9 後 |
| CAMERA-IN | camera input gate | 9 | **5** | **FUTURE** | **必須** | - | △ | ✓ | Phase 9 後 |
| PRODUCTION-READY | productionReady 最終 gate | 10 | **5** | LOCKED_FALSE | **必須** | - | - | ✓ | Phase 10 |
| EXECUTION-ENABLE | execution enable 最終 gate | 10 | **5** | LOCKED_DISABLED | **必須** | - | - | ✓ | Phase 10 |
| FINAL-ACCEPTANCE | 実運用100% 最終受け入れ | 10 | **5** | **FUTURE** | **必須** | - | - | ✓ | Phase 1–9 後 |

---

## 優先実施順 (推奨)

```
1. PHASE9-DOCS  → docs作成 (Level 4、本パッケージで完了)
2. AT14-EVIDENCE + ROOM-VISUAL + CC-LIVE-EV + UX-EV
   → 人間が time_window GO → Phase 1 runtime でまとめて確認
3. L5-REVIEW → 書類最終確認
4. FINAL-ACCEPTANCE → 人間が実運用100%を宣言
5. CC-03 / HB-01 / XS-01 → 個別に人間 GO (任意の順・deferred 可)
```
