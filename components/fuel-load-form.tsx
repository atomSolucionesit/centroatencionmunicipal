"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Fuel } from "lucide-react"
import type { Vehicle } from "@/lib/api/vehicles"

interface FuelLoadFormProps {
  vehicles: Vehicle[]
  onSubmit: (loads: Array<{
    vehicleId: string
    quantity: number
    pricePerLiter: number
    odometer?: number
    station?: string
  }>) => void
}

interface FuelLoadEntry {
  id: string
  vehicleId: string
  quantity: string
  pricePerLiter: string
  odometer: string
  station: string
}

export function FuelLoadForm({ vehicles, onSubmit }: FuelLoadFormProps) {
  const [entries, setEntries] = useState<FuelLoadEntry[]>([
    { id: '1', vehicleId: '', quantity: '', pricePerLiter: '', odometer: '', station: '' }
  ])

  const addEntry = () => {
    setEntries([...entries, {
      id: Date.now().toString(),
      vehicleId: '',
      quantity: '',
      pricePerLiter: '',
      odometer: '',
      station: ''
    }])
  }

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id))
    }
  }

  const updateEntry = (id: string, field: keyof FuelLoadEntry, value: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validEntries = entries.filter(e => 
      e.vehicleId && e.quantity && e.pricePerLiter
    )

    if (validEntries.length === 0) return

    const loads = validEntries.map(e => ({
      vehicleId: e.vehicleId,
      quantity: parseFloat(e.quantity),
      pricePerLiter: parseFloat(e.pricePerLiter),
      odometer: e.odometer ? parseFloat(e.odometer) : undefined,
      station: e.station || undefined,
    }))

    onSubmit(loads)
  }

  const getTotalCost = (quantity: string, price: string) => {
    const q = parseFloat(quantity) || 0
    const p = parseFloat(price) || 0
    return (q * p).toFixed(2)
  }

  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Fuel className="h-6 w-6" />
          Registrar Carga de Combustible
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Complete los datos de cada carga. Puede agregar múltiples vehículos a la vez.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {entries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4 space-y-4 bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">Vehículo {index + 1}</span>
                {entries.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-base">Vehículo *</Label>
                  <Select
                    value={entry.vehicleId}
                    onValueChange={(value) => updateEntry(entry.id, 'vehicleId', value)}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Seleccione un vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id} className="text-base py-3">
                          {v.licensePlate} - {v.brand} {v.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base">Litros *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={entry.quantity}
                      onChange={(e) => updateEntry(entry.id, 'quantity', e.target.value)}
                      placeholder="50.00"
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Precio por Litro *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={entry.pricePerLiter}
                      onChange={(e) => updateEntry(entry.id, 'pricePerLiter', e.target.value)}
                      placeholder="1500.00"
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                {entry.quantity && entry.pricePerLiter && (
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total a pagar</p>
                    <p className="text-2xl font-bold">
                      ${getTotalCost(entry.quantity, entry.pricePerLiter)}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base">Kilometraje</Label>
                    <Input
                      type="number"
                      value={entry.odometer}
                      onChange={(e) => updateEntry(entry.id, 'odometer', e.target.value)}
                      placeholder="15000"
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Estación de Servicio</Label>
                    <Input
                      value={entry.station}
                      onChange={(e) => updateEntry(entry.id, 'station', e.target.value)}
                      placeholder="YPF Centro"
                      className="h-12 text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={addEntry}
              className="flex-1 h-12 text-base"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar Otro Vehículo
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-base"
            >
              Guardar {entries.length > 1 ? `${entries.length} Cargas` : 'Carga'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}