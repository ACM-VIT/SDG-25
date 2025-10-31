"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { dummyClasses } from "@/lib/dummy-data"
import { classStorage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import StudentNav from "@/components/student-nav"
import StudentClassTabs from "@/components/student/class-tabs"

const STUDENT = {
  id: "student1",
  name: "John Doe",
  email: "john@student.com",
}

export default function StudentClassPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id 

  const [classData, setClassData] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (classId) {
      let cls = classStorage.getById(classId)
      if (!cls) {
        cls = dummyClasses.find((c) => c.id === classId)
      }
      
      if (cls && cls.students.includes(STUDENT.id)) {
        setClassData(cls)
      } else {
        router.push("/student")
      }
    }
  }, [classId, router])

  if (!classData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav student={STUDENT} />

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

        <StudentClassTabs classId={classId} activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  )
}
