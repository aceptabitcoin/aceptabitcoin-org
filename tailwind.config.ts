import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    // ✅ Rutas explícitas para nuevos componentes
    "./components/widgets/bob-chat/**/*.{ts,tsx}",
    "./components/ui/MatrixArcadeWhatsApp.{ts,tsx}",
    "./components/ui/icons/**/*.{ts,tsx}",
    "./lib/prompts/**/*.{ts,tsx}",
    "./lib/vector/**/*.{ts,tsx}",
  ],

  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // 🟢 Design System Matrix v2.0 — Colores de marca
        matrix: "var(--matrix)",
        bitcoin: "var(--bitcoin)",
        
        // ❌ REMOVIDO: `dark: "#000000"` → usar `bg-black` nativo de Tailwind
        
        // shadcn/ui variables (HSL) — no interferir con colores custom
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        // 🟠 Orange palette — uses CSS variables for consistency
        orange: {
          500: "var(--orange-500)",
          400: "var(--orange-400)",
          300: "var(--orange-300)",
        },
      },
      
      // ✨ NUEVO: Utilities de glow para sombras neon (DS v2.0)
      boxShadow: {
        'matrix': '0 0 15px rgba(0,255,65,0.2), 0 0 30px rgba(0,255,65,0.1)',
        'matrix-hover': '0 0 25px rgba(0,255,65,0.4), 0 0 50px rgba(0,255,65,0.25)',
        'bitcoin': '0 0 20px rgba(247,147,26,0.4)',
        'bitcoin-hover': '0 0 35px rgba(247,147,26,0.6)',
        'orange': 'var(--orange-glow)',
        'orange-hover': '0 0 25px rgba(249,115,22,0.5), 0 0 40px rgba(249,115,22,0.25)',
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
          "25%": { transform: "rotate(1deg)" },
          "75%": { transform: "rotate(-1deg)" },
        },
        // Blink (cursor parpadeante)
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        // Loading pulse (estados de carga)
        loading: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        // Ping suave para partículas
        "ping-soft": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
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
      },
      
      // 🎨 Utilidades adicionales para el DS
      backgroundImage: {
        // Grid sutil estilo terminal (para fondos decorativos)
        'matrix-grid': 'radial-gradient(rgba(0,255,65,0.03) 1px, transparent 1px)',
        'bitcoin-grid': 'radial-gradient(rgba(247,147,26,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-40': '40px 40px',
        'grid-50': '50px 50px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;