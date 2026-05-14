# StackChan Not Arrived — Robot Track Preparation Only

## Document Status

- roadmapVersion: v3.1.4
- status: robot_preparation_only / HOLD
- StackChan arrival: not arrived
- robot runtime: not approved
- robot connection: not approved
- robot motion: not approved
- robotMotion: HOLD
- date: 2026-05-14

## Purpose

This document explicitly records that StackChan has not arrived yet and that
the Robot / StackChan / Device track is preparation-only until it does.

It also defines the boundary between what is allowed now (preparation docs)
and what must wait for a separate human GO after StackChan arrives.

## Current Status

StackChan has not arrived yet.

Until StackChan arrives, the Robot / StackChan / Device track is
preparation-only. No robot implementation, connection, motion control, servo
control, device testing, runtime behavior, voice/camera/mic integration, or
autonomous robot behavior is approved.

## Allowed Before StackChan Arrives

The following preparation-only work is allowed:

- documentation and scope definition
- safety gates design
- expression/face design concepts and UI notes
- physical safety checklist drafting
- pre-arrival GO wording templates
- future connection GO wording review
- future observation GO wording review
- non-connection readiness docs
- emergency stop and physical safety policy drafting
- evidence log templates

These items are docs-only. None of them require StackChan to be present.

## Not Allowed Before StackChan Arrives

The following are not allowed until StackChan arrives and a separate explicit
human GO is issued:

- device connection (USB, serial, Wi-Fi)
- servo or motor motion control
- robot runtime implementation
- robot behavior testing
- expression display testing on real hardware
- voice/camera/mic integration
- audio/visual hardware testing
- autonomous or semi-autonomous robot behavior
- any physical interaction with StackChan

## Robot Track Two-Stage Split

The Robot Track is split into two stages:

### Robot Preparation 100%

Can be completed before StackChan arrives:

| Item | Status |
|---|---|
| Robot scope definition | in progress (FINAL docs) |
| Physical safety checklist | to do |
| Expression design concepts | to do |
| Future connection GO wording | to do |
| Future observation GO wording | to do |
| Emergency stop policy | to do |
| Evidence log templates | to do |

### Robot Runtime 100%

HOLD until StackChan arrives and human issues a separate explicit GO.

| Item | Status |
|---|---|
| Device connection | HOLD |
| Expression display on hardware | HOLD |
| Motion test | HOLD |
| Servo/motor behavior | HOLD |
| Voice/camera/mic integration | HOLD |
| Physical interaction | HOLD |
| Autonomous behavior | HOLD |

## Non-Approval Statement

This document does not approve robot implementation, robot connection, robot
motion, device testing, servo control, voice/camera/mic, runtime behavior,
Level 2 execution, Level 3, productionReady true, execution enabled, or git push.

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- StackChan connection: not approved
- robot runtime: not approved
- Level 2: not approved
- Level 3: not approved
- future_git_push: not approved
