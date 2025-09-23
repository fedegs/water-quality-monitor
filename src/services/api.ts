import type {
  Location,
  Magnitude,
  Sensor,
  SensorMagnitude,
  LocationMagnitude,
  Measurement,
  MeasuredValue,
  Unit,
} from '@/types'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Error fetching ${url}: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// === Units ===
export function getUnits() {
  return fetchJson<Unit[]>('/api/units/list')
}

// === Locations ===
export function getLocations() {
  return fetchJson<Location[]>('/api/locations/list')
}

export function getLocationMagnitudes(locationId: number) {
  return fetchJson<LocationMagnitude[]>(`/api/locations/${locationId}/magnitudes/list`)
}

// === Magnitudes ===
export function getMagnitudes() {
  return fetchJson<Magnitude[]>('/api/magnitudes/list')
}

// === Sensors ===
export function getSensors() {
  return fetchJson<Sensor[]>('/api/sensors/list')
}

export function getSensorMagnitudes(sensorId: number) {
  return fetchJson<SensorMagnitude[]>(`/api/sensors/${sensorId}/magnitudes/list`)
}

// === Measurements ===
export function getMeasurements() {
  return fetchJson<Measurement[]>('/api/measurement/list')
}

export function getMeasurement(measurementId: number) {
  return fetchJson<Measurement & { values: (MeasuredValue & { unit: string })[] }>(
    `/api/measurement/${measurementId}`
  )
}

// === Latest measurement by location ===
export async function getLatestMeasurementByLocation(locationId: number) {
  // la lista ya viene ordenada (handler) y limitamos a 1
  const list = await fetchJson<Measurement[]>(
    `/api/measurement/list?location_id=${locationId}&limit=1`
  )

  if (!list.length) return null

  // pedimos el detalle con values y unit
  const latestId = list[0].id
  const detail = await getMeasurement(latestId)
  return detail // Measurement & { values: (MeasuredValue & { unit: string })[] }
}
