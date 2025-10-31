"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(status === "loading")

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null

    if (session && session.user) {
      let role
if (stored) {
  try {
    const parsed = JSON.parse(stored)
    role = parsed?.role
  } catch {}
}
if (!role && typeof window !== "undefined") {
  role = localStorage.getItem("intendedRole")
  localStorage.removeItem("intendedRole")
}


      const sessionUser = {
        id: session.user.email ?? session.user.name ?? "",
        name: session.user.name ?? session.user.email ?? "",
        email: session.user.email ?? "",
        role,
      }

      setUser(sessionUser)
      try {
        localStorage.setItem("user", JSON.stringify(sessionUser))
      } catch (e) {
      }

      setIsLoading(false)
      return
    }

    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (e) {
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [session, status])

  const logout = async (options = { redirect: false }) => {
    try {
      localStorage.removeItem("user")
    } catch (e) {}
    setUser(null)
    try {
      await signOut(options)
    } catch (e) {
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === null) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
