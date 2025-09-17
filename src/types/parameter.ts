export type ParameterKey = "ph" | "orp" | "ec" | "tds" | "sal" | "sg" | "temp"

export type ParameterReading = {
  key: ParameterKey
  value: number
  unit: string
}