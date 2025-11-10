"use client";

import React from "react";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { dummyNotes } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NotesTab({ classId }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState(
    dummyNotes.filter((n) => n.classId === classId)
  );
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (files.length === 0) {
      setError("Please attach at least one file");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("createdBy", user?.name || "Unknown");
    files.forEach((file) => data.append("file", file));

    try {
      const res = await fetch("http://localhost:8000/api/notes/create", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      const newNote = result.data;
      setNotes([...notes, newNote]);
      setFormData({ title: "", content: "" });
      setFiles([]);
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to upload note");
    }
  };

  const handleDelete = (noteId) => {
    setNotes(notes.filter((n) => n.id !== noteId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Class Notes</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {showForm ? "Cancel" : "+ Upload Note"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note Title
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Chapter 5 - Algebra Basics"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Paste your note content here..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attach Files (PDF, DOCX, PPTX, Images)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.pptx,image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0 file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {files.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {files.length} file(s) selected
                </p>
              )}
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
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
            <Card key={note._id || note.id} className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {note.title}
                  </h3>
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
              <p className="text-gray-700 whitespace-pre-wrap">
                {note.content}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
