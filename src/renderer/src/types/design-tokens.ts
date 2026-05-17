/**
 * Command Center UI — design token types.
 * Mirrors the CSS variables defined in docs/shikishima/design/final-command-center/source/index.html.
 * Type-only. No runtime behavior. No imports.
 */

// ─── CSS Variable Keys ───────────────────────────────────────────────────────

/** All CSS custom property names used by the Command Center design system. */
export type CSSVar =
  // Surface
  | "--paper"
  | "--paper2"
  | "--paper3"
  // Text
  | "--ink"
  | "--ink2"
  | "--ink3"
  // Structure
  | "--rule"
  | "--bar"
  | "--bar-text"
  | "--bar-text-2"
  // State accent colors
  | "--hold"
  | "--hold-soft"
  | "--go"
  | "--go-soft"
  | "--pass"
  | "--pass-soft"
  | "--stop"
  | "--stop-soft"
  | "--reject"
  | "--reject-soft";

// ─── Theme ───────────────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark" | "auto";

export const DEFAULT_THEME: ThemeMode = "light";

// ─── Font Families ───────────────────────────────────────────────────────────

/** The three font families used by the design system. */
export type FontFamily = "jp" | "sans" | "mono";

/**
 * Font-family CSS values by key.
 * jp:   Japanese UI text (Noto Sans JP first)
 * sans: Western UI text (IBM Plex Sans first)
 * mono: Code, data, status codes (IBM Plex Mono first)
 */
export const FONT_FAMILIES: Readonly<Record<FontFamily, string>> = {
  jp: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
  sans: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
  mono: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, Menlo, monospace',
} as const;

// ─── Breakpoints ─────────────────────────────────────────────────────────────

export type BreakpointKey = "mobile" | "tablet" | "desktop" | "wide";

/** Pixel widths for each breakpoint. */
export const BREAKPOINTS: Readonly<Record<BreakpointKey, number>> = {
  mobile: 393,   // iPhone 15 Pro target
  tablet: 768,   // portrait tablets (future)
  desktop: 1200, // PC operator base
  wide: 1400,    // Inspector / Workflow
} as const;

// ─── Spacing Scale ───────────────────────────────────────────────────────────

/** Approved spacing values (px) from the design system. */
export type SpacingValue = 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 28 | 32 | 36;

// ─── Border Radius ───────────────────────────────────────────────────────────

export type BorderRadius = 2 | 4;
