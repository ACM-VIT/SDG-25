const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

// ➕ Create new quiz
router.post("/", async (req, res) => {
  try {
    const { classId, title, questions, professor } = req.body;

    if (!classId || !title || !questions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newQuiz = new Quiz({
      classId,
      title,
      questions,
      professor: professor || "Mr. Sharma",
    });

    await newQuiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📜 Get all quizzes for a class
router.get("/:classId", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ classId: req.params.classId }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
