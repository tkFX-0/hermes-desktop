# Shikishima External Tool Integration Policy Map

## Document Status

```text
roadmapVersion: v3.39.0
date: 2026-05-16
status: policy_map_only — not API connection approval / not execution approval
```

---

## Purpose

This document maps allowed and forbidden Shikishima behaviors for each future external tool category.

For each tool, the default stance is: **allowed for drafting and research; forbidden for writing and executing without explicit GO.**

---

## X / Note

### Allowed now (Level 0–1)

```text
- draft posts and replies
- topic planning and timing suggestions
- hashtag research
- risk review of draft content
- Note article outline drafting
```

### Forbidden without separate explicit GO

```text
- post to X
- reply on X
- send DM
- follow / unfollow
- delete posts
- call X API write endpoints
- create Note articles
- access account tokens
```

---

## Calendar

### Allowed now

```text
- draft schedule suggestions
- propose reminders
- summarize calendar if user manually provides data
- create time-block proposals
```

### Forbidden without separate explicit GO

```text
- create calendar events (Google/Apple/etc.)
- edit calendar events
- delete calendar events
- invite others
- share calendar
- access calendar OAuth tokens
```

---

## Reservation

### Allowed now

```text
- research reservation options
- draft reservation details (date/time/name/requirements)
- prepare confirmation checklist
- compare options and estimate cost
```

### Forbidden without separate explicit GO

```text
- submit reservation
- cancel reservation
- enter payment details
- submit personal data to reservation services
- call reservation APIs
```

---

## Product Research / Shopping

### Allowed now

```text
- compare products
- recommend candidates
- estimate cost
- create shopping list
- research StackChan parts and hardware
- summarize product specs
```

### Forbidden without separate explicit GO

```text
- purchase
- add to cart (on live service)
- apply coupon or promo code
- add or modify payment method
- checkout or confirm order
- subscribe to service
```

---

## Sensors / Hardware

### Allowed now

```text
- explain sensor types and capabilities
- design sensor integration roadmap
- suggest sensor placement
- analyze redacted demo data if pre-approved
```

### Forbidden without separate explicit GO

```text
- activate camera
- activate microphone
- enable continuous location tracking
- enable biometric sensing
- expose raw sensor data containing personal information
- physical robot motion
- servo / motor activation
```

---

## ToDo / Reminders

### Allowed now

```text
- detect task candidates from conversation
- draft reminder text
- suggest task priority
- create redacted task summary
```

### Forbidden without separate explicit GO

```text
- send push notifications to external services
- write to third-party task management systems (Notion, Todoist, etc.)
- execute tasks autonomously
- delete or archive tasks without confirmation
```

---

## Finance / Trading

### Allowed now

```text
- summarize provided data
- organize financial categories
- flag potential risks
- draft budget plan
- research market context (suggestion only)
```

### Forbidden without separate explicit GO

```text
- place trades
- transfer funds
- pay bills
- connect bank or brokerage APIs
- disclose account numbers or tokens
- subscribe to financial services
- execute any live financial transaction
```

---

## Development Tools

### Allowed now (Level 1–2)

```text
- draft code
- create task descriptions
- suggest implementation approach
- review diff and suggest changes
```

### Forbidden without Level 3 gated GO

```text
- run code outside approved scope
- install dependencies
- deploy to production
- commit without human review
- push without explicit GO
- access credentials
```

---

## Safety Boundary

```text
execution         : disabled
productionReady   : false
external_api_write: not approved (all categories)
secret_access     : not approved
voice/camera/mic  : HOLD
robot_motion      : HOLD
```

---

この範囲では問題を検出していません。
