# personal-website

Sam Merkovitz's personal site. The concept: the site IS an operating system.

- **Desktop** — Mac OS X Aqua (early-2000s era): menu bar, desktop icons, draggable / resizable / maximizable windows.
- **Mobile** — iOS 6 skeuomorphic home: a 2×2 grid of glossy app icons, a glass dock, iOS-style fullscreen app views.
- **Writings** — each article is a "document": full-screen Mac doc on desktop, iOS Reader-style on mobile.

See [`.impeccable.md`](./.impeccable.md) for the design brief and [`CLAUDE.md`](./CLAUDE.md) for repo conventions.

## Stack

- Next.js 16 (App Router, webpack mode)
- React 19
- TypeScript strict
- Tailwind v4 + a single `globals.css` with design tokens
- MDX via `next-mdx-remote` for writings
- `zustand` for the small bit of UI state (active window region)

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # next dev --webpack (port 3000)
npm run build    # production build
npm run lint     # eslint
npx tsc --noEmit # type-check (no test suite yet)
```

## Repo layout

```
src/
├── app/                  # routes, global styles, fonts, OG image
│   ├── globals.css       # Mac + iOS + writings styles, all in one file
│   └── writings/         # /writings index + /writings/[slug] articles
├── components/
│   ├── content/          # section bodies (Personal, Work, Writings, Contact)
│   ├── desktop/          # AquaDesktop + ClientGate (mobile/desktop switch)
│   ├── mac/              # Mac primitives: MenuBar, Window, icons
│   └── phone/            # PhoneHome (iOS home + fullscreen app view)
├── hooks/useIsMobile.ts
├── lib/writings.ts       # MDX frontmatter parser + file listing
└── store/useStore.ts     # zustand: active region, navigate/goHome
content/writings/         # MDX essays — drop a file in to publish
```

## Adding an essay

Create `content/writings/your-slug.mdx` with frontmatter:

```mdx
---
title: "..."
date: "YYYY-MM-DD"
tag: "Essay"
excerpt: "..."
---
```

The Finder and the writings index pick it up automatically.

## Deployment

Deployed on [Railway](https://railway.app/). Pushes to `main` deploy automatically.
