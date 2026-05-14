import * as React from "react"

interface MatrixPhoneIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

/**
 * MatrixPhoneIcon — Ícono de teléfono estilo Matrix.
 * Reutilizable en cualquier componente de la UI.
 *
 * Nota: MatrixArcadeWhatsApp.tsx lo define inline y lo exporta,
 *       por lo que este archivo es opcional si se prefiere la
 *       importación centralizada desde el componente.
 */
export default function MatrixPhoneIcon({
  className,
  ...props
}: MatrixPhoneIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <rect x="7" y="4" width="10" height="14" rx="1.5" fill="currentColor" opacity="0.25" />
      <rect x="9" y="3" width="6" height="1.2" rx="0.6" fill="currentColor" />
      <circle cx="12" cy="19.5" r="1.1" fill="currentColor" />
      <path d="M8 11 Q12 7 16 11" strokeWidth="1" opacity="0.7" />
      <path d="M6.5 13 Q12 8 17.5 13" strokeWidth="0.8" opacity="0.4" />
    </svg>
  )
}