"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import StudentNav from "@/components/student-nav"
import StudentClassList from "@/components/student/class-list"
import JoinClassModal from "@/components/student/join-class-modal"

const STUDENT = {
  id: "student1",
  name: "John Doe",
  email: "john@student.com",
}

export default function StudentDashboard() {
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleClassJoined = () => {
    setShowJoinModal(false)
    setRefreshKey((prev) => prev + 1)
  }

  const clearTestData = () => {
    if (confirm('Are you sure you want to clear ALL site data? This will remove all classes, notes, quizzes, announcements, and attendance records.')) {
      localStorage.removeItem('educonnect_classes')
      localStorage.removeItem('educonnect_notes')
      localStorage.removeItem('educonnect_quizzes')
      localStorage.removeItem('educonnect_announcements')
      localStorage.removeItem('educonnect_attendance')
      
      setRefreshKey((prev) => prev + 1)
      alert('All site data cleared successfully!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav student={STUDENT} />

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Classes</h1>
            <p className="text-gray-600 mt-1">Access your classes and materials</p>
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

        <StudentClassList key={refreshKey} studentId={STUDENT.id} />

        {showJoinModal && (
          <JoinClassModal
            onClose={() => setShowJoinModal(false)}
            onClassJoined={handleClassJoined}
            studentId={STUDENT.id}
          />
        )}
      </main>
    </div>
  )
}
