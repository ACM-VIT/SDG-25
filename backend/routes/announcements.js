import express from 'express';
import Announcement from '../models/Announcement.js';

const router = express.Router();

// Create a new announcement
router.post('/', async (req, res) => {
  try {
    const { classId, title, content, professor, priority } = req.body;

    if (!classId || !title || !content || !professor) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAnnouncement = new Announcement({
      classId,
      title,
      content,
      professor,
      priority: priority || 'medium',
    });

    await newAnnouncement.save();

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Get all announcements for a class
router.get('/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const announcements = await Announcement.find({ classId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Delete an announcement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

export default router;
