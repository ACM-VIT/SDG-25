"use client"

import React from "react"

import { useState, useEffect } from "react"
import { dummyNotes } from "@/lib/dummy-data"
import { noteStorage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const PROFESSOR_NAME = "Mr. Sharma"

export default function NotesTab({ classId }) {
  const [notes, setNotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: "", content: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    loadNotes()
  }, [classId])

  const loadNotes = () => {
    const storedNotes = noteStorage.getByClass(classId)
    const dummyClassNotes = dummyNotes.filter((n) => n.classId === classId)
    const allNotes = [...dummyClassNotes, ...storedNotes]
    setNotes(allNotes)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in all fields")
      return
    }

    noteStorage.create(classId, formData.title, formData.content, PROFESSOR_NAME)
    
    loadNotes()
    setFormData({ title: "", content: "" })
    setShowForm(false)
  }

  const handleDelete = (noteId) => {
    noteStorage.delete(noteId)
    loadNotes()
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

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Upload Note
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
            <Card key={note.id} className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{note.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploaded {new Date(note.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleDelete(note.id)}
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
