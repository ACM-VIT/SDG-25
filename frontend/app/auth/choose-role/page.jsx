"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function ChooseRolePage() {
  const { data: session, status, update } = useSession()
  const { user, isLoading, needsRoleSelection, updateRole } = useAuth()
  const router = useRouter()
  const [error, setError] = useState(null)
  const [submittingRole, setSubmittingRole] = useState(null)

  useEffect(() => {
    if (status === "loading" || isLoading) return

    if (status === "unauthenticated" || !session?.user) {
      router.replace("/auth/login")
      return
    }

    if (!needsRoleSelection && user?.role) {
      router.replace(user.role === "professor" ? "/professor" : "/student")
    }
  }, [status, isLoading, needsRoleSelection, user, router, session])

  const handleChoose = async (role) => {
    if (submittingRole) return
    setError(null)
    setSubmittingRole(role)

    try {
      const res = await fetch("/api/user/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include",
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data?.ok) {
        const message = data?.error ?? "Unable to save role. Please try again."
        console.error("Failed to save role", message)
        setError(message)
        return
      }

      await update({ role })
      updateRole(role)

      router.replace(role === "professor" ? "/professor" : "/student")
    } catch (e) {
      console.error(e)
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmittingRole(null)
    }
  }

  if (status === "loading" || isLoading) return null

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold mb-3">Welcome{session?.user?.name ? `, ${session.user.name}` : ""}</h1>
        <p className="text-gray-600 mb-6">Choose how you'd like to continue</p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-2">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => handleChoose("professor")}
            disabled={Boolean(submittingRole)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 font-semibold"
          >
            {submittingRole === "professor" ? "Saving..." : "Continue as Professor"}
          </Button>

          <Button
            onClick={() => handleChoose("student")}
            disabled={Boolean(submittingRole)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold"
          >
            {submittingRole === "student" ? "Saving..." : "Continue as Student"}
          </Button>
        </div>
      </Card>
    </main>
  )
}
