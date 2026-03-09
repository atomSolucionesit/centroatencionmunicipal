import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import type { Complaint, Status, Sector, TaskType } from "@/lib/types";
import { StatsCards } from "./stats-cards";
import { DashboardFilters } from "./dashboard-filters";
import { ComplaintsTable } from "./complaints-table";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, CheckSquare, Square } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface DashboardProps {
  complaints: Complaint[];
  onStatusChange: (id: string, status: Status) => void;
  onAreaChange?: (id: string, area: string) => void;
  onRefresh?: () => void;
  userRole?: string;
  userArea?: string;
  currentUserId?: string;
}

export function Dashboard({
  complaints,
  onStatusChange,
  onAreaChange,
  onRefresh,
  userRole,
  userArea,
  currentUserId,
}: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSector, setSelectedSector] = useState<Sector | "all">("all");
  const [selectedTask, setSelectedTask] = useState<TaskType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<Status | "all">("all");
  const [searchId, setSearchId] = useState("");
  const [searchCitizen, setSearchCitizen] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtrar reclamos por área del usuario
  const areaFilteredComplaints = useMemo(() => {
    const role = userRole?.toUpperCase();
    const area = userArea?.toLowerCase();

    if (role === "ADMIN" || role === "OPERATOR" || area === "operador") {
      return complaints;
    }

    return complaints.filter(
      (c) =>
        c.area?.toLowerCase() === area ||
        (currentUserId && c.userId === currentUserId),
    );
  }, [complaints, userRole, userArea, currentUserId]);

  const filteredComplaints = useMemo(() => {
    return areaFilteredComplaints.filter((complaint) => {
      if (selectedDate && !isSameDay(complaint.createdAt, selectedDate)) {
        return false;
      }
      if (selectedSector !== "all" && complaint.sector !== selectedSector) {
        return false;
      }
      if (selectedTask !== "all" && complaint.taskType !== selectedTask) {
        return false;
      }
      if (selectedStatus !== "all" && complaint.status !== selectedStatus) {
        return false;
      }
      if (
        searchId &&
        !complaint.id.toLowerCase().includes(searchId.toLowerCase())
      ) {
        return false;
      }
      if (
        searchCitizen &&
        !complaint.citizenName
          .toLowerCase()
          .includes(searchCitizen.toLowerCase())
      ) {
        return false;
      }
      if (
        searchAddress &&
        !complaint.address.toLowerCase().includes(searchAddress.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [
    areaFilteredComplaints,
    selectedDate,
    selectedSector,
    selectedTask,
    selectedStatus,
    searchId,
    searchCitizen,
    searchAddress,
  ]);

  const exportToExcel = () => {
    const dataToExport =
      selectedIds.length > 0
        ? filteredComplaints.filter((c) => selectedIds.includes(c.id))
        : filteredComplaints;

    if (dataToExport.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    const worksheetData = dataToExport.map((c) => ({
      ID: c.id,
      Fecha: format(new Date(c.createdAt), "dd/MM/yyyy HH:mm"),
      Ciudadano: c.citizenName,
      DNI: c.citizenDni,
      Dirección: c.address,
      Ciudad: "Paso de los Libres",
      Contacto: c.contactInfo,
      Sector: c.sector,
      Tarea: c.taskType,
      Estado: c.status,
      Área: c.area || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reclamos");

    const fileName = `Reclamos_${format(new Date(), "yyyy-MM-dd_HHmm")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success(`Exportados ${dataToExport.length} reclamos a Excel`);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedIds.length === filteredComplaints.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredComplaints.map((c) => c.id));
    }
  };

  // Group complaints by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Complaint[]> = {};
    for (const complaint of filteredComplaints) {
      const dateKey = format(new Date(complaint.createdAt), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(complaint);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([dateKey, items]) => ({
        date: new Date(dateKey + "T12:00:00"),
        complaints: items,
      }));
  }, [filteredComplaints]);

  const handleClearFilters = () => {
    setSelectedDate(undefined);
    setSelectedSector("all");
    setSelectedTask("all");
    setSelectedStatus("all");
    setSearchId("");
    setSearchCitizen("");
    setSearchAddress("");
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Gestiona los reclamos y solicitudes ciudadanas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="text-xs h-8"
            >
              Limpiar Selección ({selectedIds.length})
            </Button>
          )}
          <Button
            onClick={exportToExcel}
            variant="default"
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 h-8"
          >
            <FileSpreadsheet size={16} />
            {selectedIds.length > 0
              ? `Exportar Seleccionados (${selectedIds.length})`
              : "Exportar Filtrados"}
          </Button>
        </div>
      </div>

      <StatsCards complaints={complaints} />

      <div className="space-y-4">
        <DashboardFilters
          selectedDate={selectedDate}
          selectedSector={selectedSector}
          selectedTask={selectedTask}
          selectedStatus={selectedStatus}
          searchId={searchId}
          searchCitizen={searchCitizen}
          searchAddress={searchAddress}
          onDateChange={setSelectedDate}
          onSectorChange={setSelectedSector}
          onTaskChange={setSelectedTask}
          onStatusChange={setSelectedStatus}
          onSearchIdChange={setSearchId}
          onSearchCitizenChange={setSearchCitizen}
          onSearchAddressChange={setSearchAddress}
          onClearFilters={handleClearFilters}
        />

        <div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground">
          <div>
            Mostrando {filteredComplaints.length} de{" "}
            {areaFilteredComplaints.length} reclamos
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAllFiltered}
            className="h-7 text-[10px] uppercase font-bold tracking-wider"
          >
            {selectedIds.length === filteredComplaints.length
              ? "Desmarcar Todos"
              : "Seleccionar Todos los Filtrados"}
          </Button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {groupedByDate.map(({ date, complaints: dayComplaints }) => (
          <div key={date.toISOString()} className="space-y-2 sm:space-y-3">
            <h2 className="text-xs sm:text-sm font-medium text-muted-foreground">
              {format(date, "EEEE, d MMMM yyyy", { locale: es })}
            </h2>
            <ComplaintsTable
              complaints={dayComplaints}
              onStatusChange={onStatusChange}
              onAreaChange={onAreaChange}
              onRefresh={onRefresh}
              userRole={userRole}
              userArea={userArea}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
            />
          </div>
        ))}

        {groupedByDate.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              No se encontraron reclamos con los filtros seleccionados
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
