"use client"

import { useAuth } from "@/hooks/use-auth"
import { Home, FileText, Users, Settings, LogOut, Truck, Fuel } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from "react"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Reclamos", href: "/complaints" },
  { icon: Truck, label: "Vehículos", href: "/vehicles" },
  { icon: Fuel, label: "Combustible", href: "/fuel-loads" },
  { icon: Users, label: "Usuarios", href: "/users" },
  { icon: Settings, label: "Configuración", href: "/settings" },
]

export function AdminSidebar() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // No renderizar hasta que esté montado del lado del cliente
  if (!mounted) return null
  
  // No mostrar si no está autenticado o no es ADMIN
  if (!isAuthenticated || !user || user.role !== "ADMIN") return null

  return (
    <TooltipProvider>
      <aside className="fixed left-0 top-0 h-screen w-16 border-r bg-background flex flex-col">
        <div className="border-b p-4 flex justify-center">
          <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center">
            {/* <span className="text-primary-foreground font-bold text-sm">CA</span> */}
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        <div className="border-t p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={logout}
                className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-muted transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Cerrar Sesión</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}