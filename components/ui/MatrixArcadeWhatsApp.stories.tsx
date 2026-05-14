import type { Meta, StoryObj } from "@storybook/react"
import MatrixArcadeWhatsApp from "./MatrixArcadeWhatsApp"

const meta: Meta<typeof MatrixArcadeWhatsApp> = {
  title: "UI/MatrixArcadeWhatsApp",
  component: MatrixArcadeWhatsApp,
  tags: ["autodocs"],
  argTypes: {
    phoneNumber: {
      control: "text",
      description: "Número de teléfono con código de país",
    },
    message: {
      control: "text",
      description: "Mensaje prellenado para WhatsApp",
    },
    label: {
      control: "text",
      description: "Texto del label debajo del ícono",
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg", "xl"],
      description: "Tamaño del botón",
    },
    enableMatrixRain: {
      control: "boolean",
      description: "Activar efecto Matrix Rain al hacer hover",
    },
    enableSound: {
      control: "boolean",
      description: "Activar sonido arcade al hacer click",
    },
    onlineStatus: {
      control: { type: "radio" },
      options: ["online", "away", "offline"],
      description: "Estado de conexión",
    },
    lastSeen: {
      control: "text",
      description: "Texto de última vez visto (cuando no está online)",
    },
  },
} satisfies Meta<typeof MatrixArcadeWhatsApp>

export default meta

type Story = StoryObj<typeof MatrixArcadeWhatsApp>

export const Default: Story = {
  args: {
    phoneNumber: "521234567890",
    label: "WhatsApp",
    size: "lg",
  },
}

export const SmallSize: Story = {
  args: {
    phoneNumber: "521234567890",
    label: "Contáctanos",
    size: "sm",
  },
}

export const MediumSize: Story = {
  args: {
    phoneNumber: "521234567890",
    label: "Escríbenos",
    size: "md",
  },
}

export const ExtraLargeSize: Story = {
  args: {
    phoneNumber: "521234567890",
    label: "Soporte 24/7",
    size: "xl",
  },
}

export const WithMessage: Story = {
  args: {
    phoneNumber: "521234567890",
    message: "¡Hola! Me interesa conocer más sobre sus servicios de Bitcoin.",
    label: "Cotizar",
    size: "lg",
  },
}

export const OfflineStatus: Story = {
  args: {
    phoneNumber: "521234567890",
    label: "Dejamos un mensaje",
    onlineStatus: "offline",
    lastSeen: "hace 2h",
    size: "lg",
  },
}

export const AwayStatus: Story = {
  args: {
    phoneNumber: "521234567890",
    label: "En unos minutos",
    onlineStatus: "away",
    lastSeen: "hace 15min",
    size: "lg",
  },
}

export const NoRain: Story = {
  args: {
    phoneNumber: "521234567890",
    label: "Sin lluvia",
    enableMatrixRain: false,
    size: "lg",
  },
}

export const CustomHref: Story = {
  args: {
    href: "https://wa.me/521234567890?text=Hola%20me%20interesa",
    label: "Chat Directo",
    size: "lg",
  },
}