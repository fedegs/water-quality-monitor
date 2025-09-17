import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from "react"
import L from 'leaflet'

// --- Fix for Leaflet default icon in bundlers (Vite/CRA/Next) ---
// Import the images from the package and set them as the default icon.
// Using new URL(..., import.meta.url) works reliably in production builds.
const iconUrl = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString()
const iconRetinaUrl = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString()
const shadowUrl = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString()

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
})
// ------------------------------------------------------------------------

type RecenterMapProps = {
  center: [number, number]
  zoom: number
}

function RecenterMap({ center, zoom }: RecenterMapProps) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1
    })
  }, [center, zoom, map])

  return null
}

type LocationMapProps = {
  center?: [number, number]
}

function LocationMap({ center }: LocationMapProps) {
  const defaultCenter: [number, number] = [-32.135414, -59.304181]
  const zoomLevel = center ? 15 : 10
  const currentCenter = center ?? defaultCenter

  return (
    <div className="h-[350px] rounded-xl overflow-hidden border">
      <MapContainer className="h-full w-full" center={currentCenter} zoom={zoomLevel} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={currentCenter} />
        {center && <RecenterMap center={currentCenter} zoom={zoomLevel} />}
      </MapContainer>
    </div>
  )
}


export default LocationMap