# しきしま最終ゴール固定書

**Baseline:** aadea91 | **Prepared:** 2026-05-19 | **Worker:** ClaudeCode

---

## 最終ゴール宣言

```
しきしま計画の最終ゴールは、
「AIが勝手に外部実行すること」ではなく、
「人間がGateを見て、必要なときにGOを出せる実運用準備状態」である。
```

---

## Goal A — 実装完了

**定義:** Core 実装・UI 機能が実装・push 済みの状態。

**現在の状態:** ほぼ完了 (evidence 確認残)

**含む:**
- Agent Theater AT-07〜AT-15 (Room Layout 含む)
- Control Center live snapshot (CC-01/02)
- PageShell / OperatorPage / CommandChatPage live data
- window bounds 記憶 (UI-01)
- Ctrl+wheel zoom
- テーマトグル (UI-02)
- ナビ順序
- safety gate UI

**完了条件:**
- ソース実装 push 済み ✓
- tracked dirty なし ✓
- unsafe Level 5 アクション なし ✓

---

## Goal B — 実運用準備100%

**定義:** 制御されたローカル実運用に安全な状態。Level 5 は引き続き人間 Gate 管理。

**次の公式ターゲット**

**必要条件:**
```
AT-14 + Room Layout 目視証跡: accepted
CC live data 証跡: accepted
UX 証跡: accepted
Phase 9 docs: 完備
Level 5 Gate 書類: 全完備
最終受け入れ記録: 作成済み
productionReady: false (宣言まで)
execution: disabled (宣言まで)
rawValuesReported: false
```

**Goal B は Goal C (Level 5) の一部が DEFERRED でも達成可能**

---

## Goal C — Level 5 実運用開始

**定義:** 個々の Level 5 Gate を人間 GO で一つずつ開ける。

**含む (各 Gate は独立して承認):**
- CC-03 Command Chat 実送信
- HB-01 Hermes Bridge WSL2 接続
- XS-01 x_search read-only
- Obsidian local note write
- OAuth/login
- 外部 API write
- StackChan 物理動作
- voice output
- mic input
- camera input
- productionReady: true
- execution: enabled

**重要:** Goal C は Goal B の完了後に順次開始。一括承認禁止。

---

## 設計書の終点

この設計書により、以下が固定された:
- 実装完了の定義 (Goal A)
- 実運用準備100%の定義 (Goal B)
- Level 5 実運用開始の定義 (Goal C)
- 各 Goal の受け入れ条件
- 設計書の追加を終了し、実証フェーズに移行する判断基準

**これ以上の「設計書のための設計書」は作成しない。**
次のアクションは実証 (Phase 1 runtime visual recheck) または Level 5 実行である。

---

> AIは作るところまで。鍵と発射ボタンは人間。
