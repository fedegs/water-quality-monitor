import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Magnitude, MeasuredValue } from "@/types"

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

function getStatusFromSnapshots(v: MeasuredValue) {
  const { value_numeric: x, snapshot_min_acceptable: min, snapshot_max_acceptable: max,
          snapshot_alert_low: al, snapshot_alert_high: ah } = v

  if (min != null && max != null && x >= min && x <= max) return "good"
  if (al != null && ah != null && x >= al && x <= ah)     return "warning"
  return "critical"
}

export default function MeasureCard({ value, magnitude }: MeasureCardProps) {
  const decimals = typeof magnitude.decimals === "number" ? magnitude.decimals : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {magnitude.abbreviation} · {magnitude.name_en}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-baseline justify-between">
        <span className="text-2xl font-bold">
          {formatValue(value.value_numeric, decimals)}
        </span>
        <span className="text-sm text-muted-foreground">{value.unit}</span>
      </CardContent>
    </Card>
  )
}
