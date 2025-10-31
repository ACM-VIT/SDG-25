"use client"

import { useState, useEffect } from "react"
import { dummyNotes } from "@/lib/dummy-data"
import { noteStorage } from "@/lib/storage"
import { Card } from "@/components/ui/card"

export default function StudentNotesTab({ classId }) {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    // Load from storage and dummy data
    const storedNotes = noteStorage.getByClass(classId)
    const dummyClassNotes = dummyNotes.filter((n) => n.classId === classId)
    const allNotes = [...dummyClassNotes, ...storedNotes]
    setNotes(allNotes)
  }, [classId])

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
            <Card key={note.id} className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{note.title}</h3>
              <p className="text-xs text-gray-500 mb-3">Uploaded {new Date(note.uploadedAt).toLocaleDateString()}</p>
              <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
