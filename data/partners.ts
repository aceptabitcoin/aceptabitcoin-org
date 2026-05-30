// data/partners.ts

export interface Partner {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  // Por ahora usamos iconos de Lucide. Cuando tengas logos, cambiaremos esto por 'logoUrl'
  icon: string; 
  color: string; // Color de acento para el glow (ej. 'amber', 'orange', 'blue')
}

export const PARTNERS: Partner[] = [
  {
    id: "aureo",
    name: "AureoBitcoin",
    url: "https://www.aureobitcoin.com/",
    tagline: "La plataforma mexicana confiable",
    description: "Compra y vende Bitcoin fácilmente con SPEI. Soberanía financiera desde México.",
    icon: "Bitcoin", // Nombre del icono de Lucide
    color: "amber",
  },
  {
    id: "arcadia",
    name: "Arcadia",
    url: "https://www.arcadiab.com/",
    tagline: "Tu puerta a Lightning Network",
    description: "Exchange enfocado en privacidad y velocidad. Conecta tu nodo y toma el control.",
    icon: "Zap",
    color: "cyan", // Usaremos cyan como 'matrix-tech' si no hay naranja
  },
  {
    id: "bullbitcoin",
    name: "Bull Bitcoin",
    url: "https://www.bullbitcoin.com/",
    tagline: "Non-custodial & Privacy First",
    description: "Intercambio P2P sin KYC. Diseñado para cypherpunks que valoran su privacidad.",
    icon: "Shield",
    color: "green",
  },
  {
    id: "hodlhodl",
    name: "Hodl Hodl",
    url: "https://hodlhodl.com/",
    tagline: "Trade Bitcoin without giving up custody",
    description: "Plataforma P2P global. Tú tienes las llaves, tú tienes el Bitcoin.",
    icon: "Globe",
    color: "purple",
  },
];