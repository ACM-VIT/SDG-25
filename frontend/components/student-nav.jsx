"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function StudentNav({ student }) {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:p-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-green-600">EduConnect</h1>
          <p className="text-xs text-gray-600">Student Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{student?.name}</p>
            <p className="text-xs text-gray-600">{student?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
