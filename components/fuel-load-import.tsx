"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, FileSpreadsheet } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import type { Vehicle } from "@/lib/api/vehicles"

interface FuelLoadImportProps {
  vehicles: Vehicle[]
  onImport: (loads: any[]) => Promise<void>
}

export function FuelLoadImport({ vehicles, onImport }: FuelLoadImportProps) {
  const [loading, setLoading] = useState(false)

  const downloadTemplate = () => {
    const template = [
      {
        "Patente": "ABC123",
        "Litros": 50,
        "Unidad Trabajo": 5,
        "Tipo Unidad": "VIAJES",
        "Estación": "YPF Centro",
        "Fecha (DD/MM/YYYY)": "01/01/2025",
        "Notas": "Ejemplo"
      }
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Cargas")
    XLSX.writeFile(wb, "plantilla_cargas_combustible.xlsx")
    toast.success("Plantilla descargada")
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      const loads = jsonData.map((row: any) => {
        const vehicle = vehicles.find(v => v.licensePlate === row["Patente"])
        if (!vehicle) throw new Error(`Vehículo ${row["Patente"]} no encontrado`)

        const dateParts = row["Fecha (DD/MM/YYYY)"]?.split("/")
        const recordedAt = dateParts 
          ? new Date(dateParts[2], dateParts[1] - 1, dateParts[0]).toISOString()
          : new Date().toISOString()

        return {
          vehicleId: vehicle.id,
          quantity: parseFloat(row["Litros"]),
          workUnit: row["Unidad Trabajo"] ? parseFloat(row["Unidad Trabajo"]) : undefined,
          workUnitType: row["Tipo Unidad"] || undefined,
          station: row["Estación"] || undefined,
          notes: row["Notas"] || undefined,
          recordedAt,
        }
      })

      await onImport(loads)
      toast.success(`${loads.length} cargas importadas`)
      e.target.value = ""
    } catch (error: any) {
      toast.error(error.message || "Error al importar archivo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileSpreadsheet className="h-5 w-5" />
          Importar desde Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <p>1. Descarga la plantilla</p>
          <p>2. Completa los datos (Patente, Litros, etc.)</p>
          <p>3. Sube el archivo</p>
          <p className="text-xs mt-2">Tipos de unidad: VIAJES, JORNADAS, DIAS, CICLOS, CARGAS</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadTemplate} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Descargar Plantilla
          </Button>

          <label className="flex-1">
            <Button disabled={loading} className="w-full" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {loading ? "Importando..." : "Subir Archivo"}
              </span>
            </Button>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
