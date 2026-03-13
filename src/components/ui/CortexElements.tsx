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
    <motion.div variants={fadeUp} className="relative my-14 h-px bg-gray-100">
      <div
        className="absolute left-0 -top-[3px] w-[7px] h-[7px] rounded-full"
        style={{ background: color }}
      />
      <div
        className="absolute left-[72px] -top-[2px] w-[5px] h-[5px] rounded-full"
        style={{ background: `${color}50` }}
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
      className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.06em] uppercase text-gray-400 mb-6"
    >
      <span
        className="w-1 h-1 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      {children}
    </motion.h3>
  );
}

// Drawer header with icon circle
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
    <motion.div variants={fadeUp} className="flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${color}12` }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: color }}
        />
      </div>
      <div>
        <span
          className="text-[10px] font-medium tracking-[0.1em] uppercase"
          style={{ color }}
        >
          {lobe}
        </span>
        <h2 className="text-[22px] font-bold tracking-tight leading-tight mt-0.5 text-gray-900">
          {title}
        </h2>
        <p className="text-[11px] text-gray-400 mt-1">{lobeFunction}</p>
      </div>
    </motion.div>
  );
}
