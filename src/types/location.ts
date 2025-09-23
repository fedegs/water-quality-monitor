export type Location = {
  id: number
  name: string
  description?: string | null
  lat_dd?: number | null
  lon_dd?: number | null
  altitude_m?: number | null
  address?: string | null
  active: boolean
  created_at?: string | null
}

export type LocationMagnitude = {
  location_id: number
  magnitude_id: number
  min_acceptable?: number | null
  max_acceptable?: number | null
  alert_low?: number | null
  alert_high?: number | null
  sampling_plan?: string | null
  required: boolean
  notes?: string | null
}