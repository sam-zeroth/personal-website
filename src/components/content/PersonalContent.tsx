"use client";

import { motion } from "framer-motion";
import {
  stagger,
  fadeUp,
  DrawerHeader,
  ConnectionDivider,
  SubHeading,
} from "../ui/CortexElements";

const COLOR = "#7b2ff7";

const timeline = [
  {
    period: "Now",
    title: "Zeroth Technology",
    desc: "Building Pyrana — an Enterprise Agent Orchestration Platform. Working on the frontier of AI systems and multi-agent coordination.",
  },
  {
    period: "Previously",
    title: "Kenvue (J&J spin-off)",
    desc: "AdTech — built novel algorithms to improve advertising targeting and spend optimization, working on the future of advertising technology.",
  },
  {
    period: "Previously",
    title: "Johnson & Johnson",
    desc: "Corporate Technology & MedTech — engineering across enterprise systems and medical technology platforms.",
  },
  {
    period: "Previously",
    title: "Genentech",
    desc: "Data Management — working with biotech data systems at one of the world's leading biotechnology companies.",
  },
];

const interests = [
  "Philosophy of Mind",
  "Computational Science",
  "Logic",
  "Basketball",
  "Reading",
  "AI & ML",
  "Tinkering",
  "Writing",
];

export default function PersonalContent() {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      <DrawerHeader
        lobe="Parietal Lobe"
        lobeFunction="Self-awareness, spatial reasoning & integration"
        title="Personal"
        color={COLOR}
      />

      <ConnectionDivider color={COLOR} />

      <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
        <p className="text-[13px] text-gray-600 leading-relaxed">
          Northeastern University grad with a BS in Computer Science and
          Philosophy. Deeply interested in the intersections of mind,
          computation, and logic. Currently building AI agent infrastructure at
          Zeroth Technology. Always reading, always learning.
        </p>
        <a
          href="https://linkedin.com/in/sam-merkovitz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#7b2ff7] hover:text-[#6020d0] transition-colors"
          style={{ marginTop: 12 }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Connect on LinkedIn
        </a>
      </motion.div>

      <SubHeading color={COLOR}>Experience</SubHeading>

      {timeline.map((item, i) => (
        <motion.div
          key={item.title}
          variants={fadeUp}
          className="rounded-xl bg-gray-50/80 border-l-[3px] border-transparent hover:border-l-[#7b2ff7] transition-all"
          style={{ padding: 16, marginBottom: 10 }}
        >
          <span className="text-[10px] font-mono font-medium tracking-wider uppercase text-[#7b2ff7]">
            {item.period}
          </span>
          <h4 className="text-[14px] font-semibold text-gray-800 tracking-tight mt-0.5">
            {item.title}
          </h4>
          <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
            {item.desc}
          </p>
        </motion.div>
      ))}

      <ConnectionDivider color={COLOR} />

      <SubHeading color={COLOR}>Interests</SubHeading>

      <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <span
            key={interest}
            className="px-3.5 py-1.5 text-[12px] rounded-full border border-gray-200 text-gray-500 hover:border-[#7b2ff780] hover:bg-[#7b2ff708] hover:text-[#6020d0] transition-all cursor-default"
          >
            {interest}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
