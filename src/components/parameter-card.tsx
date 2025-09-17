import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { parameterConfig } from "@/config/parameters"
import type { ParameterReading } from "@/types"

function getStatusColor(status: string) {
  switch (status) {
    case "good":
      return "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
    case "warning":
      return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800"
    case "critical":
      return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800"
  }
}

function getStatusBadge(status: string) {
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

function getProgressColor(status: string) {
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

function getParameterStatus(value: number, goodRange: [number, number], warningRange: [number, number]) {
  if (value >= goodRange[0] && value <= goodRange[1]) {
    return "good"
  } else if (value >= warningRange[0] && value <= warningRange[1]) {
    return "warning"
  } else {
    return "critical"
  }
}

function getProgressValue(value: number, goodRange: [number, number], warningRange: [number, number]) {
  const min = Math.min(warningRange[0], goodRange[0])
  const max = Math.max(warningRange[1], goodRange[1])
  return ((value - min) / (max - min)) * 100
}

type ParameterCardProps = {
  parameter: ParameterReading
}

function ParameterCard({ parameter }: ParameterCardProps) {
  const config = parameterConfig[parameter.key]
  const { icon: Icon, label, goodRange, warningRange } = config
  const status = getParameterStatus(parameter.value, goodRange, warningRange)
  const progress = getProgressValue(parameter.value, goodRange, warningRange)

  return (
    <Card className={`border-2 ${getStatusColor(status)}`}>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span>{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-bold">
            {parameter.value.toFixed(1)}
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">{parameter.unit}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Range</span>
            {getStatusBadge(status)}
          </div>
          <div className="relative">
            <Progress value={Math.min(100, Math.max(0, progress))} className="h-2" indicatorClassName={getProgressColor(status)} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="truncate">
              Good: {goodRange[0]}-{goodRange[1]}
            </span>
            <span>Max: {warningRange[1]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ParameterCard