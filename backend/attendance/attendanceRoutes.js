import express from 'express';
import Attendance from '../models/attendance.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('Received attendance data:', req.body);
    const { classId, date, entries } = req.body;

    if (!classId || !date || !entries) {
      console.log('Missing required fields');
      return res
        .status(400)
        .json({ error: 'Missing required fields: classId, date, entries' });
    }

    const existing = await Attendance.findOne({ classId, date });

    if (existing) {
      console.log('Updating existing attendance record');
      existing.entries = entries;
      await existing.save();
      console.log('Attendance updated successfully');
      return res.json({ message: 'Attendance updated', attendance: existing });
    }

    console.log('Creating new attendance record');
    const newAttendance = new Attendance({ classId, date, entries });
    await newAttendance.save();
    console.log('Attendance saved successfully:', newAttendance);
    res.status(201).json(newAttendance);
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/debug/all', async (req, res) => {
  try {
    console.log('Fetching ALL attendance records for debugging');
    const allRecords = await Attendance.find({}).limit(50);
    console.log('Total records in database:', allRecords.length);

    const summary = allRecords.map((r) => ({
      classId: r.classId,
      date: r.date,
      studentIds: r.entries.map((e) => e.studentId),
      entriesCount: r.entries.length,
    }));

    res.json({
      totalRecords: allRecords.length,
      records: summary,
      fullRecords: allRecords,
    });
  } catch (error) {
    console.error('Error fetching all records:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log('Attendance for student:', studentId);

    const records = await Attendance.find({ 'entries.studentId': studentId });
    console.log('Found', records.length, 'attendance records');

    if (records.length > 0) {
      console.log('Sample record:', JSON.stringify(records[0], null, 2));
    }

    const formatted = records.map((r) => ({
      classId: r.classId,
      date: r.date,
      status:
        r.entries.find((e) => e.studentId === studentId)?.status || 'absent',
    }));

    console.log('Sending formatted records:', formatted);
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:classId/:date', async (req, res) => {
  try {
    const { classId, date } = req.params;
    const attendance = await Attendance.findOne({ classId, date });
    res.json(attendance || { message: 'No record found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
