import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  professor: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

noteSchema.index({ classId: 1, createdAt: -1 });

export default mongoose.model('Note', noteSchema);
