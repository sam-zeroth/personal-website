"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
    ink: "oklch(0.99 0 0)",
    glyph: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
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
    ink: "oklch(0.99 0 0)",
    glyph: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

// Decorative dock apps — not interactive, just for visual completeness
// so the home screen reads as a real iPhone.
interface DockApp {
  label: string;
  bg: string;
  glyph: React.ReactNode;
}

const DOCK_APPS: DockApp[] = [
  {
    label: "Phone",
    bg: "linear-gradient(180deg, oklch(0.82 0.2 145) 0%, oklch(0.5 0.22 150) 100%)",
    glyph: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="oklch(0.99 0 0)" aria-hidden>
        <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.1 15.1 0 0 1-6.59-6.59l2.2-2.2a1 1 0 0 0 .25-1.02A11.4 11.4 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z" />
      </svg>
    ),
  },
  {
    label: "Safari",
    bg: "radial-gradient(circle at 50% 50%, oklch(0.92 0.07 235) 0%, oklch(0.65 0.15 240) 55%, oklch(0.38 0.17 245) 100%)",
    glyph: (
      <svg width="52" height="52" viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r="16.5" fill="oklch(0.96 0.005 230)" />
        <g stroke="oklch(0.4 0 0)" strokeWidth="0.7" strokeLinecap="round">
          <line x1="20" y1="6" x2="20" y2="8" />
          <line x1="20" y1="32" x2="20" y2="34" />
          <line x1="6" y1="20" x2="8" y2="20" />
          <line x1="32" y1="20" x2="34" y2="20" />
        </g>
        <g transform="rotate(45 20 20)">
          <path d="M20 7.5 L22.6 20 L17.4 20 Z" fill="oklch(0.55 0.22 25)" />
          <path d="M20 32.5 L22.6 20 L17.4 20 Z" fill="oklch(0.98 0 0)" stroke="oklch(0.45 0 0)" strokeWidth="0.25" />
        </g>
        <circle cx="20" cy="20" r="1.3" fill="oklch(0.15 0 0)" />
      </svg>
    ),
  },
  {
    label: "Messages",
    bg: "linear-gradient(180deg, oklch(0.82 0.2 145) 0%, oklch(0.55 0.22 150) 100%)",
    glyph: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="oklch(0.99 0 0)" aria-hidden>
        <path d="M12 3C6.48 3 2 6.58 2 11c0 2.4 1.32 4.55 3.42 6.02-.18 1.2-.82 2.35-1.64 3.2-.18.2-.02.51.25.48 2.04-.24 3.94-1.06 5.22-2.32.88.26 1.8.4 2.75.4 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    bg: "linear-gradient(180deg, oklch(0.8 0 0) 0%, oklch(0.45 0 0) 100%)",
    glyph: (
      <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="oklch(0.98 0 0)"
          d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.61l-1.92-3.32a.5.5 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54A.49.49 0 0 0 13.9 2h-3.84a.49.49 0 0 0-.49.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.59.22L2.69 8.48a.5.5 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94 0 .32.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.61l1.92 3.32c.12.22.37.3.59.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54a.49.49 0 0 0 .49.42h3.84a.49.49 0 0 0 .49-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96a.5.5 0 0 0 .59-.22l1.92-3.32a.5.5 0 0 0-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"
        />
      </svg>
    ),
  },
];

interface ClockState {
  timeCompact: string;
  ampm: string;
  dayShort: string;
  dateNum: number;
  monthLong: string;
}

