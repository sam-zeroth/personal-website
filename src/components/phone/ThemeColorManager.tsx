"use client";

import { useEffect } from "react";

/**
 * Keeps <meta name="theme-color"> in sync with the currently visible
 * surface. iOS Safari tints the status bar and URL pill chrome with this
 * value, so matching it to the active surface makes the chrome visually
 * continuous with the page — since viewport-fit=cover doesn't reliably
 * let the page paint behind the chrome.
 *
 *   .ios-app-view present → cream (#faf5ea)
 *   .writings-page-root  → cream
 *   .ios-stage only      → black (#000000)
 *
 * The <meta name="color-scheme" content="light"> tag is also upserted
 * once, so Safari in dark-mode devices still honors light theme-colors.
 */
export default function ThemeColorManager() {
  useEffect(() => {
    let themeMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.name = "theme-color";
      document.head.appendChild(themeMeta);
    }

    let schemeMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="color-scheme"]',
    );
    if (!schemeMeta) {
      schemeMeta = document.createElement("meta");
      schemeMeta.name = "color-scheme";
      schemeMeta.content = "light";
      document.head.appendChild(schemeMeta);
    }

    const BLACK = "#000000";
    const CREAM = "#faf5ea";

    const apply = () => {
      const hasApp = document.querySelector(".ios-app-view");
      const hasWritings = document.querySelector(".writings-page-root");
      const next = hasApp || hasWritings ? CREAM : BLACK;
      if (themeMeta.content !== next) themeMeta.content = next;
    };

    apply();

    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
