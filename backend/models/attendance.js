import mongoose from 'mongoose';

const attendanceEntrySchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
});

const attendanceSchema = new mongoose.Schema({
  classId: { type: String, required: true },
  date: { type: Date, required: true },
  entries: [attendanceEntrySchema],
});

export default mongoose.model('Attendance', attendanceSchema);
