"use client"

import React from "react"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { signIn } from "next-auth/react"

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role")

  useEffect(() => {
    if (!role) {
      router.push("/")
    }
  }, [role, router])

  if (!role) return null

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: `${window.location.origin}/auth/choose-role` })
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign Up as {role === "professor" ? "Professor" : "Student"}</h1>
        <p className="text-gray-600 mb-6">Use Google to create and sign in to your account</p>

        <Button onClick={handleGoogleSignIn} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 font-semibold">
          Sign in with Google
        </Button>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account? <a href="/auth/login" className="text-blue-600 hover:underline font-semibold">Sign In</a>
        </p>
      </Card>
    </main>
  )
}
