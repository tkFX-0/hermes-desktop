# Future Gate Registry

## Purpose

Records the Gates that must be completed before high-risk capabilities
can be considered for approval. None of these Gates are approved here.
This registry only defines the approval boundaries.

---

## Registry

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| GATE-PR-01 | productionReady: true | HOLD | Gate 005 resolution + LMO session + human GO |
| GATE-EX-01 | execution: enabled | HOLD | GATE-PR-01 + separate execution Gate |
| GATE-EW-01 | external API write (general) | HOLD | GATE-EX-01 + per-service Gate |
| GATE-EMAIL-01 | email send | HOLD | GATE-EW-01 + email Gate |
| GATE-CAL-01 | calendar event creation | HOLD | GATE-EW-01 + calendar Gate |
| GATE-GH-01 | GitHub issue/PR creation | HOLD | GATE-EW-01 + GitHub Gate |
| GATE-SOC-01 | social post | HOLD | GATE-EW-01 + social Gate |
| GATE-PAY-01 | purchase / reservation / payment | HOLD | GATE-EW-01 + payment Gate |
| GATE-PUSH-01 | git push from UI | HOLD | separate explicit per-push GO |
| GATE-SC-DISP-01 | StackChan display-only (face terminal) | HOLD | display Gate + safety review |
| SC-PC-02 | StackChan PC firmware write evidence | PASS_CANDIDATE | human review of `SC_PC_02_FIRMWARE_WRITE_EVIDENCE.md` |
| SC-FACE-01 | Official app face capability check | PARTIAL_HOLD | SC-FACE-02 PC face customization plan |
| SC-FACE-02 | PC face customization plan | PLAN | human review before firmware/source research |
| SC-FACE-03 | Custom firmware feasibility gate | HOLD | source/build/restore/recovery review |
| GATE-SC-PHYS-01 | StackChan physical motion | HOLD | GATE-SC-DISP-01 + physical Gate |
| GATE-SC-CONN-01 | StackChan serial/USB/Wi-Fi connection | HOLD | GATE-SC-PHYS-01 |
| GATE-VOICE-01 | voice output | HOLD | separate voice Gate |
| GATE-MIC-01 | microphone input | HOLD | separate mic Gate |
| GATE-CAM-01 | camera input | HOLD | separate camera Gate |
| GATE-AUTO-01 | autonomous command execution | HOLD | all above + autonomous Gate |
| SLOT-09 | Worker Status / Cooldown / Resume Queue Design | COMPLETE (docs-only) | human review |
| AUTO-LEVEL-04 | Autonomous Development up to Evidence Commit | HOLD | SLOT-09 review + scoped task GO |
| AUTO-LEVEL-05 | Human-Gated External Action Boundary | HOLD | explicit human GO per action |
| OAUTH-GO | Explicit OAuth Provider Gate | HOLD | provider/purpose/scopes/time_window/token policy |
| XS-READ | x_search / Social Read-only Awareness Gate | HOLD | read-only human GO |
| RUNTIME-GO | Runtime Start Human GO Gate | HOLD | date/time_window/command/stop/shutdown/evidence |
| OBS-LOCAL | Obsidian Local Note Write Gate | HOLD | local Vault scope + content + redaction policy |
| RUNAWAY-GUARD | Worker Runaway Prevention Gate | COMPLETE (docs-only) | human review |

## Gate Dependency Chain

```
GATE-PR-01 (productionReady)
  └─ GATE-EX-01 (execution)
       └─ GATE-EW-01 (external write)
            ├─ GATE-EMAIL-01
            ├─ GATE-CAL-01
            ├─ GATE-GH-01
            ├─ GATE-SOC-01
            └─ GATE-PAY-01

GATE-SC-DISP-01 (StackChan display)
  └─ GATE-SC-PHYS-01 (physical motion)
       └─ GATE-SC-CONN-01 (connection)

GATE-VOICE-01 (independent)
GATE-MIC-01 (independent)
GATE-CAM-01 (independent)

GATE-AUTO-01 (requires all above)
```

