import { headers } from "next/headers";
import { getAllWritings } from "@/lib/writings";
import ClientGate from "@/components/desktop/ClientGate";

function isMobileUA(ua: string) {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
}

export default async function Home() {
  const all = await getAllWritings();
  const writings = all.map((w) => ({
    slug: w.slug,
    title: w.title,
    tag: w.tag,
    date: w.date,
    excerpt: w.excerpt,
  }));

  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const mobileHint = isMobileUA(ua);

  return (
    <main style={{ position: "fixed", inset: 0 }}>
      <ClientGate initialMobileHint={mobileHint} writings={writings} />
    </main>
  );
}
