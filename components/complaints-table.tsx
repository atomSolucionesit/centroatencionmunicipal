"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  MoreHorizontal,
  Eye,
  MessageSquare,
  Pencil,
  Save,
  X,
} from "lucide-react";
import type { Complaint, Status, Sector, TaskType } from "@/lib/types";
import { STATUSES, SECTORS, TASK_TYPES } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { complaintsApi } from "@/lib/api/complaints";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";

interface ComplaintsTableProps {
  complaints: Complaint[];
  onStatusChange: (id: string, status: Status) => void;
  onAreaChange?: (id: string, area: string) => void;
  userRole?: string;
  userArea?: string;
  onRefresh?: () => void;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
}

export function ComplaintsTable({
  complaints,
  onStatusChange,
  onAreaChange,
  userRole,
  userArea,
  onRefresh,
  selectedIds = [],
  onToggleSelect,
}: ComplaintsTableProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  );
  const [observationsComplaint, setObservationsComplaint] = useState<any>(null);
  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchObservation, setSearchObservation] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<Complaint | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadObservations = async (complaintId: string) => {
    try {
      const data = await complaintsApi.getComplaint(complaintId);
      setObservationsComplaint(data);
    } catch (error) {
      console.error("Error loading observations:", error);
    }
  };

  useEffect(() => {
    if (observationsComplaint) {
      intervalRef.current = setInterval(() => {
        loadObservations(observationsComplaint.id);
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [observationsComplaint?.id]);

  const handleAddObservation = async () => {
    if (!observation.trim() || !observationsComplaint) return;

    setIsSubmitting(true);
    try {
      await complaintsApi.addObservation(observationsComplaint.id, observation);
      toast.success("Observación agregada");
      setObservation("");
      await loadObservations(observationsComplaint.id);
      // onRefresh?.()
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al agregar observación",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredObservations =
    observationsComplaint?.observations?.filter((obs: any) => {
      if (!searchObservation) return true;
      const searchLower = searchObservation.toLowerCase();
      return (
        obs.observation.toLowerCase().includes(searchLower) ||
        format(new Date(obs.createdAt), "dd/MM/yyyy HH:mm").includes(
          searchLower,
        )
      );
    }) || [];

  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-sm">No se encontraron reclamos</p>
        <p className="text-xs">Intenta ajustar los filtros</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-[40px]">
                {/* Selector column */}
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-xs">
                Hora
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-xs">
                ID
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-xs">
                Ciudadano
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-xs">
                Dirección
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-xs">
                Sector
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-xs">
                Tarea
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-xs">
                Estado
              </TableHead>
              <TableHead className="text-muted-foreground font-medium w-[50px] text-xs">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow
                key={complaint.id}
                className={`border-border hover:bg-secondary/30 ${selectedIds.includes(complaint.id) ? "bg-primary/5" : ""}`}
              >
                <TableCell className="w-[40px]">
                  <Checkbox
                    checked={selectedIds.includes(complaint.id)}
                    onCheckedChange={() => onToggleSelect?.(complaint.id)}
                    aria-label={`Select ${complaint.id}`}
                  />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-mono">
                  {format(new Date(complaint.createdAt), "HH:mm", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell className="text-sm font-mono text-muted-foreground">
                  {complaint.id}
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">
                  {complaint.citizenName}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {complaint.address}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {complaint.sector}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {complaint.taskType}
                </TableCell>
                <TableCell>
                  <StatusBadge status={complaint.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          await loadObservations(complaint.id);
                        }}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Observaciones
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingData({ ...complaint });
                          setIsEditing(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {(userRole === "ADMIN" || userRole === "MANAGER") && (
                        <DropdownMenuItem
                          onClick={async () => {
                            if (
                              confirm("¿Está seguro de eliminar este reclamo?")
                            ) {
                              try {
                                await complaintsApi.deleteComplaint(
                                  complaint.id,
                                );
                                toast.success("Reclamo eliminado");
                                onRefresh?.();
                              } catch (error) {
                                toast.error("Error al eliminar reclamo");
                              }
                            }
                          }}
                          className="text-destructive"
                        >
                          Eliminar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {STATUSES.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => onStatusChange(complaint.id, status)}
                          className={
                            complaint.status === status ? "bg-secondary" : ""
                          }
                        >
                          <StatusBadge status={status} />
                        </DropdownMenuItem>
                      ))}
                      {(userRole === "ADMIN" || userRole === "OPERATOR") &&
                        onAreaChange && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Cambiar área</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {["operador", "corralon", "alumbrado"].map(
                              (area) => (
                                <DropdownMenuItem
                                  key={area}
                                  onClick={() =>
                                    onAreaChange(complaint.id, area)
                                  }
                                >
                                  {area.charAt(0).toUpperCase() + area.slice(1)}
                                </DropdownMenuItem>
                              ),
                            )}
                          </>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            className={`rounded-lg border border-border bg-card p-4 space-y-3 relative ${selectedIds.includes(complaint.id) ? "ring-1 ring-primary border-primary/50" : ""}`}
          >
            <div className="absolute top-4 left-4">
              <Checkbox
                checked={selectedIds.includes(complaint.id)}
                onCheckedChange={() => onToggleSelect?.(complaint.id)}
                aria-label={`Select ${complaint.id}`}
              />
            </div>
            <div className="pl-8 flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    {complaint.id}
                  </span>
                  <StatusBadge status={complaint.status} />
                </div>
                <p className="text-sm font-medium text-foreground truncate">
                  {complaint.citizenName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {complaint.address}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menú</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await loadObservations(complaint.id);
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Observaciones
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingData({ ...complaint });
                      setIsEditing(true);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  {(userRole === "ADMIN" || userRole === "MANAGER") && (
                    <DropdownMenuItem
                      onClick={async () => {
                        if (confirm("¿Está seguro de eliminar este reclamo?")) {
                          try {
                            await complaintsApi.deleteComplaint(complaint.id);
                            toast.success("Reclamo eliminado");
                            onRefresh?.();
                          } catch (error) {
                            toast.error("Error al eliminar reclamo");
                          }
                        }
                      }}
                      className="text-destructive"
                    >
                      Eliminar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {STATUSES.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => onStatusChange(complaint.id, status)}
                      className={
                        complaint.status === status ? "bg-secondary" : ""
                      }
                    >
                      <StatusBadge status={status} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
              <span className="font-mono">
                {format(new Date(complaint.createdAt), "HH:mm", { locale: es })}
              </span>
              <span>•</span>
              <span className="truncate">{complaint.sector}</span>
              <span>•</span>
              <span className="truncate">{complaint.taskType}</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedComplaint}
        onOpenChange={() => setSelectedComplaint(null)}
      >
        <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono text-muted-foreground">
                {selectedComplaint?.id}
              </span>
              {selectedComplaint && (
                <StatusBadge status={selectedComplaint.status} />
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Fecha y hora</p>
                  <p className="font-medium">
                    {format(
                      new Date(selectedComplaint.createdAt),
                      "dd/MM/yyyy HH:mm",
                      { locale: es },
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Ciudadano</p>
                  <p className="font-medium">{selectedComplaint.citizenName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Contacto</p>
                  <p className="font-medium">{selectedComplaint.contactInfo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Sector</p>
                  <p className="font-medium">{selectedComplaint.sector}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1">Dirección</p>
                  <p className="font-medium">{selectedComplaint.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1">Tipo de tarea</p>
                  <p className="font-medium">{selectedComplaint.taskType}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground mb-2">Descripción</p>
                <p className="text-sm leading-relaxed bg-secondary/50 rounded-lg p-3">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!observationsComplaint}
        onOpenChange={() => {
          setObservationsComplaint(null);
          setSearchObservation("");
        }}
      >
        <DialogContent className="w-[95vw] max-w-[700px] max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5" />
              Observaciones - {observationsComplaint?.id}
            </DialogTitle>
          </DialogHeader>
          {observationsComplaint && (
            <div className="flex flex-col gap-4 flex-1 min-h-0">
              {(userRole === "ADMIN" ||
                (userRole === "MANAGER" &&
                  (userArea === "corralon" || userArea === "alumbrado"))) && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Agregar observación..."
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <Button
                    onClick={handleAddObservation}
                    disabled={isSubmitting || !observation.trim()}
                    className="w-full"
                  >
                    {isSubmitting ? "Guardando..." : "Agregar Observación"}
                  </Button>
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por fecha o contenido..."
                  value={searchObservation}
                  onChange={(e) => setSearchObservation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {filteredObservations.length > 0 ? (
                  [...filteredObservations].reverse().map((obs: any) => (
                    <div
                      key={obs.id}
                      className="border-l-2 border-primary pl-4 py-2 bg-secondary/30 rounded-r"
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {format(
                            new Date(obs.createdAt),
                            "dd/MM/yyyy - HH:mm",
                            { locale: es },
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          {obs.user?.firstName || "Usuario"}
                        </p>
                      </div>
                      <p className="text-sm">{obs.observation}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {searchObservation
                      ? "No se encontraron observaciones"
                      : "No hay observaciones"}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Editar Reclamo {editingData?.id}
            </DialogTitle>
          </DialogHeader>

          {editingData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nombre del Ciudadano *</Label>
                <Input
                  value={editingData.citizenName}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      citizenName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>DNI</Label>
                <Input
                  value={editingData.citizenDni || ""}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      citizenDni: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Dirección *</Label>
                <Input
                  value={editingData.address}
                  onChange={(e) =>
                    setEditingData({ ...editingData, address: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Contacto</Label>
                <Input
                  value={editingData.contactInfo}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      contactInfo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Sector</Label>
                <Select
                  value={editingData.sector}
                  onValueChange={(val) =>
                    setEditingData({ ...editingData, sector: val as Sector })
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
                <Label>Tipo de Tarea</Label>
                <Select
                  value={editingData.taskType}
                  onValueChange={(val) =>
                    setEditingData({
                      ...editingData,
                      taskType: val as TaskType,
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
              <div className="space-y-2 md:col-span-2">
                <Label>Descripción detallada *</Label>
                <Textarea
                  rows={4}
                  value={editingData.description}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 md:col-span-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" /> Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    if (
                      !editingData.citizenName ||
                      !editingData.address ||
                      !editingData.description
                    ) {
                      toast.error("Campos obligatorios faltantes");
                      return;
                    }
                    setIsSaving(true);
                    try {
                      await complaintsApi.updateComplaint(editingData.id, {
                        citizenName: editingData.citizenName,
                        citizenDni: editingData.citizenDni,
                        address: editingData.address,
                        contactInfo: editingData.contactInfo,
                        description: editingData.description,
                        sector: editingData.sector,
                        taskType: editingData.taskType,
                      });
                      toast.success("Reclamo actualizado");
                      setIsEditing(false);
                      onRefresh?.();
                    } catch (error) {
                      toast.error("Error al actualizar");
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Guardar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
