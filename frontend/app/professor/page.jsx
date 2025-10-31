"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ProfessorNav from "@/components/professor-nav"
import ClassList from "@/components/professor/class-list"
import CreateClassModal from "@/components/professor/create-class-modal"

const PROFESSOR = {
  id: "prof1",
  name: "Mr. Sharma",
  email: "sharma@school.com",
}

export default function ProfessorDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleClassCreated = () => {
    setShowCreateModal(false)
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
      <ProfessorNav professor={PROFESSOR} />

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Classes</h1>
            <p className="text-gray-600 mt-1">Manage your classes and students</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={clearTestData} variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
              Clear Test Data
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              + Create Class
            </Button>
          </div>
        </div>

        <ClassList key={refreshKey} professorId={PROFESSOR.id} />

        {showCreateModal && (
          <CreateClassModal
            onClose={() => setShowCreateModal(false)}
            onClassCreated={handleClassCreated}
            professorId={PROFESSOR.id}
            professorName={PROFESSOR.name}
          />
        )}
      </main>
    </div>
  )
}
