import { IBM_Plex_Serif, Fira_Code, VT323 } from "next/font/google";
import HackathonNavbar from "@/components/hackathon/layout/HackathonNavbar";
import HackathonFooter from "@/components/hackathon/layout/HackathonFooter";

// Fonts específicas para hackathones (pueden heredarse del root si prefieres)
const ibmSerif = IBM_Plex_Serif({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-serif" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });
const vt323 = VT323({ subsets: ["latin"], weight: ["400"], variable: "--font-vt323" });

export default function HackathonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${ibmSerif.variable} ${firaCode.variable} ${vt323.variable} font-sans`}>
      <HackathonNavbar />
      <main className="min-h-screen bg-black text-white">
        {children}
      </main>
      <HackathonFooter />
    </div>
  );
}