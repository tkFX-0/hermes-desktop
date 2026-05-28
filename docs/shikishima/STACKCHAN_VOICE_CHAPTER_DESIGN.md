# StackChan Voice — Chapter Design (Kickoff)

Date: 2026-05-28
Human GO: umbrella record `STACKCHAN_NEXT_CHAPTERS_HUMAN_GO_RECORD.md` (design only)

---

## Scope

Design **voice output** boundaries (VOICEVOX → PCM → WebSocket) without enabling voice pilots or PCM streams.

---

## Legacy Path (reference only — not approved for pilot)

```text
stackchanSayLocal / VOICEVOX localhost:50021 / PCM chunks
Coupled: face + speaking state + motion overlap risk (SC_MOTION_04)
```

Display-only ACCEPTED path must remain isolated from this chain.

---

## Design Questions (TBD)

```text
1. Separate voice GO from display GO (never chain in one pilot)
2. VOICEVOX availability preflight (redacted health check only)
3. Max utterance length / single phrase allowlist per GO
4. speaking-state interaction with motion presets
5. guarded transport vs direct local-service call
6. **Not Hermes-mediated TTS** — shikishima decides intent; PC VOICEVOX → WS direct (see `STACKCHAN_VOICE_OUTPUT_ARCHITECTURE.md`)
```

---

## Explicit HOLD

```text
voice output: HOLD
mic input: HOLD
VOICEVOX invoke: HOLD
PCM WebSocket stream: HOLD
```

---

## Deliverables (this chapter)

```text
- voice boundary doc
- one-shot voice pilot GO draft (empty placeholder)
- evidence template (no audio raw paths in repo)
```

---

## Status

```text
chapter_design_go: DONE
voice_route: IMPLEMENTED (sendStackChanVoiceOnce)
voice_pilot: HOLD (voicevox_unavailable likely)
next: start VOICEVOX localhost:50021; new time-window GO for retry
```
