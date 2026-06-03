# Pixel Ghost Agent Character Spec

## Document Status

```
date:            2026-05-18
status:          docs-only character design spec
image_assets:    none — placeholder CSS in AT-02; real sprites in AT-03+
```

---

## Visual Direction (Confirmed)

```
style:           cute soft pixel-art ghost
body_color:      white / pale-blue
outline_color:   blue
size_target:     48×64px or 64×80px per frame (sprite sheet in AT-03)
name_label:      UI-rendered text (not baked into image asset)
accessories:     small role-based items (described per agent)
flags:           small back or side flags for role identification
expression:      distinct per-agent default face
animation:       CSS-only in AT-02/05; sprite sheet in AT-03+
```

---

## しきしま (Shikishima)

```
role:            command / conversation / response waiting / final routing
canonical_id:    supervisor

visual:
  body:          standard ghost — white/pale-blue, blue outline
  accessory:     small headset (drawn pixel style)
  flag:          small blue flag on back
  extra:         sometimes holds a small "GO?" speech bubble card

default_expression:
  eyes:          gentle half-moon eyes (calm/sleepy)
  mouth:         small soft smile
  mood:          warm, attentive, slightly drowsy-but-listening

name_label_text: "しきしま"
name_label_lang: ja primary / en secondary

core_poses:
  idle:          floating gently, headset on, calm face
  listening:     tilts slightly toward user, eyes slightly wider
  thinking:      head tilted, eyes looking up-left
  pass_ready:    holds small blue card forward (PASS indicator)
  waiting_go:    holds "GO?" flag, patient expression
  directing:     points gently toward はじめ
  reviewing:     glances at all agents via small binoculars or sweeping gaze
  blocked:       sad-face, headset tilted, HOLD badge visible
```

---

## しずめ (Shizume)

```
role:            safety gate / HOLD / STOP / REJECT / pass-check
canonical_id:    approval_guardian

visual:
  body:          slightly more angular/alert shape
  accessory:     whistle, small HOLD/STOP sign, tiny baton
  vest_accent:   small safety-vest stripe detail
  flag:          yellow flag on back

default_expression:
  eyes:          sharp half-lidded serious eyes
  mouth:         firm straight line or small frown
  mood:          vigilant, authoritative, trustworthy

name_label_text: "しずめ"

core_poses:
  idle:          standing firm, baton resting, alert face
  checking:      examining a small checklist card
  hold_raised:   holds HOLD sign up, serious expression
  stop_raised:   holds STOP sign up, blocking pose
  whistle:       blowing whistle (alert)
  pass_given:    lowers sign, gives small nod, PASS card shown
  review:        reads safety checklist closely
  blocked:       arms crossed, yellow badge glowing
```

---

## はじめ (Hajime) → むすび

```
role:            planning / task decomposition / next step design
canonical_id:    execution_planner (むすび)

visual:
  body:          curious, slightly tilted float
  accessory:     small folded map, sticky notes around
  extra:         tiny sticky notes floating near it
  flag:          green flag

default_expression:
  eyes:          wide curious eyes, slightly puzzled
  mouth:         small open-mouth thinking expression
  mood:          curious, energetic, ready-to-plan

name_label_text: "はじめ" (display) / むすび (canonical)

core_poses:
  idle:          floating with map tucked, curious face
  planning:      spreads map open, studying it
  writing:       scribbles on memo pad
  arranging:     arranges small task cards in order
  receiving:     turns toward しきしま, listening pose
  sending:       extends memo to つむぎ direction
  waiting:       holds map closed, patient expression
  blocked:       map folded shut, question mark bubble
```

---

## つむぎ (Tsumugi)

```
role:            development / implementation / test / commit preparation
canonical_id:    memory_curator (つむぐ)

visual:
  body:          compact, slightly hunched-forward working posture
  accessory:     construction helmet, small keyboard, tool in hand
  flag:          orange flag

default_expression:
  eyes:          focused narrow eyes, concentration
  mouth:         slight determined smile or neutral focus
  mood:          professional, focused, reliable

name_label_text: "つむぎ"

core_poses:
  idle:          helmet on, keyboard in lap, calm working posture
  typing:        keyboard tap loop animation, focused eyes
  tool_held:     holds tool, examining something
  test_check:    looks at small screen showing CHECK
  pass_card:     holds out a PASS card toward しずめ
  review_card:   holds review card toward しずめ
  complete:      small jump or sparkle, OK gesture
  frozen_stop:   frozen mid-type, STOP badge visible, alarmed expression
```

---

## しるべ (Shirube)

```
role:            evidence / record / log / roadmap / changelog
canonical_id:    audit_keeper

visual:
  body:          calm, slightly formal posture
  accessory:     headphones, logbook open, pen
  extra:         small archive box nearby or tucked under arm
  flag:          purple flag

default_expression:
  eyes:          calm attentive eyes, serene
  mouth:         gentle closed-mouth expression
  mood:          peaceful, methodical, trustworthy

name_label_text: "しるべ"

core_poses:
  idle:          headphones on, logbook closed, calm float
  listening:     headphones pressed, eyes slightly closed
  writing:       pen to logbook, recording
  receive_paper: reaches out to receive evidence from つむぎ
  archive:       places paper into archive box
  read_log:      opens logbook, reading quietly
  send_back:     extends recorded card back toward しきしま
  blocked:       logbook closed, pen down, HOLD badge
```

---

## Visual Consistency Rules

```
1. All five agents share the white/pale-blue body + blue outline base
2. Each agent is distinct through accessories and flag color only
3. Name labels are always UI text, never pixel art baked into sprite
4. Expressions are pixel-art faces (minimal detail, 2-3 colors max)
5. Safety-critical states (HOLD/STOP/BLOCKED) always show a badge
6. No agent is ever shown in a "executing" or "pushing" visual state
7. Human GO wait pose is always recognizable and non-threatening
```

---

## Flag Color Reference

| Agent | Flag Color | CSS Variable |
|---|---|---|
| しきしま | blue | var(--go) |
| しずめ | yellow | var(--hold) |
| はじめ | green | var(--pass) |
| つむぎ | orange | #f97316 |
| しるべ | purple | #a855f7 |

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
