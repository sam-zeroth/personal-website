"use client";

import { motion } from "framer-motion";
import {
  stagger,
  fadeUp,
  DrawerHeader,
  ConnectionDivider,
  SubHeading,
} from "../ui/CortexElements";

const COLOR = "#ff006e";

const posts = [
  {
    title: "On Building in Public",
    excerpt:
      "Why sharing your process is more valuable than polishing your product...",
    date: "Mar 2025",
    tag: "Essay",
  },
  {
    title: "The Architecture of Thought",
    excerpt:
      "How neural networks mirror the way we organize ideas and make connections...",
    date: "Feb 2025",
    tag: "Blog",
  },
  {
    title: "Three.js Performance Tips",
    excerpt:
      "Lessons learned from building a 3D brain visualization for the web...",
    date: "Jan 2025",
    tag: "Technical",
  },
  {
    title: "Design as Communication",
    excerpt:
      "Every pixel is a word. Every interaction is a sentence. Every experience tells a story...",
    date: "Dec 2024",
    tag: "Essay",
  },
];

export default function WritingsContent() {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      <DrawerHeader
        lobe="Temporal Lobe"
        lobeFunction="Language processing, memory & expression"
        title="Writings"
        color={COLOR}
      />

      <ConnectionDivider color={COLOR} />

      <SubHeading color={COLOR}>Recent</SubHeading>

      {posts.map((post) => (
        <motion.article
          key={post.title}
          variants={fadeUp}
          className="p-5 rounded-xl bg-gray-50/80 mb-5 border-l-[3px] border-transparent hover:border-l-[#ff006e] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 text-[10px] rounded border border-gray-200 text-gray-500">
              {post.tag}
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              {post.date}
            </span>
          </div>
          <h4 className="text-[14px] font-semibold text-gray-800 tracking-tight group-hover:text-[#ff006e] transition-colors">
            {post.title}
          </h4>
          <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
            {post.excerpt}
          </p>
        </motion.article>
      ))}

      <motion.p
        variants={fadeUp}
        className="text-center text-[11px] text-gray-400 mt-4"
      >
        More writings coming soon...
      </motion.p>
    </motion.div>
  );
}
