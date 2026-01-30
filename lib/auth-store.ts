"use client"

import type { User, UserRole, Zone, Sector } from "./types"

// Mock users for the system
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "María García",
    email: "maria@municipio.gov",
    role: "call-center",
  },
  {
    id: "user-2",
    name: "Carlos López",
    email: "carlos@municipio.gov",
    role: "sector-manager",
    sector: "Obras y Servicios",
  },
  {
    id: "user-3",
    name: "Roberto Sánchez",
    email: "roberto@municipio.gov",
    role: "driver",
    zone: "Norte",
  },
  {
    id: "user-4",
    name: "Ana Fernández",
    email: "ana@municipio.gov",
    role: "driver",
    zone: "Sur",
  },
  {
    id: "user-5",
    name: "Pedro Martínez",
    email: "pedro@municipio.gov",
    role: "driver",
    zone: "Centro",
  },
  {
    id: "user-6",
    name: "Laura Torres",
    email: "laura@municipio.gov",
    role: "admin",
  },
]

export const mockDrivers = mockUsers.filter((u) => u.role === "driver") as (User & { zone: Zone })[]

type AuthListener = (user: User | null) => void

class AuthStore {
  private currentUser: User | null = null
  private listeners: Set<AuthListener> = new Set()

  login(role: UserRole, zone?: Zone, sector?: Sector): User {
    let user = mockUsers.find((u) => {
      if (u.role !== role) return false
      if (role === "driver" && zone && u.zone !== zone) return false
      if (role === "sector-manager" && sector && u.sector !== sector) return false
      return true
    })

    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: role === "driver" ? `Chofer ${zone}` : `Usuario ${role}`,
        email: `${role}@municipio.gov`,
        role,
        zone: role === "driver" ? zone : undefined,
        sector: role === "sector-manager" ? sector : undefined,
      }
    }

    this.currentUser = user
    this.notifyListeners()
    return user
  }

  logout(): void {
    this.currentUser = null
    this.notifyListeners()
  }

  getUser(): User | null {
    return this.currentUser
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentUser))
  }
}

export const authStore = new AuthStore()
