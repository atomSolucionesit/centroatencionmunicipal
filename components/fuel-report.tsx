"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { fuelLoadsApi, type MonthlyReportItem } from "@/lib/api/fuel-loads"
import { toast } from "sonner"

const MONTHS = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

export function FuelReport() {
  const [year, setYear] = useState(currentYear.toString())
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString())
  const [report, setReport] = useState<MonthlyReportItem[]>([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const data = await fuelLoadsApi.getMonthlyReport(parseInt(year), parseInt(month))
      setReport(data)
      if (data.length === 0) {
        toast.info("No hay datos para el período seleccionado")
      }
    } catch (error) {
      toast.error("Error al generar reporte")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Reporte Mensual de Consumo
        </CardTitle>
        <div className="text-sm text-muted-foreground mt-2 space-y-1">
          <p><strong>Cálculo de eficiencia:</strong></p>
          <p>• Con unidades de trabajo: <code className="bg-muted px-1 py-0.5 rounded">Litros / Unidades</code> (ej: L/viaje, L/jornada)</p>
          <p>• Sin unidades de trabajo: <code className="bg-muted px-1 py-0.5 rounded">Litros / Días del mes</code></p>
          <p className="text-xs mt-2">El objetivo es detectar desvíos comparando el mismo vehículo en el tiempo.</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generando..." : "Generar Reporte"}
          </Button>
        </div>

        {report.length > 0 && (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Combustible</TableHead>
                  <TableHead>Medición</TableHead>
                  <TableHead>Consumo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.vehiculo}</TableCell>
                    <TableCell>{item.codigo}</TableCell>
                    <TableCell>{item.tipo}</TableCell>
                    <TableCell>{item.combustible}</TableCell>
                    <TableCell>{item.medicion}</TableCell>
                    <TableCell className="font-medium">{item.consumo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
