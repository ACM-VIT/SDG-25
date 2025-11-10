"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { dummyQuizzes } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function QuizTab({ classId }) {
  const { user } = useAuth()
  const makeEmptyQuestion = () => ({
    question: "",
    options: ["", ""], // minimum 2 options baseline
    correctAnswer: 0,
  })
  const [quizzes, setQuizzes] = useState(
    dummyQuizzes.filter((q) => q.classId === classId)
  )
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    questions: [makeEmptyQuestion()],
  })
  const setQuestions = (updater) =>
    setFormData((prev) => ({ ...prev, questions: updater(Array.isArray(prev.questions) ? prev.questions : []) }))

  const handleTitleChange = (e) => setFormData({ ...formData, title: e.target.value })

  const handleQuestionTextChange = (qIdx, value) => {
    setQuestions((qs) => {
      const next = [...qs]
      next[qIdx] = { ...next[qIdx], question: value }
      return next
    })
  }

  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuestions((qs) => {
      const next = [...qs]
      const q = { ...next[qIdx] }
      const opts = [...q.options]
      opts[optIdx] = value
      q.options = opts
      if (q.correctAnswer >= q.options.length) {
        q.correctAnswer = Math.max(0, q.options.length - 1)
      }
      next[qIdx] = q
      return next
    })
  }

  const handleCorrectAnswerChange = (qIdx, idxStr) => {
    const idx = parseInt(idxStr, 10)
    setQuestions((qs) => {
      const next = [...qs]
      const q = { ...next[qIdx], correctAnswer: isNaN(idx) ? 0 : idx }
      next[qIdx] = q
      return next
    })
  }

  const handleAddOption = (qIdx) => {
    setQuestions((qs) => {
      const next = [...qs]
      const q = { ...next[qIdx] }
      q.options = [...q.options, ""]
      next[qIdx] = q
      return next
    })
  }

  const handleRemoveOption = (qIdx, optIdx) => {
    setQuestions((qs) => {
      const next = [...qs]
      const q = { ...next[qIdx] }
      if (q.options.length <= 2) return next 

      const newOptions = q.options.filter((_, i) => i !== optIdx)
      let newCorrect = q.correctAnswer
      if (optIdx === q.correctAnswer) {
        newCorrect = Math.max(0, q.correctAnswer - 1)
      } else if (optIdx < q.correctAnswer) {
        newCorrect = q.correctAnswer - 1
      }


      if (newCorrect >= newOptions.length) newCorrect = Math.max(0, newOptions.length - 1)

      q.options = newOptions
      q.correctAnswer = newCorrect
      next[qIdx] = q
      return next
    })
  }

  const handleAddQuestion = () => {
    setQuestions((qs) => [...qs, makeEmptyQuestion()])
  }

  const handleRemoveQuestion = (qIdx) => {
    setQuestions((qs) => {
      if (qs.length <= 1) return qs
      const next = qs.filter((_, i) => i !== qIdx)
      return next
    })
  }

  const validateForm = () => {
    if (!formData.title.trim()) return false

    for (const q of formData.questions) {
      if (!q.question.trim()) return false
      if (!Array.isArray(q.options) || q.options.length < 2) return false
      const nonEmptyOpts = q.options.filter((o) => o.trim() !== "")
      if (nonEmptyOpts.length < 2) return false
      if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      alert("Please complete the title, each question, and at least 2 options per question.")
      return
    }

    const newQuiz = {
      id: Date.now().toString(),
      classId,
      title: formData.title,
      questions: formData.questions,
      createdBy: user?.name || "Unknown",
      createdAt: new Date(),
    }

    setQuizzes((prev) => [...prev, newQuiz])
    setFormData({ title: "", questions: [makeEmptyQuestion()] })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quiz & Assignments</h2>
        <Button onClick={() => setShowForm((s) => !s)} className="bg-blue-600 hover:bg-blue-700 text-white">
          {showForm ? "Cancel" : "+ Create Quiz"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
              <Input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g., Chapter 5 Quiz"
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              {formData.questions.map((q, qIdx) => (
                <Card key={qIdx} className="p-4 bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question {qIdx + 1}</label>
                      <Input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                        placeholder="Enter question"
                        className="w-full mb-3"
                      />

                      <div className="space-y-3">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <Input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              placeholder={`Option ${optIdx + 1}`}
                              className="w-full text-sm"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="shrink-0"
                              onClick={() => handleRemoveOption(qIdx, optIdx)}
                              disabled={q.options.length <= 2}
                              title={q.options.length <= 2 ? "At least 2 options required" : "Remove option"}
                            >
                              −
                            </Button>
                          </div>
                        ))}

                        <div className="flex justify-between items-center">
                          <Button type="button" variant="outline" onClick={() => handleAddOption(qIdx)}>
                            + Add Option
                          </Button>
                          <div className="flex items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                            <select
                              value={q.correctAnswer}
                              onChange={(e) => handleCorrectAnswerChange(qIdx, e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                              {q.options.map((_, idx) => (
                                <option key={idx} value={idx}>
                                  Option {idx + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        disabled={formData.questions.length <= 1}
                        title={formData.questions.length <= 1 ? "At least 1 question required" : "Remove question"}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <Button type="button" onClick={handleAddQuestion} variant="outline" className="w-full">
                + Add Question
              </Button>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
            <Card key={quiz.id} className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{quiz.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{quiz.questions.length} questions</p>
              <p className="text-xs text-gray-500">Created {new Date(quiz.createdAt).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
