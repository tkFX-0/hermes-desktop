# Face Terminal Expression Protocol Draft

## Purpose

This is a non-executable draft for a future expression protocol. It is not a
runtime schema, implementation approval, or robot control approval.

## Draft Message Shape

```json
{
  "type": "expression",
  "face": "neutral",
  "mouth": "idle",
  "eyes": "center",
  "message": "HOLD"
}
```

## Allowed Values Draft

| Field | Draft examples | Notes |
|---|---|---|
| type | expression | expression-only |
| face | neutral, listening, thinking | no identity |
| mouth | idle, small_smile | no speech synthesis implied |
| eyes | center, blink | no camera tracking implied |
| message | HOLD, review, idle | status text only |

## Boundary

- Documentation only.
- Not runtime schema.
- Not implementation approval.
- Not StackChan firmware approval.
- Not robot motion approval.

この範囲では問題を検出していません。
