# しきしま実運用100% — Hermes Bridge Plan

**状態:** BLOCKED — HB-01 GO 待ち
**Baseline:** aadea91 | **Prepared:** 2026-05-19

---

## 現状

Hermes Bridge コードは存在する。
`hermes-bridge.ts` / `hermes-controlled-pilot-config.ts` に実装あり。
しかし WSL2 接続・実行は HOLD。

---

## docs / 設計 (現在可能)

- bridge コードの読み取り・設計レビュー
- pilot dry-run plan の更新
- 承認フォームの記入

---

## WSL2 接続 (HB-01 GO 後のみ)

### 必要な人間 GO フィールド

```yaml
hb01_go:
  date:
  time_window:
  wsl2_target:          # distro 名
  approved_command:     # 1つのコマンドのみ
  connection_scope:     # localhost / LAN のみ
  stop_conditions:
    - unexpected_external: STOP
    - raw_value_output:    STOP
  evidence_file:
```

---

## raw-value redaction ポリシー

```
WSL2 実行結果に含まれる可能性のあるもの:
  - ローカルパス → chat/docs に出力しない
  - API キー     → chat/docs に出力しない
  - IP アドレス  → chat/docs に出力しない

redacted サマリーのみ表示する
```

---

## STOP 条件

```
意図しない外部ネットワーク接続
raw ローカルパス/token が chat に出力された
productionReady が true になった
execution が enabled になった
WSL プロセスが停止しない
```

---

## evidence テンプレート

```yaml
hb01_bridge_evidence:
  result:
  date:
  time_window:
  command_run:
  connection_scope:
  raw_value_output: false
  unexpected_external: false
  productionReady_after: false
  git_status_after: clean
```

---

## shutdown 手順

```
1. Ctrl+C (runtime / bridge プロセス)
2. WSL プロセスの停止確認
3. port check
4. git status --short → clean 確認
```

> HB-01 GO なしに WSL2 接続・Hermes 実行を行わない。
