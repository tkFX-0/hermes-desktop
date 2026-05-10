# Shikishima System Diagram

## Overall System

```mermaid
flowchart TD
  User["User"]
  Shikishima["しきしま / しき\nMain orchestrator"]
  Shizume["しずめ\nSafety Gate\nGO / HOLD / REJECT"]
  Hajime["はじめ\nPlanning"]
  Tsumugi["つむぎ / つむ\nImplementation"]
  Shirube["しるべ\nRecord / navigation"]
  Router["Model Router"]
  Rules["rules_only"]
  LocalLight["local_light"]
  LocalMedium["local_medium"]
  CloudMini["cloud_mini"]
  CloudReasoner["cloud_reasoner"]
  Codex["Codex / GPT"]
  RunPod["RunPod\non-demand only"]

  User --> Shikishima --> Shizume
  Shizume --> Hajime
  Shizume --> Tsumugi
  Shizume --> Shirube
  Hajime --> Router
  Tsumugi --> Router
  Shirube --> Router
  Router --> Rules
  Router --> LocalLight
  Router --> LocalMedium
  Router --> CloudMini
  Router --> CloudReasoner
  Router --> Codex
  Router --> RunPod
```

## Device Roles

```text
RTX 4070 PC
  = main development and local runtime base

Lenovo TAB6
  = display monitor

Redmi 12
  = prototype face/expression terminal

StackChan
  = future physical expression robot
  = safety gate required

iPhone 15 Pro
  = private / read-only / planning and approval notes

Mini PC
  = deferred / optional always-on control node
```

## HOLD Reason

```text
Current HOLD reasons:
  - Shizume Safety Gate policy is not fully approved.
  - agent permissions are not fully approved.
  - Model Router policy is not fully approved.
  - device roles are partly deferred.
  - StackChan safety gate is not implemented.
  - minimum human-supervised operation line is not approved.
```

## Roadmap Update Flow

```mermaid
flowchart TD
  Change["Roadmap/doc change"]
  Docs["Update docs"]
  Badge["Update REAL_OPERATION_ROADMAP.html version badge"]
  Changelog["Update ROADMAP_CHANGELOG.md"]
  Verify["Run static verification"]
  Commit["Local commit only if approved"]
  Push["Push only if separately approved"]

  Change --> Docs --> Badge --> Changelog --> Verify --> Commit --> Push
```

Safety gate flow remains unchanged. Updating the roadmap does not open the
execution gate.

## v0.3.0 Phase Package Flow

```mermaid
flowchart TD
  P3["Phase 3 permission review package"]
  P4["Phase 4 Model Router review package"]
  P5["Phase 5 しずめ decision package"]
  P6["Phase 6-10 templates and runbooks"]
  Human["Human review"]
  Gate["しずめ scoped safety review"]
  Hold["HOLD remains until explicit future GO"]

  P3 --> Human
  P4 --> Human
  P5 --> Human
  P6 --> Human
  Human --> Gate --> Hold
```

Updating matrices, templates, and runbooks is documentation-only. It does not
approve WSL, Hermes, wrapper, RunPod, StackChan, git push, GO, or production
readiness.

## Documentation Review / Approval Separation Flow

```mermaid
flowchart TD
  Docs["Docs created"]
  Review["Human documentation review"]
  Decision["approved_for_documentation / needs_revision / rejected"]
  Reference["If approved_for_documentation: docs can be treated as reference"]
  Hold["Execution still remains HOLD"]
  GO["Separate scoped GO required for execution"]

  Docs --> Review --> Decision --> Reference --> Hold --> GO
```

```mermaid
flowchart LR
  Commit["Commit approval"] --> Local["local commit only"]
  Push["Push approval"] --> Remote["remote push only"]
  Exec["Execution approval"] --> ScopedGO["separate scoped GO only"]
```

## Explorer-Style Dashboard Information Flow

```mermaid
flowchart TD
  Docs["Docs / review matrices / templates"]
  Dashboard["Explorer-style Dashboard"]
  Queue["Human review queue"]
  Decision["Documentation decision"]
  Hold["Execution remains HOLD unless separate scoped GO is granted"]

  Docs --> Dashboard --> Queue --> Decision --> Hold
```

Dashboard non-goals:

- no wallet.
- no token system.
- no marketplace.
- no autonomous reward flow.
- no external API.

この範囲では問題を検出していません。
