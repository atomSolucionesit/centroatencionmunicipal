"use client"

import { useState, useMemo } from "react"
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import type { Complaint, Status, Sector, TaskType } from "@/lib/types"
import { StatsCards } from "./stats-cards"
import { DashboardFilters } from "./dashboard-filters"
import { ComplaintsTable } from "./complaints-table"

interface DashboardProps {
  complaints: Complaint[]
  onStatusChange: (id: string, status: Status) => void
}

export function Dashboard({ complaints, onStatusChange }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedSector, setSelectedSector] = useState<Sector | "all">("all")
  const [selectedTask, setSelectedTask] = useState<TaskType | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<Status | "all">("all")

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      if (selectedDate && !isSameDay(complaint.createdAt, selectedDate)) {
        return false
      }
      if (selectedSector !== "all" && complaint.sector !== selectedSector) {
        return false
      }
      if (selectedTask !== "all" && complaint.taskType !== selectedTask) {
        return false
      }
      if (selectedStatus !== "all" && complaint.status !== selectedStatus) {
        return false
      }
      return true
    })
  }, [complaints, selectedDate, selectedSector, selectedTask, selectedStatus])

  // Group complaints by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Complaint[]> = {}
    for (const complaint of filteredComplaints) {
      const dateKey = format(complaint.createdAt, "yyyy-MM-dd")
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(complaint)
    }
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([dateKey, items]) => ({
        date: new Date(dateKey),
        complaints: items,
      }))
  }, [filteredComplaints])

  const handleClearFilters = () => {
    setSelectedDate(undefined)
    setSelectedSector("all")
    setSelectedTask("all")
    setSelectedStatus("all")
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Gestiona los reclamos y solicitudes ciudadanas
        </p>
      </div>

      <StatsCards complaints={complaints} />

      <div className="space-y-4">
        <DashboardFilters
          selectedDate={selectedDate}
          selectedSector={selectedSector}
          selectedTask={selectedTask}
          selectedStatus={selectedStatus}
          onDateChange={setSelectedDate}
          onSectorChange={setSelectedSector}
          onTaskChange={setSelectedTask}
          onStatusChange={setSelectedStatus}
          onClearFilters={handleClearFilters}
        />

        <div className="text-xs sm:text-sm text-muted-foreground">
          Mostrando {filteredComplaints.length} de {complaints.length} reclamos
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
  )
}
