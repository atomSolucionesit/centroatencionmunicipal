"use client"

import { CalendarIcon, Filter } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Sector, TaskType, Status } from "@/lib/types"
import { SECTORS, TASK_TYPES, STATUSES } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface DashboardFiltersProps {
  selectedDate: Date | undefined
  selectedSector: Sector | "all"
  selectedTask: TaskType | "all"
  selectedStatus: Status | "all"
  onDateChange: (date: Date | undefined) => void
  onSectorChange: (sector: Sector | "all") => void
  onTaskChange: (task: TaskType | "all") => void
  onStatusChange: (status: Status | "all") => void
  onClearFilters: () => void
}

export function DashboardFilters({
  selectedDate,
  selectedSector,
  selectedTask,
  selectedStatus,
  onDateChange,
  onSectorChange,
  onTaskChange,
  onStatusChange,
  onClearFilters,
}: DashboardFiltersProps) {
  const hasFilters =
    selectedDate ||
    selectedSector !== "all" ||
    selectedTask !== "all" ||
    selectedStatus !== "all"

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground w-full sm:w-auto">
        <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="text-xs sm:text-sm font-medium">Filtros</span>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-8 sm:h-9 justify-start text-left font-normal bg-secondary border-border text-foreground hover:bg-accent text-xs sm:text-sm flex-1 sm:flex-initial min-w-[100px]"
          >
            <CalendarIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {selectedDate ? (
              format(selectedDate, "dd MMM yyyy", { locale: es })
            ) : (
              <span className="text-muted-foreground">Fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Select
        value={selectedSector}
        onValueChange={(value) => onSectorChange(value as Sector | "all")}
      >
        <SelectTrigger className="h-8 sm:h-9 w-full sm:w-[160px] bg-secondary border-border text-xs sm:text-sm">
          <SelectValue placeholder="Sector" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los sectores</SelectItem>
          {SECTORS.map((sector) => (
            <SelectItem key={sector} value={sector}>
              {sector}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedTask}
        onValueChange={(value) => onTaskChange(value as TaskType | "all")}
      >
        <SelectTrigger className="h-8 sm:h-9 w-full sm:w-[160px] bg-secondary border-border text-xs sm:text-sm">
          <SelectValue placeholder="Tarea" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las tareas</SelectItem>
          {TASK_TYPES.map((task) => (
            <SelectItem key={task} value={task}>
              {task}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedStatus}
        onValueChange={(value) => onStatusChange(value as Status | "all")}
      >
        <SelectTrigger className="h-8 sm:h-9 w-full sm:w-[140px] bg-secondary border-border text-xs sm:text-sm">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-8 sm:h-9 text-xs sm:text-sm text-muted-foreground hover:text-foreground w-full sm:w-auto"
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
