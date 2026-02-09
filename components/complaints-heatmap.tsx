"use client"

import { useEffect, useRef, useState } from "react"

interface HeatmapProps {
  complaints: Array<{
    latitude?: number
    longitude?: number
  }>
}

export function ComplaintsHeatmap({ complaints }: HeatmapProps) {
  const mapRef = useRef<any>(null)
  const heatLayerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || mapRef.current) return

    import("leaflet").then((L) => {
      import("leaflet.heat").then(() => {
        if (containerRef.current && !mapRef.current) {
          containerRef.current.innerHTML = ""
          
          const map = L.default.map(containerRef.current).setView([-29.7167, -57.0833], 13)

          L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map)

          mapRef.current = map
          setMapReady(true)
        }
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      setMapReady(false)
    }
  }, [])

  useEffect(() => {
    if (!mapReady || !mapRef.current || typeof window === "undefined") return

    import("leaflet").then((L) => {
      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null
      }

      const heatData = complaints
        .filter((c) => c.latitude && c.longitude)
        .map((c) => [Number(c.latitude), Number(c.longitude), 1] as [number, number, number])

      if (heatData.length > 0) {
        // @ts-ignore
        heatLayerRef.current = L.default.heatLayer(heatData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          max: 1.0,
          gradient: {
            0.0: "blue",
            0.5: "yellow",
            1.0: "red",
          },
        }).addTo(mapRef.current)

        const bounds = L.default.latLngBounds(heatData.map(([lat, lng]) => [lat, lng]))
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
      } else {
        const popup = L.default.popup()
          .setLatLng([-29.7167, -57.0833])
          .setContent('<div style="text-align: center;"><strong>Sin datos de ubicación</strong><br/>Los reclamos no tienen coordenadas geográficas</div>')
          .openOn(mapRef.current)
      }
    })
  }, [mapReady, complaints])

  return <div ref={containerRef} className="w-full h-[600px] rounded-lg border" />
}
