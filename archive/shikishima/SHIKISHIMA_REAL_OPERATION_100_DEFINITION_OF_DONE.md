# しきしま実運用100% — Definition of Done

**Baseline:** aadea91 | **Prepared:** 2026-05-19

---

## 100% ではないもの

```
× 無制限自律 AI
× productionReady: true (by default)
× execution: enabled (by default)
× 無制限の外部 API 利用
× 無制限の SNS 投稿/返信/DM/いいね/フォロー
× 無制限の WSL/Hermes 実行
× 無制限の StackChan/voice/mic/camera
× raw token/secret/IP/個人情報 の表示
× 人間が止めても続く自律ループ
```

---

## 100% であるもの

```
✓ 管制室 / Agent Theater の目視確認済み (AT-07〜AT-15 + Room Layout)
✓ Control Center live data が redacted/safe で表示
✓ Gate ダッシュボードで全 Level 5 が可視化
✓ 全 Level 5 が人間 GO なしに実行されない
✓ clear GO/HOLD/STOP 条件が全 Gate で定義済み
✓ rollback/停止手順が文書化済み
✓ 最終受け入れ記録が作成済み
✓ 人間が任意の Gate を任意のタイミングで開けられる状態
```

---

## 受け入れ区分

| 区分 | 意味 |
|---|---|
| **PASS** | 問題なし、条件を完全に満たす |
| **PASS_WITH_CAVEAT** | 軽微な注意点あり、記録の上で受け入れ |
| **HOLD** | 未解決の問題あり、修正後再確認 |
| **REJECT** | 重大な問題、そのフェーズを無効化 |
| **DEFERRED** | 意図的に後回し、明示記録必須 |
| **NOT_APPLICABLE** | 現時点で適用外 |

---

## 最終チェックリスト

### Phase 1–4 (必須)

- [ ] AT-14 + Room Layout 目視証跡: PASS / PASS_WITH_CAVEAT
- [ ] Control Center live data 証跡: PASS
- [ ] UI/UX 証跡: PASS
- [ ] Level 5 Gate 書類: 全完備

### Phase 5–9 (PASS または DEFERRED)

- [ ] CC-03: PASS / DEFERRED (理由記録)
- [ ] HB-01: PASS / DEFERRED (理由記録)
- [ ] XS-01: PASS / DEFERRED (理由記録)
- [ ] Phase 9 StackChan/Voice/Mic/Camera: docs 完備 / 実行 DEFERRED

### 安全不変条件

- [ ] productionReady: false 維持
- [ ] execution: disabled 維持
- [ ] rawValuesReported: false 維持

### Phase 10 (最終)

- [ ] 最終受け入れ記録作成
- [ ] 人間が「実運用準備100%」を明示宣言

---

> AIは作るところまで。鍵と発射ボタンは人間。
> 100% は「人間がすべての Gate を任意に開けられる状態」である。
