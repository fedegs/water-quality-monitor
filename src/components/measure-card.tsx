import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Magnitude, MeasuredValue } from "@/types"
import { Battery, Droplets, Gauge, Thermometer, Waves, Zap, type LucideIcon } from "lucide-react"

type MeasureCardProps = {
  value: MeasuredValue & { unit: string } // viene del /api/measurement/:id (handler ya lo enriquece)
  magnitude: Magnitude                     // viene de /api/magnitudes/list
}

function formatValue(n: number, decimals = 0) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
type Status = "good" | "warning" | "critical" | "unknown"

function getStatusFromSnapshots(value: MeasureCardProps["value"]): Status {
  const x = value.value_numeric
  const min = value.snapshot_min_acceptable
  const max = value.snapshot_max_acceptable
  const al = value.snapshot_alert_low
  const ah = value.snapshot_alert_high

  if (min == null || max == null) return "unknown"
  if (x < min || x > max) return "critical"
  if ((al != null && x < al) || (ah != null && x > ah)) return "warning"
  return "good"
}

function getStatusBadge(status: Status) {
  switch (status) {
    case "good":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
          Good
        </Badge>
      )
    case "warning":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300">
          Warning
        </Badge>
      )
    case "critical":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">Critical</Badge>
      )
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

function getStatusColor(status: Status) {
  switch (status) {
    case "good":
      return "text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
    case "warning":
      return "text-yellow-600 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800"
    case "critical":
      return "text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
    default:
      return "text-gray-600 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800"
  }
}

function getProgressColor(status: Status) {
  switch (status) {
    case "good":
      return "bg-green-500"
    case "warning":
      return "bg-yellow-500"
    case "critical":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const iconMap: Record<string, LucideIcon> = {
  "WT": Thermometer,
  "pH": Droplets,
  "EC": Zap,
  "TDS": Gauge,
  "SAL": Waves,
  "SG": Gauge,
  "ORP": Battery
}

export default function MeasureCard({ value, magnitude }: MeasureCardProps) {
  const decimals = typeof magnitude.decimals === "number" ? magnitude.decimals : 0

  const status = getStatusFromSnapshots(value)

  const percent = value.snapshot_min_acceptable != null && value.snapshot_max_acceptable != null
    ? Math.max(0, Math.min(100, ((value.value_numeric - value.snapshot_min_acceptable) / (value.snapshot_max_acceptable - value.snapshot_min_acceptable)) * 100))
    : null

  const Icon = iconMap[magnitude.abbreviation] || Gauge
  
  return (
    <Card className={`border ${getStatusColor(status)}`}>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span>{magnitude.name_en}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            {formatValue(value.value_numeric, decimals)}
          </span>
          <span className="text-sm text-muted-foreground">{value.unit}</span>
        </div>

        <div className="flex flex-col text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Progress value={percent} indicatorClassName={getProgressColor(status)} /> %
          </div>
          <div className="flex justify-between">
            <span>
              min: {value.snapshot_min_acceptable ?? "N/A"}
            </span>
            <span>
              max: {value.snapshot_max_acceptable ?? "N/A"}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          {getStatusBadge(status)}
        </div>
      </CardContent>
    </Card>
  )
}
