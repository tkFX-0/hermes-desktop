# Grok-Hermes Tool HOLD Registry

## Policy

All tools in this registry are HOLD.
No tool can be activated without:
  1. Passing the relevant GHG gate (see GROK_HERMES_PROVIDER_GATE.md)
  2. A separate explicit human GO for the specific tool
  3. Not included in the chat-only provider test (GHG-05)
  4. No productionReady change implied

---

## x_search

```
status:               HOLD
hermes_default:       off
reason:               Sends search queries to X (Twitter) platform
                      Requires separate content policy review
                      May expose query content to external network
gate_required:        GHG-09a
separate_GO_required: yes — explicit "GHG-09a x_search GO"
included_in_chat_test: false
```

---

## TTS (Text-to-Speech)

```
status:               HOLD
hermes_default:       unknown (verify locally)
reason:               Generates audio output; may interact with device audio system
                      Voice output may be heard by others in environment
                      Requires audio output policy review
gate_required:        GHG-09b
separate_GO_required: yes — explicit "GHG-09b TTS GO"
included_in_chat_test: false
```

---

## Image Generation

```
status:               HOLD
hermes_default:       unknown (verify locally)
reason:               Generates images via xAI image surface
                      Content policy for generated images not yet defined
                      Storage and display of generated images not reviewed
gate_required:        GHG-09c
separate_GO_required: yes — explicit "GHG-09c image generation GO"
included_in_chat_test: false
```

---

## Video Generation

```
status:               HOLD
hermes_default:       off (off by default in Hermes)
reason:               Generates video content
                      High compute cost; quota implications unclear
                      Content policy for generated video not yet defined
gate_required:        GHG-09d
separate_GO_required: yes — explicit "GHG-09d video generation GO"
included_in_chat_test: false
note:                 Off by default in Hermes — requires explicit enable step
```

---

## Transcription

```
status:               HOLD
hermes_default:       unknown (verify locally)
reason:               Processes audio input
                      Microphone access is HOLD in Shikishima
                      Any mic activation requires separate voice/mic gate
gate_required:        GHG-09e + voice/mic gate
separate_GO_required: yes — both transcription GO and voice/mic GO required
included_in_chat_test: false
```

---

## Messaging Adapters

```
status:               HOLD
adapters:             Discord, Telegram, WhatsApp, Signal (and any others)
reason:               All external messaging send/receive is HOLD in Shikishima
                      Requires GATE-EMAIL-01 equivalent per platform
                      No inbound message routing defined
gate_required:        GATE-EW-01 + per-platform gate
separate_GO_required: yes — per platform
included_in_chat_test: false
```

---

## Discord

```
status:               HOLD
reason:               External message send to Discord server
                      Shikishima has no Discord send permission
gate_required:        GATE-DISCORD-01 (not yet defined — define at gate time)
separate_GO_required: yes
```

---

## Telegram

```
status:               HOLD
reason:               External message send via Telegram API
gate_required:        GATE-TELEGRAM-01 (not yet defined)
separate_GO_required: yes
```

---

## WhatsApp / Signal

```
status:               HOLD
reason:               External messaging; personal communication platform
gate_required:        GATE-MESSAGING-01 (not yet defined)
separate_GO_required: yes
```

---

## External Posting (General)

```
status:               HOLD
includes:             X (Twitter) posting, social media, blog platforms
reason:               All public external content creation is HOLD
gate_required:        GATE-EW-01 + per-platform
separate_GO_required: yes — per post type
```

---

## Autonomous Actions

```
status:               HOLD
includes:             Any action initiated without human approval in current session
reason:               Shikishima requires humanGoApprovalRequired: true for all actions
                      No autonomous action path is approved
gate_required:        productionReady + execution gates
separate_GO_required: yes — per action class
```

---

## GitHub Write Actions

```
status:               HOLD
includes:             remote issue creation, PR creation, comment posting,
                      push to remote, force push, repository modification
reason:               All remote GitHub writes require human confirmation
                      Currently only local git push with explicit GO is in scope
gate_required:        GATE-EW-01 (GitHub)
separate_GO_required: yes — explicit GO per write action
```

---

## Purchase / Reservation / Payment

```
status:               HOLD
includes:             Any purchase, subscription change, reservation, billing action
reason:               Financial operations require explicit human authorization
gate_required:        Not defined — must define before any purchase path
separate_GO_required: yes — explicit GO + human payment confirmation
```

---

## Voice Activation

```
status:               HOLD
reason:               Shikishima voiceActive: false is a type-level literal
                      No microphone or voice input path is approved
gate_required:        VOICE_GATE (not yet defined)
separate_GO_required: yes
```

---

## Camera Activation

```
status:               HOLD
reason:               cameraActive: false is a type-level literal
gate_required:        CAMERA_GATE (not yet defined)
separate_GO_required: yes
```

---

## Microphone Activation

```
status:               HOLD
reason:               micActive: false is a type-level literal
gate_required:        MIC_GATE (not yet defined)
separate_GO_required: yes
```

---

## StackChan Physical Operation

```
status:               HOLD
reason:               physicalOperation: false is a type-level literal
                      StackChan unit not yet arrived; no connection attempted
gate_required:        DEVICE_GATE (see DEVICE_AND_SENSOR_GATE_REGISTRY.md)
separate_GO_required: yes
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
