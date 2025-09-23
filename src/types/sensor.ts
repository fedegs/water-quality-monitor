export type Sensor = {
  id: number
  name: string
  manufacturer?: string | null
  model?: string | null
  serial_number?: string | null
  sensor_type?: string | null
  installed_at?: string | null      // ISO date-time
  active: boolean
  notes?: string | null
}

export type SensorMagnitude = {
  sensor_id: number
  magnitude_id: number
  value_min?: number | null
  value_max?: number | null
  resolution?: number | null
  accuracy?: string | null
  calibrated_at?: string | null     // ISO date
  channel_name?: string | null
  notes?: string | null
}