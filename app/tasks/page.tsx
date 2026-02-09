"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { DriversMap } from "@/components/drivers-map";
import { complaintsApi, type ApiComplaint } from "@/lib/api/complaints";
import { usersApi, type User } from "@/lib/api/users";
import { tasksApi, type DriverStatus } from "@/lib/api/tasks";
import type { Complaint, Status, Sector, TaskType } from "@/lib/types";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { TasksList } from "@/components/tasks-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  area: apiComplaint.area,
  zone: "Centro",
  assignedDriverId: apiComplaint.assignedDriverId,
  completedAt: undefined,
  latitude: apiComplaint.latitude,
  longitude: apiComplaint.longitude,
});

export default function TasksPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [driversStatus, setDriversStatus] = useState<DriverStatus[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    } else if (!loading && isAuthenticated) {
      if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
        router.replace("/dashboard");
      } else {
        loadData();
      }
    }
  }, [isAuthenticated, loading, user, router]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [apiComplaints, allUsers, statusData] = await Promise.all([
        complaintsApi.getComplaints(),
        usersApi.getUsers(),
        tasksApi.getDriversStatus(),
      ]);
      
      const mappedComplaints = apiComplaints.map(mapApiComplaintToComplaint);
      const driverUsers = allUsers.filter(u => u.tipo === "DRIVER");
      
      setComplaints(mappedComplaints);
      setDrivers(driverUsers);
      setDriversStatus(statusData);
    } catch (error) {
      toast.error("Error al cargar datos");
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAssignDriver = async (complaintId: string, driverId: string) => {
    try {
      await complaintsApi.assignDriver(complaintId, driverId);
      toast.success("Tarea asignada exitosamente");
      loadData();
    } catch (error) {
      toast.error("Error al asignar tarea");
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== "ADMIN" && user?.role !== "MANAGER")) {
    return null;
  }

  return (
    <AuthenticatedLayout userRole={user?.role}>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Gestión de Tareas</h1>
              <p className="text-sm text-muted-foreground">
                Asigna reclamos a conductores y monitorea su ubicación
              </p>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>

          <Tabs defaultValue="tasks" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tasks">Tareas</TabsTrigger>
              <TabsTrigger value="map">Mapa de Choferes</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <TasksList
                complaints={complaints}
                drivers={drivers}
                onAssignDriver={handleAssignDriver}
                userArea={user?.area}
                userRole={user?.role}
              />
            </TabsContent>

            <TabsContent value="map">
              <DriversMap drivers={driversStatus} />
            </TabsContent>
          </Tabs>
        </main>
        <Toaster position="bottom-center" className="sm:bottom-right" />
      </div>
    </AuthenticatedLayout>
  );
}
