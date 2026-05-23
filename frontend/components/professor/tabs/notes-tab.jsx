"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function NotesTab({ classId }) {
  const { data: session } = useSession();
  const professorName = session?.user?.name || "Unknown Professor";
  
  const [notes, setNotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: "", content: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [classId])

  const loadNotes = async () => {
    try {
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
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId,
          title: formData.title,
          content: formData.content,
          professor: professorName,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        loadNotes()
        setFormData({ title: "", content: "" })
        setShowForm(false)
      } else {
        setError(data.error || 'Failed to upload note')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      setError('Failed to upload note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadNotes()
      } else {
        alert('Failed to delete note')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Class Notes</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white">
          {showForm ? "Cancel" : "+ Upload Note"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note Title</label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Chapter 5 - Algebra Basics"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Paste your note content here..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Note'}
            </Button>
          </form>
        </Card>
      )}

      {notes.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No notes uploaded yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note._id} className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{note.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploaded {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleDelete(note._id)}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent text-sm"
                >
                  Delete
                </Button>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
