import { HackathonEdition } from "./types";

export const edition2026_1: HackathonEdition = {
  id: "2026-1",
  slug: "bitcoin-mexico-2026",
  title: "Hackathon Bitcoin México 2026",
  tagline: "Identidad, Soberanía y el Nuevo Sistema Monetario",
  subtitle: "5to Aniversario — La Edición Más Grande",
  status: "completed",
  
  dates: {
    start: "2026-01-15T09:00:00-06:00",
    end: "2026-01-17T23:59:00-06:00",
    registrationDeadline: "2026-01-13T23:59:00-06:00",
    timezone: "America/Mexico_City",
  },
  
  format: "presencial",
  locations: [
    {
      city: "Mérida",
      venue: "Centro de Convenciones Yucatán Siglo XXI",
    },
  ],
  
  prizes: [
    {
      place: "1°",
      amountMXN: 50000,
      paidInBitcoin: true,
      description: "Mejor desarrollo on-chain",
    },
  ],
  
  sponsors: [
    {
      name: "Acepta Bitcoin México",
      role: "convocante",
      logo: "/hackathon/logos/aceptabitcoin.svg",
      url: "https://aceptabitcoin.org",
      description: "Oracle System v2.0",
      featured: true,
    },
  ],
  
  timeline: [
    {
      step: "01",
      title: "Kickoff",
      description: "Inicio del evento",
      date: "2026-01-15",
    },
    {
      step: "02",
      title: "Clausura",
      description: "Premiación",
      date: "2026-01-17",
    },
  ],
  
  resources: [],
  
  repoBase: {
    url: "https://github.com/aceptabitcoin/hackathon-2026-base",
    quickStartCommands: [],
  },
  
  support: {
    telegram: "@aceptabitcoin",
    email: "hackathon@aceptabitcoin.org",
    twitter: "@aceptabitcoin",
    docsUrl: "https://aceptabitcoin.org/docs",
  },
};
