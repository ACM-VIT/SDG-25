import express from 'express';
import Quiz from '../models/Quiz.js';

const router = express.Router();

// ➕ Create new quiz
router.post("/", async (req, res) => {
  try {
    const { classId, title, questions, professor } = req.body;

    if (!classId || !title || !questions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions must be a non-empty array" });
    }

    const newQuiz = new Quiz({
      classId,
      title,
      questions,
      professor: professor || "Mr. Sharma",
    });

    await newQuiz.save();
    console.log(`✅ Quiz created successfully: ${newQuiz._id} for class ${classId}`);
    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Get all quizzes for a class
router.get("/:classId", async (req, res) => {
  try {
    const { classId } = req.params;
    console.log(`📚 Fetching quizzes for class: ${classId}`);
    
    const quizzes = await Quiz.find({ classId: classId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${quizzes.length} quizzes for class ${classId}`);
    
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
