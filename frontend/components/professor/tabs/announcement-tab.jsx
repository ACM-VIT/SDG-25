"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AnnouncementTab({ classId }) {
  const { data: session } = useSession();
  const professorName = session?.user?.name || "Unknown Professor";
  
  const [announcements, setAnnouncements] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: "", content: "", priority: "medium" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAnnouncements()
  }, [classId])

  const loadAnnouncements = async () => {
    try {
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
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId,
          title: formData.title,
          content: formData.content,
          professor: professorName,
          priority: formData.priority,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        loadAnnouncements()
        setFormData({ title: "", content: "", priority: "medium" })
        setShowForm(false)
      } else {
        alert(data.error || 'Failed to post announcement')
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      alert('Failed to post announcement. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (announcementId) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const response = await fetch(`${API_URL}/api/announcements/${announcementId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadAnnouncements()
      } else {
        alert('Failed to delete announcement')
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert('Failed to delete announcement')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white">
          {showForm ? "Cancel" : "+ Post Announcement"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Announcement title"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your announcement..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? 'Posting...' : 'Post Announcement'}
            </Button>
          </form>
        </Card>
      )}

      {announcements.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No announcements yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement._id} className={`p-6 border-l-4 ${
              announcement.priority === 'high' ? 'border-l-red-500' :
              announcement.priority === 'medium' ? 'border-l-blue-500' :
              'border-l-gray-400'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{announcement.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                      announcement.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{announcement.content}</p>
                  <p className="text-xs text-gray-500">Posted {new Date(announcement.createdAt).toLocaleDateString()}</p>
                </div>
                <Button
                  onClick={() => handleDelete(announcement._id)}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent text-sm ml-4"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
