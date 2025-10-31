"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function LandingPage() {
  const router = useRouter()

  const handleStudentLogin = () => {
    router.push("/student")
  }

  const handleProfessorLogin = () => {
    router.push("/professor")
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-7xl">
        <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border-2 border-gray-300 shadow-2xl" style={{ minHeight: '700px' }}>
          <div className="bg-white flex flex-col items-center justify-center p-12 space-y-10">
            <h1 className="text-5xl font-semibold text-gray-800 tracking-wide">WELCOME</h1>
            
            <div className="w-full max-w-md space-y-6">
              <Button
                onClick={handleStudentLogin}
                className="w-full bg-white hover:bg-gray-800 text-gray-700 hover:text-white border-2 border-gray-800 rounded-full py-6 text-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                login as a student
              </Button>
              
              <Button
                onClick={handleProfessorLogin}
                className="w-full bg-white hover:bg-gray-800 text-gray-700 hover:text-white border-2 border-gray-800 rounded-full py-6 text-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                login as a professor
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 relative border-l-2 border-gray-300">
            <Image
              src="/assets/leaf.jpg"
              alt="Welcome"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  )
}
