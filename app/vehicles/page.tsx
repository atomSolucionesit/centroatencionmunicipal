"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { VehicleForm } from "@/components/vehicle-form";
import { VehiclesList } from "@/components/vehicles-list";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { vehiclesApi, type Vehicle } from "@/lib/api/vehicles";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VehiclesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadVehicles();
    if (!isAuthenticated) {
      return;
    }
  }, [isAuthenticated]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehiclesApi.getVehicles();
      setVehicles(data);
    } catch (error) {
      toast.error("Error al cargar vehículos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      if (editingVehicle) {
        toast.info("Edición aún no implementada");
        return;
      }
      
      const newVehicle = await vehiclesApi.createVehicle(data);
      setVehicles((prev) => [newVehicle, ...prev]);
      toast.success("Vehículo registrado exitosamente");
      setShowForm(false);
      setEditingVehicle(null);
    } catch (error) {
      toast.error("Error al registrar vehículo");
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este vehículo?")) return;

    try {
      await vehiclesApi.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success("Vehículo eliminado");
    } catch (error) {
      toast.error("Error al eliminar vehículo");
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthenticatedLayout userRole={user?.role}>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="flex h-14 md:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold">Gestión de Vehículos</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              {showForm ? "Ver Lista" : "Nuevo Vehículo"}
            </Button>
          </div>
        </header>

        <main className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          {showForm ? (
            <VehicleForm onSubmit={handleCreate} />
          ) : (
            <VehiclesList 
              vehicles={vehicles} 
              onEdit={handleEdit}
              onDelete={handleDelete} 
            />
          )}
        </main>

        <Toaster position="bottom-center" />
      </div>
    </AuthenticatedLayout>
  );
}
