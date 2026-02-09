"use client"

import React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Phone, MapPin, User, Clock, Plus } from "lucide-react"
import type { Sector, TaskType } from "@/lib/types"
import { configApi } from "@/lib/api/config"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ComplaintFormProps {
  onSubmit: (data: {
    citizenName: string
    citizenDni: string
    address: string
    contactInfo: string
    description: string
    sector: Sector
    taskType: TaskType
    area: string
  }) => void
}

export function ComplaintForm({ onSubmit }: ComplaintFormProps) {
  const [citizenName, setCitizenName] = useState("")
  const [citizenDni, setCitizenDni] = useState("")
  const [address, setAddress] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const [description, setDescription] = useState("")
  const [sector, setSector] = useState<Sector | "">("")
  const [taskType, setTaskType] = useState<TaskType | "">("")
  const [area, setArea] = useState<string>("operador")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [sectors, setSectors] = useState<string[]>([])
  const [taskTypes, setTaskTypes] = useState<string[]>([])
  const [newSectorName, setNewSectorName] = useState("")
  const [newTaskTypeName, setNewTaskTypeName] = useState("")
  const [isCreatingSector, setIsCreatingSector] = useState(false)
  const [isCreatingTaskType, setIsCreatingTaskType] = useState(false)
  const [openSectorDialog, setOpenSectorDialog] = useState(false)
  const [openTaskTypeDialog, setOpenTaskTypeDialog] = useState(false)

  const now = new Date()

  useEffect(() => {
    loadSectors()
    loadTaskTypes()
  }, [])

  const loadSectors = async () => {
    try {
      const data = await configApi.getSectors()
      setSectors(data.map((s) => s.name))
    } catch (error) {
      console.error("Error cargando sectores:", error)
    }
  }

  const loadTaskTypes = async () => {
    try {
      const data = await configApi.getTaskTypes()
      setTaskTypes(data.map((t) => t.name))
    } catch (error) {
      console.error("Error cargando tipos de tarea:", error)
    }
  }

  const handleCreateSector = async () => {
    if (!newSectorName.trim()) return
    
    setIsCreatingSector(true)
    try {
      await configApi.createSector(newSectorName)
      await loadSectors()
      setNewSectorName("")
      setOpenSectorDialog(false)
    } catch (error) {
      console.error("Error creando sector:", error)
    } finally {
      setIsCreatingSector(false)
    }
  }

  const handleCreateTaskType = async () => {
    if (!newTaskTypeName.trim()) return
    
    setIsCreatingTaskType(true)
    try {
      await configApi.createTaskType(newTaskTypeName)
      await loadTaskTypes()
      setNewTaskTypeName("")
      setOpenTaskTypeDialog(false)
    } catch (error) {
      console.error("Error creando tipo de tarea:", error)
    } finally {
      setIsCreatingTaskType(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!citizenName || !address || !contactInfo || !description || !sector || !taskType) {
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 300))

    onSubmit({
      citizenName,
      citizenDni,
      address,
      contactInfo,
      description,
      sector: sector as Sector,
      taskType: taskType as TaskType,
      area,
    })

    setCitizenName("")
    setCitizenDni("")
    setAddress("")
    setContactInfo("")
    setDescription("")
    setSector("")
    setTaskType("")
    setArea("operador")
    setIsSubmitting(false)
  }

  const isValid = citizenName && address && contactInfo && description && sector && taskType

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
                htmlFor="citizenDni"
                className="text-sm font-medium text-foreground"
              >
                DNI del ciudadano (opcional)
              </Label>
              <Input
                id="citizenDni"
                value={citizenDni}
                onChange={(e) => setCitizenDni(e.target.value)}
                placeholder="Ingrese el DNI"
                className="bg-secondary border-border"
              />
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

          {/* Sector and Task */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  Sector
                </Label>
                <Dialog open={openSectorDialog} onOpenChange={setOpenSectorDialog}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" className="h-6 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Sector</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        value={newSectorName}
                        onChange={(e) => setNewSectorName(e.target.value)}
                        placeholder="Nombre del sector"
                      />
                      <Button
                        onClick={handleCreateSector}
                        disabled={isCreatingSector || !newSectorName.trim()}
                        className="w-full"
                      >
                        {isCreatingSector ? "Creando..." : "Crear Sector"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Select
                value={sector}
                onValueChange={(value) => setSector(value as Sector)}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Seleccionar sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  Tipo de tarea
                </Label>
                <Dialog open={openTaskTypeDialog} onOpenChange={setOpenTaskTypeDialog}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" className="h-6 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Tipo de Tarea</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        value={newTaskTypeName}
                        onChange={(e) => setNewTaskTypeName(e.target.value)}
                        placeholder="Nombre del tipo de tarea"
                      />
                      <Button
                        onClick={handleCreateTaskType}
                        disabled={isCreatingTaskType || !newTaskTypeName.trim()}
                        className="w-full"
                      >
                        {isCreatingTaskType ? "Creando..." : "Crear Tipo de Tarea"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Select
                value={taskType}
                onValueChange={(value) => setTaskType(value as TaskType)}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Seleccionar tarea" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Área
              </Label>
              <Select
                value={area}
                onValueChange={(value) => setArea(value)}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operador">Operador</SelectItem>
                  <SelectItem value="corralon">Corralón</SelectItem>
                  <SelectItem value="alumbrado">Alumbrado</SelectItem>
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
