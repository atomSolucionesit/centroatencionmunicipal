"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Fuel } from "lucide-react"
import type { Vehicle } from "@/lib/api/vehicles"

interface FuelLoadFormProps {
  vehicles: Vehicle[]
  onSubmit: (load: {
    vehicleId: string
    quantity: number
    workUnit?: number
    workUnitType?: string
    station?: string
    notes?: string
    recordedAt?: string
  }) => void
}

const WORK_UNIT_TYPES = [
  { value: "VIAJES", label: "Viajes" },
  { value: "JORNADAS", label: "Jornadas" },
  { value: "DIAS", label: "Días" },
  { value: "CICLOS", label: "Ciclos" },
  { value: "CARGAS", label: "Cargas" },
]

export function FuelLoadForm({ vehicles, onSubmit }: FuelLoadFormProps) {
  const [vehicleId, setVehicleId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [workUnit, setWorkUnit] = useState("")
  const [workUnitType, setWorkUnitType] = useState("")
  const [station, setStation] = useState("")
  const [notes, setNotes] = useState("")
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!vehicleId || !quantity) return

    onSubmit({
      vehicleId,
      quantity: parseFloat(quantity),
      workUnit: workUnit ? parseFloat(workUnit) : undefined,
      workUnitType: workUnitType || undefined,
      station: station || undefined,
      notes: notes || undefined,
      recordedAt: recordedAt ? new Date(recordedAt).toISOString() : undefined,
    })

    setVehicleId("")
    setQuantity("")
    setWorkUnit("")
    setWorkUnitType("")
    setStation("")
    setNotes("")
    setRecordedAt(new Date().toISOString().split('T')[0])
  }

  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Fuel className="h-5 w-5" />
          Registrar Carga
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Vehículo *</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un vehículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.licensePlate} - {v.brand} {v.model} ({v.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fecha de Carga *</Label>
            <Input
              type="date"
              value={recordedAt}
              onChange={(e) => setRecordedAt(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label>Litros *</Label>
            <Input
              type="number"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="50.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Unidad de Trabajo (opcional)</Label>
              <Input
                type="number"
                step="0.1"
                value={workUnit}
                onChange={(e) => setWorkUnit(e.target.value)}
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Unidad</Label>
              <Select value={workUnitType} onValueChange={setWorkUnitType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_UNIT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estación</Label>
              <Input
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder="YPF Centro"
              />
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones"
              />
            </div>
          </div>

          <Button type="submit" disabled={!vehicleId || !quantity} className="w-full">
            Registrar Carga
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}