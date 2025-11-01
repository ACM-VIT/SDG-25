"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { classAPI } from "@/lib/api/classes"

export default function CreateClassModal({
  onClose,
  onClassCreated,
  professorId,
  professorName,
}) {
  const [className, setClassName] = useState("")
  const [error, setError] = useState("")
  const [createdClass, setCreatedClass] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!className.trim()) {
      setError("Class name is required")
      setLoading(false)
      return
    }

    try {
      const newClass = await classAPI.create(className.trim(), professorId, professorName)
      console.log("Created new class:", newClass)
      
      setCreatedClass(newClass)
    } catch (err) {
      setError(err.message || "Failed to create class. Please try again.")
      console.error("Error creating class:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDone = () => {
    onClassCreated()
  }

  if (createdClass) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div 
          className="w-full max-w-md bg-white rounded-xl shadow-lg p-6"
        >
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Class Created!</h2>
            <p className="text-gray-600 mb-4">{createdClass.name}</p>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Share this code with your students:</p>
              <p className="text-4xl font-mono font-bold text-blue-600 tracking-wider">{createdClass.code}</p>
            </div>

            <p className="text-sm text-gray-500 mb-6">Students can use this 6-digit code to join your class</p>

            <Button onClick={handleDone} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Done
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Class</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
            <Input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., Mathematics 101"
              className="w-full"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? 'Creating...' : 'Create Class'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