## Worker Autonomy and Human-Gated Actions (SLOT / AUTO series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| SLOT-09 | Worker status enum, cooldown state, resume queue schema | COMPLETE (docs-only) | human review |
| AUTO-LEVEL-04 | Autonomous drafting, implementation, checks, evidence, local commit | HOLD | scoped task instruction + clean local checks |
| AUTO-LEVEL-05 | Push, runtime, OAuth, x_search, external connection, productionReady, execution enabled | HOLD | explicit human GO per action |
| RUNAWAY-GUARD | Max-step, cooldown, NEEDS_HUMAN, and audit requirements | COMPLETE (docs-only) | human review |

## Human-Gated Future Action Gates

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| OAUTH-GO | Explicit OAuth provider connection | HOLD | provider/purpose/scopes/time_window/token storage/redaction policy |
| XS-READ | x_search / social read-only awareness | HOLD | source/topic/time_window/read-only GO |
| RUNTIME-GO | Runtime start | HOLD | date/time_window/command/stop/shutdown/evidence |
| OBS-LOCAL | Obsidian local Markdown note read/write | HOLD | Vault path scope/target file/content/redaction policy |

## Grok-Hermes Provider Gates (GHG series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| GHG-00 | Docs-only research | COMPLETE | — |
| GHG-01 | Hermes version / readiness check | HOLD | explicit human GO |
| GHG-02 | Auth boundary review | HOLD | GHG-01 PASS |
| GHG-03 | Manual OAuth login (human-only) | HOLD | GHG-02 PASS + human GO |
| GHG-04 | Redacted provider status | HOLD | GHG-03 PASS |
| GHG-05 | Chat-only dry run | HOLD | GHG-04 PASS + human GO + time_window |
| GHG-06 | Provider-router integration | HOLD | GHG-05 PASS + impl GO |
| GHG-07 | Fallback / quota / timeout policy | HOLD | GHG-06 PASS |
| GHG-08 | Limited manual chat operation | HOLD | GHG-07 PASS + human GO + time_window |
| GHG-09a | x_search enablement | HOLD | GHG-08 PASS + XS-01+ |
| GHG-09b | TTS | HOLD | GHG-08 PASS + separate GO |
| GHG-09c | Image generation | HOLD | GHG-08 PASS + separate GO |
| GHG-09d | Video generation | HOLD | GHG-08 PASS + separate GO |
| GHG-09e | Transcription | HOLD | GHG-08 PASS + mic gate |
| GHG-09f | Messaging adapters | HOLD | GHG-08 PASS + per-platform GO |

## x_search Social Awareness Gates (XS series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| XS-00 | Docs-only registration | COMPLETE | — |
| XS-01 | Auth boundary review for x_search | HOLD | GHG-04 PASS |
| XS-02 | Enablement GO draft | HOLD | XS-01 PASS |
| XS-03 | Read-only manual dry run | HOLD | XS-02 PASS + human GO + time_window |
| XS-04 | Redacted result display | HOLD | XS-03 PASS |
| XS-05 | Daily digest draft only | HOLD | XS-04 PASS + human GO |
| XS-06 | Draft Outbox integration | HOLD | XS-05 PASS + impl GO |
| XS-07 | Runtime UI status | HOLD | XS-06 PASS |
| XS-08 | Limited manual operation | HOLD | XS-07 PASS + human GO + time_window |
| XS-09 | External posting review | HOLD | XS-08 PASS + content policy GO |

