"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PersonalContent from "@/components/content/PersonalContent";
import WorkContent from "@/components/content/WorkContent";
import ContactContent from "@/components/content/ContactContent";

type AppKey = "personal" | "work" | "writings" | "contact";

interface WritingMeta {
  slug: string;
  title: string;
  tag: string;
  date: string;
  excerpt: string;
}

interface AppDef {
  key: AppKey;
  label: string;
  bg: string;
  ink: string;
  glyph: React.ReactNode;
}

const APPS: AppDef[] = [
  {
    key: "personal",
    label: "About",
    bg: "linear-gradient(180deg, oklch(0.9 0.14 290) 0%, oklch(0.58 0.18 295) 100%)",
    ink: "oklch(0.97 0 0)",
    glyph: (
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
      </svg>
    ),
  },
  {
    key: "work",
    label: "Work",
    bg: "linear-gradient(180deg, oklch(0.92 0.14 85) 0%, oklch(0.65 0.18 60) 100%)",
    ink: "oklch(0.2 0.06 70)",
    glyph: (
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <rect x="3" y="7" width="18" height="13" rx="1" />
        <path d="M3 11h18" />
      </svg>
    ),
  },
  {
    key: "writings",
    label: "Writings",
    bg: "linear-gradient(180deg, oklch(0.88 0.16 25) 0%, oklch(0.48 0.2 20) 100%)",
    ink: "oklch(0.98 0 0)",
    glyph: (
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h12l4 4v12H4z" />
        <path d="M8 10h8M8 14h8M8 18h5" />
      </svg>
    ),
  },
  {
    key: "contact",
    label: "Contact",
    bg: "linear-gradient(180deg, oklch(0.9 0.18 145) 0%, oklch(0.52 0.18 155) 100%)",
    ink: "oklch(0.16 0.05 145)",
    glyph: (
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

function useClock() {
  const [t, setT] = useState("9:41");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setT(d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false }));
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function StatusBar() {
  const time = useClock();
  return (
    <div className="ios-status">
      <span className="ios-status-time">{time}</span>
      <div className="ios-status-right">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor" aria-hidden>
          <circle cx="2" cy="9" r="1.2" />
          <circle cx="6" cy="9" r="1.2" />
          <circle cx="10" cy="9" r="1.2" />
          <circle cx="14" cy="9" r="1.2" />
        </svg>
        <span style={{ fontSize: 12, fontWeight: 600 }}>AT&amp;T</span>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <path d="M9 2c3 0 5.5 1 7.5 3l-1.5 1.5C13.3 5 11.2 4 9 4S4.7 5 3 6.5L1.5 5C3.5 3 6 2 9 2zm0 3c2 0 3.8.7 5.3 2L13 8.5C12 7.5 10.6 7 9 7s-3 .5-4 1.5L3.7 7C5.2 5.7 7 5 9 5zm0 3c.9 0 1.7.3 2.4.9L9 11 6.6 8.9C7.3 8.3 8.1 8 9 8z" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden>
          <rect x="0.5" y="1" width="22" height="10" rx="2" stroke="currentColor" />
          <rect x="2" y="2.5" width="18" height="7" rx="1" fill="currentColor" />
          <rect x="23" y="4" width="2" height="4" rx="0.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

interface Props {
  writings?: WritingMeta[];
}

export default function PhoneHome({ writings = [] }: Props) {
  const [open, setOpen] = useState<AppKey | null>(null);
  const time = useClock();

  return (
    <>
      <div className="ios-stage">
        <div className="ios-wallpaper" />
        <StatusBar />

        <div
          style={{
            position: "absolute",
            top: "calc(var(--safe-top) + 30px)",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "oklch(1 0 0)",
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <div className="ios-clock">{time}</div>
          <div className="ios-date">sam.os</div>
        </div>

        <div className="ios-app-grid">
          {APPS.map((app) => (
            <button
              key={app.key}
              type="button"
              className="ios-app"
              onClick={() => setOpen(app.key)}
              aria-label={`Open ${app.label}`}
            >
              <div
                className="ios-app-icon"
                style={{ background: app.bg, color: app.ink }}
              >
                <div className="ios-app-icon-gloss" />
                {app.glyph}
              </div>
              <span className="ios-app-label">{app.label}</span>
            </button>
          ))}
        </div>

        <div className="ios-dock">
          <div className="ios-dock-inner">
            {[
              { label: "Mail", bg: "linear-gradient(180deg, oklch(0.9 0.09 235), oklch(0.55 0.15 240))", glyph: "✉" },
              { label: "Safari", bg: "linear-gradient(180deg, oklch(0.92 0.1 240), oklch(0.48 0.18 245))", glyph: "🧭" },
              { label: "Notes", bg: "linear-gradient(180deg, oklch(0.95 0.1 85), oklch(0.78 0.16 70))", glyph: "✎" },
              { label: "Clock", bg: "linear-gradient(180deg, oklch(0.35 0 0), oklch(0.1 0 0))", glyph: "⏱" },
            ].map((d, i) => (
              <div key={i} className="ios-dock-app">
                <div className="ios-dock-icon" style={{ background: d.bg }}>
                  <div className="ios-app-icon-gloss" />
                  <span style={{ fontSize: 28, color: "oklch(0.97 0 0)" }}>{d.glyph}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ios-home-indicator" />
      </div>

      {open && (
        <IOSApp
          appKey={open}
          onClose={() => setOpen(null)}
          writings={writings}
        />
      )}
    </>
  );
}

function IOSApp({
  appKey,
  onClose,
  writings,
}: {
  appKey: AppKey;
  onClose: () => void;
  writings: WritingMeta[];
}) {
  const titles: Record<AppKey, string> = {
    personal: "About",
    work: "Work",
    writings: "Writings",
    contact: "Contact",
  };

  let body: React.ReactNode;
  switch (appKey) {
    case "personal": body = <PersonalContent />; break;
    case "work": body = <WorkContent />; break;
    case "contact": body = <ContactContent />; break;
    case "writings":
      body = (
        <div>
          <p style={{ fontSize: 15, color: "oklch(0.38 0 0)", marginBottom: 20 }}>
            Essays, technical posts, and things I&apos;m thinking about.
          </p>
          {writings.map((w) => (
            <Link
              key={w.slug}
              href={`/writings/${w.slug}`}
              className="ios-list-row"
            >
              <div>
                <div className="ios-list-row-title">{w.title}</div>
                <div className="ios-list-row-meta">
                  {w.tag} · {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="ios-list-row-excerpt">{w.excerpt}</div>
              </div>
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M1 1 L9 8 L1 15" />
              </svg>
            </Link>
          ))}
        </div>
      );
  }

  return (
    <div className="ios-app-view" role="dialog" aria-label={titles[appKey]}>
      <div className="ios-navbar">
        <button type="button" className="ios-back" onClick={onClose} aria-label="Back">
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 2 L2 10 L12 18" />
          </svg>
          <span>Home</span>
        </button>
        <div className="ios-navbar-title">{titles[appKey]}</div>
        <div style={{ width: 60 }} />
      </div>
      <div className="ios-app-body">{body}</div>
    </div>
  );
}
