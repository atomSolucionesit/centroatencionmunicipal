"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, LogOut, Users } from "lucide-react"
import { NotificationsPanel } from "./notifications-panel"
import { Button } from "./ui/button"
import { useAuth } from "@/hooks/use-auth"

interface HeaderProps {
  activeView: "dashboard" | "nuevo-reclamo"
  onViewChange: (view: "dashboard" | "nuevo-reclamo") => void
  onLogout?: () => void
}

export function Header({ activeView, onViewChange, onLogout }: HeaderProps) {
  const { user } = useAuth()
  
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-14 md:h-16 items-center justify-between px-3 sm:px-4 md:px-6 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Image
            src="/logo-municipalidad.png"
            alt="Logo Municipalidad"
            width={48}
            height={48}
            className="object-contain w-12 h-12 sm:w-14 sm:h-14 shrink-0"
          />
          <span className="text-sm sm:text-base md:text-lg font-semibold text-foreground truncate">
            <span className="hidden sm:inline">Centro de Atención Municipal</span>
            <span className="sm:hidden">CAM</span>
          </span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          <NotificationsPanel />
          <button
            onClick={() => onViewChange("dashboard")}
            className={`flex items-center gap-1 sm:gap-2 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              activeView === "dashboard"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Dash</span>
          </button>
          <button
            onClick={() => onViewChange("nuevo-reclamo")}
            className={`flex items-center gap-1 sm:gap-2 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              activeView === "nuevo-reclamo"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Nuevo Reclamo</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
          {user?.role === "ADMIN" && (
            <Link href="/users">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Usuarios</span>
              </Button>
            </Link>
          )}
          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Salir</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
