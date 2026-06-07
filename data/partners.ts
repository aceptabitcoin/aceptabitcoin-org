// data/partners.ts

export interface Partner {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  icon: string; // Nombre del icono de Lucide (ej: "Bitcoin", "Globe")
  protocol?: string; // Protocolo técnico (ej: "Lightning Network", "P2P Escrow")
  status?: 'online' | 'maintenance' | 'offline'; // Estado del nodo para UI técnica
}

export const PARTNERS: Partner[] = [
  {
    id: "aureo",
    name: "AureoBitcoin",
    url: "https://www.aureobitcoin.com/",
    tagline: "La plataforma mexicana confiable",
    description: "Compra y vende Bitcoin fácilmente con SPEI. Soberanía financiera desde México.",
    icon: "Bitcoin",
    protocol: "SPEI / On-Chain",
    status: "online"
  },
  {
    id: "arcadia",
    name: "Arcadia",
    url: "https://www.arcadiab.com/",
    tagline: "Tu puerta a Lightning Network",
    description: "Exchange enfocado en privacidad y velocidad. Conecta tu nodo y toma el control.",
    icon: "Zap",
    protocol: "Lightning Network",
    status: "online"
  },
  {
    id: "bullbitcoin",
    name: "Bull Bitcoin",
    url: "https://www.bullbitcoin.com/",
    tagline: "Non-custodial & Privacy First",
    description: "Intercambio P2P sin KYC. Diseñado para cypherpunks que valoran su privacidad.",
    icon: "Shield",
    protocol: "P2P Non-Custodial",
    status: "online"
  },
  {
    id: "hodlhodl",
    name: "Hodl Hodl",
    url: "https://hodlhodl.com/",
    tagline: "Trade Bitcoin without giving up custody",
    description: "Plataforma P2P global. Tú tienes las llaves, tú tienes el Bitcoin.",
    icon: "Globe",
    protocol: "Multisig Escrow",
    status: "online"
  },
];