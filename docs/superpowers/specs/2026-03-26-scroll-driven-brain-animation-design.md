# Scroll-Driven Brain Animation

## Overview

Transform the homepage from a single full-viewport interactive experience into a scroll-driven narrative. The brain visualization becomes a cinematic journey: after an intro sequence, the user scrolls through four sections — each highlighting a brain region with a floating content modal — before landing in a free-interaction playground at the bottom.

## Tech Stack

- **GSAP ScrollTrigger** — orchestrates all scroll-to-animation mapping (already installed: gsap 3.14.2)
- **React Three Fiber / Three.js** — existing brain visualization, camera and shader uniforms driven by scroll progress
- **Framer Motion** — existing, handles DOM overlay animations (modal enter/exit)
- **Zustand** — existing state management, extended with scroll state

## Page Structure

The Three.js canvas remains `position: fixed` filling the entire viewport. Scroll spacer divs sit behind it, driving GSAP ScrollTrigger animations.

| Section | Height | Layout | Description |
|---------|--------|--------|-------------|
| Intro | 100vh | Full screen | Logo trace → corner → brain zoom-in with rotation. Scroll locked. |
| Personal | 150vh | Brain left 2/3, modal right 1/3 | Parietal lobe highlights. |
| Work | 150vh | Modal left 1/3, brain right 2/3 | Frontal lobe highlights. |
| Writings | 150vh | Brain top (zoomed out), modal bottom | Temporal lobe highlights. Camera pulls back. |
| Contact | 150vh | Brain left 2/3, modal right 1/3 | Cerebellum highlights. |
| Playground | 100vh | Brain centered, full interactive | Drag-to-rotate, click regions, auto-rotation. Current behavior. |

**Total page height:** ~800vh

## Section Order & Region Mapping

