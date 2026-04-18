"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

type Variant = "classic" | "aqua" | "hybrid";

export interface MacWindowProps {
  title: string;
  variant: Variant;
  onClose: () => void;
  onFocus?: () => void;
  zIndex?: number;
  initial: { x: number; y: number; w: number; h: number };
  minSize?: { w: number; h: number };
  resizable?: boolean;
  children: ReactNode;
  bodyClass?: string;
}

type Frame = { x: number; y: number; w: number; h: number };

export default function MacWindow({
  title,
  variant,
  onClose,
  onFocus,
  zIndex = 100,
  initial,
  minSize = { w: 320, h: 240 },
  resizable = true,
  children,
  bodyClass,
}: MacWindowProps) {
  const [frame, setFrame] = useState<Frame>({ ...initial });
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const prevFrame = useRef<Frame | null>(null);

  const dragState = useRef<{ dx: number; dy: number } | null>(null);
  const resizeState = useRef<{
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // ── Drag (title bar) ──
  const beginDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (maximized) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-tl]")) return;
    onFocus?.();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { dx: e.clientX - frame.x, dy: e.clientY - frame.y };
  };
  const onDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    e.preventDefault();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nextX = Math.min(Math.max(-40, e.clientX - dragState.current.dx), vw - frame.w + 40);
    const nextY = Math.min(Math.max(24, e.clientY - dragState.current.dy), vh - 60);
    setFrame((f) => ({ ...f, x: nextX, y: nextY }));
  };
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // ── Resize (bottom-right handle) ──
  const beginResize = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (maximized) return;
    onFocus?.();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: frame.w,
      startH: frame.h,
    };
    e.stopPropagation();
    e.preventDefault();
  };
  const onResize = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!resizeState.current) return;
    e.preventDefault();
    const { startX, startY, startW, startH } = resizeState.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nextW = Math.min(Math.max(minSize.w, startW + dx), vw - frame.x - 8);
    const nextH = Math.min(Math.max(minSize.h, startH + dy), vh - frame.y - 8);
    setFrame((f) => ({ ...f, w: nextW, h: nextH }));
  };
  const endResize = (e: ReactPointerEvent<HTMLDivElement>) => {
    resizeState.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const toggleMaximize = () => {
    if (maximized) {
      if (prevFrame.current) setFrame(prevFrame.current);
      setMaximized(false);
    } else {
      prevFrame.current = frame;
      setFrame({
        x: 12,
        y: 36,
        w: window.innerWidth - 24,
        h: window.innerHeight - 48,
      });
      setMaximized(true);
    }
  };

  const toggleMinimize = () => {
    setMinimized((m) => !m);
  };

  // Restore a minimized window via keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Keep a maximized window sized to viewport on resize
  useEffect(() => {
    if (!maximized) return;
    const onR = () => {
      setFrame({
        x: 12,
        y: 36,
        w: window.innerWidth - 24,
        h: window.innerHeight - 48,
      });
    };
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [maximized]);

  if (minimized) {
    return (
      <button
        type="button"
        className="mac-window-min-chip"
        onClick={toggleMinimize}
        style={{ zIndex }}
        aria-label={`Restore ${title}`}
      >
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <span className="mac-tl min" style={{ pointerEvents: "none" }} />
          {title}
        </span>
      </button>
    );
  }

  return (
    <div
      ref={ref}
      className="mac-window"
      style={{
        left: frame.x,
        top: frame.y,
        width: frame.w,
        height: frame.h,
        zIndex,
      }}
      onMouseDown={() => onFocus?.()}
    >
      <div
        className="mac-titlebar"
        onPointerDown={beginDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={toggleMaximize}
      >
        {variant === "classic" ? (
          <div className="mac-close-group">
            <button
              data-tl
              className="mac-close"
              aria-label="Close window"
              onClick={onClose}
              type="button"
            />
          </div>
        ) : (
          <div className="mac-close-group">
            <button
              data-tl
              className="mac-tl close"
              aria-label="Close window"
              onClick={onClose}
              type="button"
            >
              <svg viewBox="0 0 8 8" aria-hidden>
                <path d="M1.8 1.8 L6.2 6.2 M6.2 1.8 L1.8 6.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              data-tl
              className="mac-tl min"
              aria-label="Minimize"
              onClick={toggleMinimize}
              type="button"
            >
              <svg viewBox="0 0 8 8" aria-hidden>
                <path d="M1.5 4 L6.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              data-tl
              className="mac-tl max"
              aria-label="Maximize"
              onClick={toggleMaximize}
              type="button"
            >
              <svg viewBox="0 0 8 8" aria-hidden>
                <path d="M4 1.5 L4 6.5 M1.5 4 L6.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
        <span className="mac-window-title">{title}</span>
      </div>
      <div className={`mac-body ${bodyClass ?? ""}`}>{children}</div>

      {resizable && !maximized && (
        <div
          className="mac-resize-handle"
          onPointerDown={beginResize}
          onPointerMove={onResize}
          onPointerUp={endResize}
          onPointerCancel={endResize}
          aria-label="Resize"
          role="slider"
          tabIndex={-1}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <line x1="2" y1="10" x2="10" y2="2" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <line x1="5" y1="10" x2="10" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <line x1="8" y1="10" x2="10" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          </svg>
        </div>
      )}
    </div>
  );
}
