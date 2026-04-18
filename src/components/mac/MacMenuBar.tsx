"use client";

import { useEffect, useState } from "react";
import PixelMark from "./PixelMark";

type Variant = "classic" | "aqua" | "hybrid";

export default function MacMenuBar({ variant, appName = "Finder" }: { variant: Variant; appName?: string }) {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mac-menubar">
      <span className="apple-mark" style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
        <PixelMark size={13} />
      </span>
      <span className="mac-menubar-item" style={{ fontWeight: 700 }}>{appName}</span>
      <span className="mac-menubar-item">File</span>
      <span className="mac-menubar-item">Edit</span>
      <span className="mac-menubar-item">View</span>
      <span className="mac-menubar-item">Special</span>
      <span className="mac-menubar-item">Help</span>
      <span className="mac-menubar-spacer" />
      <span
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          opacity: 0.6,
          textTransform: "uppercase",
        }}
      >
        {variant}
      </span>
      <span className="mac-menubar-clock">{clock || "—"}</span>
    </div>
  );
}
