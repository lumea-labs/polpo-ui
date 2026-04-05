export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        header { display: none !important; }
        body { min-height: auto !important; }
      `}</style>
      {children}
    </>
  );
}
