# しきしま実運用100% — Final Acceptance Plan

**状態:** FUTURE
**Baseline:** aadea91 | **Prepared:** 2026-05-19

---

## 最終受け入れフロー

```
1. Phase 1–4 の全証跡レビュー
2. Phase 5–9 の PASS / DEFERRED 確認
3. 安全不変条件の最終確認
4. deferred タスクの明示記録
5. 最終受け入れ記録の作成
6. 人間が「実運用準備100%」を宣言
```

---

## 必要な証跡リスト

| 証跡 | ファイル | 必須/任意 |
|---|---|---|
| AT-14 + Room layout visual | AT14_ROOM_VISUAL_EVIDENCE_*.md | **必須** |
| CC live data | CC_LIVE_DATA_EVIDENCE_*.md | **必須** |
| UX (zoom/theme/window) | UX_EVIDENCE_*.md | **必須** |
| CC-03 実送信テスト | CC03_EVIDENCE_*.md | PASS or DEFERRED |
| HB-01 Bridge 接続 | HB01_EVIDENCE_*.md | PASS or DEFERRED |
| XS-01 x_search | XS01_EVIDENCE_*.md | PASS or DEFERRED |
| Phase 9 StackChan docs | STACKCHAN_* docs | **必須 (docs)** |
| Phase 9 実運用テスト | SC/VOICE/MIC/CAM EVIDENCE | PASS or DEFERRED |

---

## Deferred タスク 記録ポリシー

Level 5 タスクが DEFERRED の場合は必ず以下を記録:

```yaml
deferred_record:
  task_id:
  reason:             # なぜ後回しにするか
  deferred_until:     # いつ/何の条件で開けるか
  risk_accepted:      # リスクを承認したか
  human_signature:
```

---

## GO/HOLD/REJECT 判断基準

| 判断 | 条件 |
|---|---|
| **GO** | 必須証跡完備 / deferred 明示 / 安全不変条件維持 |
| **PASS_WITH_CAVEAT** | 軽微な課題あり、注記の上で受け入れ |
| **HOLD** | 必須証跡未完 / 未解決の問題あり |
| **REJECT** | 重大な安全問題 / raw value 露出 / Level 5 未承認実行 |

---

## 最終受け入れ記録フォーム

```yaml
shikishima_final_acceptance:
  date:
  baseline_commit:           # aadea91 or later
  reviewer:                  human

  evidence_reviewed:
    at14_room_visual:        # PASS / PASS_WITH_CAVEAT
    cc_live_data:            # PASS / PASS_WITH_CAVEAT
    ux_evidence:             # PASS / PASS_WITH_CAVEAT

  level5_decisions:
    cc03:                    # PASS / DEFERRED / REJECT
    hb01:                    # PASS / DEFERRED / REJECT
    xs01:                    # PASS / DEFERRED / REJECT
    phase9_stackchan:        # docs DONE / physical DEFERRED
    phase9_voice:            # DEFERRED / REJECT
    phase9_mic:              # DEFERRED / REJECT
    phase9_camera:           # DEFERRED / REJECT
    production_ready:        # false / approved
    execution_enabled:       # disabled / approved

  safety_invariants_confirmed:
    productionReady:         false
    execution:               disabled
    rawValuesReported:       false

  deferred_items:            # list of deferred Level 5 tasks
  risk_acceptance:           # deferred リスクの承認記録

  final_decision:            # GO / PASS_WITH_CAVEAT / HOLD / REJECT
  human_notes:

  declaration: |
    しきしま実運用準備100%を宣言する。
    AIは作るところまで。鍵と発射ボタンは人間。
```

---

## post-100 運用ポリシー

```
100% 宣言後も:
  - Level 5 は個別 GO 必須
  - productionReady は明示変更まで false
  - execution は明示変更まで disabled
  - 新機能追加は Level 4 以下で実装、Level 5 は別 GO
  - rawValuesReported は常時 false
```
