import { useEffect, useState } from "react"
import type { Location, Measurement, MeasuredValue, Magnitude } from "@/types"
import { getLatestMeasurementByLocation, getMagnitudes } from "@/services/api"
import Spinner from "@/components/ui/spinner"
import { FlaskConical } from "lucide-react"
import MeasureCard from "@/components/measure-card"

type MeasurementDetail = Measurement & {
  values: (MeasuredValue & { unit: string })[]
}

function LocationLastMeasure({ location }: { location: Location }) {
  const [data, setData] = useState<MeasurementDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magsById, setMagsById] = useState<Record<number, Magnitude>>({})

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true

    async function run() {
      setLoading(true)
      setError(null)
      setData(null)
      try {
        const res = await getLatestMeasurementByLocation(location.id)
        if (!mounted || ac.signal.aborted) return
        setData(res) // puede ser null
      } catch (e) {
        if (!mounted || ac.signal.aborted) return
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        if (mounted && !ac.signal.aborted) setLoading(false)
      }
    }

    run()
    return () => { mounted = false; ac.abort() }
  }, [location.id])

  useEffect(() => {
    let mounted = true
    getMagnitudes()
      .then(list => { if (mounted) setMagsById(Object.fromEntries(list.map(m => [m.id, m]))) })
      .catch(console.error)
    return () => { mounted = false }
  }, [])

  const lastUpdate =
    !loading && data ? `Actualizado: ${new Date(data.sampled_at).toLocaleString()}` : ""

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg sm:text-xl font-semibold">Última medición</h2>
        <div className="text-xs sm:text-sm text-muted-foreground">{lastUpdate}</div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center"><Spinner /></div>
      ) : error ? (
        <div className="text-sm text-red-500">Error cargando la medición: {error}</div>
      ) : !data ? (
        <div className="flex min-h-[20vh] flex-col items-center justify-center text-center text-muted-foreground">
          <FlaskConical className="h-8 w-8 text-primary" />
          <p className="mt-2 text-sm">No hay mediciones disponibles para esta ubicación.</p>
          <p className="text-xs">Probá otra ubicación o volvé más tarde.</p>
        </div>
      ) : Object.keys(magsById).length === 0 ? (
        <div className="flex items-center justify-center"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.values.map(v => {
            const mag = magsById[v.magnitude_id]
            if (!mag) return null
            return (
              <MeasureCard
                key={`${data.id}-${v.magnitude_id}`}
                value={v}
                magnitude={mag}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LocationLastMeasure
