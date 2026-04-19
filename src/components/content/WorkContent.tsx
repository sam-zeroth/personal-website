"use client";

interface Project {
  title: string;
  description: string;
  tech: string[];
  year: string;
  url?: string;
}

const projects: Project[] = [
  {
    title: "Pyrana",
    description:
      "Agent orchestration platform for building, deploying, and managing AI agent workflows at scale. Structured outputs, governance-as-code, self-improving pipelines.",
    tech: ["Python", "TypeScript", "AI Agents"],
    year: "2025",
    url: "https://pyrana.ai",
  },
  {
    title: "Pyrana Roadmap",
    description:
      "Open-source roadmapping tool built internally at Zeroth Agents. Syncs with Linear and Google Drive, lets anyone submit and vote on ideas before they hit the roadmap, and exposes the whole thing over MCP so agents can read and update it directly.",
    tech: ["TypeScript", "MCP", "Linear", "Open Source"],
    year: "2025",
    url: "https://github.com/zeroth-agents/pyrana-roadmap",
  },
  {
    title: "sammerk.app",
    description:
      "Personal command center — workouts, meal plans, tasks, calendar. MCP integration so a swarm of agents can manage and update my plans for me.",
    tech: ["TypeScript", "MCP", "AI Agents"],
    year: "2025",
    url: "https://github.com/sam-zeroth/sammerk-app",
  },
];

const skills = [
  "Python", "TypeScript", "React", "Next.js",
  "AI Agents", "LLMs", "SQL", "Systems Design",
  "Three.js", "Postgres", "Framer Motion",
];

export default function WorkContent() {
  return (
    <article>
      <header style={{ marginBottom: 18 }}>
        <span className="small-caps" style={{ opacity: 0.65 }}>Projects.dir</span>
        <h1
          style={{
            fontFamily: "var(--font-pixelify), system-ui",
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1,
            marginTop: 6,
            letterSpacing: "-0.01em",
          }}
        >
          Things I&apos;m building.
        </h1>
      </header>

      <p style={{ fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
        I work on systems that sit at the intersection of AI, agency, and governance —
        software that makes itself a little better every day.
      </p>

      {projects.map((project) => (
        <a
          key={project.title}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            padding: "18px 20px",
            border: "1.5px solid var(--win-ink)",
            background: "var(--win-bg)",
            marginBottom: 14,
            textDecoration: "none",
            color: "var(--win-ink)",
            boxShadow: "3px 3px 0 var(--win-ink)",
            transition: "transform 0.08s ease, box-shadow 0.08s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-1px, -1px)";
            e.currentTarget.style.boxShadow = "4px 4px 0 var(--win-ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "3px 3px 0 var(--win-ink)";
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-pixelify), system-ui",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {project.title} <span style={{ fontSize: 14, opacity: 0.6 }}>↗</span>
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "oklch(0.28 0.02 80)" }}>
            {project.description}
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  padding: "2px 7px",
                  border: "1px solid var(--win-ink)",
                  letterSpacing: "0.05em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </a>
      ))}

      <hr className="rule-dotted" />

      <h2
        style={{
          fontFamily: "var(--font-pixelify), system-ui",
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        Tools &amp; Stack
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {skills.map((s) => (
          <span
            key={s}
            className="small-caps"
            style={{
              padding: "4px 9px",
              border: "1.5px solid var(--win-ink)",
              background: "var(--paper)",
              fontSize: 11,
              letterSpacing: "0.08em",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}
