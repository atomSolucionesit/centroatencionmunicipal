"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Truck, Clock } from "lucide-react"
import type { DriverStatus } from "@/lib/api/tasks"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

interface DriversMapProps {
  drivers: DriverStatus[]
}

export function DriversMap({ drivers }: DriversMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card>
        <CardContent className="h-[600px] flex items-center justify-center">
          <p className="text-muted-foreground">Cargando mapa...</p>
        </CardContent>
      </Card>
    )
  }

  const driversWithLocation = drivers.filter(d => d.lastLocation)
  const center = driversWithLocation.length > 0
    ? [driversWithLocation[0].lastLocation!.lat, driversWithLocation[0].lastLocation!.lng]
    : [-34.6037, -58.3816] // Buenos Aires default

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación de Choferes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapContainer
              center={center as [number, number]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {driversWithLocation.map((driver) => (
                <Marker
                  key={driver.driver.id}
                  position={[driver.lastLocation!.lat, driver.lastLocation!.lng]}
                >
                  <Popup>
                    <p className="font-semibold">{driver.driver.name}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <Card key={driver.driver.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{driver.driver.name}</p>
                  <Badge variant={driver.status === "IN_PROGRESS" ? "default" : "secondary"}>
                    {driver.status}
                  </Badge>
                </div>

                {driver.vehicle && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">{driver.vehicle.licensePlate}</span>
                  </div>
                )}

                {driver.activeTask && (
                  <div className="text-sm">
                    <p className="font-medium">{driver.activeTask.type}</p>
                    <p className="text-muted-foreground truncate">{driver.activeTask.address}</p>
                  </div>
                )}

                {driver.lastLocation ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>
                      Actualizado {formatDistanceToNow(new Date(driver.lastLocation.timestamp), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Sin ubicación</p>
                )}

                {driver.tracking && (
                  <Badge variant="outline" className="text-xs">
                    Riesgo: {driver.tracking.riskLevel}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
