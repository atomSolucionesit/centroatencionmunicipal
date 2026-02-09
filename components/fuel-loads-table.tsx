"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react"
import type { FuelLoad } from "@/lib/api/fuel-loads"
import * as XLSX from "xlsx"

interface FuelLoadsTableProps {
  loads: FuelLoad[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onDelete: (ids: string[]) => void
}

export function FuelLoadsTable({ loads, total, page, totalPages, onPageChange, onDelete }: FuelLoadsTableProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleAll = () => {
    if (selected.length === loads.length) {
      setSelected([])
    } else {
      setSelected(loads.map(l => l.id))
    }
  }

  const toggleOne = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  const handleDelete = () => {
    onDelete(selected)
    setSelected([])
  }

  const handleExport = () => {
    const selectedLoads = loads.filter(l => selected.includes(l.id))
    const exportData = selectedLoads.map(load => ({
      "Fecha": format(new Date(load.recordedAt), "dd/MM/yyyy HH:mm", { locale: es }),
      "Patente": load.vehicle?.licensePlate,
      "Vehículo": `${load.vehicle?.brand} ${load.vehicle?.model}`,
      "Litros": load.quantity,
      "Unidad Trabajo": load.workUnit || "-",
      "Tipo Unidad": load.workUnitType || "-",
      "Estación": load.station || "-",
      "Notas": load.notes || "-",
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Cargas")
    XLSX.writeFile(wb, `cargas_combustible_${format(new Date(), "ddMMyyyy")}.xlsx`)
  }

  if (loads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay cargas registradas</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selected.length > 0 && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar {selected.length}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar {selected.length}
          </Button>
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selected.length === loads.length} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Litros</TableHead>
              <TableHead>Unidad Trabajo</TableHead>
              <TableHead>Estación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loads.map((load) => (
              <TableRow key={load.id}>
                <TableCell>
                  <Checkbox checked={selected.includes(load.id)} onCheckedChange={() => toggleOne(load.id)} />
                </TableCell>
                <TableCell>
                  {format(new Date(load.recordedAt), "dd/MM/yyyy HH:mm", { locale: es })}
                </TableCell>
                <TableCell>
                  {load.vehicle?.licensePlate} - {load.vehicle?.brand} {load.vehicle?.model}
                </TableCell>
                <TableCell>{load.quantity} L</TableCell>
                <TableCell>
                  {load.workUnit ? `${load.workUnit} ${load.workUnitType?.toLowerCase() || ''}` : "-"}
                </TableCell>
                <TableCell>{load.station || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {(page - 1) * 10 + 1} - {Math.min(page * 10, total)} de {total}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
