import fs from "fs/promises";
import path from "path";

export interface WritingFrontmatter {
  title: string;
  date: string;
  tag: string;
  excerpt: string;
}

export interface WritingMeta extends WritingFrontmatter {
  slug: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "writings");

export async function getAllWritings(): Promise<WritingMeta[]> {
  const files = await fs.readdir(CONTENT_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  const writings: WritingMeta[] = [];

  for (const file of mdxFiles) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
    const frontmatter = parseFrontmatter(raw);
    if (frontmatter) {
      writings.push({
        ...frontmatter,
        slug: file.replace(/\.mdx$/, ""),
      });
    }
  }

  // Sort by date descending
  writings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return writings;
}

export async function getWriting(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf-8");
  return raw;
}

export async function getAdjacentWritings(
  slug: string
): Promise<{ prev: WritingMeta | null; next: WritingMeta | null }> {
  const all = await getAllWritings();
  const idx = all.findIndex((w) => w.slug === slug);
  return {
    prev: idx < all.length - 1 ? all[idx + 1] : null,
    next: idx > 0 ? all[idx - 1] : null,
  };
}

function parseFrontmatter(raw: string): WritingFrontmatter | null {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const lines = match[1].split("\n");
  const data: Record<string, string> = {};

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = value;
  }

  return data as unknown as WritingFrontmatter;
}
