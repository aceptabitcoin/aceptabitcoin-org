// ============================================================
// HACKATHON HERO GLOW — Background luminous effect
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

export default function HeroGlow({ className }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className || ""}`}
      aria-hidden="true"
    >
      {/* Bitcoin glow */}
      <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-bitcoin/10 blur-[120px] rounded-full animate-float" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-matrix/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-purple-500/10 blur-[80px] rounded-full animate-float" style={{ animationDelay: '-4s' }} />
    </div>
  );
}

// Add animation to global CSS
// In hackathon.css:
// @keyframes float {
//   0%, 100% { transform: translateY(0) scale(1); }
//   50% { transform: translateY(-20px) scale(1.05); }
// }
// .animate-float { animation: float 8s ease-in-out infinite; }