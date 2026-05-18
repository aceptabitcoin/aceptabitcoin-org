// lib/hackathon/editions/types.ts
// Alineado con: Design System "Bitcoin Matrix" v2.0 + PDF oficial

// ============================================================
// INTERFACES BASE — Hackathon Edition System
// ============================================================

export interface Prize {
  place: string;               // "1°", "2°", "3°"
  amountMXN: number;
  paidInBitcoin: boolean;
  description: string;
  // 🎨 Design System tokens (opcional, para estilos dinámicos)
  dsColor?: "text-bitcoin" | "text-matrix" | "text-gray-300" | "text-gray-400";
  glow?: string; // Ej: "shadow-[0_0_20px_rgba(247,147,26,0.4)]"
}

export interface HardwareWallet {
  name: "Trezor" | "Ledger" | "BitBox" | "Coldcard" | "Jade";
  models?: string[];           // ["Model T", "Safe 3"]
  supported: boolean;
  note?: string;               // "Recomendado por soberanía y código abierto"
}

export interface Sponsor {
  name: string;
  role: "convocante" | "sponsor" | "aliado" | "hub" | "hub-presencial";
  logo: string;                  // path en /public/hackathon/logos/
  url: string;
  description: string;
  featured?: boolean;
  address?: string;              // Para hubs presenciales
}

export interface TimelineItem {
  step: string;                  // "01", "02"
  title: string;
  description: string;
  date?: string;                 // Opcional para hitos con fecha específica
  location?: string;             // "Tec de Software Mérida" | "Discord" | "Global"
}

export interface Resource {
  title: string;
  type: "pdf" | "video" | "workshop" | "guide" | "tool" | "compiler";
  url: string;
  description?: string;
  icon?: string;                 // Nombre de icono de lucide-react (opcional)
}

export interface TechnicalConcept {
  id: string; // "xpub", "miniscript", "timelocks", "psbt", "descriptors"
  title: string;
  description: string;
  codeExample?: string;          // Ejemplo de descriptor o miniscript
}

export interface EvaluationCriterion {
  criterion: string;
  weight: string; // "35%", "25%", etc.
  description: string;
}

export interface Deliverable {
  title: string;
  description: string;
  isMandatory: boolean;
  bonus?: string;                // "Puntos extra"
}

export interface CompetitionResult {
  place: "1°" | "2°" | "3°" | "Mención Honorífica";
  name: string;
  team: string[];
  description: string;
  prize?: string;
  repoUrl?: string;
  demoUrl?: string;
  highlights?: string[];
}

export interface HackathonEdition {
  // --- Identidad ---
  id: string;                    // "2026-1", "2026-2"
  slug: string;                  // "tianguis-2026", "custody-ui-2026"
  title: string;                 // "Bitcoin Self-Custody UI Challenge"
  tagline: string;               // "Diseña la mejor experiencia de usuario..."
  subtitle?: string;             // "Multisig + Timelocks + Miniscript"
  
  // --- Estado y Fechas ---
  status: "upcoming" | "live" | "completed" | "planned" | "draft";
  dates: {
    start: string;               // ISO 8601: "2026-06-05T09:00:00-06:00"
    end: string;
    registrationDeadline: string;
    timezone: string;            // "America/Mexico_City"
  };
  
  // --- Formato y Ubicación ---
  format: "presencial" | "virtual" | "hibrida" | "virtual_en_vivo";
  locations?: {
    city: string;
    venue: string;
    address?: string;            // Dirección completa para mapas
    coordinates?: {              // Para Leaflet/Google Maps
      lat: number;
      lng: number;
    };
    mapUrl?: string;
    isPrimary?: boolean;         // Marcar sede principal
  }[];
  
  // --- Contenido Principal ---
  prizes: Prize[];
  sponsors: Sponsor[];
  timeline: TimelineItem[];
  resources: Resource[];
  
  // --- Repositorio Base ---
  repoBase: {
    url: string;
    branch?: string;
    quickStartCommands: string[];
  };
  
  // --- Soporte y Contacto ---
  support: {
    telegram: string;
    email: string;
    twitter: string;
    docsUrl: string;
  };
  
  // --- Reglas (flexible para legacy) ---
  rules?: {
    allowed: string[];
    forbidden: string[];
  } | string | {
    title: string;
    items: string[];
  }[];
  
  // --- Contexto y Stack (opcional) ---
  context?: string;
  stack?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  
  // --- Features de UI (toggleable) ---
  features?: {
    matrixBackground?: boolean;
    countdown?: boolean;
    registration?: boolean;
    map?: boolean;               // Mostrar mapa interactivo
  };

  // --- External Redirects ---
  registrationUrl?: string;     // URL personalizado de Google Forms (opcional)

  // --- Métricas (para ediciones completadas) ---
  metrics?: {
    totalProjects: number;
    totalParticipants: number;
    lightningTransactions: number;
    mediaMentions: number;
  };

  // 📚 Contenido técnico específico (Self-Custody Challenge)
  technicalConcepts?: TechnicalConcept[];
  evaluationCriteria?: EvaluationCriterion[];
  antiPatterns?: string[];
  deliverables?: Deliverable[];
  
  // 🔐 Hardware Wallets soportadas (nuevo para custody-ui-2026)
  hardwareWallets?: HardwareWallet[];
  
  // 🏆 Resultados (para ediciones completadas)
  results?: {
    winners?: CompetitionResult[];
    topProjects?: any[];
    // Legacy support for Leaderboard
    winner?: any;
    second?: any;
    third?: any;
  };
}