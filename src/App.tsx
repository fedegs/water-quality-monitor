import LocationLastMeasure from "@/components/location-last-measure"
import LocationMap from "@/components/location-map"
import LocationSelector from "@/components/location-selector"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Spinner from "@/components/ui/spinner"
import AppLayout from "@/layouts/app-layout"
import { getLocations } from "@/services/api"
import type { Location } from "@/types"
import { MapPin } from "lucide-react"
import { useEffect, useState } from "react"

function App() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLocationsLoading, setIsLocationsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>()

  useEffect(() => {
    setIsLocationsLoading(true)
    getLocations()
      .then(locations => {
        setLocations(locations)
        if (locations.length > 0) setSelectedLocation(locations[0])
      })
      .catch(console.error)
      .finally(() => setIsLocationsLoading(false))
  }, [])

  const handleLocationChange = (id: string) => {
    const location = locations?.find(l => l.id.toString() === id)
    setSelectedLocation(location)
  }

  const center = (typeof selectedLocation?.lat_dd === 'number' && typeof selectedLocation?.lon_dd === 'number')
  ? [selectedLocation.lat_dd, selectedLocation.lon_dd] as [number, number]
  : undefined


  return (
    <AppLayout>
      { 
        isLocationsLoading
          ? (
            <div className="flex items-center justify-center">
              <Spinner className="w-10 h-10" />
            </div>
          )
          : (

            <>
              <LocationSelector 
                locations={locations}
                onChange={handleLocationChange}
                value={selectedLocation?.id.toString() ?? ''}
              />

              <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <h2 className="text-base sm:text-lg font-semibold">Ubicación</h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LocationMap center={center} />
                  </CardContent>
                </Card>
                
                {
                  selectedLocation && 
                  <>
                    <LocationLastMeasure location={selectedLocation} />
                  </>
                }
              </>

          )

      }
    </AppLayout>
  )
}

export default App
