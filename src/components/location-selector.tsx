import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Location } from "@/types"
import { MapPin } from "lucide-react"

type LocationSelectorProps = {
  locations: Location[]
  value: string
  onChange: (value: string) => void
}

function LocationSelector({ locations, value, onChange }: LocationSelectorProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="flex-1">
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar ubicación" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {
                  locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LocationSelector
