export type Measurement = {
  id: number
  sensor_id?: number | null
  location_id: number
  entered_by?: number | null
  sampled_by?: number | null
  registered_at: string            // ISO date-time
  sampled_at: string               // ISO date-time
  status: string                   // 'received' | 'validated' | ...
  source: string                   // 'manual' | 'device' | 'import' | 'api'
  batch_id?: string | null         // UUID
  comments?: string | null
}

export type MeasuredValue = {
  id: number
  measurement_id: number
  magnitude_id: number
  unit_id: number
  value_numeric: number
  qc_flag?: string | null
  status: string
  taken_at?: string | null
  comments?: string | null
  // snapshot
  snapshot_min_acceptable?: number | null
  snapshot_max_acceptable?: number | null
  snapshot_alert_low?: number | null
  snapshot_alert_high?: number | null
  snapshot_allow_negative?: boolean | null
}
