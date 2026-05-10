export interface HackathonEdition {
  id: string;                    // "2026-1", "2026-2"
  slug: string;                  // "tianguis-2026"
  title: string;                 // "2ndo Hackathon Tianguis Bitcoin"
  tagline: string;               // "Comercio Libre con Bitcoin: Tu Código, Tu Mercado, Tu Soberanía"
  subtitle?: string;             // "Multisig + Timelocks + Miniscript"
  status: "upcoming" | "live" | "completed" | "planned" | "draft";
  dates: {
    start: string;               // ISO 8601
    end: string;
    registrationDeadline: string;
    timezone: string;            // "America/Mexico_City"
  };
  format: "presencial" | "virtual" | "hibrida" | "virtual_en_vivo";
  locations?: {
    city: string;
    venue: string;
    address?: string;
    mapUrl?: string;
  }[];
  prizes: Prize[];
  sponsors: Sponsor[];
  timeline: TimelineItem[];
  resources: Resource[];
  repoBase: {
    url: string;
    branch?: string;
    quickStartCommands: string[];
  };
  support: {
    telegram: string;
    email: string;
    twitter: string;
    docsUrl: string;
  };
  rules?: {
    allowed: string[];
    forbidden: string[];
  } | string | {
    title: string;
    items: string[];
  }[];
  context?: string;
  stack?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  features?: {
    matrixBackground?: boolean;
    countdown?: boolean;
    registration?: boolean;
  };

  metrics?: {
    totalProjects: number;
    totalParticipants: number;
    lightningTransactions: number;
    mediaMentions: number;
  };

  // 📚 Contenido técnico específico
  technicalConcepts?: TechnicalConcept[];
  evaluationCriteria?: EvaluationCriterion[];
  antiPatterns?: string[];
  deliverables?: Deliverable[];
  
  // Resultados (para ediciones completadas)
  results?: {
    winners?: CompetitionResult[];
    topProjects?: any[];
    // Legacy support for Leaderboard
    winner?: any;
    second?: any;
    third?: any;
  };
}

export interface Sponsor {
  name: string;
  role: "convocante" | "sponsor" | "aliado" | "hub";
  logo: string;                  // path en /public/hackathon/logos/
  url: string;
  description: string;
  featured?: boolean;
}

export interface TimelineItem {
  step: string;                  // "01", "02"
  title: string;
  description: string;
  date?: string;                 // Opcional para hitos con fecha específica
}

export interface Resource {
  title: string;
  type: "pdf" | "video" | "workshop" | "guide";
  url: string;
  description?: string;
}

export interface TechnicalConcept {
  id: string; // "xpub", "miniscript", "timelocks", etc.
  title: string;
  description: string;
  codeExample?: string;
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
  bonus?: string;
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

export interface Prize {
  place: string;               // "1°", "2°", "3°"
  amountMXN: number;
  paidInBitcoin: boolean;
  description: string;
}
