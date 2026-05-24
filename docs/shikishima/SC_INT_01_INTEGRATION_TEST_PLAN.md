# SC-INT-01 Integration Test Plan

status: DESIGN_COMPLETE
date: 2026-05-24

---

## Pre-conditions (all scenarios)

- StackChan powered on, WiFi connected (<STACKCHAN_HOST>:8080)
- VOICEVOX running at localhost:50021
- shikishima-bot.mjs running (via Electron sidebot-service or standalone)
- Discord bot connected

---

## Test Scenarios

### T-01: Startup self-test

**Trigger**: bot start
**Expected**:
- Discord: しずめ sends self-test report within 5 seconds
- Log: `[SelfTest] 診断レポート送信完了`
- StackChan: startup greeting voice plays within 10 seconds

**Pass criteria**: Discord receives self-test message; no error in log

---

### T-02: Basic chat routing

**Input**: Discord message `おはよう`
**Expected**:
- Routed to `shikishima` agent
- Groq → response sent via Webhook with しきしま avatar
- StackChan: face changes to match emotion
- Log: `[Bot] 🏯 しきしま ← "おはよう"`

**Pass criteria**: response arrives within 15s; webhook avatar is correct

---

### T-03: !sc dance command

**Input**: Discord message `!sc dance`
**Expected**:
- `stackchanDance()` called
- StackChan executes dance motion (after audio-based guard clears)
- Log: `StackChan: ダンス開始`

**Pass criteria**: dance motion executed; no crash; `isDancing` guard works

---

### T-04: !sc led blue command

**Input**: Discord message `!sc led blue`
**Expected**:
- WebSocket `{type:"led", preset:"blue"}` sent
- StackChan LED turns blue
- Reply: `StackChan: LED → blue`

**Pass criteria**: LED changes color; returns to off after command (firmware auto-off behavior)

---

### T-05: !sc say text command

**Input**: Discord message `!sc say こんにちは世界`
**Expected**:
- VOICEVOX synthesizes "こんにちは世界"
- PCM streamed to StackChan
- StackChan speaks the text
- Reply: `StackChan: 発話 → こんにちは世界`

**Pass criteria**: StackChan audibly says the text; no timing error

---

### T-06: Pet event (IMU-triggered)

**Trigger**: Physical pat on StackChan IMU (≥3 detections)
**Expected**:
- Firmware POSTs `{type:"pat", mode:"nod"}` to PC:8765/event
- Bot log: `[Pat] nod → "ふふ、嬉しい"`
- StackChan: nod motion + speaks "ふふ、嬉しい"
- なかよし度 patCount increments
- Milestone check (if patCount hits 10/30/50 etc.)

**Pass criteria**: pat received → voice reaction within 3s; relationship counter updated

---

### T-07: MT5 DD alert

**Trigger**: MT5 data file shows DD > threshold
**Expected**:
- `startMt5Watcher` detects DD level
- Discord: しずめ sends DD warning
- StackChan: `hookOnDdAlert()` changes face + speaks alert

**Pass criteria**: Discord alert sent; StackChan reacts; no execution triggered

---

### T-08: Morning report (scheduled)

**Trigger**: 8:00 JST
**Expected**:
- はじめ sends morning plan via Webhook
- StackChan: `hookMorningGreeting()` fires greeting voice
- Grok provides today's XAUUSD outlook

**Pass criteria**: morning message arrives; no duplicate sends

---

## Pass/Fail Record Template

```
date:
tester:
pre_conditions_met: yes/no

T-01: PASS / FAIL / SKIP
T-02: PASS / FAIL / SKIP
T-03: PASS / FAIL / SKIP (requires SC-DANCE-01 PASS first)
T-04: PASS / FAIL / SKIP (requires SC-LED-01 PASS first)
T-05: PASS / FAIL / SKIP
T-06: PASS / FAIL / SKIP (requires physical StackChan)
T-07: PASS / FAIL / SKIP (requires MT5 data file)
T-08: PASS / FAIL / SKIP (scheduled, observe at 8:00 JST)

notes:
blocker:
```

---

## 100% Software Completion Criteria

All of T-01, T-02, T-05 must PASS without hardware-gated tests.
T-03 and T-04 require SC-FW-11 + SC-DANCE/LED-01 PASS.
T-06 requires physical IMU.
T-07 requires MT5 data.
T-08 is time-scheduled.

この範囲では問題を検出していません
