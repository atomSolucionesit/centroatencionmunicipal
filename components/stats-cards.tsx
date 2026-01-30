"use client"

import { AlertTriangle, Clock, CheckCircle2, FileText } from "lucide-react"
import type { Complaint } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardsProps {
  complaints: Complaint[]
}

const statusColors = {
  urgent: { bg: "rgba(239, 68, 68, 0.12)", text: "#ef4444" },
  waiting: { bg: "rgba(245, 158, 11, 0.12)", text: "#d97706" },
  done: { bg: "rgba(101, 163, 13, 0.12)", text: "#65a30d" },
}

export function StatsCards({ complaints }: StatsCardsProps) {
  const total = complaints.length
  const urgent = complaints.filter((c) => c.status === "URGENTE").length
  const waiting = complaints.filter((c) => c.status === "ESPERA").length
  const done = complaints.filter((c) => c.status === "LISTO").length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-semibold text-foreground">{total}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Total Reclamos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0"
              style={{ backgroundColor: statusColors.urgent.bg }}
            >
              <AlertTriangle
                className="h-4 w-4 sm:h-5 sm:w-5"
                style={{ color: statusColors.urgent.text }}
              />
            </div>
            <div className="min-w-0">
              <p
                className="text-xl sm:text-2xl font-semibold"
                style={{ color: statusColors.urgent.text }}
              >
                {urgent}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Urgentes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0"
              style={{ backgroundColor: statusColors.waiting.bg }}
            >
              <Clock
                className="h-4 w-4 sm:h-5 sm:w-5"
                style={{ color: statusColors.waiting.text }}
              />
            </div>
            <div className="min-w-0">
              <p
                className="text-xl sm:text-2xl font-semibold"
                style={{ color: statusColors.waiting.text }}
              >
                {waiting}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">En Espera</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0"
              style={{ backgroundColor: statusColors.done.bg }}
            >
              <CheckCircle2
                className="h-4 w-4 sm:h-5 sm:w-5"
                style={{ color: statusColors.done.text }}
              />
            </div>
            <div className="min-w-0">
              <p
                className="text-xl sm:text-2xl font-semibold"
                style={{ color: statusColors.done.text }}
              >
                {done}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Completados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
