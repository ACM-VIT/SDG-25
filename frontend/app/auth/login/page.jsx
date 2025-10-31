"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { signIn, useSession } from "next-auth/react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()
  const { user, isLoading, needsRoleSelection } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    if (status === "loading" || isLoading) return
    if (status !== "authenticated" || !user) return

    if (needsRoleSelection || !user.role) {
      router.replace("/auth/choose-role")
      return
    }

    router.replace(user.role === "professor" ? "/professor" : "/student")
  }, [status, isLoading, user, needsRoleSelection, router])

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return
    setIsSigningIn(true)
    try {
      await signIn("google", { callbackUrl: `${window.location.origin}/auth/choose-role` })
    } catch (err) {
      console.error("Google sign-in failed", err)
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
        <p className="text-gray-600 mb-6">
          Welcome to <span className="font-semibold">EduConnect</span>
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => handleGoogleSignIn()}
            disabled={isSigningIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold"
          >
            {isSigningIn ? "Redirecting..." : "Sign in with Google"}
          </Button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          New here? Just sign in with your Google account — we’ll set things up!
        </p>
      </Card>
    </main>
  )
}
