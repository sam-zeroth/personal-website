"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const root = isMobile ? null : document.getElementById("writings-scroll");
    const target: HTMLElement | Window = root ?? window;

    function compute() {
      const article = document.querySelector("article");
      if (!article) return;
      const scrollY = root ? root.scrollTop : window.scrollY;
      const viewportH = root ? root.clientHeight : window.innerHeight;
      const articleTop = root
        ? article.offsetTop
        : article.getBoundingClientRect().top + window.scrollY;
      const total = Math.max(1, article.scrollHeight - viewportH);
      const scrolled = scrollY - articleTop;
      const pct = Math.min(Math.max((scrolled / total) * 100, 0), 100);
      setProgress(pct);
    }

    compute();
    target.addEventListener("scroll", compute, { passive: true } as AddEventListenerOptions);
    window.addEventListener("resize", compute);
    return () => {
      target.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div
      className="writings-reading-progress"
      style={{ width: `${progress}%` }}
    />
  );
}
