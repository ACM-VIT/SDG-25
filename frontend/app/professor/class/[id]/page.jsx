"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { dummyClasses } from "@/lib/dummy-data"
import { classStorage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import ProfessorNav from "@/components/professor-nav"
import ClassTabs from "@/components/professor/class-tabs"
import { useAuth } from "@/lib/auth-context"

export default function ProfessorClassPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id 

  const [classData, setClassData] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
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

    if (user.role !== "professor") {
      router.replace(user.role === "student" ? "/student" : "/")
    }
  }, [user, isLoading, needsRoleSelection, router])

  useEffect(() => {
    if (!classId || !user || user.role !== "professor") return

    let cls = classStorage.getById(classId)
    if (!cls) {
      cls = dummyClasses.find((c) => c.id === classId)
    }

    const isOwner = cls && (cls.professorId === user.id || cls.professorId === user.email)

    if (isOwner) {
      setClassData(cls)
    } else {
      router.replace("/professor")
    }
  }, [classId, user, router])

  if (isLoading || needsRoleSelection || !user || user.role !== "professor") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!classData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessorNav professor={user} />

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <Button
            onClick={() => router.push("/professor")}
            variant="outline"
            className="mb-4 bg-transparent text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            ← Back to Classes
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">{classData.name}</h1>
          <p className="text-gray-600 mt-2">
            Class Code: <span className="font-mono font-bold text-blue-600">{classData.code}</span>
          </p>
        </div>

        <ClassTabs classId={classId} activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  )
}
