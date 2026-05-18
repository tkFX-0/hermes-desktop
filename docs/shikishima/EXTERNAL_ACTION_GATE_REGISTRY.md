# External Action Gate Registry

## Status: ALL HOLD

No external action capability is approved.
This registry records approval requirements only.

---

## External API Write (General)

```
Gate ID:    GATE-EW-01
Status:     HOLD
Capability: Any write to an external API service
Required before Gate:
  - GATE-PR-01 (productionReady) complete
  - GATE-EX-01 (execution) complete
  - Specific service + action defined
  - Rate limit and error handling reviewed
  - Rollback procedure defined
  - Human review
  - Per-action explicit GO
Human approval: required per action
```

## Email Send

```
Gate ID:    GATE-EMAIL-01
Status:     HOLD
Capability: Sending email via any provider (SMTP, SendGrid, Gmail API, etc.)
Required before Gate:
  - GATE-EW-01 complete
  - Email content policy defined
  - Recipient validation defined
  - No bulk / mass send
  - Human review of first send
  - Separate explicit human GO per send
Human approval: required per send
```

## Calendar Event Creation

```
Gate ID:    GATE-CAL-01
Status:     HOLD
Capability: Creating calendar events (Google Calendar, Exchange, etc.)
Required before Gate:
  - GATE-EW-01 complete
  - Calendar access scope defined (minimum necessary)
  - No recurring event creation without explicit scope
  - Human review
  - Separate explicit human GO per event
Human approval: required per event
```

## GitHub Issue / PR Creation

```
Gate ID:    GATE-GH-01
Status:     HOLD
Capability: Creating GitHub issues or pull requests
Required before Gate:
  - GATE-EW-01 complete
  - Repository scope defined (specific repo only)
  - No auto-merge
  - Human reviews PR before any merge
  - Separate explicit human GO per PR
Human approval: required per PR / issue
```

## Social Post

```
Gate ID:    GATE-SOC-01
Status:     HOLD
Capability: Posting to social media (Twitter/X, LinkedIn, etc.)
Required before Gate:
  - GATE-EW-01 complete
  - Social content policy defined
  - No automated posting
  - Human reads and approves each post before send
  - Separate explicit human GO per post
Human approval: required per post
```

## Purchase / Reservation / Payment

```
Gate ID:    GATE-PAY-01
Status:     HOLD
Capability: Any purchase, reservation, or payment action
Required before Gate:
  - GATE-EW-01 complete
  - Payment provider defined
  - Maximum amount defined
  - Refund mechanism defined
  - Human review + confirmation
  - Separate explicit human GO per transaction
Human approval: required per transaction
```

## git push from UI

```
Gate ID:    GATE-PUSH-01
Status:     HOLD (per-push basis)
Capability: Triggering git push from Command Center UI
Note:       Currently, all pushes require explicit per-push human GO in chat
            This gate is about enabling UI-triggered push
Required before Gate:
  - Separate UI push implementation
  - Push confirmation dialog with exact commit list
  - Human reviews commit list before confirming
  - Separate explicit human GO per push
Human approval: required per push
```

---

## X Search (via Grok-Hermes x_search)

```
Gate ID:    GATE-XSEARCH-01 (GHG-09a)
Status:     HOLD
Capability: Sending search queries to X (Twitter) via Hermes x_search tool
            Default-off in Hermes — requires explicit enable step
Required before Gate:
  - GHG-08 complete (chat-only operation established)
  - x_search content policy defined
  - Query logging policy defined (no sensitive query content stored unsafely)
  - Rate limit policy defined
  - Human review of first search
  - Separate explicit human GO: "GHG-09a x_search GO"
Human approval: required per activation
```

## TTS / Audio Output (via Grok-Hermes)

```
Gate ID:    GATE-TTS-01 (GHG-09b)
Status:     HOLD
Capability: Text-to-speech output via Hermes xAI TTS surface
Required before Gate:
  - GHG-08 complete
  - Audio output scope defined
  - Verify subscription tier supports TTS
  - Human confirms TTS is safe in current environment
  - Separate explicit human GO: "GHG-09b TTS GO"
Human approval: required per activation
```

## Image Generation (via Grok-Hermes)

```
Gate ID:    GATE-IMAGE-01 (GHG-09c)
Status:     HOLD
Capability: Image generation via Hermes xAI image surface
Required before Gate:
  - GHG-08 complete
  - Content policy for generated images defined
  - Image storage and display policy defined
  - Verify subscription tier supports image generation
  - Separate explicit human GO: "GHG-09c image generation GO"
Human approval: required per activation
```

## Video Generation (via Grok-Hermes)

```
Gate ID:    GATE-VIDEO-01 (GHG-09d)
Status:     HOLD
Capability: Video generation via Hermes xAI video surface
            Default-off in Hermes — requires explicit enable step
Required before Gate:
  - GHG-08 complete
  - Content policy for generated video defined
  - Storage and quota policy defined
  - Separate explicit human GO: "GHG-09d video generation GO"
Human approval: required per activation
```

## Messaging Adapters (Discord / Telegram / WhatsApp / Signal)

```
Gate ID:    GATE-MSG-01 (per adapter)
Status:     HOLD
Capability: Sending messages via any messaging adapter in Hermes
Required before Gate:
  - GATE-EW-01 complete
  - Per-adapter scope defined (no bulk send)
  - Message content policy defined
  - Recipient confirmation mechanism defined
  - Human review of first send per platform
  - Separate explicit human GO per platform
Human approval: required per platform per send
```

---

## Required Statement

None of the above capabilities are approved.
This document records approval requirements only.
externalWrite: false / productionReady: false / execution: disabled

---

_Updated: 2026-05-18 — added x_search, TTS, image, video, messaging gates_
_Created: 2026-05-17_
