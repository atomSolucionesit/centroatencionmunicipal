"use client"

import { useState, useCallback } from "react"
import type { Complaint, Status, Sector, TaskType } from "@/lib/types"
import { initialComplaints } from "@/lib/mock-data"
import { notificationStore } from "@/lib/notification-store"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { ComplaintForm } from "@/components/complaint-form"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function Home() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints)
  const [activeView, setActiveView] = useState<"dashboard" | "nuevo-reclamo">(
    "dashboard"
  )

  const handleStatusChange = useCallback((id: string, newStatus: Status) => {
    // Obtener el reclamo actual antes de actualizar el estado
    const complaint = complaints.find((c) => c.id === id)
    
    // Actualizar el estado
    setComplaints((prev) => {
      return prev.map((c) =>
        c.id === id ? { ...c, status: newStatus } : c
      )
    })

    // Agregar notificación solo si el estado realmente cambió
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
  }, [complaints])

  const handleAddComplaint = useCallback(
    (data: {
      citizenName: string
      address: string
      contactInfo: string
      description: string
      sector: Sector
      taskType: TaskType
    }) => {
      const newComplaint: Complaint = {
        id: `RECLAMO-${String(2000 + complaints.length).padStart(4, "0")}`,
        createdAt: new Date(),
        status: "ESPERA",
        ...data,
      }

      setComplaints((prev) => [newComplaint, ...prev])
      toast.success("Reclamo registrado exitosamente", {
        description: `ID: ${newComplaint.id}`,
      })
      setActiveView("dashboard")
    },
    [complaints.length]
  )

  return (
    <div className="min-h-screen bg-background">
      <Header activeView={activeView} onViewChange={setActiveView} />

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
  )
}
