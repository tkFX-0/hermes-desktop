import "./assets/main.css";
import "./assets/command-center-tokens.css";

import { StrictMode } from "react";

// Ctrl+wheel zoom (persisted via localStorage, Ctrl+0 to reset)
{
  const STEP = 0.1;
  const MIN = 0.5;
  const MAX = 2.5;
  const KEY = "cc-zoom";

  const clamp = (v: number) => Math.round(Math.min(MAX, Math.max(MIN, v)) * 10) / 10;
  const apply = (level: number) => {
    document.documentElement.style.zoom = String(level);
    localStorage.setItem(KEY, String(level));
  };

  apply(clamp(parseFloat(localStorage.getItem(KEY) ?? "1")));

  window.addEventListener("wheel", (e: WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const cur = parseFloat(document.documentElement.style.zoom || "1");
    apply(clamp(cur + (e.deltaY < 0 ? STEP : -STEP)));
  }, { passive: false });

  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "0") { e.preventDefault(); apply(1.0); }
  });
}
import { createRoot } from "react-dom/client";
import App from "./App";
import { I18nProvider } from "./components/I18nProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