function useClock(): ClockState {
  const [clock, setClock] = useState<ClockState>({
    timeCompact: "3:23",
    ampm: "PM",
    dayShort: "Wed",
    dateNum: 18,
    monthLong: "April",
  });
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const raw = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const [t, a] = raw.split(" ");
      setClock({
        timeCompact: t,
        ampm: a ?? "",
        dayShort: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: d.getDate(),
        monthLong: d.toLocaleDateString("en-US", { month: "long" }),
      });
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

function HomeWidgets() {
  const c = useClock();
  return (
    <div className="ios-widget-row">
      <div className="ios-widget">
        <span className="ios-widget-eyebrow ios-widget-eyebrow--cal">{c.dayShort}</span>
        <div className="ios-widget-primary ios-widget-primary--bold">{c.dateNum}</div>
        <span className="ios-widget-foot">{c.monthLong}</span>
      </div>
      <div className="ios-widget">
        <span className="ios-widget-eyebrow ios-widget-eyebrow--clock">Time</span>
        <div className="ios-widget-primary">{c.timeCompact}</div>
        <span className="ios-widget-foot">
          New York · {c.timeCompact} {c.ampm}
        </span>
      </div>
    </div>
  );
}

interface Props {
  writings?: WritingMeta[];
}

export default function PhoneHome({ writings = [] }: Props) {
  const [open, setOpen] = useState<AppKey | null>(null);

  return (
    <>
      <div className="ios-stage">
        <div className="ios-wallpaper" />

        <HomeWidgets />

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
                {app.glyph}
              </div>
              <span className="ios-app-label">{app.label}</span>
            </button>
          ))}
        </div>

        <div className="ios-dock" aria-hidden>
          {DOCK_APPS.map((d) => (
            <div
              key={d.label}
              className="ios-dock-icon"
              style={{ background: d.bg }}
            >
              {d.glyph}
            </div>
          ))}
        </div>
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

/* ─── Mobile editorial content ───
   These are mobile-specific renderers. Desktop Mac windows use the
   components in src/components/content/ — those keep the Pixelify/
   Mac chrome look. Mobile gets the Reader/Editorial palette defined
   by the .ed-* classes in globals.css. */

const PERSONAL_TIMELINE = [
  { period: "Now", title: "Zeroth Technology", desc: "Building Pyrana — an Enterprise Agent Orchestration Platform. Working on the frontier of AI systems and multi-agent coordination." },
  { period: "Previously", title: "Kenvue (J&J spin-off)", desc: "AdTech — built novel algorithms to improve advertising targeting and spend optimization." },
  { period: "Previously", title: "Johnson & Johnson", desc: "Corporate Technology & MedTech — engineering across enterprise systems and medical technology platforms." },
  { period: "Previously", title: "Genentech", desc: "Data Management — working with biotech data systems at one of the world's leading biotechnology companies." },
];

function MobilePersonal() {
  return (
    <article>
      <span className="ed-kicker">About</span>
      <h1 className="ed-title">Hi, I&apos;m Sam.</h1>
      <hr className="ed-rule" />
      <p className="ed-body">
        Northeastern grad — BS in Computer Science and Philosophy. Deeply interested
        in the intersections of mind, computation, and logic. Currently building AI agent
        infrastructure at Zeroth Technology. Always reading, always learning.
      </p>
      <p className="ed-body">
        I grew up curious about how things think — brains, machines, languages, and lately
        the systems we build that seem to do a bit of both.
      </p>

      <span className="ed-section-label">Résumé</span>
      {PERSONAL_TIMELINE.map((item) => (
        <div key={item.title} className="ed-timeline-item">
          <div className="ed-timeline-head">
            <div className="ed-timeline-title">{item.title}</div>
            <div className="ed-timeline-period">{item.period}</div>
          </div>
          <div className="ed-timeline-desc">{item.desc}</div>
        </div>
      ))}

      <a
        href="https://www.linkedin.com/in/sam-merkovitz/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginTop: 20,
          padding: "10px 16px",
          border: "0.5px solid oklch(0.55 0.06 40 / 0.5)",
          borderRadius: 6,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 14,
          color: "oklch(0.28 0.08 35)",
          textDecoration: "none",
          background: "oklch(0.96 0.015 75)",
        }}
      >
        Connect on LinkedIn →
      </a>
    </article>
  );
}

const WORK_PROJECTS = [
  {
    title: "Pyrana",
    url: "https://pyrana.ai",
    status: "Building",
    description:
      "Agent orchestration platform for building, deploying, and managing AI agent workflows at scale. Structured outputs, governance-as-code, self-improving pipelines.",
    tech: ["Python", "TypeScript", "AI Agents"],
  },
];

const WORK_STACK = [
  "Python", "TypeScript", "React", "Next.js",
  "AI Agents", "LLMs", "SQL", "Systems Design",
  "Three.js", "Postgres", "Framer Motion",
];

