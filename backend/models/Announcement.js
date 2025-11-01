import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
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
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

announcementSchema.index({ classId: 1, createdAt: -1 });

export default mongoose.model('Announcement', announcementSchema);
