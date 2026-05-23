import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
});

const quizSchema = new mongoose.Schema({
  classId: { type: String, required: true },
  title: { type: String, required: true },
  questions: [questionSchema],
  professor: { type: String, default: "Mr. Sharma" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Quiz", quizSchema);
