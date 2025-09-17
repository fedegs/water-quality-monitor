import type { ParameterKey } from "@/types"
import { Battery, Droplets, Gauge, Thermometer, Waves, Zap, type LucideIcon } from "lucide-react"

type ParameterConfig = {
  label: string
  icon: LucideIcon,
  unit?: string
  goodRange: [number, number]
  warningRange: [number, number]
}

export const parameterConfig: Record<ParameterKey, ParameterConfig> = {
  ph: {
    label: "Nivel de pH",
    icon: Droplets,
    goodRange: [6.5, 8.5],
    warningRange: [6, 9],
  },
  orp: {
    label: "Potencial de Oxidación-Reducción",
    icon: Battery,
    unit: "mV",
    goodRange: [300, 400],
    warningRange: [250, 450],
  },
  ec: {
    label: "Electro conductividad",
    icon: Zap,
    unit: "μS/cm",
    goodRange: [200, 500],
    warningRange: [100, 600],
  },
  tds: {
    label: "Sólidos disueltos totales",
    icon: Gauge,
    unit: "ppm",
    goodRange: [200, 400],
    warningRange: [100, 800],
  },
  sal: {
    label: "Salinidad",
    icon: Waves,
    unit: "ppt",
    goodRange: [30, 35],
    warningRange: [25, 40],
  },
  sg: {
    label: "Gravedad específica",
    icon: Gauge,
    goodRange: [1.024, 1.026],
    warningRange: [1.02, 1.03],
  },
  temp: {
    label: "Temperatura",
    icon: Thermometer,
    unit: "°C",
    goodRange: [15, 25],
    warningRange: [10, 30],
  },
}