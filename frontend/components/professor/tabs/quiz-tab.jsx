"use client"

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function QuizTab({ classId }) {
  const { data: session } = useSession();
  const professorName = session?.user?.name || "Unknown User";
  const [quizzes, setQuizzes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    questions: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
  })

  useEffect(() => {
    loadQuizzes()
  }, [classId])

  // Load quizzes from backend
  const loadQuizzes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/quiz/${classId}`);
      if (!res.ok) throw new Error("Failed to fetch quizzes")
      const data = await res.json()
      console.log(`Loaded ${data.length} quizzes for class ${classId}`)
      setQuizzes(data)
    } catch (error) {
      console.error("Error loading quizzes:", error)
      setQuizzes([])
    }
  }

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ],
    })
  }

  // Submit quiz to backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.title.trim() ||
      formData.questions.some((q) => !q.question.trim())
    ) {
      alert("Please fill in all fields")
      return
    }

    const payload = {
      classId,
      title: formData.title,
      questions: formData.questions,
      professor: professorName,
    }

    console.log('Submitting quiz:', payload)

    try {
      const res = await fetch(`${API_URL}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to create quiz")
      }

      const result = await res.json()
      console.log('Quiz created successfully:', result)
      
      await loadQuizzes()
      setFormData({
        title: "",
        questions: [
          { question: "", options: ["", "", "", ""], correctAnswer: 0 },
        ],
      })
      setShowForm(false)
      alert("Quiz created successfully!")
    } catch (error) {
      console.error("Error creating quiz:", error)
      alert(`Error saving quiz: ${error.message}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quiz & Assignments</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {showForm ? "Cancel" : "+ Create Quiz"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Chapter 5 Quiz"
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              {formData.questions.map((q, qIdx) => (
                <Card key={qIdx} className="p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question {qIdx + 1}
                  </label>
                  <Input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const newQuestions = [...formData.questions]
                      newQuestions[qIdx].question = e.target.value
                      setFormData({ ...formData, questions: newQuestions })
                    }}
                    placeholder="Enter question"
                    className="w-full mb-3"
                  />

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <Input
                        key={optIdx}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newQuestions = [...formData.questions]
                          newQuestions[qIdx].options[optIdx] = e.target.value
                          setFormData({ ...formData, questions: newQuestions })
                        }}
                        placeholder={`Option ${optIdx + 1}`}
                        className="w-full text-sm"
                      />
                    ))}
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Answer
                    </label>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => {
                        const newQuestions = [...formData.questions]
                        newQuestions[qIdx].correctAnswer = Number.parseInt(
                          e.target.value
                        )
                        setFormData({ ...formData, questions: newQuestions })
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {q.options.map((_, idx) => (
                        <option key={idx} value={idx}>
                          Option {idx + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              type="button"
              onClick={handleAddQuestion}
              variant="outline"
              className="w-full bg-transparent text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              + Add Question
            </Button>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Quiz
            </Button>
          </form>
        </Card>
      )}

      {quizzes.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No quizzes created yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz._id} className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {quiz.questions.length} questions
              </p>
              <p className="text-xs text-gray-500">
                Created {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
