# Gate 007 — Command Center Wording Hardening Plan

## Document Status

```text
roadmapVersion: v3.67.0
date: 2026-05-17
gate: Post-100 Gate 007 (extended scope)
name: Command Center Wording Hardening Plan
status: design_ready
```

---

## Purpose

UI-02 実装に入る前に、しきしま Command Center の文言・ボタン・状態表示が
**実行・自動送信・外部書き込みに見えない**ことを明文化・固定する。

Goal: 実装フェーズで「押せそうに見えるボタン」「実行に見える文言」が混入するリスクを事前に潰す。

---

## Why Gate 007 Must Happen Before UI-02

```text
1. デザインファイルのボタンラベルには "Send" "Approve" "Execute" など
   外部実行に見える表現が prototype として含まれている可能性がある。

2. 実装時に文言をそのままコピーすると、安全境界が UI に反映されない。

3. wording policy を先に docs に固定しておくことで、
   UI-02 以降の各フェーズで参照できる単一の真実源(source of truth)になる。

4. Gate 007 AFTER design intake → UI-02 という順序が、
   「設計を見てから安全文言を決める → 実装する」の自然な流れ。
```

---

## Scope (allowed)

```text
[✓] Button wording policy の docs 化
[✓] State label policy の docs 化
[✓] Design-to-implementation safety checklist の作成
[✓] UI-02 GO draft の docs 化 (承認ではない)
[✓] ROADMAP_CHANGELOG / DEVELOPMENT_TEMPO_DASHBOARD の更新
[✓] 1 docs-only commit
```

---

## Non-Scope (forbidden in this Gate)

```text
[✗] src/ への実装
[✗] package.json / package-lock.json の変更
[✗] runtime の起動
[✗] port 3030 の開放
[✗] git push (別途 GO が必要)
[✗] 外部 API 書き込み
[✗] email / calendar / GitHub remote / social / purchase
[✗] StackChan 物理操作
[✗] voice / camera / mic の有効化
[✗] productionReady: true への変更
[✗] execution: enabled への変更
```

---

## Relation to Final Command Center Design Package

```text
UI-01 (474c928) で取り込んだデザインパッケージの文言を、
このゲートで安全サイドに固定する。

design package (source/):  prototype 表現を含む
Gate 007 policy docs:       implementation-safe wording を定義する
UI-02 以降:                 Gate 007 policy を参照して実装する

デザイン → wording hardening → 実装 の順序を守る。
```

---

## Safety Boundary

```text
productionReady: false (変更不可)
execution: disabled (変更不可)
rawValuesReported: false (変更不可)
external_api_write: false
email_sent: false
calendar_event_created: false
github_remote_created: false
social_posted: false
purchase_or_reservation_made: false
StackChan_physical_operation: false
voice_camera_mic_activation: false
runtime_started: false
port_3030_opened: false
git_push_performed: false
```

---

## STOP Conditions

```text
src/ が変更された場合 → STOP
package.json が変更された場合 → STOP
runtime が起動した場合 → STOP
port 3030 が開いた場合 → STOP
外部書き込みが発生した場合 → STOP
raw value / secret / token が出力された場合 → STOP
予期しない commit が ahead に追加された場合 → STOP
```

---

## Expected Next Task After Gate 007

```text
1. Gate 007 commit → push GO → origin/main に反映
2. UI-02 GO review (GATE_007_CLAUDECODE_UI02_GO_DRAFT.md を人間がレビュー)
3. 人間が UI-02 GO を出す
4. UI-02 type / design contract scaffold の実装
```

---

## This Gate Does NOT Approve

```text
Gate 007 docs-only is NOT approval for:
  UI implementation (UI-02 through UI-10)
  runtime start
  execution enablement
  productionReady: true
  external writes
  StackChan physical operation
  voice / camera / mic
  git push (requires separate GO)
```

---

この範囲では問題を検出していません。
