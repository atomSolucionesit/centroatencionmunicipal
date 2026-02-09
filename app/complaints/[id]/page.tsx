"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { complaintsApi } from "@/lib/api/complaints";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ComplaintDetailPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const complaintId = params.id as string;

  const [complaint, setComplaint] = useState<any>(null);
  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    } else if (!loading && isAuthenticated) {
      loadComplaint();
    }
  }, [isAuthenticated, loading, complaintId]);

  const loadComplaint = async () => {
    try {
      setLoadingData(true);
      const data = await complaintsApi.getComplaint(complaintId);
      setComplaint(data);
    } catch (error) {
      toast.error("Error al cargar el reclamo");
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddObservation = async () => {
    if (!observation.trim()) {
      toast.error("Ingresa una observación");
      return;
    }

    setIsSubmitting(true);
    try {
      await complaintsApi.addObservation(complaintId, observation);
      toast.success("Observación agregada");
      setObservation("");
      loadComplaint();
    } catch (error) {
      toast.error("Error al agregar observación");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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

  if (!isAuthenticated || !complaint) {
    return null;
  }

  return (
    <AuthenticatedLayout userRole={user?.role}>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto max-w-5xl px-4 py-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            ← Volver
          </Button>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{complaint.id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(complaint.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                    </p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Ciudadano</h3>
                  <p>{complaint.citizenName}</p>
                  {complaint.citizenDni && <p className="text-sm text-muted-foreground">DNI: {complaint.citizenDni}</p>}
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Dirección</h3>
                  <p>{complaint.address}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Contacto</h3>
                  <p>{complaint.contactInfo}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Descripción</h3>
                  <p>{complaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Sector</h3>
                    <p>{complaint.sector}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Tipo de Tarea</h3>
                    <p>{complaint.taskType}</p>
                  </div>
                </div>

                {complaint.assignedDriver && (
                  <div>
                    <h3 className="font-semibold mb-1">Conductor Asignado</h3>
                    <p>{complaint.assignedDriver.firstName}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Observaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complaint.observations && complaint.observations.length > 0 ? (
                  <div className="space-y-3">
                    {complaint.observations.map((obs: any) => (
                      <div key={obs.id} className="border-l-2 border-primary pl-4 py-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          {format(new Date(obs.createdAt), "dd/MM/yyyy - HH:mm", { locale: es })}
                        </p>
                        <p className="mt-1">{obs.observation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay observaciones</p>
                )}

                {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                  <div className="space-y-2 pt-4 border-t">
                    <Textarea
                      placeholder="Agregar observación..."
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddObservation} disabled={isSubmitting}>
                      {isSubmitting ? "Guardando..." : "Agregar Observación"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Toaster position="bottom-center" />
      </div>
    </AuthenticatedLayout>
  );
}
