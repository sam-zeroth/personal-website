"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import MacMenuBar from "@/components/mac/MacMenuBar";
import MacWindow from "@/components/mac/MacWindow";
import {
  FolderIcon,
  PersonIcon,
  BriefcaseIcon,
  PhoneIcon,
  DocumentIcon,
  TrashIcon,
} from "@/components/mac/icons";
import PersonalContent from "@/components/content/PersonalContent";
import WorkContent from "@/components/content/WorkContent";
import ContactContent from "@/components/content/ContactContent";
import ReadmeContent from "@/components/content/ReadmeContent";

type WindowKey = "personal" | "work" | "contact" | "writings-folder" | "readme";

interface OpenWindow {
  key: WindowKey;
  z: number;
  initial: { x: number; y: number; w: number; h: number };
}

interface AquaDesktopProps {
  writings: {
    slug: string;
    title: string;
    tag: string;
    date: string;
    excerpt: string;
  }[];
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function iconCoords(index: number) {
  return { top: 24 + index * 104, right: 24 };
}

export default function AquaDesktop({ writings }: AquaDesktopProps) {
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const [maxZ, setMaxZ] = useState(100);

  const spawnWindow = useCallback(
    (key: WindowKey) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.key === key);
        const newZ = maxZ + 1;
        setMaxZ(newZ);
        if (existing) {
          return prev.map((w) => (w.key === key ? { ...w, z: newZ } : w));
        }
        const defaults: Record<WindowKey, OpenWindow["initial"]> = {
          personal: { x: 80, y: 70, w: 620, h: 620 },
          work: { x: 140, y: 100, w: 620, h: 600 },
          contact: { x: 200, y: 130, w: 540, h: 560 },
          "writings-folder": { x: 100, y: 80, w: 720, h: 440 },
          readme: { x: 110, y: 90, w: 560, h: 620 },
        };
        const base = defaults[key];
        // Random spawn: bounded jitter so windows land somewhere
        // believable on the desktop each time, without running off-screen.
        const marginX = 40;
        const marginTop = 44;
        const marginBottom = 32;
        const maxX = Math.max(marginX, window.innerWidth - base.w - marginX);
        const maxY = Math.max(marginTop, window.innerHeight - base.h - marginBottom);
        const x = Math.round(marginX + Math.random() * (maxX - marginX));
        const y = Math.round(marginTop + Math.random() * (maxY - marginTop));
        return [
          ...prev,
          {
            key,
            z: newZ,
            initial: { ...base, x, y },
          },
        ];
      });
    },
    [maxZ]
  );

  const closeWindow = useCallback((key: WindowKey) => {
    setWindows((prev) => prev.filter((w) => w.key !== key));
  }, []);

  const focusWindow = useCallback(
    (key: WindowKey) => {
      const newZ = maxZ + 1;
      setMaxZ(newZ);
      setWindows((prev) => prev.map((w) => (w.key === key ? { ...w, z: newZ } : w)));
    },
    [maxZ]
  );

  const titleFor = (key: WindowKey) => {
    switch (key) {
      case "personal": return "About Sam";
      case "work": return "Projects";
      case "contact": return "Rolodex";
      case "writings-folder": return "Writings";
      case "readme": return "README.txt";
    }
  };

  const renderBody = (key: WindowKey) => {
    const wrap = (children: React.ReactNode) => (
      <div
        style={{
          padding: "28px 32px 36px",
          fontFamily: "var(--font-serif), Georgia, serif",
          color: "oklch(0.15 0 0)",
        }}
      >
        {children}
      </div>
    );

    switch (key) {
      case "personal":
        return wrap(<PersonalContent />);
      case "work":
        return wrap(<WorkContent />);
      case "contact":
        return wrap(<ContactContent />);
      case "readme":
        return wrap(<ReadmeContent />);
      case "writings-folder":
        return (
          <div>
            <div className="mac-finder-toolbar" style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Writings</span>
              <span style={{ marginLeft: "auto", opacity: 0.6 }}>
                {writings.length} {writings.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="mac-finder-header">
              <span />
              <span>Name</span>
              <span style={{ textAlign: "right" }}>Tag</span>
              <span style={{ textAlign: "right" }}>Date</span>
            </div>
            <div className="mac-finder-list">
              {writings.map((w) => (
                <Link
                  key={w.slug}
                  href={`/writings/${w.slug}`}
                  className="mac-finder-row"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span style={{ display: "inline-flex" }}>
                    <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden>
                      <rect x="6" y="3" width="17" height="26" fill="oklch(0.97 0.01 90)" stroke="oklch(0.12 0 0)" strokeWidth="1.2" />
                      <path d="M23 3 L23 8 L28 8 L23 3" fill="oklch(0.85 0 0)" stroke="oklch(0.12 0 0)" strokeWidth="1.2" />
                      {[11, 14, 17, 20, 23].map((y) => (
                        <line key={y} x1="9" y1={y} x2={y === 23 ? 18 : 20} y2={y} stroke="oklch(0.3 0 0)" strokeWidth="0.8" />
                      ))}
                    </svg>
                  </span>
                  <span>{w.title}</span>
                  <span className="mac-finder-row-meta">{w.tag}</span>
                  <span className="mac-finder-row-meta">{formatDate(w.date)}</span>
                </Link>
              ))}
            </div>
            <div
              style={{
                padding: "12px 14px",
                fontFamily: "var(--font-pixelify), system-ui",
                fontSize: 12,
                opacity: 0.55,
                textAlign: "center",
              }}
            >
              Open an article to read the full essay
            </div>
          </div>
        );
    }
  };

  const appName = windows.length
    ? titleFor(windows[windows.length - 1].key) || "Finder"
    : "Finder";

  return (
    <div className="mac-stage variant-aqua">
      <MacMenuBar variant="aqua" appName={appName} />

      {/* Desktop icons */}
      <div style={{ position: "absolute", inset: 0, zIndex: 15 }}>
        {[
          { key: "personal" as const, label: "About Me", render: () => <PersonIcon /> },
          { key: "work" as const, label: "Work", render: () => <BriefcaseIcon /> },
          { key: "writings-folder" as const, label: "Writings", render: () => <FolderIcon variant="aqua" /> },
          { key: "contact" as const, label: "Contact", render: () => <PhoneIcon /> },
        ].map((icon, i) => {
          const { top, right } = iconCoords(i);
          return (
            <button
              key={icon.key}
              type="button"
              className="mac-icon"
              style={{ position: "absolute", top, right }}
              onDoubleClick={() => spawnWindow(icon.key)}
              onClick={() => spawnWindow(icon.key)}
              aria-label={`Open ${icon.label}`}
            >
              <span className="mac-icon-glyph">{icon.render()}</span>
              <span className="mac-icon-label">{icon.label}</span>
            </button>
          );
        })}

        {/* Trash */}
        <div style={{ position: "absolute", bottom: 28, right: 28, zIndex: 15 }}>
          <div className="mac-icon" style={{ cursor: "default" }}>
            <span className="mac-icon-glyph">
              <TrashIcon />
            </span>
            <span className="mac-icon-label">Trash</span>
          </div>
        </div>

        {/* README */}
        <div style={{ position: "absolute", top: 24, left: 28, zIndex: 15 }}>
          <button
            type="button"
            className="mac-icon"
            onDoubleClick={() => spawnWindow("readme")}
            onClick={() => spawnWindow("readme")}
            aria-label="Open README"
          >
            <span className="mac-icon-glyph">
              <DocumentIcon />
            </span>
            <span className="mac-icon-label">README.txt</span>
          </button>
        </div>
      </div>

      {/* Open windows */}
      {windows.map((w) => (
        <MacWindow
          key={w.key}
          variant="aqua"
          title={titleFor(w.key) || ""}
          zIndex={w.z}
          initial={w.initial}
          onClose={() => closeWindow(w.key)}
          onFocus={() => focusWindow(w.key)}
        >
          {renderBody(w.key)}
        </MacWindow>
      ))}
    </div>
  );
}
