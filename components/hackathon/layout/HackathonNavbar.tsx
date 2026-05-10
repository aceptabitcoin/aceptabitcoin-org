// ============================================================
// HACKATHON NAVBAR — Dedicated navigation for hackathon section
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Bug, Menu, X, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface HackathonNavbarProps {
  className?: string;
}

export default function HackathonNavbar({ className }: HackathonNavbarProps = {}) {
  const pathname = usePathname();
  const params = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const editionSlug = (params?.edition as string) || "custody-ui-2026";

  const navLinks = [
    { name: "Inicio", href: `/hackathon/${editionSlug}`, pattern: /^\/hackathon\/[^/]+\/?$/ },
    {
      name: "Registro",
      href: `/hackathon/${editionSlug}/register`,
      pattern: /^\/hackathon\/[^/]+\/register/,
    },
    {
      name: "Proyectos",
      href: `/hackathon/${editionSlug}/projects`,
      pattern: /^\/hackathon\/[^/]+\/projects/,
    },
    {
      name: "Recursos",
      href: `/hackathon/${editionSlug}/resources`,
      pattern: /^\/hackathon\/[^/]+\/resources/,
    },
    {
      name: "API",
      href: "#api-docs",
      pattern: "#api",
    },
  ];

  function isActive(pattern: RegExp | string): boolean {
    if (typeof pattern === "string") {
      return (pathname || "").includes(pattern);
    }
    return pattern.test(pathname || "");
  }

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        "bg-black/80 backdrop-blur-md",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <Bug className="h-6 w-6 text-bitcoin" />
            <span className="font-serif font-bold text-sm md:text-base text-white">
              <span className="text-bitcoin">Acepta Bitcoin</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.pattern);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-mono transition-all duration-200",
                    "relative group",
                    active
                      ? "text-bitcoin bg-bitcoin/10 shadow-[0_0_15px_rgba(247,147,26,0.2)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-[2px] transition-all duration-300",
                      active
                        ? "w-full bg-bitcoin shadow-[0_0_8px_rgba(247,147,26,0.5)]"
                        : "w-0 group-hover:w-full bg-matrix/50"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-matrix focus:outline-none z-50"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-6 md:hidden">
          <Rocket className="h-8 w-8 text-bitcoin animate-pulse" />
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-serif text-white hover:text-bitcoin transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <span className="font-mono text-xs text-gray-500 mt-4">
            aceptabitcoin.org/hackathon
          </span>
        </div>
      )}
    </nav>
  );
}

// Import useState (needed for client component)
import { useState } from "react";