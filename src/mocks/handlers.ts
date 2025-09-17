import { http, HttpResponse } from 'msw'
import locations from '@/mocks/data/locations.json'
import measurements from '@/mocks/data/measurements.json'
import type { Measurement, MeasurementsByLocation } from '@/types'

export const handlers = [
  http.get('/locations', () => {
    return HttpResponse.json(locations)
  }),

  http.get('/locations/:locationId/measurements/latest', ({ params }) => {
    const { locationId } = params

    if (!locationId) {
      return HttpResponse.json({ message: "Bad Request" }, { status: 400 })
    }

    const byLocation = measurements as MeasurementsByLocation
    const rows: Measurement[] = byLocation[locationId as string] ?? []
  
    if (!rows.length) return HttpResponse.json({message: 'Not found'}, {status: 404})
  
    // copy and sort by unix timestamp
    const latest = rows
      .slice()
      .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))[0]
  
    return HttpResponse.json(latest)
  })
]