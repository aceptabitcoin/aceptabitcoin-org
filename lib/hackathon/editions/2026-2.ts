import { HackathonEdition } from "./types";

// ============================================================
// HACKATHON EDITION: 2026-2 (Bitcoin Self-Custody UI Challenge)
// Basado en: hackathon-bitcoin-custody-ui.md.pdf
// Alineado con: Design System "Bitcoin Matrix" v2.0
// ============================================================

export const edition2026_2: HackathonEdition = {
  // --- Identidad ---
  id: "2026-2",
  slug: "custody-ui-2026",
  title: "Bitcoin Self-Custody UI Challenge",
  tagline: "Diseña la mejor experiencia de usuario para custodia avanzada de Bitcoin",
  subtitle: "Multisig + Timelocks + Miniscript — Sin perder la cabeza en el intento",
  
  // --- Fechas (PDF oficial) ---
  status: "upcoming",
  dates: {
    start: "2026-06-05T09:00:00-06:00",
    end: "2026-06-07T23:59:00-06:00",
    registrationDeadline: "2026-06-04T23:59:00-06:00",
    timezone: "America/Mexico_City",
  },

  // --- Formato ---
  format: "hibrida",
  locations: [
    { 
      city: "Mérida", 
      venue: "Tecnológico de Software Mérida",
      address: "C. 18 103, Col. México, México Oriente, 97100 Mérida, Yuc.",
      coordinates: { lat: 20.9674, lng: -89.5926 },
      isPrimary: true 
    },
  ],

  // --- Contexto ---
  context: `La auto-custodia de Bitcoin sigue siendo un campo donde la seguridad y la usabilidad están en tensión constante. 
  Sparrow es excelente para técnicos, pero su UI asume conocimientos profundos. Liana simplifica con 'primary/recovery paths', 
  pero aún deja espacio para iteración. 
  El reto es crear una UI donde un usuario pueda configurar visualmente su política de custodia (multisig, timelocks, herencia) 
  sin escribir descriptors a mano, pero permitiendo al usuario avanzado el poder total de un descriptor BIP380.`,

  // --- Premios (montos corregidos + DS tokens) ---
  prizes: [
    { 
      place: "1°", 
      amountMXN: 6000, 
      paidInBitcoin: true, 
      description: "Mejor UX + Correctitud Técnica + Innovación",
      dsColor: "text-bitcoin",
      glow: "shadow-[0_0_20px_rgba(247,147,26,0.4)]"
    },
    { 
      place: "2°", 
      amountMXN: 2500, 
      paidInBitcoin: true, 
      description: "Mejor Diseño de Experiencia y Accesibilidad",
      dsColor: "text-matrix",
      glow: "shadow-[0_0_15px_rgba(0,255,65,0.2)]"
    },
    { 
      place: "3°", 
      amountMXN: 1500, 
      paidInBitcoin: true, 
      description: "Mejor Implementación de Descriptor y Código",
      dsColor: "text-gray-300",
      glow: "shadow-[0_0_15px_rgba(255,255,255,0.1)]"
    },
  ],

  // --- Criterios de Evaluación ---
  evaluationCriteria: [
    { criterion: "UX / Diseño", weight: "35%", description: "¿Un usuario no técnico puede configurar una custodia razonable en <10 min?" },
    { criterion: "Correctitud Técnica", weight: "25%", description: "¿El descriptor generado es válido? ¿La política refleja la UI?" },
    { criterion: "Innovación", weight: "20%", description: "¿Resuelven algo que Sparrow/Liana no resuelven? ¿Metáfora visual nueva?" },
    { criterion: "Accesibilidad y Educación", weight: "10%", description: "¿La UI enseña al usuario sin abrumarlo? (Tooltips, Glosario)" },
    { criterion: "Calidad de Código", weight: "10%", description: "Repo limpio, demo que corre, documentación decente." },
  ],

  // --- Entregables Mínimos Viables ---
  deliverables: [
    { title: "Configurar Multisig", description: "Al menos un multisig N-of-M con M ≥ 2", isMandatory: true },
    { title: "Timelocks", description: "Soportar al menos un timelock (relativo o absoluto) en un spending path", isMandatory: true },
    { title: "Importar Xpubs", description: "Importar al menos 2 xpubs (manual o archivo) mostrando fingerprint y derivation path", isMandatory: true },
    { title: "Generar Descriptor", description: "Generar y exportar descriptor BIP380 válido", isMandatory: true },
    { title: "Direcciones", description: "Mostrar al menos una dirección de recibo derivada del descriptor", isMandatory: true },
    { title: "Simulador (Bonus)", description: "Simulador 'qué pasa si' para la política configurada", isMandatory: false, bonus: "Puntos extra" },
    { title: "Taproot (Bonus)", description: "Soporte para Taproot + miniscript (tr())", isMandatory: false, bonus: "Puntos extra" },
  ],

  // --- Conceptos Técnicos ---
  technicalConcepts: [
    { id: "xpub", title: "XPUB (Extended Public Key)", description: "Llaves públicas padre para derivar direcciones sin exponer privadas. Formato: xpub, ypub, zpub." },
    { id: "descriptors", title: "Output Descriptors (BIP380)", description: "Strings que describen cómo la wallet genera direcciones (ej: wpkh, wsh(multi()))." },
    { id: "miniscript", title: "Miniscript", description: "Lenguaje estructurado para condiciones complejas (multi-firma, timelocks, hashes) dentro de wsh() y tr()." },
    { id: "timelocks", title: "Timelocks (BIP68/BIP65)", description: "Relativos (older) para recovery paths y Absolutos (after) para herencia con fecha fija." },
    { id: "psbt", title: "PSBT (BIP174)", description: "Partially Signed Bitcoin Transaction. Formato estándar para cooperación de firmantes." },
  ],

  // --- Anti-Patrones ---
  antiPatterns: [
    "❌ Pedir seed phrase al usuario en una web app.",
    "❌ Custodiar llaves privadas en el backend.",
    "❌ Inventar descriptors sin validación contra una librería real.",
    "❌ UIs que esconden información crítica (descriptor, pubkeys).",
    "❌ Olvidar el flujo de recovery (configurar bien pero no poder recuperar).",
    "❌ Hardcodear timelocks sin que el usuario pueda configurarlos."
  ],

  // --- Stack Sugerido ---
  stack: [
    "React / Next.js / SvelteKit / Tauri",
    "@bitcoinerlab/descriptors o bitcoinjs-lib (JS/TS)",
    "bdk-js (Bindings WASM)",
    "Miniscript Compiler Online para validación",
    "Testnet / Signet (Mutinynet) para pruebas"
  ],

  // --- Recursos ---
  resources: [
    { title: "Mastering Bitcoin (Ch 5 & 7)", type: "guide", url: "https://github.com/bitcoinbook/bitcoinbook", description: "Keys, addresses, scripts" },
    { title: "Miniscript Official Site", type: "guide", url: "https://bitcoin.sipa.be/miniscript/", description: "Compiler online y documentación" },
    { title: "Learn Me a Bitcoin", type: "guide", url: "https://learnmeabitcoin.com/", description: "Explicaciones visuales de Descriptors" },
    { title: "Liana GUI Reference", type: "video", url: "https://github.com/wizardsardine/liana", description: "State of the art en miniscript UI" },
    { title: "Sparrow Multisig Walkthrough", type: "workshop", url: "https://sparrowwallet.com/", description: "Tutorial de Orange Surf" },
  ],

  // --- Hardware Wallets (solo Trezor por soberanía) ---
  hardwareWallets: [
    { 
      name: "Trezor", 
      models: ["Model T", "Safe 3", "One"], 
      supported: true,
      note: "Recomendado por soberanía y código abierto"
    },
  ],

  // --- Reglas ---
  rules: "Código Open Source (MIT/Apache/BSD). Equipos de 2-4 personas. Multi-disciplinario recomendado. IP: Propiedad compartida bajo licencia permisiva.",

  // --- Timeline ---
  timeline: [
    { step: "01", title: "Banderazo + Workshop Miniscript", description: "Presentación del reto y taller de Descriptors/Miniscript", date: "2026-06-05 09:00 AM", location: "Tec de Software Mérida / Discord" },
    { step: "02", title: "48h de Construcción", description: "Desarrollo del frontend y validación de policies", date: "2026-06-05 a 2026-06-07" },
    { step: "03", title: "Office Hours / Mentoring", description: "Sesiones con mentores (Bitcoin Dev Kit, UX Experts)", date: "Disponible por Discord" },
    { step: "04", title: "Submission Deadline", description: "Envío de Repo, Demo y Video Pitch", date: "2026-06-07 11:59 PM" },
    { step: "05", title: "Pitch Final & Winners", description: "Demos en vivo de 5 min + Q&A", date: "2026-06-08" },
  ],

  // --- Sponsors ---
  sponsors: [
    { 
      name: "Acepta Bitcoin México", 
      role: "convocante", 
      logo: "/hackathon/logos/aceptabitcoin.svg", 
      url: "https://aceptabitcoin.org", 
      description: "Educación y herramientas Lightning para México.", 
      featured: true 
    },
    { 
      name: "Tecnológico de Software Mérida", 
      role: "hub-presencial", 
      logo: "/hackathon/logos/tecdesoftware.svg", 
      url: "https://tecdesoftware.edu.mx/", 
      description: "Formación técnica de alto impacto en el sureste.",
      address: "C. 18 103, Col. México, México Oriente, 97100 Mérida, Yuc."
    }
  ],

  // --- Repo Base ---
  repoBase: {
    url: "https://github.com/aceptabitcoin/custody-ui-base",
    branch: "main",
    quickStartCommands: [
      "git clone https://github.com/aceptabitcoin/custody-ui-base.git",
      "cd custody-ui-base && pnpm install",
      "pnpm dev",
      "## Acceder a: http://localhost:3000"
    ]
  },

  // --- Soporte ---
  support: {
    telegram: "@custody_ui_hackathon",
    email: "hackathon@aceptabitcoin.org",
    twitter: "@aceptabitcoin",
    docsUrl: "https://aceptabitcoin.org/hackathon/custody-ui-2026/resources"
  }
};