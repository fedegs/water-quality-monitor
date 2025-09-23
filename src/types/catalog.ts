export type Unit = {
  id: number
  ucum_code: string
  uncefact_code?: string | null
  display: string
}

export type Magnitude = {
  id: number
  group_name: string              // e.g. "Water"
  name_en: string                 // "Electrical Conductivity"
  abbreviation: string            // "EC"
  unit_id: number                 // preferred UCUM unit
  wqx_code?: string | null
  wmo_code?: string | null
  iso_ieee_code?: string | null
  decimals?: number | null
  allow_negative: boolean
  min_value?: number | null
  max_value?: number | null
}