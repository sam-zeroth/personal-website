"use client";

import { motion } from "framer-motion";
import {
  stagger,
  fadeUp,
  DrawerHeader,
  ConnectionDivider,
  SubHeading,
} from "../ui/CortexElements";

const COLOR = "#00d4ff";

const projects = [
  {
    title: "Pyrana",
    description:
      "Agent orchestration platform for building, deploying, and managing AI agent workflows at scale.",
    tech: ["Python", "TypeScript", "AI Agents"],
    year: "2025",
    url: "https://pyrana.ai",
  },
];

const skills = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Python",
  "Go",
  "Three.js",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Figma",
  "Git",
];

export default function WorkContent() {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      <DrawerHeader
        lobe="Frontal Lobe"
        lobeFunction="Planning, decision-making & execution"
        title="Work"
        color={COLOR}
      />

      <ConnectionDivider color={COLOR} />

      <SubHeading color={COLOR}>Projects</SubHeading>

      {projects.map((project) => {
        const card = (
          <motion.div
            key={project.title}
            variants={fadeUp}
            className="rounded-xl bg-gray-50/80 border-l-[3px] border-transparent hover:border-l-[#00d4ff] transition-all cursor-pointer group"
            style={{ padding: 16, marginBottom: 10 }}
          >
            <div className="flex justify-between items-baseline">
              <h4 className="text-[14px] font-semibold text-gray-800 tracking-tight">
                {project.title}
                {"url" in project && (
                  <span className="inline-block ml-1.5 text-[10px] text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                )}
              </h4>
              <span className="text-[10px] font-mono text-gray-400">
                {project.year}
              </span>
            </div>
            <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-[10px] rounded border border-gray-200 text-gray-500"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        );

        return "url" in project ? (
          <a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block no-underline"
          >
            {card}
          </a>
        ) : (
          card
        );
      })}

      <ConnectionDivider color={COLOR} />

      <SubHeading color={COLOR}>Skills</SubHeading>

      <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3.5 py-1.5 text-[12px] rounded-full border border-gray-200 text-gray-500 hover:border-[#00d4ff80] hover:bg-[#00d4ff08] hover:text-[#0099bb] transition-all cursor-default"
          >
            {skill}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
