"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/use-auth";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { complaintsApi } from "@/lib/api/complaints";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";

const ComplaintsHeatmap = dynamic(() => import("@/components/complaints-heatmap").then(mod => ({ default: mod.ComplaintsHeatmap })), { ssr: false });

export default function StatisticsPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    } else if (!loading && isAuthenticated && user?.role !== "ADMIN" && user?.role !== "MANAGER") {
      router.replace("/dashboard");
    } else if (!loading && isAuthenticated && (user?.role === "ADMIN" || user?.role === "MANAGER")) {
      loadData();
    }
  }, [isAuthenticated, loading, user, router]);

  const loadData = async () => {
    try {
      const data = await complaintsApi.getComplaints();
      setComplaints(data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  const totalComplaints = complaints.length;
  const complaintsBySector = complaints.reduce((acc: any, c) => {
    acc[c.sector] = (acc[c.sector] || 0) + 1;
    return acc;
  }, {});
  const complaintsByTaskType = complaints.reduce((acc: any, c) => {
    acc[c.taskType] = (acc[c.taskType] || 0) + 1;
    return acc;
  }, {});
  const complaintsByStatus = complaints.reduce((acc: any, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <AuthenticatedLayout userRole={user?.role}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Estadísticas</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reclamos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalComplaints}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
                <TrendingUp className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{complaintsByStatus.URGENTE || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Espera</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{complaintsByStatus.ESPERA || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completados</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{complaintsByStatus.LISTO || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reclamos por Sector</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(complaintsBySector).map(([sector, count]: [string, any]) => (
                    <div key={sector} className="flex justify-between items-center">
                      <span className="text-sm">{sector}</span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reclamos por Tipo de Tarea</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(complaintsByTaskType).map(([taskType, count]: [string, any]) => (
                    <div key={taskType} className="flex justify-between items-center">
                      <span className="text-sm">{taskType}</span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Mapa de Calor - Zonas con Más Reclamos</CardTitle>
            </CardHeader>
            <CardContent>
              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
              <ComplaintsHeatmap complaints={complaints} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