## Agent Theater Implementation Gates (AT series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| AT-00 | Docs-only design | COMPLETE | — |
| AT-01 | Page route design (docs) | HOLD | AT-00 + human review |
| AT-02 | Static UI implementation | HOLD | AT-01 + impl GO |
| AT-03 | Pixel ghost asset integration | HOLD | AT-02 + asset review GO |
| AT-04 | State binding to snapshot | HOLD | AT-02 + impl GO |
| AT-05 | CSS-only animation | HOLD | AT-02 + impl GO + human visual review |
| AT-06 | Slot worker status display | HOLD | AT-04 + impl GO |
| AT-07 | Handoff animation | HOLD | AT-06 + impl GO + human visual review |
| AT-08 | Runtime visual recheck (initial) | PASS (2026-05-18) | — |
| AT-08b | AT-04 refined ghost runtime recheck | HOLD | human GO + time_window |

| AT-09 | Resume Queue / Cooldown Panel | COMPLETE | pushed AT-09 implementation |
| AT-10 | Runaway Guard / Human-Gated Action Panel | IMPLEMENTED (display-only) | — |
| AT-11 | Worker Routing / Handoff Prompt Panel | DESIGN-READY | AT-10 review + impl GO |
| AT-12 | Gate Dashboard / Future Gate Panel | DESIGN-READY | AT-11 review + impl GO |
| AT-13 | Final Visual Polish / Responsive Pass | DESIGN-READY | AT-10/11/12 implementation review |
| AT-14 | Runtime Visual Recheck Package | DESIGN-READY / HOLD | explicit runtime GO with date/time_window |
| AT-05b | Sprite Asset Integration | HOLD | AT-05 asset plan + separate asset GO |

## Remaining Agent Theater Priority Order

1. AT-10 Runaway Guard / Human-Gated Action Panel
2. AT-11 Worker Routing / Handoff Prompt Panel
3. AT-12 Gate Dashboard / Future Gate Panel
4. AT-13 Final Visual Polish / Responsive Pass
5. AT-14 Runtime Visual Recheck Package
6. AT-05 Sprite Asset Plan / optional later asset gate

These gates are display-only design records. They do not approve runtime,
push, OAuth, x_search, Obsidian write, external write, productionReady true,
or execution enabled.

## Level 4 / Level 5 Transition Gates

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| L4-CONFIRM | Level 4 final confirmation | PASS (2026-05-20) | — |
| L5-READY | Level 5 transition readiness | DESIGN (2026-05-20) | L4-CONFIRM PASS |
| L5-OB-01 | Obsidian local write | IPC IMPLEMENTED (OB01_DRY_RUN=true) — awaiting ob01_local_write_go | ob01_local_write_go |
| L5-DIS-01 | Discord read-only intake | IPC IMPLEMENTED (DIS01_HOLD=true) — awaiting dis01_read_only_go | dis01_read_only_go |
| L5-XS-AUTO | XS-AUTO one-shot read-only | HOLD | xs_auto_read_go |
| L5-HB-01 | Hermes/WSL connection | HOLD | hb01_hermes_wsl_go |
| L5-CC-03 | Command Chat one-shot | HOLD | cc03_real_send_go |
| L5-DIS-03 | Discord one-shot reply | HOLD | dis03_reply_go |
| L5-SC-DISP | StackChan display-only | HOLD | stackchan_display_go |
| L5-XACC-R | X account read-only OAuth | HOLD | xacc_read_go |
| L5-XACC-W | X write / post / reply | HOLD | xacc_write_go |
| L5-SC-PHYS | StackChan physical/motion | HOLD | stackchan_motion_go |
| L5-PROD | productionReady true | HOLD (Critical) | all Level 5 + productionReady_go |
| L5-EXEC | execution enabled | HOLD (Critical) | productionReady true + execution_go |

## Obsidian Local Library Gates (OBS-LIB series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| OBS-LIB-00 | Local library design + UI preview | IMPLEMENTED | — |
| OBS-LIB-01 | Vault path configuration | DESIGN | human vault setup |
| OBS-LIB-02 | Markdown export | IMPLEMENTED (dry-run) | ob01_local_write_go for real write |
| OBS-LIB-03 | Report image (PNG) export | HOLD | Electron capturePage + OB-01 |
| OBS-LIB-04 | Local write gate activation | HOLD | ob01_local_write_go |
| OBS-LIB-05 | Full Obsidian write operation | HOLD | OBS-LIB-04 PASS |
| OBS-LIB-06 | Library index / RAG | HOLD | OBS-LIB-05 PASS + index GO |

