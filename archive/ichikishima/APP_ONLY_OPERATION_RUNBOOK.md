# App-only Operation — Runbook（**設計ドラフト／実ウィンドウなし**）

**前提**: 「アプリ」を **将来の単一プロセス製品**とみなした **閲覧専用手順**。現状は静的 Shell / Snapshot のみ運用可比較。

---

## 手順一覧（いまできること）

| # | アクション |
|---|-------------|
| 1 | 「起動」（将来のアプリウィンドウ）— **未定義・本 Goal で触れない**。 |
| 2 | Snapshot / App foundation panel で **状態ラベルを確認**。 |
| 3 | Hermes room — Bridge readiness と **riskSummary 短文のみ**。 |
| 4 | Controlled Pilot — 「値待ち／canRun meta」短表示。実行無し。 |
| 5 | Approval / Audit — **件数と unavailable フラグのみ**。項目本文は開かない。 |
| 6 | Memory — **候補近似・カテゴリ件数のみ**（入力が空ならゼロ寄り）。 |
| 7 | Visualization — メタグラフのみ。ログ無し。 |
| 8 | Agent Team — 「全 disabled」「scheduler OFF」を確認。 |

---

## **押してはいけない**（開発者向け備忘）

Hermes/WSL/exec/Approval適用/Git push は **すべて STOP GATE**。（`APP_ONLY_OPERATION_ROADMAP.md` §15）。

---

## 異常時

矛盾ラベル（例: IPC 未配線であるのに “live” と誤記）→ Snapshot / docs を是正し Goal を切る。

---

## Cursor/Codex へ戻す条件

- 実装フェーズへの移行ゲート達成ログが未完  
- Controlled Pilot メタ確認が未完  
- Wrapper / WSL 値確定レビュー待ち  

---

実接続前・WSL2・EA/MT5 は **`FINAL_READINESS_MATRIX.md`** の該当行を **人手で**更新する運用とする。
