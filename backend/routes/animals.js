const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'animal-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all animals for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  const { type, status, gender, search } = req.query;
  let sql = 'SELECT * FROM animals WHERE user_id = ?';
  const params = [req.user.id];

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (gender) {
    sql += ' AND gender = ?';
    params.push(gender);
  }

  if (search) {
    sql += ' AND number LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY created_at DESC';

  try {
    const rows = await query(sql, params);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Get single animal
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const rows = await query(
      'SELECT * FROM animals WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    const row = rows[0];
    if (!row) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.json(row);
  } catch (error) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Create animal
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  const { number, type, age, status, gender } = req.body;

  if (!number || !type || !age || !status || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['cow', 'goat'].includes(type)) {
    return res.status(400).json({ error: 'Invalid animal type' });
  }

  if (!['active', 'sold', 'dead', 'other'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  if (!['male', 'female'].includes(gender)) {
    return res.status(400).json({ error: 'Invalid gender' });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await query(
      'INSERT INTO animals (number, type, age, status, gender, image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [number, type, age, status, gender, image, req.user.id]
    );
    const created = await query('SELECT * FROM animals WHERE number = ? AND user_id = ?', [number, req.user.id]);
    res.status(201).json(created[0]);
  } catch (err) {
    if (err?.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Animal number already exists' });
    }
    return res.status(500).json({ error: 'Failed to create animal' });
  }
});

// Update animal
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { number, type, age, status, gender } = req.body;

  // First check if animal exists and belongs to user
  try {
    const existingRows = await query(
      'SELECT * FROM animals WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    const existingAnimal = existingRows[0];
    if (!existingAnimal) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    let image = existingAnimal.image;
    if (req.file) {
      // Delete old image if exists
      if (existingAnimal.image) {
        const oldImagePath = path.join(__dirname, '..', existingAnimal.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    const updateFields = [];
    const params = [];

    if (number !== undefined) {
      updateFields.push('number = ?');
      params.push(number);
    }
    if (type !== undefined) {
      updateFields.push('type = ?');
      params.push(type);
    }
    if (age !== undefined) {
      updateFields.push('age = ?');
      params.push(age);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      params.push(status);
    }
    if (gender !== undefined) {
      updateFields.push('gender = ?');
      params.push(gender);
    }
    if (image !== undefined) {
      updateFields.push('image = ?');
      params.push(image);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id, req.user.id);

    await query(
      `UPDATE animals SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );

    const row = await query('SELECT * FROM animals WHERE id = ?', [req.params.id]);
    res.json(row[0]);
  } catch (err) {
    if (err?.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Animal number already exists' });
    }
    return res.status(500).json({ error: 'Failed to update animal' });
  }
});

// Delete animal
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const rows = await query(
      'SELECT * FROM animals WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    const animal = rows[0];
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    // Delete image if exists
    if (animal.image) {
      const imagePath = path.join(__dirname, '..', animal.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await query('DELETE FROM animals WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete animal' });
  }
});

module.exports = router;

