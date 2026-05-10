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

// ── Hackathon Registration Schema ──
export const REGISTRATION_SCHEMA = z.object({
  teamName: z.string()
    .min(3, "El nombre del equipo debe tener al menos 3 caracteres")
    .max(60, "El nombre del equipo no puede exceder 60 caracteres")
    .regex(
      /^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s\-_]+$/,
      "El nombre del equipo solo puede contener letras, números, espacios, guiones y guiones bajos"
    ),
  
  teamDescription: z.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),

  theme: z.enum([
    "financial-inclusion",
    "lightning-payments",
    "education",
    "sovereignty",
    "social-impact",
    "dev-tools",
  ], {
    errorMap: () => ({ message: "Debes seleccionar un tema válido" }),
  }),

  members: z.array(TEAM_MEMBER_SCHEMA)
    .min(1, "Debe haber al menos 1 miembro")
    .max(4, "Máximo 4 miembros por equipo"),

  email: z.string()
    .email("Debes ingresar un correo electrónico válido")
    .max(254, "Correo electrónico demasiado largo"),

  discordUsername: z.string()
    .min(2, "El nombre de Discord debe tener al menos 2 caracteres")
    .optional()
    .or(z.literal("")),

  projectDescription: z.string()
    .min(20, "La descripción del proyecto debe tener al menos 20 caracteres")
    .max(2000, "La descripción del proyecto no puede exceder 2000 caracteres"),

  projectStack: z.array(z.string())
    .min(1, "Debes incluir al menos una tecnología")
    .max(10, "Máximo 10 tecnologías"),

  projectUrl: z.string()
    .url("Debes ingresar una URL válida para el repositorio")
    .optional()
    .or(z.literal("")),

  experienceLevel: z.enum(["beginner", "intermediate", "advanced"], {
    errorMap: () => ({ message: "Selecciona un nivel de experiencia válido" }),
  }),

  needsMentorship: z.boolean().default(false),

  agreeRules: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar las reglas del hackathon para continuar",
  }),

  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
});

export type RegistrationSchema = z.infer<typeof REGISTRATION_SCHEMA>;

export const TEAM_MEMBER_SCHEMA_DEFAULTS: z.infer<typeof TEAM_MEMBER_SCHEMA> = {
  nombre: "",
  rol: "",
  ubicacion: "",
  github: "",
  linkedin: "",
};

export const REGISTRATION_DEFAULTS: RegistrationSchema = {
  teamName: "",
  teamDescription: "",
  theme: "financial-inclusion",
  members: [{ ...TEAM_MEMBER_SCHEMA_DEFAULTS }],
  email: "",
  discordUsername: "",
  projectDescription: "",
  projectStack: [],
  projectUrl: "",
  experienceLevel: "intermediate",
  needsMentorship: false,
  agreeRules: false,
  agreeTerms: false,
};

// ── Validation helper ──
export function validateRegistration(data: unknown) {
  const result = REGISTRATION_SCHEMA.safeParse(data);
  
  if (result.success) return { success: true as const, data: result.data };
  
  return { 
    success: false as const, 
    errors: result.error.flatten().fieldErrors,
  };
}

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