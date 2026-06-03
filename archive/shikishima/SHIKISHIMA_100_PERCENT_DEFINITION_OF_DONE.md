# しきしま 100% — Definition of Done

**Baseline:** 75e690b
**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)

---

## 100% は何ではないか

```
× 自律的に外部APIを呼び出す AI
× productionReady が自動的に true になる
× execution が自動的に enabled になる
× 無制限の API 利用
× 無制限の SNS 投稿・返信・DM
× 無制限のロボット/音声/カメラ/マイク操作
× human GO なしの git push / runtime 起動
× raw token / secret / 個人情報 の表示
× 人間が止めても続く自律ループ
```

---

## 100% は何であるか

```
✓ 計画した全 UI / 管制室 機能が安全に表示確認済み
✓ Gate ダッシュボードで全 Level 5 操作が可視化・管理済み
✓ すべての Level 5 操作が人間 GO なしに実行されない
✓ runtime visual check が PASS 記録済み (AT-14)
✓ Control Center live data が stale/fresh 正しく表示
✓ CC-03 / HB-01 / XS-01 の controlled test が PASS または明示的に defer
✓ rawValuesReported: false を全ステージで維持
✓ productionReady: false (人間が明示的に変えるまで)
✓ execution: disabled (人間が明示的に変えるまで)
✓ ロールバック / 停止手順が全 Gate で文書化済み
✓ 最終受け入れ記録が作成済み
✓ 人間が任意に各 Gate を開けられる状態が整っている
```

---

## チェックリスト (最終受け入れ時)

### Phase 2 — AT-14 runtime 目視確認

- [ ] AT-14 time_window GO が記録済み
- [ ] npm run dev 実施 → PASS
- [ ] AT-07〜AT-13 全セクション目視 PASS
- [ ] STOP 条件 未発生
- [ ] runtime 停止確認済み (Ctrl+C)
- [ ] git status clean 確認済み
- [ ] evidence doc 作成・commit 済み

### Phase 3 — CC live data

- [ ] PageShell に live snapshot 反映を目視確認
- [ ] Stale / Fresh 切り替え動作確認
- [ ] raw value 非表示確認
- [ ] evidence doc 作成・commit 済み

### Phase 4 — UI 品質

- [ ] UI-01: ウィンドウサイズ復元確認
- [ ] UI-02: dark/light/system テーマ切り替え確認
- [ ] evidence doc 作成・commit 済み

### Phase 5 — Gate 書類

- [ ] CC-03 承認フォーム完備
- [ ] HB-01 承認フォーム完備
- [ ] XS-01 承認フォーム完備
- [ ] OAuth gate plan 完備
- [ ] Obsidian gate plan 完備
- [ ] productionReady gate policy 完備
- [ ] execution gate policy 完備

### Phase 6–8 — Level 5 controlled tests

- [ ] CC-03 PASS または defer (明示記録)
- [ ] HB-01 PASS または defer (明示記録)
- [ ] XS-01 PASS または defer (明示記録)

### Phase 9 — 将来 Gate 準備

- [ ] StackChan display plan 完備
- [ ] voice/mic/camera gate policy 完備

### Phase 10 — 最終受け入れ

- [ ] 全フェーズ DONE または明示 defer
- [ ] rawValuesReported: false 維持記録
- [ ] productionReady: false 維持記録
- [ ] execution: disabled 維持記録
- [ ] ロールバック手順 文書化済み
- [ ] **最終受け入れ記録** 作成・commit・push

---

## 100% 完了宣言フォーム

```yaml
shikishima_100_percent_acceptance:
  date:
  declared_by: human
  baseline_commit:
  phases_completed:
    phase_1: DONE
    phase_2: DONE / deferred
    phase_3: DONE
    phase_4: DONE
    phase_5: DONE
    phase_6_cc03: DONE / deferred
    phase_7_hb01: DONE / deferred
    phase_8_xs01: DONE / deferred
    phase_9_sc_voice: DONE / future
    phase_10: DONE
  safety_invariants:
    productionReady: false
    execution: disabled
    rawValuesReported: false
  human_notes:
  next_gate_to_open:  # 次に開ける Gate (任意)
```

---

> AIは作るところまで。
> 鍵と発射ボタンは人間。
> 100% は「人間がすべての Gate を任意に開けられる状態」である。
