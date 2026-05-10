// ============================================================
// HACKATHON CONTAINER — Shared container wrapper
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

export default function HackathonContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className || ""}`}
    >
      {children}
    </div>
  );
}