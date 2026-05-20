# OBS-LIB-03 Report Image Export Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — HTML/React preview implemented; PNG export HOLD
**gate:** PNG export requires separate dependency check + OB-01 gate

---

## Article-Style Report Concept

The report should look like a real-world report or article page:

```text
Layout sections (portrait):
  ┌─────────────────────────────┐
  │ [Category Badge]   [Date]   │
  │                             │
  │ Title (large, bold)         │
  │                             │
  │ ┌─ Summary Card ──────────┐ │
  │ │ summary text            │ │
  │ └─────────────────────────┘ │
  │                             │
  │ Main Points                 │
  │ text...                     │
  │                             │
  │ gate: XS-01  commit: 2af99c │
  │                             │
  │─────────────────────────────│
  │ safety: productionReady:false│
  └─────────────────────────────┘
```

---

## Current Implementation

```yaml
html_react_preview: IMPLEMENTED (LibraryReportPreview.tsx)
png_export:         HOLD — next step
```

The HTML/React preview renders the full article layout using styled React components with a white/light background, category-colored badge, and safety footer.

---

## PNG Export Rendering Approach (HOLD)

Options to implement PNG export without new packages:

1. **Electron `webContents.capturePage()`** — captures a region of the app window. Already available in Electron. No new package. Requires main/IPC coordination.
2. **`window.print()` / CSS print layout** — print-to-PDF (not PNG). Electron supports this natively.
3. **Canvas / OffscreenCanvas** — browser native. Complex for styled HTML.

Recommended approach when OBS-LIB-03 opens:
- Option 1: IPC channel → main captures preview area → returns PNG bytes → renderer saves locally

---

## Dependency Policy

```text
FORBIDDEN without separate dependency GO:
  html2canvas
  puppeteer
  canvas npm package
  any new image processing package
```

Electron built-in `capturePage()` does NOT require new packages.

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
png_export:         HOLD
external_publish:   forbidden
cloud_upload:       forbidden
```
