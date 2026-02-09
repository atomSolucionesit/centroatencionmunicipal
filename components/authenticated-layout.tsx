"use client"

import { ReactNode } from "react"
import { AdminSidebar } from "./admin-sidebar"

interface AuthenticatedLayoutProps {
  children: ReactNode
  userRole?: string
}

export function AuthenticatedLayout({ children, userRole }: AuthenticatedLayoutProps) {
  const showSidebar = userRole === "ADMIN" || userRole === "MANAGER"

  return (
    <>
      {showSidebar && <AdminSidebar />}
      <main className={showSidebar ? "pl-16" : ""}>
        {children}
      </main>
    </>
  )
}