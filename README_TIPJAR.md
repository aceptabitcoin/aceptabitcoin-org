# 💰 TipJar Module — External Infrastructure Edition (v2.1)

## Overview
Módulo de pagos soberano para **Acepta Bitcoin México**.  
En esta versión, hemos eliminado la lógica de facturación del backend para delegarla 100% en infraestructura externa especializada (**Blink.sv POS** y **Mercado Pago**).  

El componente actúa como una **"Terminal de Enrutamiento"**: construye URLs dinámicas con metadatos estructurados (`memo`) y redirige al usuario a interfaces de pago seguras fuera del repositorio.

> ⚠️ **IMPORTANTE:** Ya NO existe `/api/tipjar`. La generación de facturas ocurre en el cliente mediante enlaces directos.

## Architecture (Serverless Payment)

```text
─────────────────────────────────────────────────────────────┐
│                  TipJarSection.tsx (Client)                 │
│                                                             │
│  [Selector Servicio] + [Input Monto]                        │
│         │                                                   │
│         ▼                                                   │
│  Construcción URL Dinámica:                                 │
│  https://pay.blink.sv/aceptabitcoin?amount=X&memo=SERVICIO  │
│         │                                                   │
│         ├──► [QR SVG Nativo] ──► Escanea → Blink POS        │
│         ├──► [Botón CTA] ─────► Click → Blink POS          │
│         └──► [On-Chain/Fiat] ──► Redirección Externa        │
│                                                             │
│  ✅ SIN BACKEND  ✅ SIN API KEYS EN REPO  ✅ ZERO LATENCY   │
└─────────────────────────────────────────────────────────────┘