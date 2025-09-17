import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { parameterConfig } from "@/config/parameters"
import type { ParameterKey, Location } from "@/types"
import { Calendar, Filter, TrendingUp } from "lucide-react"
import { useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type DateRange = "7d" | "30d" | "90d"

type LocationHistoryProps = {
  location: Location
}

const data = [
  { name: 'Día 1', ph: 6.8 },
  { name: 'Día 2', ph: 6.9 },
  { name: 'Día 3', ph: 7.1 },
  { name: 'Día 4', ph: 7.0 },
  { name: 'Día 5', ph: 7.2 },
  { name: 'Día 6', ph: 7.3 },
  { name: 'Día 7', ph: 7.1 },
]

function LocationHistory({ location }: LocationHistoryProps) {
  const [showAllParameters, setShowAllParameters] = useState(false)
  const [selectedParameter, setSelectedParameter] = useState<ParameterKey>("ph")
  const [dateRange, setDateRange] = useState<DateRange>("7d")
  const selectedConfig = parameterConfig[selectedParameter]

  // todo: data fetching

  const trend = 3 // todo: calculate trend

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold">Datos históricos - {location.name}</h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowAllParameters(!showAllParameters)}
              className="text-xs sm:text-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{showAllParameters ? "Un parámetro" : "Todos los parámetros"}</span>
              <span className="sm:hidden">{showAllParameters ? "Uno" : "Todos"}</span>
            </Button>
          </div>
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
            <Select value={selectedParameter} onValueChange={(value: ParameterKey) => setSelectedParameter(value)}>
              <SelectTrigger className="w-full sm:w-68">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(parameterConfig).map(key => {
                  const config = parameterConfig[key as ParameterKey]
                  return (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  )
                })}
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
                {showAllParameters ? "Todos los parámetros" : selectedConfig.label}
              </span>
              {!showAllParameters && selectedConfig.unit && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {selectedConfig.unit}
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
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={['dataMin - 0.2', 'dataMax + 0.2']} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ph" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default LocationHistory