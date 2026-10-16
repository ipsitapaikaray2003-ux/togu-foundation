import express from 'express';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

// GET /api/gallery (Public: published only; Admin: all or filter)
router.get('/', async (req, res) => {
  try {
    const { category = '', admin = false } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (!admin || admin === 'false') {
      whereClause += ' AND is_published = 1';
    }

    if (category && category !== 'all') {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    const [gallery] = await pool.query(
      `SELECT * FROM gallery ${whereClause} ORDER BY id DESC`,
      params
    );

    return res.json({ success: true, gallery });
  } catch (err) {
    console.error('Fetch gallery error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve gallery.' });
  }
});

// POST /api/gallery (Admin: Add photo)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, caption, category = 'General', image_url, is_published = 1 } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ success: false, message: 'Title and Image URL are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO gallery (title, caption, category, image_url, is_published)
       VALUES (?, ?, ?, ?, ?)`,
      [title.trim(), caption || null, category, image_url, is_published ? 1 : 0]
    );

    await logActivity(req, 'CREATE', 'GALLERY', result.insertId, `Added gallery item: ${title}`);

    return res.status(201).json({
      success: true,
      message: 'Photo added to gallery.',
      id: result.insertId
    });
  } catch (err) {
    console.error('Add gallery error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add photo.' });
  }
});

// PUT /api/gallery/:id (Admin: Edit photo)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, caption, category, image_url, is_published } = req.body;

    const [existing] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    await pool.query(
      `UPDATE gallery 
       SET title = ?, caption = ?, category = ?, image_url = ?, is_published = ? 
       WHERE id = ?`,
      [
        title || existing[0].title,
        caption !== undefined ? caption : existing[0].caption,
        category || existing[0].category,
        image_url || existing[0].image_url,
        is_published !== undefined ? (is_published ? 1 : 0) : existing[0].is_published,
        req.params.id
      ]
    );

    await logActivity(req, 'UPDATE', 'GALLERY', req.params.id, `Updated gallery item: ${req.params.id}`);

    return res.json({ success: true, message: 'Gallery item updated.' });
  } catch (err) {
    console.error('Update gallery error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update gallery item.' });
  }
});

// DELETE /api/gallery/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    await logActivity(req, 'DELETE', 'GALLERY', req.params.id, `Deleted gallery photo: ${existing[0].title}`);

    return res.json({ success: true, message: 'Photo deleted from gallery.' });
  } catch (err) {
    console.error('Delete gallery error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete photo.' });
  }
});

export default router;
