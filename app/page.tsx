"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/login-form"
import { Toaster } from "@/components/ui/sonner"

export default function LoginPage() {
  const { isAuthenticated, loading, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <>
      <LoginForm onLogin={login} />
      <Toaster position="bottom-center" />
    </>
  )
}
