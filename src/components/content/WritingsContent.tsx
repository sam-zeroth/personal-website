"use client";

import Link from "next/link";
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
    title: "What Is It Like to Be Claude?",
    excerpt:
      "An exploratory analysis of machine experience, after Thomas Nagel. I asked Claude to turn the hard problem of consciousness inward.",
    date: "Mar 2026",
    tag: "Essay",
    slug: "what-is-it-like-to-be-claude",
    readingTime: "12 min read",
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
        <Link key={post.slug} href={`/writings/${post.slug}`}>
          <motion.article
            variants={fadeUp}
            className="rounded-xl bg-gray-50/80 border-l-[3px] border-transparent hover:border-l-[#ff006e] transition-all cursor-pointer group"
            style={{ padding: "16px 18px", marginBottom: 12 }}
          >
            <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
              <span className="px-2 py-0.5 text-[10px] rounded border border-gray-200 text-gray-500 font-mono">
                {post.tag}
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                {post.date}
              </span>
            </div>
            <h4 className="text-[14px] font-semibold text-gray-800 tracking-tight group-hover:text-[#ff006e] transition-colors">
              {post.title}
            </h4>
            <p className="text-[12px] text-gray-500 leading-relaxed" style={{ marginTop: 4 }}>
              {post.excerpt}
            </p>
            <span className="text-[10px] font-mono text-gray-300" style={{ marginTop: 8, display: "block" }}>
              {post.readingTime}
            </span>
          </motion.article>
        </Link>
      ))}

      <motion.div variants={fadeUp} className="text-center" style={{ marginTop: 16 }}>
        <Link
          href="/writings"
          className="text-[12px] font-medium text-gray-400 hover:text-[#ff006e] transition-colors"
        >
          View all writings →
        </Link>
      </motion.div>
    </motion.div>
  );
}
