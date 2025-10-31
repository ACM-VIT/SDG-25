"use client"

import { useState, useEffect } from "react"
import { dummyClasses, dummyAttendance } from "@/lib/dummy-data"
import { classStorage, attendanceStorage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AttendanceTab({ classId }) {
  const [classData, setClassData] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [markedStudents, setMarkedStudents] = useState(new Set())

  useEffect(() => {
    let cls = classStorage.getById(classId)
    if (!cls) {
      cls = dummyClasses.find((c) => c.id === classId)
    }
    setClassData(cls)

    const storedAttendance = attendanceStorage.getByClass(classId)
    const dummyClassAttendance = dummyAttendance.filter((a) => a.classId === classId)
    const allAttendance = [...dummyClassAttendance, ...storedAttendance]
    setAttendance(allAttendance)

    const today = selectedDate
    const markedToday = new Set(
      allAttendance
        .filter((a) => a.date.split('T')[0] === today)
        .map((a) => a.studentId)
    )
    setMarkedStudents(markedToday)
  }, [classId, selectedDate])

  const handleMarkAttendance = (studentId, status) => {
    attendanceStorage.markAttendance(classId, studentId, status)
    
    const updatedAttendance = attendanceStorage.getByClass(classId)
    const dummyClassAttendance = dummyAttendance.filter((a) => a.classId === classId)
    setAttendance([...dummyClassAttendance, ...updatedAttendance])

    setMarkedStudents(prev => new Set([...prev, studentId]))
  }

  const getStudentStatus = (studentId) => {
    const today = selectedDate
    const record = attendance.find(
      (a) => a.studentId === studentId && a.date.split('T')[0] === today
    )
    return record?.status
  }

  if (!classData) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mark Attendance</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {!classData.students || classData.students.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No students in this class yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {classData.students.map((studentId, index) => {
            const status = getStudentStatus(studentId)
            return (
              <Card key={studentId} className="p-6 flex flex-row items-center justify-between border-2 border-gray-200 rounded-2xl">
                <p className="font-medium text-gray-800">Student id: Student {index + 1}</p>
                <div className="flex gap-4 flex-shrink-0">
                  <button
                    onClick={() => handleMarkAttendance(studentId, "present")}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                      status === 'present' 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-gray-300 bg-white hover:border-green-400'
                    }`}
                  >
                    <svg 
                      className={`w-7 h-7 ${status === 'present' ? 'text-green-600' : 'text-gray-400'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMarkAttendance(studentId, "absent")}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                      status === 'absent' 
                        ? 'border-red-600 bg-red-50' 
                        : 'border-gray-300 bg-white hover:border-red-400'
                    }`}
                  >
                    <svg 
                      className={`w-7 h-7 ${status === 'absent' ? 'text-red-600' : 'text-gray-400'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Attendance Summary */}
      {classData.students && classData.students.length > 0 && (
        <Card className="p-6 mt-6">
          <h3 className="font-bold text-gray-800 mb-4">Today's Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">{classData.students.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Present</p>
              <p className="text-2xl font-bold text-green-600">
                {classData.students.filter(s => getStudentStatus(s) === 'present').length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Absent</p>
              <p className="text-2xl font-bold text-red-600">
                {classData.students.filter(s => getStudentStatus(s) === 'absent').length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
