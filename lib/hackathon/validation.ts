// ============================================================
// HACKATHON VALIDATION SCHEMAS
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { z } from "zod";

// ── Team Member Schema ──
export const TEAM_MEMBER_SCHEMA = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  rol: z.string().min(2, "El rol debe tener al menos 2 caracteres").max(100),
  ubicacion: z.string().optional(),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  linkedin: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
});

// ── Project submission schema (post-hackathon) ──
export const PROJECT_SUBMISSION_SCHEMA = z.object({
  projectName: z.string().min(3, "El nombre del proyecto debe tener al menos 3 caracteres").max(100),
  projectDescription: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  shortDescription: z.string().min(10, "La descripción corta debe tener al menos 10 caracteres").max(200),
  projectUrl: z.string().url("URL inválida"),
  repoUrl: z.string().url("URL del repositorio inválida").optional().or(z.literal("")),
  demoUrl: z.string().url("URL de demo inválida").optional().or(z.literal("")),
  logoUrl: z.string().url("URL de logo inválida").optional().or(z.literal("")),
  stack: z.array(z.string()).min(1, "Al menos una tecnología"),
  theme: z.enum([
    "financial-inclusion",
    "lightning-payments", 
    "education",
    "sovereignty",
    "social-impact",
    "dev-tools",
  ]),
  teamMembers: z.array(TEAM_MEMBER_SCHEMA).min(1, "Al menos un miembro"),
});

export type ProjectSubmissionSchema = z.infer<typeof PROJECT_SUBMISSION_SCHEMA>;

// Registro nativo removido: Migrado a Google Forms.