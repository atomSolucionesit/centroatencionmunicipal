"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { FuelLoadForm } from "@/components/fuel-load-form"
import { FuelLoadsTable } from "@/components/fuel-loads-table"
import { FuelLoadsFilters } from "@/components/fuel-loads-filters"
import { FuelReport } from "@/components/fuel-report"
import { FuelLoadImport } from "@/components/fuel-load-import"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { vehiclesApi, type Vehicle } from "@/lib/api/vehicles"
import { fuelLoadsApi, type FuelLoad } from "@/lib/api/fuel-loads"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FuelLoadsPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loads, setLoads] = useState<FuelLoad[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState<{ vehicleId?: string; startDate?: string; endDate?: string }>({})

  useEffect(() => {
    if (!isAuthenticated) return
    loadData()
  }, [isAuthenticated, page, filters])

  const loadData = async () => {
    try {
      setLoading(true)
      const [vehiclesData, loadsData] = await Promise.all([
        vehiclesApi.getVehicles(),
        fuelLoadsApi.getFuelLoads(filters.vehicleId, filters.startDate, filters.endDate, page, 10),
      ])
      setVehicles(vehiclesData.filter(v => v.status === 'ACTIVE'))
      setLoads(loadsData.data)
      setTotal(loadsData.total)
      setTotalPages(loadsData.totalPages)
    } catch (error) {
      toast.error("Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (load: any) => {
    try {
      await fuelLoadsApi.createFuelLoad(load)
      toast.success("Carga registrada exitosamente")
      setShowForm(false)
      loadData()
    } catch (error) {
      toast.error("Error al registrar carga")
    }
  }

  const handleImport = async (loads: any[]) => {
    try {
      for (const load of loads) {
        await fuelLoadsApi.createFuelLoad(load)
      }
      loadData()
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async (ids: string[]) => {
    try {
      await fuelLoadsApi.deleteMany(ids)
      toast.success(`${ids.length} cargas eliminadas`)
      loadData()
    } catch (error) {
      toast.error("Error al eliminar cargas")
    }
  }

  const handleFilter = (newFilters: { vehicleId?: string; startDate?: string; endDate?: string }) => {
    setFilters(newFilters)
    setPage(1)
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
          <div className="flex h-14 md:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Carga
            </Button>
          </div>
        </header>

        <main className="container mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-6">
          <h1 className="text-2xl font-bold mb-6">Cargas de Combustible</h1>
          
          <Tabs defaultValue="loads" className="space-y-4">
            <TabsList>
              <TabsTrigger value="loads">Cargas</TabsTrigger>
              <TabsTrigger value="import">Importar Excel</TabsTrigger>
              <TabsTrigger value="report">Reporte Mensual</TabsTrigger>
            </TabsList>
            
            <TabsContent value="loads" className="space-y-4">
              <FuelLoadsFilters vehicles={vehicles} onFilter={handleFilter} />
              <FuelLoadsTable 
                loads={loads} 
                total={total}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onDelete={handleDelete}
              />
            </TabsContent>
            
            <TabsContent value="import">
              <FuelLoadImport vehicles={vehicles} onImport={handleImport} />
            </TabsContent>
            
            <TabsContent value="report">
              <FuelReport />
            </TabsContent>
          </Tabs>
        </main>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Carga de Combustible</DialogTitle>
            </DialogHeader>
            {vehicles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No hay vehículos activos</p>
                <Button onClick={() => router.push("/vehicles")}>Ir a Vehículos</Button>
              </div>
            ) : (
              <FuelLoadForm vehicles={vehicles} onSubmit={handleSubmit} />
            )}
          </DialogContent>
        </Dialog>

        <Toaster position="bottom-center" />
      </div>
    </AuthenticatedLayout>
  )
}