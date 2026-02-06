"use client"

import { ReactNode } from "react"
import { AdminSidebar } from "./admin-sidebar"

interface AuthenticatedLayoutProps {
  children: ReactNode
  userRole?: string
}

export function AuthenticatedLayout({ children, userRole }: AuthenticatedLayoutProps) {
  const isAdmin = userRole === "ADMIN"

  return (
    <>
      {isAdmin && <AdminSidebar />}
      <main className={isAdmin ? "pl-16" : ""}>
        {children}
      </main>
    </>
  )
}