"use client";

import { motion } from "framer-motion";

export const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

// Neural network SVG decoration for top-right corner
export function NeuralDecoration({ color }: { color: string }) {
  return (
    <svg
      className="absolute top-0 right-0 w-[180px] h-[180px] pointer-events-none"
      style={{ opacity: 0.05 }}
      viewBox="0 0 200 200"
    >
      <circle cx="160" cy="30" r="2.5" fill={color} />
      <circle cx="180" cy="55" r="2" fill={color} />
      <circle cx="140" cy="60" r="2" fill={color} />
      <circle cx="170" cy="85" r="2.5" fill={color} />
      <circle cx="150" cy="42" r="1.5" fill={color} />
      <circle cx="192" cy="72" r="1.5" fill={color} />
      <circle cx="128" cy="28" r="2" fill={color} />
      <circle cx="188" cy="22" r="1.5" fill={color} />
      <circle cx="155" cy="95" r="2" fill={color} />
      <circle cx="120" cy="50" r="1.5" fill={color} />
      <circle cx="175" cy="110" r="1.5" fill={color} />
      <line x1="160" y1="30" x2="180" y2="55" stroke={color} strokeWidth="0.6" />
      <line x1="180" y1="55" x2="170" y2="85" stroke={color} strokeWidth="0.6" />
      <line x1="140" y1="60" x2="170" y2="85" stroke={color} strokeWidth="0.6" />
      <line x1="160" y1="30" x2="140" y2="60" stroke={color} strokeWidth="0.6" />
      <line x1="150" y1="42" x2="180" y2="55" stroke={color} strokeWidth="0.6" />
      <line x1="128" y1="28" x2="160" y2="30" stroke={color} strokeWidth="0.6" />
      <line x1="170" y1="85" x2="155" y2="95" stroke={color} strokeWidth="0.6" />
      <line x1="188" y1="22" x2="160" y2="30" stroke={color} strokeWidth="0.6" />
      <line x1="192" y1="72" x2="180" y2="55" stroke={color} strokeWidth="0.6" />
      <line x1="120" y1="50" x2="140" y2="60" stroke={color} strokeWidth="0.6" />
      <line x1="155" y1="95" x2="175" y2="110" stroke={color} strokeWidth="0.6" />
      <line x1="150" y1="42" x2="140" y2="60" stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

// Connection-line divider with node dots
export function ConnectionDivider({ color }: { color: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative h-px"
      style={{ background: "#e8e8ee", margin: "24px 0" }}
    >
      <div
        className="absolute rounded-full"
        style={{ background: color, width: 7, height: 7, left: 0, top: -3 }}
      />
      <div
        className="absolute rounded-full"
        style={{ background: `${color}50`, width: 5, height: 5, left: 72, top: -2 }}
      />
    </motion.div>
  );
}

// Sub-heading with dot prefix
export function SubHeading({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <motion.h3
      variants={fadeUp}
      className="flex items-center text-[11px] font-semibold tracking-[0.06em] uppercase text-gray-400"
      style={{ marginBottom: 14, gap: 8 }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{ background: color, width: 4, height: 4 }}
      />
      {children}
    </motion.h3>
  );
}

// Drawer header — icon circle vertically centered with title
export function DrawerHeader({
  lobe,
  lobeFunction,
  title,
  color,
}: {
  lobe: string;
  lobeFunction: string;
  title: string;
  color: string;
}) {
  return (
    <motion.div variants={fadeUp} className="flex items-start" style={{ gap: 14 }}>
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: `${color}12`,
          width: 40,
          height: 40,
          marginTop: 19,
        }}
      >
        <div
          className="rounded-full"
          style={{ background: color, width: 10, height: 10 }}
        />
      </div>
      <div>
        <span
          className="font-medium uppercase"
          style={{ color, fontSize: 10, letterSpacing: "0.1em" }}
        >
          {lobe}
        </span>
        <h2
          className="font-bold tracking-tight leading-tight text-gray-900"
          style={{ fontSize: 22, letterSpacing: "-0.03em", marginTop: 1 }}
        >
          {title}
        </h2>
        <p
          className="text-gray-400"
          style={{ fontSize: 11, marginTop: 2 }}
        >
          {lobeFunction}
        </p>
      </div>
    </motion.div>
  );
}
