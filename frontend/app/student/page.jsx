"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import StudentNav from "@/components/student-nav"
import StudentClassList from "@/components/student/class-list"
import JoinClassModal from "@/components/student/join-class-modal"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const router = useRouter()
  const { user, isLoading, needsRoleSelection } = useAuth()
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

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

  const handleClassJoined = () => {
    setShowJoinModal(false)
    setRefreshKey((prev) => prev + 1)
  }

  const clearTestData = () => {
    if (
      confirm(
        "Are you sure you want to clear ALL site data? This will remove all classes, notes, quizzes, announcements, and attendance records."
      )
    ) {
      localStorage.removeItem("educonnect_classes")
      localStorage.removeItem("educonnect_notes")
      localStorage.removeItem("educonnect_quizzes")
      localStorage.removeItem("educonnect_announcements")
      localStorage.removeItem("educonnect_attendance")

      setRefreshKey((prev) => prev + 1)
      alert("All site data cleared successfully!")
    }
  }

  if (isLoading || !user || user.role !== "student" || needsRoleSelection) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav />

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Classes</h1>
            <p className="text-gray-600 mt-1">Access your classes and materials</p>
            <p className="text-sm text-gray-700 mt-2">Signed in as <span className="font-medium">{user?.name ?? user?.email}</span></p>
          </div>
          <div className="flex gap-3">
            <Button onClick={clearTestData} variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
              Clear Test Data
            </Button>
            <Button onClick={() => setShowJoinModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
              + Join Class
            </Button>
          </div>
        </div>

        <StudentClassList key={refreshKey} studentId={user.id} />

        {showJoinModal && (
          <JoinClassModal onClose={() => setShowJoinModal(false)} onClassJoined={handleClassJoined} studentId={user.id} />
        )}
      </main>
    </div>
  )
}
