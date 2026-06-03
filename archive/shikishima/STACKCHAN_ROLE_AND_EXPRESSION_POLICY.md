# StackChan Role and Expression Policy

## Document Status

```text
roadmapVersion: v3.36.0
date: 2026-05-16
status: policy_design_only — not robot operation approval
```

---

## 1. Core Role

StackChan is Shikishima's embodied room-side terminal.

```text
StackChan IS:
- Shikishima's face, voice, and expression layer
- the room-side physical presence
- a curated output channel for summaries, alerts, encouragement

StackChan IS NOT:
- the decision authority
- an autonomous agent
- a replacement for the human GO/HOLD/REJECT role
- approved for physical motion without a separate safety gate
```

Shikishima remains the brain and safety gate.  
The user remains the final GO / HOLD / REJECT authority.

---

## 2. Expression States

| State | Trigger | Behavior |
|---|---|---|
| neutral | default / standby | calm face |
| listening | user speaking | attentive expression |
| thinking | processing | focused, slight tilt |
| happy | task completed / PASS | bright expression |
| cheering | encouragement moment | energetic |
| caution | warning detected | alert expression |
| HOLD | HOLD condition active | steady, calm warning |
| STOP | STOP condition active | clear warning expression |
| review_ready | human review needed | attentive, waiting |
| completed | session ended clean | satisfied |
| sleepy | night mode / idle | calm, dim |

All expression states are display-only.  
Expression changes do not constitute execution.

---

## 3. Speech Policy

### Allowed future speech categories

```text
- daily summary (prepared by Shikishima, user-confirmed)
- reminder announcement (pre-set by user)
- task priority reading
- development status summary
- safety warning (HOLD / STOP)
- gentle encouragement
- user-confirmed message reading
```

### Forbidden without separate explicit GO

```text
- voice activation loop
- microphone activation
- camera activation
- autonomous speech loop (speech without user trigger)
- external message sending via voice
- reading secrets or tokens aloud
- reading raw LAN IP aloud
- trading advice framed as instruction
- medical / legal / financial decisive claims
```

---

## 4. Physical Safety Boundary

StackChan physical operation requires a separate physical safety gate.

```text
robotMotion: HOLD
physicalMovement: HOLD
deviceConnection: requires separate GO
motionTest: requires separate GO
servoMotorOperation: requires separate GO
voiceOutput: requires separate GO
microphoneInput: requires separate GO
cameraInput: requires separate GO
```

**These are not approved by this document.**

---

## 5. Future Candidate Docs

```text
- STACKCHAN_PHYSICAL_SAFETY_GATE.md (when device arrives)
- STACKCHAN_VOICE_REACTION_POLICY.md (before voice is enabled)
- STACKCHAN_EXPRESSION_STATE_MATRIX.md (full matrix with timings)
- STACKCHAN_SENSOR_REACTION_POLICY.md (sensor-linked behavior)
```

All marked as future docs-only candidates. None approved.

---

## Safety Boundary

```text
robotMotion      : HOLD
voice            : HOLD (requires separate GO)
camera/mic       : HOLD
StackChan device : not connected
Level 3          : not approved
productionReady  : false
execution        : disabled
```

---

この範囲では問題を検出していません。
