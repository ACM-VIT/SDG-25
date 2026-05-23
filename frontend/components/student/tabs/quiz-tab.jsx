"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function StudentQuizTab({ classId }) {
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [answers, setAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuizzes()
  }, [classId])

  // Load quizzes from backend API
  const loadQuizzes = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/quiz/${classId}`)
      if (!res.ok) throw new Error("Failed to fetch quizzes")
      const data = await res.json()
      setQuizzes(data)
    } catch (error) {
      console.error("Error loading quizzes:", error)
      setQuizzes([])
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz)
    setAnswers(new Array(quiz.questions.length).fill(-1))
    setSubmitted(false)
  }

  const handleSubmitQuiz = () => {
    let correctCount = 0
    selectedQuiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++
      }
    })
    const percentage = Math.round((correctCount / selectedQuiz.questions.length) * 100)
    setScore(percentage)
    setSubmitted(true)
  }

  if (selectedQuiz && !submitted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{selectedQuiz.title}</h2>
          <Button
            onClick={() => setSelectedQuiz(null)}
            variant="outline"
            className="bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            Back
          </Button>
        </div>

        <div className="space-y-6">
          {selectedQuiz.questions.map((q, qIdx) => (
            <Card key={qIdx} className="p-6">
              <h3 className="font-bold text-gray-800 mb-4">
                Question {qIdx + 1}: {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center p-3 border border-gray-300 rounded cursor-pointer hover:bg-blue-50"
                  >
                    <input
                      type="radio"
                      name={`question-${qIdx}`}
                      checked={answers[qIdx] === optIdx}
                      onChange={() => {
                        const newAnswers = [...answers]
                        newAnswers[qIdx] = optIdx
                        setAnswers(newAnswers)
                      }}
                      className="mr-3"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleSubmitQuiz}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold"
        >
          Submit Quiz
        </Button>
      </div>
    )
  }

  if (selectedQuiz && submitted) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center bg-linear-to-br from-blue-50 to-green-50">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Submitted!</h2>
          <p className="text-5xl font-bold text-green-600 mb-2">{score}%</p>
          <p className="text-gray-600 mb-6">Great effort! Keep practicing.</p>
          <Button onClick={() => setSelectedQuiz(null)} className="bg-blue-600 hover:bg-blue-700 text-white">
            Back to Quizzes
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Quiz & Assignments</h2>

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading quizzes...</p>
        </Card>
      ) : quizzes.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No quizzes available yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz._id} className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{quiz.questions.length} questions</p>
                <p className="text-xs text-gray-500 mt-1">
                  By {quiz.professor} • {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button onClick={() => handleStartQuiz(quiz)} className="bg-green-600 hover:bg-green-700 text-white">
                Start Quiz
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
