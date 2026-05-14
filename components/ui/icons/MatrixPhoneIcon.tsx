import * as React from "react"

interface MatrixPhoneIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

/**
 * MatrixPhoneIcon — Versión mejorada y clara
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
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Cuerpo del teléfono */}
      <rect 
        x="6" 
        y="3" 
        width="12" 
        height="18" 
        rx="2.8" 
        strokeWidth="1.8"
      />

      {/* Pantalla */}
      <rect 
        x="8" 
        y="6" 
        width="8" 
        height="13" 
        rx="1" 
        fill="currentColor" 
        opacity="0.15" 
      />

      {/* Cámara frontal */}
      <circle 
        cx="12" 
        cy="8.5" 
        r="1" 
        fill="currentColor" 
      />

      {/* Altavoz (speaker) */}
      <rect 
        x="9.5" 
        y="4.2" 
        width="5" 
        height="1" 
        rx="0.5" 
        fill="currentColor" 
      />

      {/* Botón inferior (home indicator) */}
      <rect 
        x="10" 
        y="17.5" 
        width="4" 
        height="1.2" 
        rx="0.6" 
        fill="currentColor" 
      />

      {/* Detalle Matrix sutil (línea diagonal brillante) */}
      <path 
        d="M8.5 11 L15.5 14.5" 
        stroke="currentColor" 
        strokeWidth="0.8" 
        opacity="0.55" 
      />
    </svg>
  )
}