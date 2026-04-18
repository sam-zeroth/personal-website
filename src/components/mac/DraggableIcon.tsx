"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const DRAG_THRESHOLD = 4; // px movement before a pointerdown becomes a drag
const EDGE_PADDING = 8;
const TOP_BAR_PADDING = 32;
const BOTTOM_PADDING = 16;

export interface Position {
  x: number;
  y: number;
}

interface Props {
  label: string;
  children: ReactNode;
  position: Position;
  onPositionChange: (next: Position) => void;
  onOpen?: () => void;
  ariaLabel?: string;
}

export default function DraggableIcon({
  label,
  children,
  position,
  onPositionChange,
  onOpen,
  ariaLabel,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Stable refs for pointer handlers — we don't want to re-bind handlers on
  // every render as the position state flows in from the parent.
  const dragState = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    crossedThreshold: boolean;
  } | null>(null);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const el = rootRef.current;
    if (!el) return;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Some browsers refuse pointer capture for non-primary pointers or in
      // nested contexts. Fall through — the global pointermove flow still
      // works via the element's own listeners.
    }
    const rect = el.getBoundingClientRect();
    dragState.current = {
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      startX: e.clientX,
      startY: e.clientY,
      crossedThreshold: false,
    };
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const s = dragState.current;
      if (!s || s.pointerId !== e.pointerId) return;

      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;

      if (!s.crossedThreshold) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        s.crossedThreshold = true;
        setDragging(true);
      }

      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let nx = e.clientX - s.offsetX;
      let ny = e.clientY - s.offsetY;
      nx = Math.max(EDGE_PADDING, Math.min(vw - rect.width - EDGE_PADDING, nx));
      ny = Math.max(TOP_BAR_PADDING, Math.min(vh - rect.height - BOTTOM_PADDING, ny));

      onPositionChange({ x: nx, y: ny });
    },
    [onPositionChange],
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const s = dragState.current;
      if (!s || s.pointerId !== e.pointerId) return;
      const wasDrag = s.crossedThreshold;
      dragState.current = null;
      setDragging(false);
      const el = rootRef.current;
      try {
        if (el && el.hasPointerCapture(e.pointerId)) {
          el.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore — capture may have been dropped already
      }
      if (!wasDrag && onOpen) {
        onOpen();
      }
    },
    [onOpen],
  );

  const onPointerCancel = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (!s || s.pointerId !== e.pointerId) return;
    dragState.current = null;
    setDragging(false);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onOpen) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen();
      }
    },
    [onOpen],
  );

  return (
    <div
      ref={rootRef}
      className={`mac-icon${dragging ? " mac-icon-dragging" : ""}`}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        touchAction: "none",
      }}
      role={onOpen ? "button" : undefined}
      aria-label={ariaLabel ?? label}
      tabIndex={onOpen ? 0 : -1}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
      onDoubleClick={onOpen}
    >
      <span className="mac-icon-glyph">{children}</span>
      <span className="mac-icon-label">{label}</span>
    </div>
  );
}

// -----------------------------------------------------------
// Positions store: computes defaults from viewport + anchor,
// persists user moves to localStorage so the desktop remembers
// where the user left each icon.
// -----------------------------------------------------------

type AnchorSide =
  | { top: number; left: number }
  | { top: number; right: number }
  | { bottom: number; right: number }
  | { bottom: number; left: number };

export interface IconSpec {
  key: string;
  anchor: AnchorSide;
}

const ICON_W_EST = 96;
const ICON_H_EST = 92;
const STORAGE_KEY = "desktop-icons-v1";

function resolveAnchor(anchor: AnchorSide): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let x = 0;
  let y = 0;
  if ("left" in anchor) x = anchor.left;
  else x = vw - ICON_W_EST - anchor.right;
  if ("top" in anchor) y = anchor.top;
  else y = vh - ICON_H_EST - anchor.bottom;
  return { x, y };
}

function loadStored(): Record<string, Position> {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as Record<string, Position>;
    return {};
  } catch {
    return {};
  }
}

export function useIconPositions(specs: IconSpec[]) {
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadStored();
    const next: Record<string, Position> = {};
    for (const spec of specs) {
      next[spec.key] = stored[spec.key] ?? resolveAnchor(spec.anchor);
    }
    setPositions(next);
    setReady(true);
    // We intentionally don't react to spec changes — the desktop icon list
    // is static at runtime. Re-resolving on every render would stomp on
    // the user's drag state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback((key: string, pos: Position) => {
    setPositions((prev) => {
      const next = { ...prev, [key]: pos };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { positions, update, ready };
}
