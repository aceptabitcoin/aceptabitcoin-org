import { HackathonEdition } from "./types";

export const edition2026_3: HackathonEdition = {
  id: "2026-3",
  slug: "tianguis-2026",
  title: "Tianguis Bitcoin Mérida",
  tagline: "Comercio Libre con Bitcoin: Tu Código, Tu Mercado, Tu Soberanía",
  status: "planned", // Cambiar a "upcoming" cuando se acerque
  
  dates: {
    start: "2026-09-15T09:00:00-06:00",
    end: "2026-09-17T23:59:00-06:00",
    registrationDeadline: "2026-09-13T23:59:00-06:00",
    timezone: "America/Mexico_City",
  },
  
  format: "hibrida",
  locations: [
    {
      city: "Mérida",
      venue: "Tec de Software Mérida",
      address: "Calle 60 x 99, Mérida, Yucatán",
      mapUrl: "https://maps.google.com/?q=Tec+de+Software+Mérida",
    },
  ],
  
  prizes: [
    {
      place: "1°",
      amountMXN: 10000,
      paidInBitcoin: true,
      description: "Pago directo a wallet del equipo en Lightning",
    },
    {
      place: "2°",
      amountMXN: 4000,
      paidInBitcoin: true,
      description: "Pago directo a wallet del equipo en Lightning",
    },
    {
      place: "3°",
      amountMXN: 2000,
      paidInBitcoin: true,
      description: "Pago directo a wallet del equipo en Lightning",
    },
  ],
  
  sponsors: [
    {
      name: "Acepta Bitcoin México",
      role: "convocante",
      logo: "/hackathon/logos/aceptabitcoin.svg",
      url: "https://aceptabitcoin.org",
      description: "Oracle System v2.0: Educación, directorio soberano y herramientas Lightning.",
      featured: true,
    },
    {
      name: "Arcadia B",
      role: "sponsor",
      logo: "/hackathon/logos/arcadiab.svg",
      url: "https://www.arcadiab.com/",
      description: "Agencia creativa especializada en interfaces cypherpunk.",
    },
    {
      name: "Tec de Software Mérida",
      role: "hub",
      logo: "/hackathon/logos/tecdesoftware.svg",
      url: "https://tecdesoftware.edu.mx/",
      description: "Formación técnica de alto impacto en el sureste mexicano.",
    },
  ],
  
  timeline: [
    {
      step: "01",
      title: "Registro abierto",
      description: "Inscríbete individualmente y forma tu equipo de 1-3 personas",
      date: "2026-08-15",
    },
    {
      step: "02",
      title: "Kickoff virtual",
      description: "Presentación del reto, repo base y mentoría inicial",
      date: "2026-09-15 09:00 AM",
    },
    {
      step: "03",
      title: "48h de construcción",
      description: "Desarrollo, mentoring en vivo y code reviews",
    },
    {
      step: "04",
      title: "Submission deadline",
      description: "Envía tu repo + demo antes de la hora límite",
      date: "2026-09-17 11:59 PM",
    },
    {
      step: "05",
      title: "Anuncio de ganadores",
      description: "Evaluación por jueces + entrega de premios en Bitcoin",
      date: "2026-09-18",
    },
  ],
  
  resources: [
    {
      title: "Guía del Participante",
      type: "pdf",
      url: "/hackathon/docs/guia-participante-2026-3.pdf",
      description: "Todo lo que necesitas saber para participar",
    },
    {
      title: "NIP-99 Cheatsheet",
      type: "guide",
      url: "/hackathon/docs/nip99-cheatsheet.pdf",
      description: "Referencia rápida para listados incensurables en Nostr",
    },
    {
      title: "Setup Lightning con Blink.sv",
      type: "workshop",
      url: "https://youtube.com/...",
      description: "Video tutorial para integrar pagos Lightning",
    },
  ],
  
  repoBase: {
    url: "https://github.com/aceptabitcoin/tianguis-base",
    branch: "main",
    quickStartCommands: [
      "git clone https://github.com/aceptabitcoin/tianguis-base.git",
      "cd tianguis-base && pnpm install",
      "cp .env.example .env.local",
      "docker-compose up -d",
      "pnpm dev",
    ],
  },
  
  support: {
    telegram: "@tianguis_bitcoin",
    email: "hackathon@aceptabitcoin.org",
    twitter: "@aceptabitcoin",
    docsUrl: "https://aceptabitcoin.org/hackathon/tianguis-2026/resources",
  },
  
  features: {
    matrixBackground: true,
    countdown: true,
    registration: true,
  },
};
