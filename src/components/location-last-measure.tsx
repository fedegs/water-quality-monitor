import ParameterCard from "@/components/parameter-card"
import Spinner from "@/components/ui/spinner"
import type { Measurement, Location } from "@/types"
import { FlaskConical } from "lucide-react"
import { useEffect, useState } from "react"

type LocationLastMeasureProps = {
  location: Location
}

function LocationLastMeasure({ location }: LocationLastMeasureProps) {
  const [measurement, setMeasurement] = useState<Measurement>()
  const [isMeasurementLoading, setIsMeasurementLoading] = useState(false)

  useEffect(() => {
    async function fetchLastMeasure() {
      setIsMeasurementLoading(true)
      const res = await fetch(`/locations/${location.id}/measurements/latest`)

      if (!res.ok) {
        setMeasurement(undefined)
        setIsMeasurementLoading(false)
        return
      }

      const data = (await res.json()) as Measurement
      
      setMeasurement(data)
      setIsMeasurementLoading(false)
    }

    fetchLastMeasure()
  }, [location.id])

  const lastUpdate = !isMeasurementLoading && measurement 
    ? `Última actualización: ${new Date(measurement.timestamp).toLocaleString()}` 
    : ''

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg sm:text-xl font-semibold">Ultimá medición - {location.name}</h2>
        <div className="text-xs sm:text-sm text-muted-foreground">
          {lastUpdate}
        </div>
      </div>
      {
        isMeasurementLoading 
          ? (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          )
          : measurement ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {measurement.readings.map(reading => (
                <ParameterCard key={`${measurement.id}-${reading.key}`} parameter={reading} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[20vh] flex-col items-center justify-center text-center text-muted-foreground">
              <FlaskConical className="h-8 w-8 text-primary" />
              <p className="mt-2 text-sm">No hay mediciones disponibles</p>
              <p className="text-xs">Probá otra ubicación o volvé más tarde.</p>
            </div>
          )
      }
    </div>
  )
}

export default LocationLastMeasure