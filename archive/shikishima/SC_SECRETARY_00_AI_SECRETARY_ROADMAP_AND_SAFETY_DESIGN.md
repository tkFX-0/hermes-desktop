# SC-SECRETARY-00 AI Secretary Roadmap and Safety Design

date: 2026-05-25
status: DESIGN_DRAFT
scope: StackChan AI secretary / camera-aware assistant planning

## Purpose

Define the safe roadmap for turning StackChan into a Shikishima AI secretary.

The target is not simply "a robot that talks." The target is a small desk-side secretary that can:

- speak through StackChan
- show emotional state through face, LED, and motion
- understand user context
- help with reminders and work flow
- eventually use the internal camera for daily-life context

This document is planning only. It does not approve camera monitoring, microphone always-on, autonomous recording, external API calls, productionReady true, or execution enabled.

## Product Vision

StackChan should become the local body for Shikishima:

- Shikishima = brain / judgment / memory / policy / task management
- StackChan = face / voice / motion / room presence / gentle nudges

The ideal experience:

- The user can talk to StackChan casually.
- StackChan answers as Shikishima or a selected sub-agent.
- StackChan can notice safe local context and say useful things.
- StackChan can keep lightweight routines: greetings, reminders, focus support, task wrap-ups.
- StackChan can escalate sensitive actions to human GO instead of doing them.

## Core Principles

1. One-shot before continuous.
2. Local-first before cloud.
3. Summary before storage.
4. Consent before sensing.
5. Human GO before external action.
6. Visible HOLD state before every high-risk gate.

Plain-language rule:

AIは気づいてよい。  
でも、見続ける・録り続ける・外へ送る・勝手に動かす、は人間GO。

## Proposed Capability Layers

### Layer 1 — Desk Companion

Goal:

- Stable voice output
- expressive face / LED / motion
- safe one-shot replies

Examples:

- morning greeting
- task completed reaction
- "おかえり" / "休憩しよう"
- focus timer start/end reaction
- Discord/Command Chat answer read-aloud

Safety:

- no camera
- no microphone always-on
- no autonomous conversation loop
- no external writes

Status:

- partially implemented through voice, face, LED, motion work

### Layer 2 — Human-Triggered Assistant

Goal:

- User explicitly asks StackChan/Shikishima to do something.
- StackChan responds by voice and motion.
- Actions remain draft-only or require GO.

Examples:

- "今日のタスクを読んで"
- "次にやることを整理して"
- "この作業の証跡をまとめて"
- "Discordに送る文案を作って"

Safety:

- actions that write externally remain HOLD
- all generated outgoing messages are drafts unless GO

### Layer 3 — One-Shot Camera Context

Goal:

- Use one user-approved still image from the internal camera or iPhone/app route.
- AI gives one safe comment or task suggestion.

Examples:

- desk looks cluttered -> "机の上を少し片づけると作業しやすそうです"
- user points camera at a paper -> "これはメモとして残す候補です"
- StackChan sees screen-free desk context -> "休憩後の再開に向いています"

Safety:

- one still image only
- no continuous monitoring
- no person identification
- no face recognition
- no private screen / credential reading
- image source must be approved by user
- evidence records whether image was used

Next gate:

- `SC-CAM-01 One-Shot Camera Comment`

### Layer 4 — Periodic Local Check-In

Goal:

- StackChan asks safe check-in questions at a limited schedule.
- It does not watch continuously.

Examples:

- "1時間経ちました。姿勢と水分、大丈夫ですか？"
- "作業が続いています。次の区切りを決めますか？"
- "今日の記録、軽く残しますか？"

Safety:

- schedule is explicit
- user can pause it
- no camera/mic by default
- no external write
- no retry loop

Next gate:

- `SC-SECRETARY-02 Periodic Check-In Draft`

### Layer 5 — Event-Aware Secretary

Goal:

- StackChan reacts to Shikishima-side events.

Examples:

- task done -> `task_done` motion + short voice
- safety HOLD -> `safety_hold` motion
- GO required -> gentle voice prompt
- Discord mention -> optional read-aloud
- market alert -> calm status summary

Safety:

- event source must be local and bounded
- external actions remain separate GO
- no autonomous trading
- no financial advice phrased as instruction

### Layer 6 — Camera-Aware Daily-Life Assistant

Goal:

- Limited camera awareness for daily-life support.

Examples:

- detect long absence from desk
- detect light/dark environment
- detect whether a work object is present
- remind about break, hydration, desk reset

Safety:

- this is not approved yet
- starts with one-shot tests only
- later can become low-frequency snapshots if explicitly approved
- no people identity recognition
- no sensitive document reading without explicit GO
- no cloud upload unless explicitly approved
- local redaction / discard policy required

Next gate:

- `SC-SECRETARY-04 Camera-Aware Daily-Life Gate`

## Suggested Roadmap

### Phase A — Stabilize Body Output

Status target:

- voice one-shot stable
- face/motion/LED stable
- dialogue motion works during speech
- pat reaction not over-sensitive
- cat-like nuzzle / hand-follow pat motion feels natural

