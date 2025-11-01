"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function StudentNotesTab({ classId }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotes()
  }, [classId])

  const loadNotes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/notes/${classId}`)
      const data = await response.json()
      
      if (response.ok) {
        setNotes(data.notes || [])
      } else {
        console.error('Error fetching notes:', data.error)
        setNotes([])
      }
    } catch (error) {
      console.error('Error loading notes:', error)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Class Notes</h2>
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading notes...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Class Notes</h2>

      {notes.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No notes available yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note._id} className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{note.title}</h3>
              <p className="text-xs text-gray-500 mb-3">Uploaded {new Date(note.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