## External Library Gates (LIB series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| LIB-00 | External library design | DESIGN (docs-only) | — |
| LIB-01 | Vault structure | DESIGN | human vault creation |
| LIB-02 | Note templates | DESIGN | — |
| LIB-03 | Obsidian local write (OB-01) | HOLD | ob01_local_write_go |
| LIB-04 | Vault index display | HOLD | LIB-03 PASS + index GO |
| LIB-05 | RAG search | HOLD | LIB-04 PASS + RAG GO |

## X Search Automation Gates (XS-AUTO series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| XS-AUTO-00 | Read-only automation design | DESIGN (display-only) | — |
| XS-AUTO-01 | Watchlist definition | DESIGN | explicit GO |
| XS-AUTO-02 | Scheduler HOLD plan | DESIGN (HOLD) | xs_auto_schedule_go |
| XS-AUTO-03 | One-shot scheduled read-only run | HOLD | xs_auto_read_go |
| XS-AUTO-04 | Recurring patrol | HOLD | xs_auto_schedule_go + review checkpoint |
| XS-AUTO-05 | X account integration | HOLD — separate XACC gate | XACC-01 PASS |

## Controlled Worker Environment Gates (WK series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| WK-00 | Controlled Worker Environment display | IMPLEMENTED (display-only) | — |
| WK-01 | Codex Worker copy-only use | DESIGN | explicit use GO |
| WK-02 | ClaudeCode Worker copy-only use | DESIGN | explicit use GO |
| WK-03 | Worker Task Queue | IMPLEMENTED (display-only) | — |
| WK-04 | Prompt Export (copy-only) | IMPLEMENTED (display-only) | — |
| WK-05 | Worker Auto-execution Adapter | HOLD | remote control / MCP / API token policy |
| WK-06 | Remote Control (Codex / ClaudeCode) | HOLD | WK-05 PASS + remote control GO |
| WK-07 | MCP / Hook / Daemon execution | HOLD | WK-06 PASS + MCP/hook/daemon GO |

## X Account Integration Gates (XACC series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| XACC-00 | X Account Integration design | DESIGN (docs-only) | — |
| XACC-01 | Read-only OAuth scope setup | HOLD | explicit XACC-01 GO |
| XACC-02 | Read-only execution (1 run) | HOLD | XACC-01 PASS + xacc_read_go |
| XACC-03 | Draft-only post/reply (local) | HOLD (Level 1-4) | XACC-02 PASS |
| XACC-04 | Human GO write (1 post/reply) | HOLD (Level 5) | XACC-03 PASS + xacc_write_go |
| XACC-05 | Limited auto post | DEFERRED (Level 5+) | XACC-04 PASS + template/loop policy |

## Discord Bridge Gates (DIS series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| DIS-00 | Discord Bridge design | DESIGN (docs-only) | — |
| DIS-01 | Discord read-only intake (one channel) | IPC IMPLEMENTED (DIS01_HOLD=true) | explicit DIS-01 read-only GO |
| DIS-02 | Discord draft response (local only) | HOLD | DIS-01 PASS |
| DIS-03 | Discord human GO reply (one message) | HOLD (Level 5) | DIS-02 PASS + explicit DIS-03 GO |
| DIS-04 | Discord limited auto-reply (template only) | DEFERRED (Level 5+) | DIS-03 PASS + template/loop policy |

## Required Statement

No gate in this registry is approved.
This registry only records approval boundaries.
All capabilities listed remain HOLD.
productionReady remains false.
execution remains disabled.
_Updated: 2026-05-20 — added DIS series (Discord Bridge gates)_

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_
