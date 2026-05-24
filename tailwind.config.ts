import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    // ✅ Rutas explícitas para componentes custom
    "./components/widgets/bob-chat/**/*.{ts,tsx}",
    "./components/ui/icons/**/*.{ts,tsx}",
    // ⚠️ REMOVIDO: "./components/ui/MatrixArcadeWhatsApp.{ts,tsx}" 
    // (era ruta de archivo único, ya cubierto por components/**/*)
    // ⚠️ REMOVIDO: lib/prompts y lib/vector (no contienen clases Tailwind)
  ],

  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // 🟢 Design System Matrix v2.0 — Colores de marca (CSS variables)
        matrix: "var(--matrix)",        // #00FF41
        bitcoin: "var(--bitcoin)",      // #F7931A
        
        // 🟠 Orange palette — para acentos financieros secundarios
        orange: {
          500: "var(--orange-500)",
          400: "var(--orange-400)",
          300: "var(--orange-300)",
        },
        
        // shadcn/ui variables (HSL) — mantener para compatibilidad
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))", // #FAFAFA según DS
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      // ✨ Glow utilities — sombras neon para estados hover/active (DS v2.0)
      boxShadow: {
        // Matrix Green glow (base + hover)
        'matrix': '0 0 15px rgba(0,255,65,0.2)',
        'matrix-hover': '0 0 25px rgba(0,255,65,0.4), 0 0 50px rgba(0,255,65,0.2)',
        // Bitcoin Orange glow (base + hover)
        'bitcoin': '0 0 20px rgba(247,147,26,0.4)',
        'bitcoin-hover': '0 0 35px rgba(247,147,26,0.6)',
        // Orange palette glow
        'orange': '0 0 15px rgba(249,115,22,0.3)',
        'orange-hover': '0 0 25px rgba(249,115,22,0.5)',
        // Terminal subtle glow (for inputs/cards)
        'terminal': '0 0 12px rgba(0,255,65,0.15)',
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // 🔤 Tipografía semántica (DS v2.0)
      fontFamily: {
        serif: ["var(--font-ibm-plex)", "serif"],    // Títulos: autoridad institucional
        mono: ["var(--font-fira-code)", "monospace"], // Datos, código, logs técnicos
        vt323: ["var(--font-vt323)", "monospace"],    // Arcade, botones especiales, metadata
      },
      
      // 🎬 Keyframes custom (animaciones del sistema)
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Scanline vertical (barrido de terminal)
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
        // Tilt sutil (efecto hover en cards)
        tilt: {
          "0%, 50%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(0.5deg)" },
          "75%": { transform: "rotate(-0.5deg)" },
        },
        // Blink (cursor parpadeante estilo terminal)
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        // Loading pulse (estados de carga)
        loading: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        // Ping suave para partículas / status indicators
        "ping-soft": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        // Fade in sutil para componentes que aparecen
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      
      // 🎞️ Animaciones registradas para uso con `animate-*`
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scanline: "scanline 3s linear infinite",
        tilt: "tilt 10s infinite linear",
        blink: "blink 1s step-end infinite",
        loading: "loading 1.5s ease-in-out infinite",
        "ping-soft": "ping-soft 1.2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-in": "fade-in 0.3s ease-out",
      },
      
      // 🎨 Utilidades adicionales para el DS
      backgroundImage: {
        // Grid sutil estilo terminal (para fondos decorativos)
        'matrix-grid': 'radial-gradient(rgba(0,255,65,0.03) 1px, transparent 1px)',
        'bitcoin-grid': 'radial-gradient(rgba(247,147,26,0.03) 1px, transparent 1px)',
        'noise': 'url("/noise.png")', // opcional: textura de ruido
      },
      backgroundSize: {
        'grid-40': '40px 40px',
        'grid-50': '50px 50px',
      },
      
      // 🔦 Utilidad para drop-shadow en títulos sobre fondos complejos
      dropShadow: {
        'matrix': '0 0 8px rgba(0,255,65,0.5)',
        'bitcoin': '0 0 8px rgba(247,147,26,0.5)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;