"use client"

import { useEffect, useRef, useState } from "react"

interface LocationPickerProps {
  address: string
  onLocationSelect: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

export function LocationPicker({ address, onLocationSelect, initialLat, initialLng }: LocationPickerProps) {
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || mapRef.current) return

    import("leaflet").then((L) => {
      if (containerRef.current && !mapRef.current) {
        containerRef.current.innerHTML = ""
        
        const map = L.default.map(containerRef.current).setView([initialLat || -29.7167, initialLng || -57.0833], 13)

        L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map)

        if (initialLat && initialLng) {
          markerRef.current = L.default.marker([initialLat, initialLng]).addTo(map)
        }

        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng
          
          if (markerRef.current) {
            map.removeLayer(markerRef.current)
          }
          
          markerRef.current = L.default.marker([lat, lng]).addTo(map)
          onLocationSelect(lat, lng)
        })

        mapRef.current = map
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!address || address.length < 5 || !mapRef.current) return

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ", Paso de los Libres, Corrientes, Argentina")}&format=json&limit=1`
        )
        const data = await response.json()
        
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat)
          const lng = parseFloat(data[0].lon)
          
          import("leaflet").then((L) => {
            if (mapRef.current) {
              mapRef.current.setView([lat, lng], 15)
              
              if (markerRef.current) {
                mapRef.current.removeLayer(markerRef.current)
              }
              
              markerRef.current = L.default.marker([lat, lng]).addTo(mapRef.current)
              onLocationSelect(lat, lng)
            }
          })
        }
      } catch (error) {
        console.error("Error buscando dirección:", error)
      } finally {
        setSearching(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [address, onLocationSelect])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div className="relative">
        <div ref={containerRef} className="w-full h-[300px] rounded-lg border" />
        {searching && (
          <div className="absolute top-2 right-2 bg-background/90 px-3 py-1 rounded-md text-xs">
            Buscando...
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Haz clic en el mapa para ajustar la ubicación exacta
      </p>
    </>
  )
}
