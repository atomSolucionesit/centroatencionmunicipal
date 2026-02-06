"use client"

import { useState, useCallback, useEffect } from "react"
import type { Complaint, Status, Sector, TaskType } from "@/lib/types"
import { complaintsApi, type ApiComplaint } from "@/lib/api/complaints"
import { notificationStore } from "@/lib/notification-store"
import { useAuth } from "@/hooks/use-auth"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { ComplaintForm } from "@/components/complaint-form"
import { LoginForm } from "@/components/login-form"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

// Función para convertir ApiComplaint a Complaint
const mapApiComplaintToComplaint = (apiComplaint: ApiComplaint): Complaint => ({
  id: apiComplaint.id,
  createdAt: new Date(apiComplaint.createdAt),
  citizenName: apiComplaint.citizenName,
  citizenDni: apiComplaint.citizenDni || "",
  address: apiComplaint.address,
  contactInfo: apiComplaint.contactInfo,
  description: apiComplaint.description,
  sector: apiComplaint.sector as Sector,
  taskType: apiComplaint.taskType as TaskType,
  status: apiComplaint.status as Status,
  zone: "Centro", // Default zone
  assignedDriverId: apiComplaint.assignedDriverId,
  completedAt: undefined,
  latitude: apiComplaint.latitude,
  longitude: apiComplaint.longitude,
})

export default function Home() {
  const { isAuthenticated, user, login, logout } = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"dashboard" | "nuevo-reclamo">(
    "dashboard"
  )

  // Cargar reclamos al iniciar (solo si está autenticado)
  useEffect(() => {
    if (isAuthenticated) {
      loadComplaints()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const loadComplaints = async () => {
    try {
      setLoading(true)
      const apiComplaints = await complaintsApi.getComplaints()
      const mappedComplaints = apiComplaints.map(mapApiComplaintToComplaint)
      setComplaints(mappedComplaints)
    } catch (error) {
      toast.error("Error al cargar reclamos")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = useCallback(async (id: string, newStatus: Status) => {
    const complaint = complaints.find((c) => c.id === id)
    
    try {
      await complaintsApi.updateComplaintStatus(id, newStatus)
      
      setComplaints((prev) => {
        return prev.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c
        )
      })

      if (complaint && complaint.status !== newStatus) {
        notificationStore.addNotification(
          complaint.id,
          complaint.address,
          complaint.status,
          newStatus,
          "Operador"
        )
      }

      toast.success(`Estado actualizado a ${newStatus}`)
    } catch (error) {
      toast.error("Error al actualizar estado")
      console.error(error)
    }
  }, [complaints])

  const handleAddComplaint = useCallback(
    async (data: {
      citizenName: string
      citizenDni: string
      address: string
      contactInfo: string
      description: string
      sector: Sector
      taskType: TaskType
    }) => {
      try {
        const apiComplaint = await complaintsApi.createComplaint(data)
        const newComplaint = mapApiComplaintToComplaint(apiComplaint)

        setComplaints((prev) => [newComplaint, ...prev])
        toast.success("Reclamo registrado exitosamente", {
          description: `ID: ${newComplaint.id}`,
        })
        setActiveView("dashboard")
      } catch (error) {
        toast.error("Error al registrar reclamo")
        console.error(error)
      }
    },
    []
  )

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <>
        <LoginForm onLogin={login} />
        <Toaster position="bottom-center" />
      </>
    )
  }

  // Pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando reclamos...</p>
        </div>
      </div>
    )
  }

  // Aplicación principal con layout autenticado
  return (
    <AuthenticatedLayout userRole={user?.role}>
      <div className="min-h-screen bg-background">
        <Header 
          activeView={activeView} 
          onViewChange={setActiveView}
          onLogout={logout}
        />

        <main className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          {activeView === "dashboard" ? (
            <Dashboard
              complaints={complaints}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <div className="py-4 sm:py-8">
              <ComplaintForm onSubmit={handleAddComplaint} />
            </div>
          )}
        </main>

        <Toaster position="bottom-center" className="sm:bottom-right" />
      </div>
    </AuthenticatedLayout>
  )
}
