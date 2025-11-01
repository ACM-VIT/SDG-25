import express from 'express';
import Class from '../models/Class.js';

const router = express.Router();

function generateClassCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

router.post('/create', async (req, res) => {
  try {
    const { name, professorId, professorName } = req.body;

    if (!name || !professorId || !professorName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let code = generateClassCode();
    let codeExists = await Class.findOne({ code });
    
    while (codeExists) {
      code = generateClassCode();
      codeExists = await Class.findOne({ code });
    }

    const newClass = new Class({
      name,
      code,
      professorId,
      professorName,
      students: [],
    });

    await newClass.save();

    res.status(201).json({
      success: true,
      class: newClass,
    });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

router.get('/professor/:professorId', async (req, res) => {
  try {
    const { professorId } = req.params;
    const classes = await Class.find({ professorId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      classes,
    });
  } catch (error) {
    console.error('Error fetching professor classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const classes = await Class.find({ students: studentId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      classes,
    });
  } catch (error) {
    console.error('Error fetching student classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const classData = await Class.findOne({ code: code.toUpperCase() });
    
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json({
      success: true,
      class: classData,
    });
  } catch (error) {
    console.error('Error fetching class by code:', error);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

router.post('/join', async (req, res) => {
  try {
    const { code, studentId } = req.body;

    if (!code || !studentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const classData = await Class.findOne({ code: code.toUpperCase() });

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classData.students.includes(studentId)) {
      return res.status(400).json({ error: 'Already enrolled in this class' });
    }

    classData.students.push(studentId);
    await classData.save();

    res.json({
      success: true,
      class: classData,
    });
  } catch (error) {
    console.error('Error joining class:', error);
    res.status(500).json({ error: 'Failed to join class' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid class ID format' });
    }
    
    const classData = await Class.findById(id);
    
    
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json({
      success: true,
      class: classData,
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ error: 'Failed to fetch class', details: error.message });
  }
});

export default router;
