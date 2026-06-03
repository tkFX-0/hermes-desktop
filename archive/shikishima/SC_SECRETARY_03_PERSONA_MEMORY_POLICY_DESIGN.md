# SC-SECRETARY-03 Persona and Memory Policy Design

date: 2026-05-25
status: DESIGN_READY
scope: StackChan secretary persona, profile, forbidden phrase policy

## Purpose

Stabilize what StackChan says as a secretary.

The current concern is that user preferences such as "do not say this" may not persist reliably. This likely comes from profile and prompt policy not being treated as a hard layer.

## Target

Create a stable persona policy layer before broad secretary behavior is implemented.

The secretary must reliably know:

- who it is
- which agent is speaking
- what tone to use
- what not to say
- when to ask for GO
- when to say HOLD

## Profile Layers

Use a layered prompt/profile model:

1. `system_safety_policy`
   - never overridden
   - Level 5 boundaries
   - privacy rules
2. `secretary_persona`
   - brief, warm, observant
   - "見守り" wording
   - does not overclaim sensing
3. `agent_voice_profile`
   - しきしま / しずめ / はじめ / つむぎ / しるべ
   - role and style
4. `user_preferences`
   - preferred tone
   - forbidden phrases
   - reminders style
5. `session_context`
   - current task / recent events
   - temporary, lowest priority

## Forbidden Phrase Contract

The system should support:

```text
forbidden_phrases:
  - phrase:
    reason:
    replacement:
    severity: soft / hard
```

Rules:

- hard forbidden phrases must be filtered after generation
- if a phrase is filtered, use a replacement or rephrase
- do not argue with the user about forbidden phrase preferences
- do not store forbidden phrase examples in raw sensitive context if they contain secrets

## Agent Voice Contract

| Agent | Voice |
| --- | --- |
| しきしま | calm, concise secretary |
| しずめ | safety, privacy, STOP |
| はじめ | planning and task breakdown |
| つむぎ | implementation progress |
| しるべ | evidence and records |

Each voice must still obey the same forbidden phrase filter.

## Response Shape

Default StackChan speech should be short:

```text
one_sentence:
  max_chars: 60
  style: warm / practical
```

Long details should go to Discord/text, not voice, unless the user asks.

## Memory Inputs

Allowed:

- user tone preference
- recurring schedule preferences
- names of project gates
- redacted task state
- prior explicit corrections

HOLD:

- camera-derived personal observations
- health/medical interpretation
- financial position instructions
- private documents

## Policy Enforcement Points

1. before prompt build
2. after model response
3. before StackChan voice output
4. before external write
5. before evidence logging

## Implementation Prep

Future files may include:

- `scripts/shikishima-secretary-profile.mjs`
- `scripts/shikishima-secretary-filter.mjs`
- `docs/shikishima/SC_SECRETARY_PROFILE_POLICY.json.example`

Implementation is not approved by this document.

## Acceptance Criteria

- forbidden phrase can be recorded
- generated response avoids forbidden phrase
- replacement phrase is used
- voice output is short
- agent identity is preserved
- safety HOLD overrides persona
