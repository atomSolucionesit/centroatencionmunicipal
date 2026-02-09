"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import type { Vehicle } from "@/lib/api/vehicles"

interface FuelLoadsFiltersProps {
  vehicles: Vehicle[]
  onFilter: (filters: { vehicleId?: string; startDate?: string; endDate?: string }) => void
}

export function FuelLoadsFilters({ vehicles, onFilter }: FuelLoadsFiltersProps) {
  const [vehicleId, setVehicleId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleApply = () => {
    onFilter({
      vehicleId: vehicleId && vehicleId !== "all" ? vehicleId : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
  }

  const handleClear = () => {
    setVehicleId("")
    setStartDate("")
    setEndDate("")
    onFilter({})  
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Vehículo</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Desde</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Hasta</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleApply} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" onClick={handleClear} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
