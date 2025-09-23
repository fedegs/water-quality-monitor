import { http, HttpResponse } from 'msw'

// mock data
import locations from '@/mocks/data/locations.json'
import magnitudes from '@/mocks/data/magnitudes.json'
import sensors from '@/mocks/data/sensors.json'
import sensorMagnitudes from '@/mocks/data/sensor_magnitudes.json'
import locationMagnitudes from '@/mocks/data/location_magnitudes.json'
import measurements from '@/mocks/data/measurements.json'
import measuredValues from '@/mocks/data/measured_values.json'
import units from '@/mocks/data/units.json'

// tipos
import type {
  Location,
  Magnitude,
  Sensor,
  SensorMagnitude,
  LocationMagnitude,
  Measurement,
  MeasuredValue,
  Unit
} from '@/types'

// last measure GET /api/measurement/list?location_id=2&limit=1

export const handlers = [
  // === Units ===
  http.get('/api/units/list', () => {
    return HttpResponse.json(units as Unit[])
  }),

  // === Locations ===
  http.get('/api/locations/list', () => {
    return HttpResponse.json(locations as Location[])
  }),

  http.get('/api/locations/:idLocation/magnitudes/list', ({ params }) => {
    const { idLocation } = params
    if (!idLocation) {
      return HttpResponse.json({ message: 'Bad Request' }, { status: 400 })
    }
    const rows = (locationMagnitudes as LocationMagnitude[]).filter(
      lm => lm.location_id === Number(idLocation)
    )
    return HttpResponse.json(rows)
  }),

  // === Magnitudes ===
  http.get('/api/magnitudes/list', () => {
    return HttpResponse.json(magnitudes as Magnitude[])
  }),

  // === Sensors ===
  http.get('/api/sensors/list', () => {
    return HttpResponse.json(sensors as Sensor[])
  }),

  http.get('/api/sensors/:idSensor/magnitudes/list', ({ params }) => {
    const { idSensor } = params
    if (!idSensor) {
      return HttpResponse.json({ message: 'Bad Request' }, { status: 400 })
    }
    const rows = (sensorMagnitudes as SensorMagnitude[]).filter(
      sm => sm.sensor_id === Number(idSensor)
    )
    return HttpResponse.json(rows)
  }),

  // === Measurements ===
  http.get('/api/measurement/list', () => {
    return HttpResponse.json(measurements as Measurement[])
  }),

  http.get('/api/measurement/:idMeasurement', ({ params }) => {
    const { idMeasurement } = params
    if (!idMeasurement) {
      return HttpResponse.json({ message: 'Bad Request' }, { status: 400 })
    }

    const meas = (measurements as Measurement[]).find(
      m => m.id === Number(idMeasurement)
    )
    if (!meas) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }

    // attach measured values + enrich with unit display
    const values = (measuredValues as MeasuredValue[])
      .filter(v => v.measurement_id === meas.id)
      .map(v => {
        const unit = (units as Unit[]).find(u => u.id === v.unit_id)
        return {
          ...v,
          unit: unit ? unit.display : ''
        }
      })

    return HttpResponse.json({ ...meas, values })
  })
]
