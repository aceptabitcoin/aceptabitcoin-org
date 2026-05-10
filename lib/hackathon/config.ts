// ============================================================
// HACKATHON CONFIGURATION
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

export const HACKATHON_CONFIG = {
  name: "Hackathon Bitcoin México",
  shortName: "HBTCMX",
  description: "Competencia de desarrollo Bitcoin en México",
  organizer: "Acepta Bitcoin México",
  location: "Mérida, Yucatán",
  website: "https://aceptabitcoin.org/hackathon",
  maxTeamSize: 4,
  minTeamSize: 1,
};

export const HACKATHON_THEMES = [
  {
    id: "financial-inclusion",
    name: "Inclusión Financiera",
    description: "Soluciones que faciliten el acceso a servicios financieros Bitcoin para personas no bancarizadas en México y LATAM.",
    icon: "🏦",
  },
  {
    id: "lightning-payments",
    name: "Pagos Lightning",
    description: "Aplicaciones que aprovechen la Red Lightning para micropagos, comercio o remesas instantáneas.",
    icon: "⚡",
  },
  {
    id: "education",
    name: "Educación Bitcoin",
    description: "Herramientas educativas, plataformas de aprendizaje o juegos que enseñen sobre Bitcoin y soberanía financiera.",
    icon: "📚",
  },
  {
    id: "sovereignty",
    name: "Soberanía Digital",
    description: "Proyectos enfocados en privacidad, autocustodia, identidad descentralizada y resistencia a la censura.",
    icon: "🛡️",
  },
  {
    id: "social-impact",
    name: "Impacto Social",
    description: "Soluciones Bitcoin para problemas sociales: donaciones, transparencia, gobernanza comunitaria.",
    icon: "🌎",
  },
  {
    id: "dev-tools",
    name: "Herramientas para Desarrolladores",
    description: "SDKs, APIs, librerías, frameworks o herramientas que faciliten el desarrollo en el ecosistema Bitcoin.",
    icon: "🔧",
  },
] as const;

export const HACKATHON_PRIZES = {
  first: {
    name: "🏆 Primer Lugar",
    amount: "100,000 sats",
    description: "Premio principal otorgado por Acepta Bitcoin México",
  },
  second: {
    name: "🥈 Segundo Lugar",
    amount: "50,000 sats",
    description: "Reconocimiento a la excelencia técnica",
  },
  third: {
    name: "🥉 Tercer Lugar",
    amount: "25,000 sats",
    description: "Mención honorífica por innovación",
  },
  categories: {
    name: "🏅 Menciones Especiales",
    amount: "10,000 sats",
    description: "Premios por categoría temática",
  },
};

export const HACKATHON_RULES = [
  "El proyecto debe ser construido durante el hackathon (24-48 horas).",
  "Se permite trabajar en equipo (máximo 4 integrantes).",
  "El código debe ser open source con licencia MIT o similar.",
  "Se priorizan proyectos funcionales sobre presentaciones.",
  "El proyecto debe tener relación con el ecosistema Bitcoin/Lightning.",
  "Se valora la originalidad, viabilidad técnica e impacto potencial.",
];

export const HACKATHON_TIMELINE = [
  { phase: "Registro", date: "2026-05-01", status: "completed" },
  { phase: "Apertura de Retos", date: "2026-05-10", status: "completed" },
  { phase: "Hackathon en Vivo", date: "2026-05-17", status: "upcoming" },
  { phase: "Evaluación", date: "2026-05-18", status: "pending" },
  { phase: "Premiación", date: "2026-05-19", status: "pending" },
];