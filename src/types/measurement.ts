import type { ParameterReading } from "@/types/parameter"

export type Measurement = {
  id: string
  timestamp: string
  readings: ParameterReading[]
}

export type MeasurementsByLocation = Record<string, Measurement[]>