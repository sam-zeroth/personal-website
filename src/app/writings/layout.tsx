export default function WritingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="writings-scroll"
      className="writings-page-root"
    >
      {children}
    </div>
  );
}
