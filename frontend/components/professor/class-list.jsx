"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { dummyClasses } from "@/lib/dummy-data"
import { classStorage } from "@/lib/storage"
import Link from "next/link"

export default function ClassList({ professorId }) {
  const [classes, setClasses] = useState([])

  useEffect(() => {
    const storedClasses = classStorage.getProfessorClasses(professorId)
    const dummyProfClasses = dummyClasses.filter((c) => String(c.professorId) === String(professorId))
    
    const allClasses = [...dummyProfClasses, ...storedClasses]
    const uniqueClasses = Array.from(new Map(allClasses.map(c => [c.id, c])).values())
    
    uniqueClasses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    setClasses(uniqueClasses)
    console.log("Loaded classes:", uniqueClasses)
  }, [professorId])

  if (classes.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600 text-lg">No classes yet. Create your first class to get started!</p>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((cls) => (
        <Link key={cls.id} href={`/professor/class/${cls.id}`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Code: <span className="font-mono font-bold text-blue-600">{cls.code}</span>
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                Students: <span className="font-semibold text-gray-800">{cls.students?.length || 0}</span>
              </p>
              <p>
                Created:{" "}
                <span className="font-semibold text-gray-800">{new Date(cls.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
