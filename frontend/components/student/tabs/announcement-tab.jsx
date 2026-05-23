"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function StudentAnnouncementTab({ classId }) {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnnouncements()
  }, [classId])

  const loadAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/announcements/${classId}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnnouncements(data.announcements || [])
      } else {
        console.error('Error fetching announcements:', data.error)
        setAnnouncements([])
      }
    } catch (error) {
      console.error('Error loading announcements:', error)
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading announcements...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>

      {announcements.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No announcements yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement._id} className={`p-6 border-l-4 ${
              announcement.priority === 'high' ? 'border-l-red-500' :
              announcement.priority === 'medium' ? 'border-l-green-500' :
              'border-l-gray-400'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-800">{announcement.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                  announcement.priority === 'medium' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {announcement.priority}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{announcement.content}</p>
              <p className="text-xs text-gray-500">Posted {new Date(announcement.createdAt).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
