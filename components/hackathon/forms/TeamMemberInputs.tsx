// ============================================================
// TEAM MEMBER INPUTS — Dynamic team member form fields
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RegistrationSchema } from "@/lib/hackathon/validation";
import { Plus, X } from "lucide-react";

interface TeamMemberInputsProps {
  register: UseFormRegister<RegistrationSchema>;
  errors: FieldErrors<RegistrationSchema>;
  members: number;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function TeamMemberInputs({
  register,
  errors,
  members,
  onAdd,
  onRemove,
}: TeamMemberInputsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="hackathon-form-label mb-0">Miembros del Equipo</label>
        <button
          type="button"
          onClick={onAdd}
          disabled={members >= 4}
          className="inline-flex items-center gap-1 text-xs font-mono text-bitcoin hover:text-bitcoin/80 disabled:opacity-50"
        >
          <Plus className="h-3 w-3" />
          Agregar miembro
        </button>
      </div>

      <div className="space-y-3">
        {Array.from({ length: members }).map((_, idx) => (
          <div key={idx} className="hackathon-member-group">
            <div className="hackathon-member-header">
              <span className="hackathon-member-index">Miembro {idx + 1}</span>
              {members > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="hackathon-member-remove"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input
                  {...register(`members.${idx}.nombre` as const)}
                  className="hackathon-form-input text-sm"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <input
                  {...register(`members.${idx}.rol` as const)}
                  className="hackathon-form-input text-sm"
                  placeholder="Rol (ej: Frontend)"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}