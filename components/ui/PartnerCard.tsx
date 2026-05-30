// components/ui/PartnerCard.tsx
"use client";

import { motion } from "framer-motion";
import { ExternalLink, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface PartnerCardProps {
  partner: {
    name: string;
    url: string;
    tagline: string;
    description: string;
    icon: string;
    color: string;
  };
}

// Mapeo simple de strings a componentes de Lucide
const getIcon = (iconName: string) => {
  const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon;
  return Icon || Icons.Bitcoin;
};

export function PartnerCard({ partner }: PartnerCardProps) {
  const IconComponent = getIcon(partner.icon);
  
  // Definir colores dinámicos basados en la prop 'color'
  // Si no existe, fallback a matrix green
  const accentColor = partner.color === 'amber' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                      partner.color === 'cyan' ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' :
                      partner.color === 'purple' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                      'text-matrix border-matrix/30 bg-matrix/10';

  const glowColor = partner.color === 'amber' ? 'rgba(245, 158, 11, 0.2)' :
                    partner.color === 'cyan' ? 'rgba(6, 182, 212, 0.2)' :
                    partner.color === 'purple' ? 'rgba(168, 85, 247, 0.2)' :
                    'rgba(0, 255, 65, 0.2)';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className={`relative p-6 sm:p-8 bg-black/80 backdrop-blur-md border rounded-2xl overflow-hidden group hover:border-white/20 transition-all duration-300`}
           style={{ boxShadow: `0 0 30px -10px ${glowColor}` }}>
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
          
          {/* Icon / Logo Area */}
          <div className={`p-4 rounded-xl border ${accentColor} shrink-0`}>
            <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
                {partner.name}
              </h3>
              <p className="text-sm font-mono text-gray-400 mt-1">{partner.tagline}</p>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed font-mono">
              {partner.description}
            </p>

            {/* CTA Button */}
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-xs font-bold uppercase tracking-wider text-black bg-bitcoin rounded-lg hover:bg-bitcoin/90 transition-colors group/btn"
            >
              Visitar Exchange
              <ExternalLink className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}