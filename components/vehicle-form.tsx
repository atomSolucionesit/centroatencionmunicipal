"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VehicleFormProps {
  onSubmit: (data: {
    licensePlate: string
    brand: string
    model: string
    year: number
    type: string
    fuelType: string
    horsePower?: number
  }) => void
}

const FUEL_TYPES = ["DIESEL", "NAFTA", "GNC", "ELECTRICO"]
const VEHICLE_TYPES = ["CAMION", "MAQUINARIA"]

export function VehicleForm({ onSubmit }: VehicleFormProps) {
  const [licensePlate, setLicensePlate] = useState("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [type, setType] = useState("")
  const [fuelType, setFuelType] = useState("")
  const [horsePower, setHorsePower] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!licensePlate || !brand || !model || !year || !type || !fuelType) return

    onSubmit({
      licensePlate,
      brand,
      model,
      year: parseInt(year),
      type,
      fuelType,
      horsePower: horsePower ? parseInt(horsePower) : undefined,
    })

    // Reset form
    setLicensePlate("")
    setBrand("")
    setModel("")
    setYear("")
    setType("")
    setFuelType("")
    setHorsePower("")
  }

  const isValid = licensePlate && brand && model && year && type && fuelType

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nuevo Vehículo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="licensePlate">Patente</Label>
            <Input
              id="licensePlate"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              placeholder="ABC123"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ford"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="F-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2020"
                min="1990"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Combustible</Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horsePower">HP (opcional)</Label>
              <Input
                id="horsePower"
                type="number"
                value={horsePower}
                onChange={(e) => setHorsePower(e.target.value)}
                placeholder="150"
              />
            </div>
          </div>

          <Button type="submit" disabled={!isValid} className="w-full">
            Registrar Vehículo
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}