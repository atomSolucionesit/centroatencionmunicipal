"use client"

import React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Phone, MapPin, User, Clock } from "lucide-react"
import type { Sector, TaskType, Zone } from "@/lib/types"
import { SECTORS, TASK_TYPES, ZONES } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComplaintFormProps {
  onSubmit: (data: {
    citizenName: string
    address: string
    contactInfo: string
    description: string
    sector: Sector
    taskType: TaskType
    zone: Zone
  }) => void
}

export function ComplaintForm({ onSubmit }: ComplaintFormProps) {
  const [citizenName, setCitizenName] = useState("")
  const [address, setAddress] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const [description, setDescription] = useState("")
  const [sector, setSector] = useState<Sector | "">("")
  const [taskType, setTaskType] = useState<TaskType | "">("")
  const [zone, setZone] = useState<Zone | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const now = new Date()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!citizenName || !address || !contactInfo || !description || !sector || !taskType || !zone) {
      return
    }

    setIsSubmitting(true)

    // Simulate a brief delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    onSubmit({
      citizenName,
      address,
      contactInfo,
      description,
      sector: sector as Sector,
      taskType: taskType as TaskType,
      zone: zone as Zone,
    })

    // Reset form
    setCitizenName("")
    setAddress("")
    setContactInfo("")
    setDescription("")
    setSector("")
    setTaskType("")
    setZone("")
    setIsSubmitting(false)
  }

  const isValid = citizenName && address && contactInfo && description && sector && taskType && zone

  return (
    <Card className="bg-card border-border max-w-2xl mx-auto w-full">
      <CardHeader className="border-b border-border pb-3 sm:pb-4 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
          Registrar Nuevo Reclamo
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Complete el formulario para registrar un nuevo reclamo ciudadano
        </p>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auto-filled timestamp */}
          <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Fecha y hora</p>
              <p className="text-sm font-medium text-foreground">
                {format(now, "EEEE, d MMMM yyyy - HH:mm", { locale: es })}
              </p>
            </div>
          </div>

          {/* Citizen info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="citizenName"
                className="text-sm font-medium text-foreground"
              >
                Nombre del ciudadano
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="citizenName"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="Ingrese el nombre completo"
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-sm font-medium text-foreground"
              >
                Dirección
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número, barrio"
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contactInfo"
                className="text-sm font-medium text-foreground"
              >
                Información de contacto
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Teléfono o email"
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Descripción del reclamo
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describa detalladamente el problema o situación reportada..."
                className="bg-secondary border-border min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Sector, Task, and Zone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Sector
              </Label>
              <Select
                value={sector}
                onValueChange={(value) => setSector(value as Sector)}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Seleccionar sector" />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Tipo de tarea
              </Label>
              <Select
                value={taskType}
                onValueChange={(value) => setTaskType(value as TaskType)}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Seleccionar tarea" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Zona
              </Label>
              <Select
                value={zone}
                onValueChange={(value) => setZone(value as Zone)}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Seleccionar zona" />
                </SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => (
                    <SelectItem key={z} value={z}>
                      {z}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="bg-foreground text-background hover:bg-foreground/90 w-full sm:w-auto text-sm"
            >
              {isSubmitting ? "Registrando..." : "Registrar Reclamo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