function MobileWork() {
  return (
    <article>
      <span className="ed-kicker">Work</span>
      <h1 className="ed-title">Things I&apos;m building.</h1>
      <hr className="ed-rule" />
      <p className="ed-body">
        I work on systems that sit at the intersection of AI, agency, and governance —
        software that makes itself a little better every day.
      </p>

      <span className="ed-section-label">Projects</span>
      {WORK_PROJECTS.map((p) => (
        <a
          key={p.title}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ed-card"
          style={{ display: "block", textDecoration: "none", color: "inherit", marginBottom: 14 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 400, color: "oklch(0.15 0.02 40)" }}>
              {p.title} <span style={{ fontSize: 13, opacity: 0.55 }}>↗</span>
            </div>
            <span className="ed-status">{p.status}</span>
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.5, color: "oklch(0.3 0.02 40)", marginBottom: 10 }}>
            {p.description}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {p.tech.map((t) => (
              <span key={t} className="ed-tag">{t}</span>
            ))}
          </div>
        </a>
      ))}

      <span className="ed-section-label">Tools &amp; Stack</span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {WORK_STACK.map((s) => (
          <span key={s} className="ed-tag">{s}</span>
        ))}
      </div>
    </article>
  );
}

const CONTACT_LINKS = [
  { label: "Email", value: "hello@sammerk.io", href: "mailto:hello@sammerk.io", symbol: "✉" },
  { label: "GitHub", value: "github.com/sam-zeroth", href: "https://github.com/sam-zeroth", symbol: "⌘" },
  { label: "LinkedIn", value: "linkedin.com/in/sam-merkovitz", href: "https://www.linkedin.com/in/sam-merkovitz/", symbol: "in" },
  { label: "Twitter / X", value: "@sam_zeroth", href: "https://x.com/sam_zeroth", symbol: "✦" },
];

function MobileContact() {
  return (
    <article>
      <span className="ed-kicker">Contact</span>
      <h1 className="ed-title">Get in touch.</h1>
      <hr className="ed-rule" />
      <p className="ed-body">
        Always open to interesting conversations, collaborations, and new opportunities.
        Pick your channel.
      </p>

      <span className="ed-section-label">Channels</span>
      <div>
        {CONTACT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-link-row"
          >
            <div className="ed-link-glyph">{link.symbol}</div>
            <div>
              <div className="ed-link-label">{link.label}</div>
              <div className="ed-link-value">{link.value}</div>
            </div>
            <svg className="ed-chevron" width="8" height="13" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M1 1 L9 8 L1 15" />
            </svg>
          </a>
        ))}
      </div>

      <div className="ed-card" style={{ marginTop: 24 }}>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 16, color: "oklch(0.15 0.02 40)", marginBottom: 6 }}>
          Let&apos;s build something together.
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.5, color: "oklch(0.3 0.02 40)" }}>
          Whether it&apos;s a project idea, a collaboration, or just a chat about technology —
          I&apos;d love to hear from you.
        </div>
      </div>
    </article>
  );
}

function MobileWritings({ writings }: { writings: WritingMeta[] }) {
  return (
    <article>
      <span className="ed-kicker">Writings</span>
      <h1 className="ed-title">Essays &amp; thoughts.</h1>
      <hr className="ed-rule" />
      <p className="ed-body">
        Essays, technical posts, and things I&apos;m thinking about.
      </p>

      <div style={{ marginTop: 8 }}>
        {writings.map((w) => (
          <Link key={w.slug} href={`/writings/${w.slug}`} className="ios-list-row">
            <div>
              <div className="ios-list-row-title">{w.title}</div>
              <div className="ios-list-row-meta">
                {w.tag} · {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <div className="ios-list-row-excerpt">{w.excerpt}</div>
            </div>
            <svg width="8" height="13" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M1 1 L9 8 L1 15" />
            </svg>
          </Link>
        ))}
      </div>
    </article>
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
    case "personal": body = <MobilePersonal />; break;
    case "work": body = <MobileWork />; break;
    case "contact": body = <MobileContact />; break;
    case "writings": body = <MobileWritings writings={writings} />; break;
  }

  return (
    <div className="ios-app-view" role="dialog" aria-label={titles[appKey]}>
      <div className="ios-navbar">
        <button type="button" className="ios-back" onClick={onClose} aria-label="Back">
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 1 L1 8 L9 15" />
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
