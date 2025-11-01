import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 6,
  },
  professorId: {
    type: String,
    required: true,
  },
  professorName: {
    type: String,
    required: true,
  },
  students: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

classSchema.index({ professorId: 1 });

export default mongoose.model('Class', classSchema);
