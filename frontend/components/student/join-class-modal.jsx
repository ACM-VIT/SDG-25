"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { classStorage } from "@/lib/storage"

export default function JoinClassModal({ onClose, onClassJoined, studentId }) {
  const [classCode, setClassCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!classCode.trim()) {
      setError("Please enter a class code")
      setLoading(false)
      return
    }

    if (classCode.length !== 6) {
      setError("Class code must be 6 characters")
      setLoading(false)
      return
    }

    try {
      const cls = classStorage.getByCode(classCode.toUpperCase())
      if (!cls) {
        setError("Invalid class code. Please check and try again.")
        setLoading(false)
        return
      }

      // Check if already joined
      if (cls.students.includes(studentId)) {
        setError("You have already joined this class")
        setLoading(false)
        return
      }

      // Join the class
      classStorage.joinClass(cls.id, studentId)
      console.log('Successfully joined class:', cls)
      
      // Close modal and trigger refresh
      onClassJoined()
    } catch (err) {
      console.error('Error joining class:', err)
      setError("Failed to join class. Please try again.")
      setLoading(false)
    }
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Join a Class</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Code</label>
            <Input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              className="w-full text-center text-lg font-mono tracking-widest"
              maxLength={6}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">Ask your professor for the class code</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
              {loading ? "Joining..." : "Join Class"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
