export default function WritingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ overflow: "auto", height: "100dvh" }}>{children}</div>;
}
