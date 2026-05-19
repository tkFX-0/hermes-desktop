# XS-READ Social Awareness Read-Only Gate Plan

## Purpose

XS-READ defines a future read-only gate for x_search and social awareness.

This document does not approve x_search execution. It only records the boundary for future use.

## Default Status

x_search and social reading are HOLD / NEEDS_HUMAN by default.

They are not permanently forbidden. They can become allowed under an explicit read-only GO.

## Future Read-Only Actions

With explicit human GO, Shikishima may:

- search X / social sources
- read public posts
- collect public social information
- summarize
- suggest
- draft replies/posts for human review

## Still Forbidden Without Separate Human GO

- post
- reply
- DM
- like
- follow
- edit profile
- send message
- perform any social write action

## Required XS-READ GO Fields

```yaml
xs_read_go:
  source:
  purpose:
  query_or_topic_scope:
  time_window:
  read_only: true
  allowed_outputs:
  raw_value_policy:
  stop_conditions:
  evidence_requirement:
```

## Relation to Naruebi-Style Observation

Social awareness is an observation layer:

- notice public signals
- summarize context
- suggest next steps
- draft possible human-facing responses

It is not an autonomous social actor.

## Evidence and Source Summary Requirement

Every read-only social run should record:

- source type
- query/topic scope
- time window
- summary
- risk/caveat notes
- no social write performed
- next human decision

Do not record raw tokens, credentials, private account details, or local-only values.

## Plain-Language Rule

SNSを読む・調べる・まとめる・下書きするのは将来GO対象。

SNSに書く・返す・送る・反応するのは別GO必須。

## Safety Boundary

- social read: future read-only GO required
- social write: separate GO / HARD STOP by default
- OAuth: separate human GO
- productionReady: false
- execution: disabled
