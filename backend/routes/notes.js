import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { classId, title, content, professor, fileUrl } = req.body;

    if (!classId || !title || !content || !professor) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newNote = new Note({
      classId,
      title,
      content,
      professor,
      fileUrl: fileUrl || null,
    });

    await newNote.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note: newNote,
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Get all notes for a class
router.get('/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const notes = await Note.find({ classId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
