import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { complaintsApi } from "@/lib/api/complaints";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Pencil,
  Save,
  X,
  Phone,
  User as UserIcon,
  MapPin,
  ClipboardList,
  Building2,
  Briefcase,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SECTORS, TASK_TYPES } from "@/lib/types";

export default function ComplaintDetailPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const complaintId = params.id as string;

  const [complaint, setComplaint] = useState<any>(null);
  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      setEditFormData(data);
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

  const handleSaveEdit = async () => {
    if (
      !editFormData.citizenName ||
      !editFormData.address ||
      !editFormData.description
    ) {
      toast.error("Nombre, dirección y descripción son obligatorios");
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        citizenName: editFormData.citizenName,
        citizenDni: editFormData.citizenDni,
        address: editFormData.address,
        contactInfo: editFormData.contactInfo,
        description: editFormData.description,
        sector: editFormData.sector,
        taskType: editFormData.taskType,
      };

      await complaintsApi.updateComplaint(complaintId, updateData);
      toast.success("Reclamo actualizado correctamente");
      setIsEditing(false);
      loadComplaint();
    } catch (error) {
      toast.error("Error al actualizar el reclamo");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !complaint) {
    return null;
  }

  return (
    <AuthenticatedLayout userRole={user?.role}>
      <div className="min-h-screen bg-background pb-12">
        <main className="container mx-auto max-w-5xl px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="hover:bg-accent"
            >
              ← Volver
            </Button>

            {user?.role === "ADMIN" && (
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => {
                  if (isEditing) {
                    setEditFormData(complaint);
                    setIsEditing(false);
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <X size={16} /> Cancelar
                  </>
                ) : (
                  <>
                    <Pencil size={16} /> Editar Reclamo
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-primary/5 border-b pb-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl font-bold font-mono tracking-tight">
                          {complaint.id}
                        </CardTitle>
                        <StatusBadge status={complaint.status} />
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <ClipboardList size={14} />
                        Registrado el{" "}
                        {format(
                          new Date(complaint.createdAt),
                          "d 'de' MMMM, yyyy 'a las' HH:mm",
                          { locale: es },
                        )}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {isEditing ? (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-primary">
                            <UserIcon size={14} /> Nombre del Ciudadano *
                          </Label>
                          <Input
                            value={editFormData?.citizenName || ""}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                citizenName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-primary">
                            DNI
                          </Label>
                          <Input
                            value={editFormData?.citizenDni || ""}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                citizenDni: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-primary">
                            <MapPin size={14} /> Dirección *
                          </Label>
                          <Input
                            value={editFormData?.address || ""}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-primary">
                            <Phone size={14} /> Datos de contacto
                          </Label>
                          <Input
                            value={editFormData?.contactInfo || ""}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                contactInfo: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-primary">
                            <Building2 size={14} /> Sector
                          </Label>
                          <Select
                            value={editFormData?.sector}
                            onValueChange={(val) =>
                              setEditFormData({ ...editFormData, sector: val })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar sector" />
                            </SelectTrigger>
                            <SelectContent>
                              {SECTORS.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-primary">
                            <Briefcase size={14} /> Tipo de Tarea
                          </Label>
                          <Select
                            value={editFormData?.taskType}
                            onValueChange={(val) =>
                              setEditFormData({
                                ...editFormData,
                                taskType: val,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tarea" />
                            </SelectTrigger>
                            <SelectContent>
                              {TASK_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-primary">
                          Descripción detallada *
                        </Label>
                        <Textarea
                          rows={6}
                          value={editFormData?.description || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="min-w-[120px]"
                        >
                          {isSaving ? (
                            "Guardando..."
                          ) : (
                            <>
                              <Save size={16} className="mr-2" /> Guardar
                              Cambios
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                              <UserIcon size={20} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Ciudadano
                              </h4>
                              <p className="text-lg font-medium">
                                {complaint.citizenName}
                              </p>
                              {complaint.citizenDni && (
                                <p className="text-sm text-muted-foreground">
                                  DNI: {complaint.citizenDni}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                              <MapPin size={20} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Dirección
                              </h4>
                              <p className="text-lg">{complaint.address}</p>
                            </div>
                          </div>
                        </section>

                        <section className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                              <Phone size={20} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Contacto
                              </h4>
                              <p className="text-lg">
                                {complaint.contactInfo || "No proporcionado"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-1">
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                Sector
                              </h4>
                              <Badge
                                variant="secondary"
                                className="font-medium"
                              >
                                {complaint.sector}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                Tipo de Tarea
                              </h4>
                              <Badge
                                variant="outline"
                                className="font-medium bg-background"
                              >
                                {complaint.taskType}
                              </Badge>
                            </div>
                          </div>
                        </section>
                      </div>

                      <div className="bg-secondary/20 rounded-2xl p-6 border border-border">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Descripción del problema
                        </h4>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {complaint.description}
                        </p>
                      </div>

                      {complaint.assignedDriver && (
                        <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                          <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Briefcase size={24} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-primary uppercase">
                              Responsable Asignado
                            </p>
                            <p className="text-md font-bold">
                              {complaint.assignedDriver.firstName}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary" />
                    Historial de Observaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {complaint.observations &&
                  complaint.observations.length > 0 ? (
                    <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                      {complaint.observations.map((obs: any) => (
                        <div key={obs.id} className="relative pl-12">
                          <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-muted-foreground uppercase">
                              {format(
                                new Date(obs.createdAt),
                                "dd/MM/yyyy - HH:mm",
                                { locale: es },
                              )}
                            </p>
                            <div className="bg-secondary/30 rounded-xl p-3 border border-border">
                              <p className="text-sm leading-snug">
                                {obs.observation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/20 mb-3" />
                      <p className="text-sm text-muted-foreground italic">
                        No se han registrado observaciones aún
                      </p>
                    </div>
                  )}

                  {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                    <div className="space-y-3 pt-6 border-t mt-6">
                      <Label className="text-sm font-bold text-primary flex items-center gap-2">
                        Nueva Observación
                      </Label>
                      <Textarea
                        placeholder="Escribe un comentario interno..."
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        rows={3}
                        className="bg-secondary/10 resize-none focus:bg-white transition-all shadow-inner"
                      />
                      <Button
                        onClick={handleAddObservation}
                        disabled={isSubmitting || !observation.trim()}
                        className="w-full shadow-lg shadow-primary/20"
                      >
                        {isSubmitting ? "Enviando..." : "Agregar Comentario"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Toaster position="bottom-center" richColors />
      </div>
    </AuthenticatedLayout>
  );
}

// Aux Badge component since it might not be imported or available globally
function Badge({ children, variant = "default", className = "" }: any) {
  const variants: any = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "text-foreground border border-input",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// Re-using MessageSquare from lucide-react since it was added to the template but not imported
import { MessageSquare } from "lucide-react";
