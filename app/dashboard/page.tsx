"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Complaint, Status, Sector, TaskType } from "@/lib/types";
import { complaintsApi, type ApiComplaint } from "@/lib/api/complaints";
import { notificationStore } from "@/lib/notification-store";
import { useAuth } from "@/hooks/use-auth";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Header } from "@/components/header";
import { Dashboard } from "@/components/dashboard";
import { ComplaintForm } from "@/components/complaint-form";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

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

export default function DashboardPage() {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [activeView, setActiveView] = useState<"dashboard" | "nuevo-reclamo">(
    "dashboard",
  );

  const loadComplaints = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoadingComplaints(true);
      const apiComplaints = await complaintsApi.getComplaints();
      const mappedComplaints = apiComplaints.map(mapApiComplaintToComplaint);
      setComplaints(mappedComplaints);
    } catch (error) {
      if (showLoading) toast.error("Error al cargar reclamos");
      console.error(error);
    } finally {
      if (showLoading) setLoadingComplaints(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
      return;
    }
    
    if (!loading && isAuthenticated) {
      loadComplaints();
      
      const interval = setInterval(() => {
        loadComplaints(false);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, loading, loadComplaints]);

  const handleStatusChange = useCallback(
    async (id: string, newStatus: Status) => {
      const complaint = complaints.find((c) => c.id === id);

      try {
        await complaintsApi.updateComplaintStatus(id, newStatus);

        setComplaints((prev) => {
          return prev.map((c) =>
            c.id === id ? { ...c, status: newStatus } : c,
          );
        });

        if (complaint && complaint.status !== newStatus) {
          notificationStore.addNotification(
            complaint.id,
            complaint.address,
            complaint.status,
            newStatus,
            "Operador",
          );
        }

        toast.success(`Estado actualizado a ${newStatus}`);
      } catch (error) {
        toast.error("Error al actualizar estado");
        console.error(error);
      }
    },
    [complaints],
  );

  const handleAreaChange = useCallback(async (id: string, newArea: string) => {
    try {
      await complaintsApi.updateComplaintArea(id, newArea);

      setComplaints((prev) => {
        return prev.map((c) => (c.id === id ? { ...c, area: newArea } : c));
      });

      toast.success(`Área actualizada a ${newArea}`);
    } catch (error) {
      toast.error("Error al actualizar área");
      console.error(error);
    }
  }, []);

  const handleAddComplaint = useCallback(
    async (data: {
      citizenName: string;
      citizenDni: string;
      address: string;
      contactInfo: string;
      description: string;
      sector: Sector;
      taskType: TaskType;
      area: string;
    }) => {
      try {
        const apiComplaint = await complaintsApi.createComplaint(data);
        const newComplaint = mapApiComplaintToComplaint(apiComplaint);

        setComplaints((prev) => [newComplaint, ...prev]);
        toast.success("Reclamo registrado exitosamente", {
          description: `ID: ${newComplaint.id}`,
        });
        setActiveView("dashboard");
      } catch (error) {
        toast.error("Error al registrar reclamo");
        console.error(error);
      }
    },
    [],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loadingComplaints) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando reclamos...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthenticatedLayout userRole={user?.role}>
      <div className="min-h-screen bg-background">
        <Header
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={logout}
        />

        <main
          className={
            user?.role === "MANAGER"
              ? "container mx-auto max-w-5xl px-3 sm:px-4 md:px-6 py-4 sm:py-6"
              : "container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-6"
          }
        >
          {activeView === "dashboard" ? (
            <Dashboard
              complaints={complaints}
              onStatusChange={handleStatusChange}
              onAreaChange={handleAreaChange}
              onRefresh={loadComplaints}
              userRole={user?.role}
              userArea={user?.area}
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
  );
}
