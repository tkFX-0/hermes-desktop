/**
 * CommandPalette — Ctrl+K keyboard-driven page navigator.
 * Navigation only. No execution, no external calls.
 * Opens via isOpen prop; closes via onClose callback.
 */

import { useState, useEffect, useRef } from "react";
import type { PageId } from "../../../../shared/ichikishima/ui-page-types";
import { PAGE_CONTRACTS } from "../../../../shared/ichikishima/ui-page-types";

interface CommandPaletteProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onNavigate: (page: PageId) => void;
  readonly lang?: "ja" | "en";
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  lang = "ja",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [focusIndex, setFocusIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = PAGE_CONTRACTS.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.id.includes(q) ||
      p.labelJa.includes(q) ||
      p.labelEn.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setFocusIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    setFocusIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[focusIndex]) {
        onNavigate(filtered[focusIndex]!.id);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, focusIndex, filtered, onNavigate, onClose]);

  if (!isOpen) return null;

  const placeholder = lang === "ja" ? "ページ名で検索…" : "Search pages…";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 900,
        }}
      />

      {/* Palette */}
      <div
        role="dialog"
        aria-label={lang === "ja" ? "コマンドパレット" : "Command palette"}
        aria-modal="true"
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(480px, 90vw)",
          background: "var(--paper, #ffffff)",
          border: "1px solid var(--rule, #d1d5db)",
          borderRadius: 6,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          zIndex: 901,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            borderBottom: "1px solid var(--rule, #e5e7eb)",
          }}
        >
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 12,
              color: "var(--ink3, #9ca3af)",
            }}
            aria-hidden
          >
            /
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            style={{
              flex: 1,
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 13,
              color: "var(--ink, #111827)",
              background: "none",
              border: "none",
              outline: "none",
              padding: 0,
            }}
          />
          <kbd
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 10,
              color: "var(--ink3, #9ca3af)",
              border: "1px solid var(--rule, #d1d5db)",
              borderRadius: 3,
              padding: "2px 6px",
            }}
          >
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div
          role="listbox"
          aria-label={lang === "ja" ? "ページ一覧" : "Page list"}
          style={{
            maxHeight: 320,
            overflowY: "auto",
            padding: "4px 0",
          }}
        >
          {filtered.length === 0 ? (
            <p
              style={{
                fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
                fontSize: 11,
                color: "var(--ink3, #9ca3af)",
                margin: 0,
                padding: "12px 16px",
              }}
            >
              {lang === "ja" ? "一致するページなし" : "No matching pages"}
            </p>
          ) : (
            filtered.map((page, i) => (
              <button
                key={page.id}
                type="button"
                role="option"
                aria-selected={i === focusIndex}
                onClick={() => {
                  onNavigate(page.id);
                  onClose();
                }}
                onMouseEnter={() => setFocusIndex(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "9px 16px",
                  background: i === focusIndex ? "var(--paper2, #f3f4f6)" : "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                    fontSize: 10,
                    color: "var(--ink3, #9ca3af)",
                    minWidth: 70,
                    flexShrink: 0,
                  }}
                >
                  {page.id}
                </span>
                <span
                  style={{
                    fontFamily:
                      lang === "en"
                        ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                        : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
                    fontSize: 12,
                    color: "var(--ink, #111827)",
                    flex: 1,
                  }}
                >
                  {lang === "ja" ? page.labelJa : page.labelEn}
                </span>
                {i === focusIndex && (
                  <kbd
                    style={{
                      fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                      fontSize: 9,
                      color: "var(--ink3, #9ca3af)",
                      border: "1px solid var(--rule, #d1d5db)",
                      borderRadius: 3,
                      padding: "1px 5px",
                      flexShrink: 0,
                    }}
                    aria-hidden
                  >
                    ↵
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid var(--rule, #e5e7eb)",
            padding: "6px 14px",
            display: "flex",
            gap: 12,
          }}
        >
          {[
            { key: "↑↓", label: lang === "ja" ? "移動" : "Navigate" },
            { key: "↵", label: lang === "ja" ? "移動" : "Go" },
            { key: "Esc", label: lang === "ja" ? "閉じる" : "Close" },
          ].map(({ key, label }) => (
            <span
              key={key}
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 9,
                color: "var(--ink3, #9ca3af)",
              }}
            >
              <kbd
                style={{
                  border: "1px solid var(--rule, #d1d5db)",
                  borderRadius: 3,
                  padding: "1px 5px",
                  marginRight: 4,
                  background: "var(--paper2, #f3f4f6)",
                }}
              >
                {key}
              </kbd>
              {label}
            </span>
          ))}
          <span style={{ flex: 1 }} />
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 9,
              color: "var(--ink3, #9ca3af)",
            }}
          >
            {lang === "ja" ? "ナビゲーションのみ" : "navigation only"}
          </span>
        </div>
      </div>
    </>
  );
}
