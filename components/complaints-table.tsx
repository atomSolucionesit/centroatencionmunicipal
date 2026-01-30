"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { MoreHorizontal, Eye } from "lucide-react"
import type { Complaint, Status } from "@/lib/types"
import { STATUSES } from "@/lib/types"
import { StatusBadge } from "./status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ComplaintsTableProps {
  complaints: Complaint[]
  onStatusChange: (id: string, status: Status) => void
}

export function ComplaintsTable({
  complaints,
  onStatusChange,
}: ComplaintsTableProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)

  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-sm">No se encontraron reclamos</p>
        <p className="text-xs">Intenta ajustar los filtros</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
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
                className="border-border hover:bg-secondary/30"
              >
                <TableCell className="text-sm text-muted-foreground font-mono">
                  {format(complaint.createdAt, "HH:mm", { locale: es })}
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
            className="rounded-lg border border-border bg-card p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
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
              <span className="font-mono">{format(complaint.createdAt, "HH:mm", { locale: es })}</span>
              <span>•</span>
              <span className="truncate">{complaint.sector}</span>
              <span>•</span>
              <span className="truncate">{complaint.taskType}</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono text-muted-foreground">{selectedComplaint?.id}</span>
              {selectedComplaint && <StatusBadge status={selectedComplaint.status} />}
            </DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Fecha y hora</p>
                  <p className="font-medium">
                    {format(selectedComplaint.createdAt, "dd/MM/yyyy HH:mm", { locale: es })}
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
    </>
  )
}