Current state:

- motion presets implemented
- dialogue motion fixed
- pat sensitivity tuned
- nuzzle / hand-follow motion: design candidate

Remaining:

- human visual check
- motion amplitude tuning
- `SC-MOTION-06 Cat-Like Nuzzle Pat Motion`

### Phase A2 — Presence Polish: Cat-Like Nuzzle

Status target:

- StackChan reacts to a light pat by leaning into the detected hand direction
- the motion feels like a small animal nuzzling, not a mechanical shake
- normal pat remains `撫でられてうれしい` with green LED
- too much pat remains `頑張るぞ` with red LED

Safety:

- touch/IMU only
- no camera
- no microphone
- no person inference
- no autonomous loop

Next gate:

- `SC-MOTION-06 Cat-Like Nuzzle Pat Motion`

### Phase B — Secretary Voice UX

Implement / design:

- secretary voice phrases
- agent-to-face mapping
- agent-to-motion mapping
- "read aloud" mode
- "short answer" mode
- "do not say this phrase" profile guard

Key issue to solve:

- stable personality/profile injection so forbidden phrases and user preferences persist.

Gate:

- `SC-SECRETARY-01 Voice Persona and Phrase Policy`

### Phase C — One-Shot Camera Comment

Implement / design:

- one still image input
- privacy confirmation
- safe image summary prompt
- no identity recognition
- no storage by default
- optional evidence-only redacted note

Gate:

- `SC-CAM-01 One-Shot Camera Comment`

### Phase D — Daily Check-In Draft

Implement / design:

- local schedule draft
- pause/resume command
- one message at a time
- no background escalation
- no camera/mic

Gate:

- `SC-SECRETARY-02 Periodic Check-In`

### Phase E — Event Bridge

Implement / design:

- Shikishima event -> StackChan reaction mapping
- task done / HOLD / PASS / STOP
- Discord read-out draft
- FX alert read-out safety labels

Gate:

- `SC-SECRETARY-03 Event-Aware Reaction Bridge`

### Phase F — Camera-Aware Secretary

Implement / design:

- one-shot -> low-frequency snapshots -> limited monitoring
- privacy indicator
- local discard policy
- no recording loop
- no face recognition
- no private screen reading

Gate:

- `SC-SECRETARY-04 Camera-Aware Daily-Life Gate`

### Phase G — Production Readiness Review

Only after:

- voice behavior stable
- camera privacy policy proven
- emergency stop / pause exists
- external writes remain gated
- logs avoid raw values
- user accepts behavior

Gate:

- `SC-SECRETARY-99 Production Readiness Review`

## Motion / Face Ideas for Secretary Behavior

Use existing faces only unless a future asset gate approves more.

| Secretary state | Face | Motion | LED |
| --- | --- | --- | --- |
| listening | `ノーマル` | `listen_ready` | blue |
| answering | `口パク` | `aiagent_speak` / `speaking_nod` | off |
| thinking | `ノーマル` | `thinking_scan` | blue dim |
| task accepted | `頑張るぞ` | `task_accept` | blue |
| task done | `笑顔` | `task_done` | green |
| safety hold | `焦り` | `safety_hold` | amber |
| stop / privacy risk | `焦り` | `panic_stop` | red |
| praise / pat | `撫でられてうれしい` | pat happy | green |
| too much pat | `頑張るぞ` | over-pat | red |
| cat-like nuzzle | `撫でられてうれしい` | `nuzzle_follow` / `nuzzle_hold` | green |
| sleepy / pause | `zzz` | `sleepy_idle` | off |

## Assistant Personality Direction

StackChan secretary should be:

- brief
- warm
- observant
- never pushy
- clearly bounded
- does not pretend to have seen something unless the camera gate was actually open

Suggested voice style:

- "見守り" not "監視"
- "提案" not "命令"
- "必要なら止めます" always available

## Privacy and Safety Boundaries

Hard HOLD until separate GO:

- continuous camera monitoring
- microphone always-on
- voice conversation loop
- person identification
- face recognition
- private screen reading
- external upload of images/audio
- Discord/X/Obsidian external write from camera-derived content
- productionReady true
- execution enabled

Allowed next:

- docs
- one-shot planning
- one-shot local tests
- motion/voice UX tuning
- draft-only assistant behavior

## Candidate Next Tasks

1. `SC-SECRETARY-01 Voice Persona and Phrase Policy`
2. `SC-MOTION-06 Cat-Like Nuzzle Pat Motion`
3. `SC-CAM-01 One-Shot Camera Comment`
4. `SC-SECRETARY-02 Periodic Check-In Draft`
5. `SC-SECRETARY-03 Event-Aware Reaction Bridge`
6. `SC-SECRETARY-04 Camera-Aware Daily-Life Gate`
7. `SC-SECRETARY-99 Production Readiness Review`

## Current Decision

AI secretary roadmap: drafted.  
Implementation: HOLD until a specific next gate is selected.  
Recommended next implementation candidate: `SC-SECRETARY-01 Voice Persona and Phrase Policy`.
