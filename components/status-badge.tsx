"use client"

import type { Status } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusStyles: Record<Status, { bg: string; text: string; dot: string }> = {
  URGENTE: {
    bg: "rgba(239, 68, 68, 0.12)",
    text: "#ef4444",
    dot: "#ef4444",
  },
  ESPERA: {
    bg: "rgba(245, 158, 11, 0.12)",
    text: "#d97706",
    dot: "#f59e0b",
  },
  EN_PROCESO: {
    bg: "rgba(59, 130, 246, 0.12)",
    text: "#3b82f6",
    dot: "#3b82f6",
  },
  LISTO: {
    bg: "rgba(101, 163, 13, 0.12)",
    text: "#65a30d",
    dot: "#65a30d",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = statusStyles[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      <span
        className="mr-1.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: styles.dot }}
      />
      {status}
    </span>
  )
}
