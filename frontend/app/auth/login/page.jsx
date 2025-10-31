"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { signIn, useSession } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const { role } = JSON.parse(storedUser)
        if (role === "professor") router.push("/professor")
        else if (role === "student") router.push("/student")
        else router.push("/")
      } else {
        router.push("/")
      }
    }
  }, [status, router])

  const handleGoogleSignIn = async (role) => {
    try {
      localStorage.setItem("user", JSON.stringify({ role }))
    } catch {}

    await signIn("google", {
      callbackUrl: `${window.location.origin}/${role}`,
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
        <p className="text-gray-600 mb-6">
          Welcome to <span className="font-semibold">EduConnect</span> — choose your role
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => handleGoogleSignIn("professor")}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 font-semibold"
          >
            Sign in as Professor
          </Button>

          <Button
            onClick={() => handleGoogleSignIn("student")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold"
          >
            Sign in as Student
          </Button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          New here? Just sign in with your Google account — we’ll set things up!
        </p>
      </Card>
    </main>
  )
}
