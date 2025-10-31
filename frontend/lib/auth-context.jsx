"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useSession, signOut } from "next-auth/react"

const STORAGE_KEY = "educonnect_user"
const LEGACY_STORAGE_KEY = "user"
const VALID_ROLES = new Set(["professor", "student"])

const AuthContext = createContext(null)

const readStoredUser = () => {
  if (typeof window === "undefined") return null

  const fromStorage =
    window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY) ?? null

  if (!fromStorage) return null

  try {
    const parsed = JSON.parse(fromStorage)
    if (parsed && typeof parsed === "object") {
      const parsedRole = typeof parsed.role === "string" ? parsed.role.toLowerCase() : null
      const safeRole = parsedRole && VALID_ROLES.has(parsedRole) ? parsedRole : null
      return {
        id: parsed.id ?? null,
        name: parsed.name ?? null,
        email: parsed.email ?? null,
        image: parsed.image ?? null,
        role: safeRole,
      }
    }
  } catch {}

  return null
}

const persistUser = (value) => {
  if (typeof window === "undefined") return
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    if (window.localStorage.getItem(LEGACY_STORAGE_KEY)) window.localStorage.removeItem(LEGACY_STORAGE_KEY)
    if (window.localStorage.getItem("intendedRole")) window.localStorage.removeItem("intendedRole")
  } catch {}
}

const clearStoredUser = () => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    if (window.localStorage.getItem(LEGACY_STORAGE_KEY)) window.localStorage.removeItem(LEGACY_STORAGE_KEY)
    if (window.localStorage.getItem("intendedRole")) window.localStorage.removeItem("intendedRole")
  } catch {}
}

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const initialUser = useMemo(() => (typeof window === "undefined" ? null : readStoredUser()), [])
  const [user, setUser] = useState(initialUser)
  const [isLoading, setIsLoading] = useState(true)
  const [needsRoleSelection, setNeedsRoleSelection] = useState(() => Boolean(initialUser && !initialUser.role))

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    if (status === "authenticated" && session?.user) {
      const cachedUser = readStoredUser()
      const role = session.user.role ?? cachedUser?.role ?? null

      const sessionUser = {
        id: session.user.id ?? session.user.email ?? cachedUser?.id ?? null,
        name: session.user.name ?? cachedUser?.name ?? session.user.email ?? null,
        email: session.user.email ?? cachedUser?.email ?? null,
        image: session.user.image ?? cachedUser?.image ?? null,
        role: VALID_ROLES.has(role) ? role : null,
      }

      setUser(sessionUser)
      setNeedsRoleSelection(!sessionUser.role)
      persistUser(sessionUser)
      setIsLoading(false)
      return
    }

    clearStoredUser()
    setUser(null)
    setNeedsRoleSelection(false)
    setIsLoading(false)
  }, [session, status])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleStorage = (event) => {
      if (!event.key || (event.key !== STORAGE_KEY && event.key !== LEGACY_STORAGE_KEY)) return

      const storedUser = readStoredUser()
      setUser(storedUser)
      setNeedsRoleSelection(storedUser ? !storedUser.role : false)
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const logout = useCallback(
    async (opts = { callbackUrl: "/" }) => {
      clearStoredUser()
      setUser(null)
      setNeedsRoleSelection(false)

      try {
        await signOut(opts)
      } catch (err) {
        try {
          window.location.href = opts?.callbackUrl || "/"
        } catch {}
      }
    },
    [signOut]
  )

  const updateRole = useCallback((role) => {
    const normalizedRole = typeof role === "string" ? role.toLowerCase() : ""
    if (!VALID_ROLES.has(normalizedRole)) return

    setUser((prev) => {
      if (!prev) return prev
      const nextUser = { ...prev, role: normalizedRole }
      persistUser(nextUser)
      return nextUser
    })
    setNeedsRoleSelection(false)
  }, [])

  const contextValue = useMemo(
    () => ({ user, isLoading, needsRoleSelection, logout, updateRole }),
    [user, isLoading, needsRoleSelection, logout, updateRole]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === null) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
