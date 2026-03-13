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
    period: "Present",
    title: "Building cool things",
    desc: "Working on projects that push boundaries at the intersection of technology and human experience.",
  },
  {
    period: "Previously",
    title: "Various adventures",
    desc: "Exploring different domains and technologies, from data engineering to creative coding.",
  },
];

const interests = [
  "AI & ML",
  "3D Graphics",
  "Music",
  "Design",
  "Philosophy",
  "Open Source",
  "Neuroscience",
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
          Builder, thinker, and maker. I love creating things at the
          intersection of technology and human experience. This brain portfolio
          is a reflection of how I think — everything is connected.
        </p>
      </motion.div>

      <SubHeading color={COLOR}>Background</SubHeading>

      {timeline.map((item) => (
        <motion.div
          key={item.period}
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
