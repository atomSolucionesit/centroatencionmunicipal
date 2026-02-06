"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { FuelLoadForm } from "@/components/fuel-load-form"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { vehiclesApi, type Vehicle } from "@/lib/api/vehicles"
import { fuelLoadsApi } from "@/lib/api/fuel-loads"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FuelLoadsPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      // router.push("/")
      return
    }
    loadVehicles()
  }, [isAuthenticated])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      const data = await vehiclesApi.getVehicles()
      setVehicles(data.filter(v => v.status === 'ACTIVE'))
    } catch (error) {
      toast.error("Error al cargar vehículos")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (loads: any[]) => {
    try {
      if (loads.length === 1) {
        await fuelLoadsApi.createFuelLoad(loads[0])
        toast.success("Carga registrada exitosamente")
      } else {
        await fuelLoadsApi.createMultipleFuelLoads(loads)
        toast.success(`${loads.length} cargas registradas exitosamente`)
      }
      
      // Recargar el formulario
      window.location.reload()
    } catch (error) {
      toast.error("Error al registrar cargas")
    }
  }

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthenticatedLayout userRole={user?.role}>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="flex h-14 md:h-16 items-center px-3 sm:px-4 md:px-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </header>

        <main className="container mx-auto max-w-4xl px-3 sm:px-4 md:px-6 py-6">
          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No hay vehículos activos disponibles
              </p>
              <Button onClick={() => router.push("/vehicles")}>
                Ir a Vehículos
              </Button>
            </div>
          ) : (
            <FuelLoadForm vehicles={vehicles} onSubmit={handleSubmit} />
          )}
        </main>

        <Toaster position="bottom-center" />
      </div>
    </AuthenticatedLayout>
  )
}