"use client"

import React from "react"

import { useState, useEffect } from "react"
import { dummyAnnouncements } from "@/lib/dummy-data"
import { announcementStorage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const PROFESSOR_NAME = "Mr. Sharma"

export default function AnnouncementTab({ classId }) {
  const [announcements, setAnnouncements] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: "", content: "" })

  useEffect(() => {
    loadAnnouncements()
  }, [classId])

  const loadAnnouncements = () => {
    const storedAnnouncements = announcementStorage.getByClass(classId)
    const dummyClassAnnouncements = dummyAnnouncements.filter((a) => a.classId === classId)
    const allAnnouncements = [...dummyClassAnnouncements, ...storedAnnouncements]
    setAnnouncements(allAnnouncements)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all fields")
      return
    }

    announcementStorage.create(classId, formData.title, formData.content, PROFESSOR_NAME)
    
    loadAnnouncements()
    setFormData({ title: "", content: "" })
    setShowForm(false)
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

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Post Announcement
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
            <Card key={announcement.id} className="p-6 border-l-4 border-l-blue-500">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{announcement.title}</h3>
              <p className="text-gray-700 mb-3">{announcement.content}</p>
              <p className="text-xs text-gray-500">Posted {new Date(announcement.createdAt).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
