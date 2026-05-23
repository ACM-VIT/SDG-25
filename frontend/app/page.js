"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const router = useRouter()

  const handleStudentLogin = () => {
    router.push("/student")
  }

  const handleProfessorLogin = () => {
    router.push("/professor")
  }

  return (
    <main className="min-h-screen opacity-90 bg-blend-multiply bg-[url('/banner2.svg')] overflow-hidden bg-cover bg-center flex items-center justify-center p-8">
      <div className="w-full max-w-7xl flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-12 space-y-10 text-center">
          <h1 className="text-7xl font-bold text-white tracking-wide ">WELCOME</h1>
          <div className="w-full max-w-md">
            <Button
              onClick={handleStudentLogin}
              className="bg-[#FFD801] hover:bg-gray-800 text-gray-700 hover:text-white rounded-full py-6 px-10 text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
