# Face Design Safety Boundary

## Purpose

This document fixes the safety boundary for the v0.6.0 minimal dot-line face
design system.

The face system is a visual design direction only. It does not approve any
execution, device control, robot motion, camera use, microphone use, or
production readiness.

## Safe Scope

Allowed inside this documentation scope:

- describe dot-line face parts.
- describe static expression states.
- describe future mouth and eye animation concepts.
- describe smartphone display-only planning.
- describe future StackChan display-only adaptation.
- use redacted status fields.

## Forbidden By Default

- runtime implementation.
- audio or microphone wiring.
- camera upload.
- face recognition.
- user emotion inference.
- StackChan control.
- servo control.
- robot motion.
- autonomous expression control.
- executable schemas or device commands.
- GO transition.
- productionReady true.

## Approval Separation

Approving the face design does not approve:

- smartphone runtime implementation.
- StackChan display output.
- robot motion.
- audio input.
- camera input.
- execution.
- git push.
- production readiness.

## Required Current Status

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
