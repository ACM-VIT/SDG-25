"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { classAPI } from "@/lib/api/classes"
import { Button } from "@/components/ui/button"
import StudentNav from "@/components/student-nav"
import StudentClassTabs from "@/components/student/class-tabs"
import { useAuth } from "@/lib/auth-context"

export default function StudentClassPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id 

  const [classData, setClassData] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const { user, isLoading, needsRoleSelection } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace("/auth/login")
      return
    }

    if (needsRoleSelection || !user.role) {
      router.replace("/auth/choose-role")
      return
    }

    if (user.role !== "student") {
      router.replace(user.role === "professor" ? "/professor" : "/")
    }
  }, [user, isLoading, needsRoleSelection, router])

  useEffect(() => {
    async function fetchClass() {
      if (!classId || !user || user.role !== "student") return

      try {
        setLoading(true)
        const cls = await classAPI.getById(classId)
        
        const studentIdentifiers = [user.id, user.email].filter(Boolean)
        const belongsToStudent =
          cls && cls.students && studentIdentifiers.some((identifier) => cls.students.includes(identifier))

        if (belongsToStudent) {
          setClassData(cls)
        } else {
          router.replace("/student")
        }
      } catch (error) {
        console.error("Error fetching class:", error)
        router.replace("/student")
      } finally {
        setLoading(false)
      }
    }

    fetchClass()
  }, [classId, user, router])

  if (isLoading || needsRoleSelection || !user || user.role !== "student") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (loading || !classData) {
    return <div className="flex items-center justify-center min-h-screen">Loading class...</div>
  }

  if (!classData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav student={user} />

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <Button
            onClick={() => router.push("/student")}
            variant="outline"
            className="mb-4 bg-transparent text-green-600 border-green-200 hover:bg-green-50"
          >
            ← Back to Classes
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">{classData.name}</h1>
          <p className="text-gray-600 mt-2">Professor: {classData.professorName}</p>
        </div>

        <StudentClassTabs classId={classId} classData={classData} activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  )
}
