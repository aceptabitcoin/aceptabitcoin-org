// ============================================================
// REGISTRATION FORM — Main multi-step registration form
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { REGISTRATION_SCHEMA, type RegistrationSchema, TEAM_MEMBER_SCHEMA_DEFAULTS } from "@/lib/hackathon/validation";

import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegistrationFormProps {
  defaults?: RegistrationSchema;
  className?: string;
}

const FORM_STEPS = [
  { id: 1, title: "Equipo", icon: Users },
  { id: 2, title: "Contacto", icon: CheckCircle },
  { id: 3, title: "Proyecto", icon: CheckCircle },
  { id: 4, title: "Confirmar", icon: CheckCircle },
];

export default function RegistrationForm({ defaults, className }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(defaults?.members?.length || 1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationSchema>({
    resolver: zodResolver(REGISTRATION_SCHEMA) as any,
    defaultValues: defaults || {
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
    },
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const addMember = () => setMemberCount((m) => Math.min(m + 1, 4));
  const removeMember = () => setMemberCount((m) => Math.max(m - 1, 1));

  const onSubmit = async (data: RegistrationSchema) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setIsSubmitted(true);
    } catch (e) {
      setError("Error al enviar el registro. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-matrix/20 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-matrix" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-white">
          ¡Registro Exitoso!
        </h3>
        <p className="font-mono text-gray-400 max-w-md mx-auto">
          Tu equipo ha sido registrado. Recibirás un correo de confirmación
          con los próximos pasos.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="hackathon-btn-primary mt-4"
        >
          Registrar otro equipo
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-8", className)}>
      {/* Progress Indicator */}
      <div className="hackathon-progress-track">
        {FORM_STEPS.map((s, idx) => (
          <div key={s.id} className="hackathon-progress-step">
            <div
              className={cn(
                "hackathon-progress-icon",
                step === s.id && "hackathon-progress-active",
                step > s.id && "hackathon-progress-completed",
                step < s.id && "hackathon-progress-upcoming"
              )}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <span className="hackathon-progress-label">{s.title}</span>
            {idx < FORM_STEPS.length - 1 && (
              <div className="hackathon-progress-bar">
                <div
                  className="hackathon-progress-bar-fill"
                  style={{ width: step > idx + 1 ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="hackathon-form-section-title">
              <Users className="h-5 w-5" /> Información del Equipo
            </h3>
            
            <div>
              <label className="hackathon-form-label" htmlFor="teamName">
                Nombre del Equipo *
              </label>
              <input
                id="teamName"
                {...register("teamName")}
                className="hackathon-form-input"
                placeholder="Ej: SatoshiSquad"
              />
              {errors.teamName && (
                <p className="hackathon-form-error">{errors.teamName.message}</p>
              )}
            </div>

            <div>
              <label className="hackathon-form-label" htmlFor="teamDescription">
                Descripción del Equipo *
              </label>
              <textarea
                id="teamDescription"
                {...register("teamDescription")}
                className="hackathon-form-input min-h-[100px] resize-none"
                placeholder="Describe brevemente a tu equipo y su experiencia..."
              />
              {errors.teamDescription && (
                <p className="hackathon-form-error">{errors.teamDescription.message}</p>
              )}
            </div>

            {/* Theme Selection */}
            <div>
              <label className="hackathon-form-label">Tema del Proyecto *</label>
              <select
                {...register("theme")}
                className="hackathon-form-input"
              >
                <option value="financial-inclusion">Inclusión Financiera 🏦</option>
                <option value="lightning-payments">Pagos Lightning ⚡</option>
                <option value="education">Educación Bitcoin 📚</option>
                <option value="sovereignty">Soberanía Digital 🛡️</option>
                <option value="social-impact">Impacto Social 🌎</option>
                <option value="dev-tools">Herramientas Dev 🔧</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="hackathon-form-section-title">
              <CheckCircle className="h-5 w-5" /> Contacto y Experiencia
            </h3>
            
            <div>
              <label className="hackathon-form-label" htmlFor="email">
                Correo Electrónico *
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="hackathon-form-input"
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="hackathon-form-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="hackathon-form-label" htmlFor="discordUsername">
                Usuario Discord
              </label>
              <input
                id="discordUsername"
                {...register("discordUsername")}
                className="hackathon-form-input"
                placeholder="usuario#1234"
              />
              <p className="hackathon-form-help">Opcional. Útil para comunicarte con mentores.</p>
            </div>

            <div>
              <label className="hackathon-form-label" htmlFor="experienceLevel">
                Nivel de Experiencia *
              </label>
              <select
                id="experienceLevel"
                {...register("experienceLevel")}
                className="hackathon-form-input"
              >
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="hackathon-form-section-title">
              <ArrowRight className="h-5 w-5" /> Detalles del Proyecto
            </h3>
            
            <div>
              <label className="hackathon-form-label" htmlFor="projectDescription">
                Descripción del Proyecto *
              </label>
              <textarea
                id="projectDescription"
                {...register("projectDescription")}
                className="hackathon-form-input min-h-[120px] resize-none"
                placeholder="Describe tu proyecto..."
              />
              {errors.projectDescription && (
                <p className="hackathon-form-error">{errors.projectDescription.message}</p>
              )}
            </div>

            <div>
              <label className="hackathon-form-label" htmlFor="projectStack">
                Tecnologías (separadas por coma) *
              </label>
              <input
                id="projectStack"
                {...register("projectStack")}
                className="hackathon-form-input"
                placeholder="Next.js, TypeScript, Lightning SDK..."
              />
            </div>

            <div>
              <label className="hackathon-form-label" htmlFor="projectUrl">
                URL del Repositorio
              </label>
              <input
                id="projectUrl"
                type="url"
                {...register("projectUrl")}
                className="hackathon-form-input"
                placeholder="https://github.com/tu-usuario/tu-proyecto"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="hackathon-form-section-title">
              ✓ Confirmar Registro
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer p-4 hackathon-card">
                <input
                  type="checkbox"
                  {...register("agreeRules")}
                  className="mt-1 accent-bitcoin w-4 h-4"
                />
                <span className="font-mono text-sm text-gray-300 leading-relaxed">
                  Acepto las <strong className="text-bitcoin">reglas del hackathon</strong>, incluyendo el uso de código
                  open source y el respeto al código de conducta.
                </span>
              </label>
              {errors.agreeRules && (
                <p className="hackathon-form-error">{errors.agreeRules.message}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer p-4 hackathon-card">
                <input
                  type="checkbox"
                  {...register("agreeTerms")}
                  className="mt-1 accent-bitcoin w-4 h-4"
                />
                <span className="font-mono text-sm text-gray-300 leading-relaxed">
                  Acepto los <strong className="text-bitcoin">términos y condiciones</strong> del evento.
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="hackathon-form-error">{errors.agreeTerms.message}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        {step > 1 && (
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            className="border-white/10 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
        )}
        {step < 4 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="ml-auto bg-bitcoin text-black hover:bg-bitcoin/90"
          >
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto hackathon-btn-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Completar Registro
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}