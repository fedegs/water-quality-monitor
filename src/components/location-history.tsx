import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMagnitudes, getMagnitudesWithUnits, getMeasurementsByLocation } from "@/services/api"
import type { Magnitude, Location, Measurement, MeasuredValue } from "@/types"
import { Calendar, Filter, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type DateRange = "7d" | "30d" | "90d"

type LocationHistoryProps = {
  location: Location
}

const dateRangeMap: Record<DateRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
}

function calculateTrend(data: { name: string; value: number | null }[]) {
  // filtramos los valores válidos
  const values = data.map(d => d.value).filter((v): v is number => v !== null)
  if (values.length < 2) return 0

  // calculamos diferencias consecutivas
  const deltas = values.slice(1).map((v, i) => v - values[i])

  // promedio de cambios
  const avgDelta = deltas.reduce((sum, d) => sum + d, 0) / deltas.length

  // porcentaje relativo respecto al valor inicial
  const trendPercent = (avgDelta / values[0]) * 100
  return trendPercent
}


function LocationHistory({ location }: LocationHistoryProps) {
  const [showAllParameters, setShowAllParameters] = useState(false)
  const [selectedMagnitude, setSelectedMagnitude] = useState<(Magnitude & { unit: string }) | null>(null)
  const [measurements, setMeasurements] = useState<(Measurement & { values: (MeasuredValue & { unit: string })[] })[]>([])
  const [dateRange, setDateRange] = useState<DateRange>("7d")
  const [magnitudes, setMagnitudes] = useState<(Magnitude & { unit: string })[]>([])

  useEffect(() => {
    getMagnitudesWithUnits()
      .then(setMagnitudes)
      .catch(console.error)
  }, [])


  useEffect(() => {
    async function fetchData() {
      try {
        const limit = dateRangeMap[dateRange]
        const measurements = await getMeasurementsByLocation(location.id, limit)
        setMeasurements(measurements)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [location.id, dateRange])

  const [chartData, setChartData] = useState<{ name: string; value: number | null }[]>([])

  useEffect(() => {
    if (!selectedMagnitude || measurements.length === 0) return

    const dataset = measurements.map((m) => {
      const valueObj = m.values.find(v => v.magnitude_id.toString() === selectedMagnitude.id.toString())
      return {
        name: new Date(m.sampled_at).toLocaleDateString(),
        value: valueObj?.value_numeric ?? null,
      }
    })

    setChartData(dataset)
  }, [selectedMagnitude, measurements])

  const trend = calculateTrend(chartData)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold">Datos históricos</h2>
          {/* <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowAllParameters(!showAllParameters)}
              className="text-xs sm:text-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{showAllParameters ? "Un parámetro" : "Todos los parámetros"}</span>
              <span className="sm:hidden">{showAllParameters ? "Uno" : "Todos"}</span>
            </Button>
          </div> */}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!showAllParameters && (
            <Select value={selectedMagnitude?.id.toString()} onValueChange={(value: string) => {
              const magnitude = magnitudes.find(m => m.id.toString() === value) ?? null
              setSelectedMagnitude(magnitude)
            }}>
              <SelectTrigger className="w-full sm:w-68">
                <SelectValue placeholder="Seleccione un parámetro" />
              </SelectTrigger>
              <SelectContent>
                {
                  magnitudes.map(m => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.name_en}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          )}

          {!showAllParameters && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Tendencia:</span>
              <Badge>
                {trend > 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </Badge>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm sm:text-base">
                {showAllParameters ? "Todos los parámetros" : selectedMagnitude?.name_en}
              </span>
              {!showAllParameters && selectedMagnitude?.unit && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {selectedMagnitude.unit}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line name={selectedMagnitude?.name_en} type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default LocationHistory