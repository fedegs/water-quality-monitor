import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import AppLayout from "@/layouts/app-layout"
import LocationSelector from "@/components/location-selector"
import type { Location } from "@/types"
import LocationMap from "@/components/location-map"
import Spinner from "@/components/ui/spinner"
import LocationLastMeasure from "@/components/location-last-measure"
import LocationHistory from "@/components/location-history"

function App() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLocationsLoading, setIsLocationsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>()

  useEffect(() => {
    async function fetchLocations() {
      setIsLocationsLoading(true)
      const res = await fetch("/locations")
      
      if (!res.ok) {
        setIsLocationsLoading(false)
        return
      }

      const data = (await res.json()) as Location[]
      setLocations(data)
      setIsLocationsLoading(false)
      
      if (data.length > 0) {
        setSelectedLocation(data[0])
      }
    }

    fetchLocations()
  }, []);

  const handleLocationChange = (value: string) => {
    const location = locations.find(location => location.id === value)
    setSelectedLocation(location)
  }

  const center = selectedLocation 
    ? [selectedLocation.latitude, selectedLocation.longitude] as [number, number] 
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
              <LocationSelector locations={locations} value={selectedLocation?.id ?? ""} onChange={handleLocationChange}/>

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
                  <LocationHistory location={selectedLocation} />
                </>
              }
            </>
          )
      }
    </AppLayout>
  )
}

export default App
