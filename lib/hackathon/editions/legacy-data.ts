// ============================================================
// HACKATHON EDITIONS DATA
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { type HackathonEdition } from "../validation";

// ── Past Hackathon Editions ──
export const HACKATHON_EDITIONS: HackathonEdition[] = [
  {
    id: "hbtcmx-2025-1",
    name: "Hackathon Bitcoin México 2025 — Edición I",
    subtitle: "La Primera Gran Competencia Bitcoin en Mérida",
    year: 2025,
    edition: 1,
    slug: "hbtcmx-2025-1",
    date: {
      start: "2025-10-18",
      end: "2025-10-19",
    },
    location: {
      venue: "Centro de Innovación IMSS",
      city: "Mérida",
      state: "Yucatán",
      country: "México",
    },
    status: "completed",
    registration: {
      openedAt: "2025-09-01",
      closedAt: "2025-10-15",
      maxParticipants: 200,
      registeredCount: 187,
    },
    theme: "5 Retos por la Adopción Bitcoin",
    results: {
      winner: {
        name: "Corriente Satoshi",
        team: ["godin-001", "Aureo"],
        prize: "100,000 sats",
        description: "Herramienta educativa que enseña Bitcoin con analogías eléctricas",
      },
      second: {
        name: "BlockBazaar",
        team: ["devmerida"],
        prize: "50,000 sats",
        description: "Marketplace descentralizado con Lightning",
      },
      third: {
        name: "SatoshiSafe",
        team: ["yucabtc"],
        prize: "25,000 sats",
        description: "Sistema de custodia social multisig",
      },
    },
    sponsors: [
      { name: "Acepta Bitcoin", type: "gold", logo: "/hackathon/logos/aceptabitcoin.svg" },
      { name: "Blink.sv", type: "silver", logo: "/hackathon/logos/blink.svg" },
    ],
    metrics: {
      totalProjects: 24,
      totalParticipants: 850,
      lightningTransactions: 12500,
      mediaMentions: 35,
    },
  },
  {
    id: "hbtcmx-2025-2",
    name: "Hackathon Bitcoin México 2025 — Edición II",
    subtitle: "Especial: Lightning Network & Beyond",
    year: 2025,
    edition: 2,
    slug: "hbtcmx-2025-2",
    date: {
      start: "2025-12-06",
      end: "2025-12-07",
    },
    location: {
      venue: "Universidad Modelo Campus Mérida",
      city: "Mérida",
      state: "Yucatán",
      country: "México",
    },
    status: "completed",
    registration: {
      openedAt: "2025-10-15",
      closedAt: "2025-12-01",
      maxParticipants: 250,
      registeredCount: 234,
    },
    theme: "Lightning Network: Escalando Bitcoin",
    results: {
      winner: {
        name: "LN-Gateway Pro",
        team: ["bitdev", "nop118"],
        prize: "100,000 sats",
        description: "Gateway de pagos Lightning con conversion automática a moneda local",
      },
      second: {
        name: "TipJar MX",
        team: ["sats4all"],
        prize: "50,000 sats",
        description: "Sistema de propinas Lightning para eventos presenciales",
      },
      third: {
        name: "ChainGuard",
        team: ["cyphermex"],
        prize: "25,000 sats",
        description: "Monitor de transacciones on-chain con alertas de privacidad",
      },
    },
    sponsors: [
      { name: "Acepta Bitcoin", type: "gold", logo: "/hackathon/logos/aceptabitcoin.svg" },
      { name: "Voltage", type: "silver", logo: "/hackathon/logos/voltage.svg" },
      { name: "Start9", type: "bronze", logo: "/hackathon/logos/start9.svg" },
    ],
    metrics: {
      totalProjects: 28,
      totalParticipants: 920,
      lightningTransactions: 18200,
      mediaMentions: 42,
    },
  },
];

// ── Current/Upcoming Edition ──
export const CURRENT_EDITION: HackathonEdition = {
  id: "hbtcmx-2026-1",
  name: "Hackathon Bitcoin México 2026",
  subtitle: "5to Aniversario — La Edición Más Grande",
  year: 2026,
  edition: 1,
  slug: "hbtcmx-2026-1",
  date: {
    start: "2026-06-13",
    end: "2026-06-14",
  },
  location: {
    venue: "Centro de Convenciones Yucatán Siglo XXI",
    city: "Mérida",
    state: "Yucatán",
    country: "México",
  },
  status: "registration-open" as const,
  registration: {
    openedAt: "2026-05-01",
    closedAt: "2026-06-10",
    maxParticipants: 300,
    registeredCount: 142,
  },
  theme: "Bitcoin: Identidad, Soberanía y el Nuevo Sistema Monetario",
  results: null,
  sponsors: [
    { name: "Acepta Bitcoin", type: "gold", logo: "/hackathon/logos/aceptabitcoin.svg" },
    { name: "Blink.sv", type: "silver", logo: "/hackathon/logos/blink.svg" },
    { name: "Foundation Devices", type: "silver", logo: "/hackathon/logos/foundation-devices.svg" },
    { name: "Coinkite", type: "bronze", logo: "/hackathon/logos/coinkite.svg" },
  ],
  metrics: {
    totalProjects: 0,
    totalParticipants: 0,
    lightningTransactions: 0,
    mediaMentions: 3,
  },
};

// ── Get editions list (most recent first) ──
export function getEditions(): HackathonEdition[] {
  return [CURRENT_EDITION, ...HACKATHON_EDITIONS].sort(
    (a, b) => new Date(b.date.start).getTime() - new Date(a.date.start).getTime()
  );
}

// ── Get edition by slug ──
export function getEditionBySlug(slug: string): HackathonEdition | undefined {
  return getEditions().find((e) => e.slug === slug);
}

// ── Get current edition ──
export function getCurrentEdition(): HackathonEdition {
  return CURRENT_EDITION;
}