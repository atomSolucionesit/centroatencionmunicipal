"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Complaint } from "@/lib/types";
import type { User } from "@/lib/api/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TasksListProps {
  complaints: Complaint[];
  drivers: User[];
  onAssignDriver: (complaintId: string, driverId: string) => void;
  userArea?: string;
  userRole?: string;
}

export function TasksList({ complaints, drivers, onAssignDriver, userArea, userRole }: TasksListProps) {
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar reclamos por área
  const areaFilteredComplaints = useMemo(() => {
    if (userRole === "ADMIN" || userArea === "operador") {
      return complaints;
    }
    return complaints.filter(c => c.area === userArea);
  }, [complaints, userRole, userArea]);

  // Filtrar por búsqueda
  const filteredComplaints = useMemo(() => {
    if (!searchTerm) return areaFilteredComplaints;
    
    const term = searchTerm.toLowerCase();
    return areaFilteredComplaints.filter(c => 
      c.id.toLowerCase().includes(term) ||
      c.citizenName.toLowerCase().includes(term) ||
      c.address.toLowerCase().includes(term) ||
      c.taskType.toLowerCase().includes(term)
    );
  }, [areaFilteredComplaints, searchTerm]);

  const handleDriverSelect = (complaintId: string, driverId: string) => {
    setSelectedDrivers(prev => ({ ...prev, [complaintId]: driverId }));
  };

  const handleAssign = (complaintId: string) => {
    const driverId = selectedDrivers[complaintId];
    if (driverId) {
      onAssignDriver(complaintId, driverId);
      setSelectedDrivers(prev => {
        const newState = { ...prev };
        delete newState[complaintId];
        return newState;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Pendiente: "secondary",
      "En Proceso": "default",
      Completado: "outline",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID, ciudadano, dirección o tarea..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Ciudadano</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Tarea</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Tarea Creada</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground">
                  No se encontraron reclamos
                </TableCell>
              </TableRow>
            ) : (
              filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-mono text-xs">{complaint.id.slice(0, 8)}</TableCell>
                  <TableCell className="text-sm">
                    {format(complaint.createdAt, "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>{complaint.citizenName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{complaint.address}</TableCell>
                  <TableCell>{complaint.taskType}</TableCell>
                  <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{complaint.area}</Badge>
                  </TableCell>
                  <TableCell>
                    {complaint.assignedDriverId ? (
                      <span className="text-sm">
                        {drivers.find(d => d.id === complaint.assignedDriverId)?.nombre || "Asignado"}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {(complaint as any).task ? (
                      <Badge variant="default" className="bg-green-600">✓ Creada</Badge>
                    ) : (
                      <Badge variant="secondary">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {(complaint as any).task ? (
                      <span className="text-xs text-muted-foreground">Tarea asignada</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedDrivers[complaint.id] || ""}
                          onValueChange={(value) => handleDriverSelect(complaint.id, value)}
                          disabled={!!complaint.assignedDriverId}
                        >
                          <SelectTrigger className="w-[150px] h-8">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {drivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.nombre} {driver.apellido}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => handleAssign(complaint.id)}
                          disabled={!selectedDrivers[complaint.id] || !!complaint.assignedDriverId}
                        >
                          Asignar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredComplaints.length} de {areaFilteredComplaints.length} reclamos
      </div>
    </div>
  );
}
