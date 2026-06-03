# Hermes WSL2 — Dummy Wrapper 計画（**自動実行なし**）

**目的**: `wsl.exe` 本番前に **stdout 1 行 JSON** 契約だけを **検証できる設計材料** とする。**本物 Hermes ではない**。

```text
This test executes only the sandbox dummy Node script.
It does not execute Hermes, WSL, execFile Controlled Pilot, or external commands.
Do not generalize this exception to real process adapters.
```

---

## 1. 範囲

- サンドボックス設計物: `sandbox/hermes-autonomy-zone/dummy-hermes/`
- **`wsl.exe` / 実 Hermes / Controlled Pilot の `execFile` は常に別ゲート**。
- **CI 既定（`npm test` / `vitest run` 通常）**:
  - **`dummy-hermes-stub-design-static.test.ts`** のみが **子プロセスなし**で常時実行（`@ci-safe @static-only`）。
- **ローカル明示（任意）**:
  - **`dummy-hermes-stub-design.process-local.test.ts`** — `spawnSync(process.execPath, [dummyScript])` **のみ**。
  - 実行条件: **`RUN_DUMMY_HERMES_LOCAL_PROCESS` = `1` または `true`** かつ **`CI` ≠ `true`**。`CI=true`（GitHub Actions 等）では **常に skip**。
  - 環境変数無し、または `CI=true` では **skipped** → **既定の hosted CI では subprocess 起動しない**。

**WSL2 wrapper パラメータ**: `HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md` / `hermes-wsl2-wrapper-parameter-registry.ts` — **registry・検証のみ**（**`wsl.exe` 未実行**）。実行値は既定 **pending**。

---

## 2. dummy 仕様

| 項目 | 方針 |
|------|------|
| stdout | **単一行** `payloadSchemaVersion` = `hermes-bridge-payload/v1` を含む JSON 文字列生成関数（参考実装） |
| secrets | **含めない** |
| ファイル I/O | **なし**（設計上、モジュール本体） |
| 外部通信 | **なし** |

---

## 3. 検証（テスト配置）

| ファイル | ラベル | 子プロセス |
|----------|--------|------------|
| `tests/ichikishima/sandbox/dummy-hermes-stub-design-static.test.ts` | `@ci-safe @dummy-only @no-hermes @no-wsl @static-only` | **なし**（`require` のみ） |
| `tests/ichikishima/sandbox/dummy-hermes-stub-design.process-local.test.ts` | `@local-only @dummy-process-only @no-hermes @no-wsl` | **あり**（上記 env 時のみ） |

- 手動 CLI: `node sandbox/hermes-autonomy-zone/dummy-hermes/dummy-hermes-bridge-payload-once.cjs`（stdout 1 行）。
- **WSL 用シェル sample（設計のみ・実行禁止）**: `sandbox/hermes-autonomy-zone/dummy-hermes/hermes-bridge-payload-once.sh.sample` — **WSL に配置しない**・**`wsl.exe` から呼ばない**。内容は stdout 1 行 JSON を `printf` する **参考**。

## 3b. Manual placement design（2026-05-06）

- Manual placement design is tracked in `HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md`.
- This is separate from the local Node dummy script.
- The Node dummy local-only test must not be treated as WSL wrapper placement.
- The WSL shell sample must not be executed or copied into WSL in this Goal.
- Docs may mention the payload contract, but must not amplify raw payload full text beyond the existing sample.

---

## 4. STOP

- **`wsl.exe` 起動**、**実 Hermes**、**未承認の長寿命 subprocess** は **STOP GATE**。
- 本 dummy の **特例を Process Adapter／実機検証への前例として拡張しない**。

---

## 関連

- `HERMES_WSL2_WRAPPER_CONTRACT.md`
- `ADR_REAL_HERMES_WSL2_CONNECTION.md`
## 2026-05-06 Pre-Execution Pack Status

- Dummy wrapper sample was reviewed as static design material only.
- WSL placement was not performed.
- `wsl.exe` was not executed.
- The shell sample and Node dummy were not executed in this pack.
- Dummy payload validation remains HOLD until a separate dummy-only run is explicitly allowed after placement readiness.