1. **Personal** — Parietal Lobe — Purple (#7b2ff7)
2. **Work** — Frontal Lobe — Cyan (#00d4ff)
3. **Writings** — Temporal Lobe — Pink (#ff006e)
4. **Contact** — Cerebellum — Green (#00e676)

## Intro Sequence (Automatic, Scroll-Locked)

1. **0–2.8s:** Logo SVG paths trace in center with purple glow (existing behavior)
2. **2.8–3.8s:** Logo floats to top-left corner, shrinks to 38px (existing behavior)
3. **3.8–5.3s:** Brain zoom-in — camera starts at z=12 (far), zooms to z=4.5 (default) over ~1.5s. Brain simultaneously rotates ~180° on Y-axis, landing face-forward.
4. **5.3s:** Scroll unlocked. Brief scroll indicator (down chevron / "scroll to explore") fades in, then auto-fades after 3s or immediately on first scroll — whichever comes first.

Body has `overflow: hidden` during intro. After brain settles, set `overflow: auto` and call `ScrollTrigger.refresh()`.

## Per-Section Animation (Scrubbed to Scroll Progress)

Each section uses `scrub: 1` (1s smoothing) and `pin: true`. As the user scrolls through 150vh of spacer, progress drives:

### Standard Sections (Personal, Work, Contact)

| Progress | Brain | Modal | Lobe Shader |
|----------|-------|-------|-------------|
| 0.0–0.3 | Translates toward its side, zooms in slightly | Not visible | Fades from grey to saturated region color |
| 0.3–0.5 | Settles at offset position | Fades + slides in from edge | Fully highlighted, others dimmed |
| 0.5–0.8 | Holds | Fully visible, content readable | Holds |
| 0.8–1.0 | Begins moving toward next section position | Fades + slides out | Highlight fades back |

**Brain offset:** Camera target shifts so brain occupies ~2/3 of viewport. Modal is a floating frosted-glass card in the remaining 1/3, partially overlapping the brain.

**Alternating sides:**
- Personal: brain offset left, modal right
- Work: brain offset right, modal left
- Contact: brain offset left, modal right

### Writings Section (Zoomed Out, Top/Bottom)

| Progress | Brain | Modal |
|----------|-------|-------|
| 0.0–0.3 | Camera pulls back (z=4.5 → z=7), temporal lobe highlights | Not visible |
| 0.3–0.5 | Settles centered at zoomed-out position | Modal rises from bottom edge |
| 0.5–0.8 | Holds | Holds |
| 0.8–1.0 | Begins zooming back in toward Contact position | Modal slides down and out |

### Playground Section (Final)

- Brain returns to center, camera at default z=4.5
- All lobes return to default pastel colors
- Auto-rotation resumes
- Drag-to-rotate and click-to-zoom re-enabled
- ScrollTrigger detaches — free interaction mode
- Existing `BrainRegionHitZones` click handlers re-enabled

## Floating Modal Design

Replaces the existing `ContentPanel` side-sheet.

- **Background:** `rgba(18, 18, 30, 0.92)` with `backdrop-filter: blur(20px)`
- **Border:** 1px solid, region-colored at 25% opacity
- **Border radius:** 16px
- **Shadow:** `0 8px 32px rgba(0, 0, 0, 0.5)`
- **Content:** Renders existing content components (`PersonalContent`, `WorkContent`, `WritingsContent`, `ContactContent`) as-is
- **Animation:** Framer Motion `opacity` + `x` (side sections) or `y` (writings) transform, triggered by GSAP scroll progress callbacks updating Zustand state

## Mobile Experience

Detected via existing `useIsMobile` hook.

**Approach: Snap-scroll pages**

Each section becomes 200vh with CSS `scroll-snap-type: y mandatory`:
- **First snap (100vh):** Full-screen brain with highlighted lobe — same camera/shader animation as desktop
- **Second snap (100vh):** Content card slides up from bottom covering ~85vh, frosted glass. Brain faintly visible behind at top.

`FloatingModal` on mobile uses `position: fixed; bottom: 0` with transform-Y animation.

Playground section remains 100vh, same interactive behavior as desktop.

## Three.js Integration

### ScrollAnimationController (new component)

Mounted inside `BrainScene` as a sibling to `CameraController`. Reads scroll state from Zustand and drives:

- **Camera position:** Lerps via `useFrame` based on `scrollProgress` within each `scrollPhase`
- **Camera lookAt target:** Shifts to offset the brain left/right/center
- **Brain rotation:** Controlled Y-axis rotation to present the relevant lobe to the user
- **Shader uniforms:** Sets `uActiveRegion` to highlight the current lobe (reuses existing highlighting logic)
- **Opacity:** Sets `uOpacity` to dim non-active regions

### scrollConfig.ts (new)

Configuration object mapping each region to:

```typescript
type ScrollSectionConfig = {
  region: BrainRegion
  cameraPosition: [number, number, number]
  lookAt: [number, number, number]
  brainRotationY: number
  modalSide: 'left' | 'right' | 'bottom'
}
```

### Interaction Gating

During scroll mode (`scrollMode: true`):
- `BrainNetwork`: drag rotation and auto-rotation disabled
- `BrainRegionHitZones`: click/hover handlers disabled (pointer-events: none)
- `CameraController`: yields to `ScrollAnimationController`

In playground (`scrollMode: false`):
- All existing interactive behaviors re-enabled

## Zustand Store Changes

Add to `useStore`:

```typescript
// Scroll state
scrollMode: boolean          // true during scroll journey, false in playground
scrollPhase: ScrollPhase     // 'intro' | 'personal' | 'work' | 'writings' | 'contact' | 'playground'
scrollProgress: number       // 0–1 within current section
setScrollState: (phase: ScrollPhase, progress: number) => void
setScrollMode: (mode: boolean) => void
```

Existing `activeRegion` is set by the scroll controller as the user enters each section — this drives the existing shader highlighting logic without modification.

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `src/components/scroll/ScrollSections.tsx` | Spacer divs + GSAP ScrollTrigger setup, manages pin/scrub instances |
| `src/components/scroll/ScrollAnimationController.tsx` | R3F component, drives camera + shader uniforms from scroll state |
| `src/components/scroll/FloatingModal.tsx` | Frosted-glass card, renders existing content components, Framer Motion animation |
| `src/components/scroll/scrollConfig.ts` | Per-section camera positions, rotations, modal side configuration |

### Modified Files

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Replace single-viewport layout with scrollable structure. Mount `ScrollSections`. Swap `ContentPanel` for `FloatingModal`. Add scroll lock/unlock for intro. |
| `src/store/useStore.ts` | Add `scrollMode`, `scrollPhase`, `scrollProgress`, and their setters. |
| `src/components/brain/BrainScene.tsx` | Mount `ScrollAnimationController`. |
| `src/components/brain/BrainNetwork.tsx` | Disable drag/auto-rotation when `scrollMode` is true. |
| `src/components/brain/CameraController.tsx` | Yield control when `scrollMode` is true (early return in `useFrame`). |
| `src/components/brain/BrainRegionHitZones.tsx` | Disable click/hover handlers when `scrollMode` is true. |
| `src/app/globals.css` | Add mobile scroll-snap styles, floating modal animation classes. |

### Removed / Replaced

| File | Reason |
|------|--------|
| `src/components/ui/ContentPanel.tsx` | Replaced by `FloatingModal`. Keep if still needed for `/writings` subpages. |
| `src/components/ui/NavigationOverlay.tsx` | Hint text updated — "scroll to explore" during scroll mode, back button only in playground. |

## Performance Considerations

- GSAP ScrollTrigger + `scrub` is GPU-friendly — no JS on every scroll pixel, uses requestAnimationFrame
- Three.js `useFrame` already runs 60fps — adding scroll-driven lerps is minimal overhead
- `FloatingModal` uses `will-change: transform, opacity` for compositor-layer promotion
- Mobile snap-scroll uses native CSS snap — browser-optimized scrolling
- Existing spatial hash + shader-based rendering unchanged
