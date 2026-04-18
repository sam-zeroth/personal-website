# CLAUDE.md

Notes for future Claude Code sessions on this repo.

## What this is

Sam Merkovitz's personal site. The concept: the site IS an operating system.

- **Desktop**: Mac OS X Aqua (early-2000s era) — you see a menu bar,
  desktop icons, draggable / resizable / maximizable windows.
- **Mobile**: iOS 6 skeuomorphic home — a 2×2 grid of glossy app icons,
  a glass dock, iOS-style fullscreen app views.
- **Writings**: each article is a "document" — full-screen Mac doc on
  desktop, iOS Reader-style on mobile.

See `.impeccable.md` for the design brief. Read that before making
visual changes.

## Stack

- Next.js 16 (App Router, webpack mode)
- React 19
- TypeScript strict
- Tailwind v4 + a single `globals.css` with design tokens
- MDX via `next-mdx-remote` for writings
- `zustand` for the tiny bit of UI state (active window region)

No three.js, no framer-motion, no gsap — the old neural/brain scroll
experience was deleted on 2026-04-18 when the site pivoted to the Mac OS
metaphor. Don't reintroduce them unless the metaphor changes.

## Repo map

```
src/
├── app/
│   ├── layout.tsx            # loads fonts (Pixelify Sans, JetBrains Mono, Young Serif)
│   ├── page.tsx              # server-component entry — loads writings, hands to ClientGate
│   ├── globals.css           # ALL global styles (Mac + iOS + writings)
│   ├── opengraph-image.tsx
│   └── writings/
│       ├── layout.tsx        # sets #writings-scroll container + paper background
│       ├── page.tsx          # index
│       └── [slug]/
│           ├── page.tsx      # article (MDX compiled server-side)
│           └── ReadingProgress.tsx
├── components/
│   ├── content/              # section bodies rendered inside windows / iOS app views
│   │   ├── PersonalContent.tsx
│   │   ├── WorkContent.tsx
│   │   ├── WritingsContent.tsx   # (unused at runtime; kept for future)
│   │   └── ContactContent.tsx
│   ├── desktop/
│   │   ├── AquaDesktop.tsx   # assembles the Mac desktop experience
│   │   └── ClientGate.tsx    # client-side mobile/desktop switch
│   ├── mac/                  # Mac OS primitives
│   │   ├── MacMenuBar.tsx
│   │   ├── MacWindow.tsx     # draggable / resizable / maximizable / minimizable
│   │   └── icons.tsx         # folder, person, briefcase, phone, document, trash
│   └── phone/
│       └── PhoneHome.tsx     # iOS home + fullscreen app view (self-contained)
├── hooks/
│   └── useIsMobile.ts        # matchMedia-based viewport check
├── lib/
│   └── writings.ts           # MDX frontmatter parser + file listing
└── store/
    └── useStore.ts           # zustand: active region, navigate/goHome
content/
└── writings/                 # MDX essays
```

## Commands

```bash
npm run dev      # next dev --webpack (port 3000)
npm run build    # production build
npm run lint     # eslint
```

No test suite yet. Type-check with `npx tsc --noEmit`.

## Conventions

### Styling

- Global styles live in `src/app/globals.css`. There are three
  well-labeled sections: Mac desktop (`.mac-*`), iOS phone (`.ios-*`),
  and Writings (responsive, `.writings-*`). Keep new styles in the right
  section.
- Use OKLCH for any new color. Never pure black/white — always tint.
- Prefer design tokens (`--win-bg`, `--win-ink`, `--paper`, etc.) over
  raw colors when building new surfaces.
- Writings pages have distinct desktop (Mac paper) and mobile (iOS
  Reader) looks. The switch is a `@media (max-width: 639px)` block at
  the bottom of the writings section.

### Components

- New "window contents" go in `src/components/content/`. Keep them
  presentation-only — they render the same way whether they're inside a
  Mac window or an iOS app view.
- New OS primitives go in `src/components/mac/` (desktop) or
  `src/components/phone/` (mobile). Don't add a third chrome style.
- Follow the existing file-per-component pattern. Co-locate only if
  something is tightly coupled and very small.

### Writings

- Essays are MDX files in `content/writings/*.mdx` with frontmatter:
  ```
  ---
  title: "..."
  date: "YYYY-MM-DD"
  tag: "Essay"
  excerpt: "..."
  ---
  ```
- `src/lib/writings.ts` reads them server-side. Adding a new essay is
  just dropping a file into `content/writings/` — the Finder and the
  writings index pick it up automatically.

### State

- Client-side navigation uses a tiny zustand store (`useStore`). It
  tracks `activeRegion` ("personal" | "work" | "writings" | "contact" |
  null). On desktop, opening a window sets it; on mobile, tapping an app
  opens the corresponding view. Prefer this over prop drilling.
- No routing to internal section pages. The OS metaphor means sections
  live as windows/apps on `/`. Writings articles are the exception —
  they're real routes at `/writings/[slug]`.

## Design rules (condensed — read `.impeccable.md` for full context)

1. Commit to the Mac OS / iOS metaphor. No hybrid or generic web chrome.
2. Traffic lights are the only vivid colors on the desktop.
3. Pixelify Sans for chrome/headings, JetBrains Mono for labels, Young
   Serif for body (desktop) / Georgia on mobile.
4. `@media (max-width: 639px)` is the phone breakpoint.
5. Never break the illusion with a side-stripe border, gradient text, or
   a fourth chrome style.

## Known sharp edges

- **Dev server + `.next` deletes**: if you delete `.next/` while the dev
  server is running, requests start 500'ing. Kill the server first, then
  clear the cache, then restart.
- **Writings scroll container**: articles scroll inside
  `#writings-scroll`, not the window. `ReadingProgress` listens there.
  If you add any sticky elements inside an article, remember that
  `position: sticky` is relative to that container.
- **Resize handle**: `MacWindow` uses pointer capture for drag + resize.
  Nested interactive elements in a titlebar need `data-tl` to opt out of
  drag handling (the traffic lights do this already).

## Not in scope

- Dark mode switching (the OS IS the "mode" — no toggle).
- Analytics or tracking beyond the OG image.
- A CMS — writings are just MDX files in `content/`.
