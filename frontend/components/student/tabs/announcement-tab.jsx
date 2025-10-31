"use client"

import { useState, useEffect } from "react"
import { dummyAnnouncements } from "@/lib/dummy-data"
import { announcementStorage } from "@/lib/storage"
import { Card } from "@/components/ui/card"

export default function StudentAnnouncementTab({ classId }) {
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    const loadAnnouncements = () => {
      const storedAnnouncements = announcementStorage.getByClass(classId)
      const dummyClassAnnouncements = dummyAnnouncements.filter((a) => a.classId === classId)
      setAnnouncements([...storedAnnouncements, ...dummyClassAnnouncements])
    }

    loadAnnouncements()
  }, [classId])

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
            <Card key={announcement.id} className="p-6 border-l-4 border-l-green-500">
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
