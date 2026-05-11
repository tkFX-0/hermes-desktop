# Expression Variation Set

## Purpose

This document defines the v0.9.0 common expression variation set for the
Shikishima static face preview board.

Expressions are display labels and visual concepts only. They are not real-time
status, connection status, robot control preview, GO approval indicators, or
production readiness indicators.

## Common Expression States

| expressionId | Japanese label | purpose | allowed use | forbidden interpretation | voiceIntent display label | mouthPattern display label | gazePattern display label | blinkState display label | safety note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neutral | ニュートラル | default calm presence | static default face review | not idle runtime state | calm | calm_loop | steady_center | open | display-only / no execution / no device connection |
| listening | 聞いている | user-facing attention concept | conversation presence review | not microphone listening | calm | quiet_loop | steady_center | open | display-only / no microphone / no recording |
| thinking | 考え中 | planning or analysis concept | static thinking face review | not active processing status | focused | calm_loop | thinking_up | half_closed | display-only / not real-time status |
| holding | HOLD中 | safety hold concept | HOLD state visual language review | not execution gate control | protective | minimal_gate_loop | steady_center | open | display-only / HOLD remains current |
| caution | 注意 | gentle caution concept | non-aggressive warning tone review | not live alert or alarm | protective | mouth_flat | eyes_focus | open | display-only / no alert system |
| rejected | REJECT | rejection concept | firm stop-state visual review | not automated rejection engine | protective | mouth_flat | steady_center | half_closed | display-only / no decision automation |
| review_ready | レビュー待ち | human review readiness concept | documentation review queue display | not GO-ready or execution-ready | proposing | smile_talk_loop | thinking_up | open | display-only / not GO approval |
| completed_static_only | 静的完了 | docs/static completion concept | completed docs-only state review | not productionReady or runtime completion | archival | quiet_loop | steady_center | half_closed | display-only / productionReady false |

## Global Rules

- Every expression is static.
- Every expression is review-only.
- No expression is a real-time state.
- No expression is a connection state.
- No expression is a robot control preview.
- No expression is a GO approval indicator.
- No expression is a productionReady indicator.
- voiceIntent, mouthPattern, gazePattern, and blinkState are display labels only.

## Current Safety State

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- GO: not approved
