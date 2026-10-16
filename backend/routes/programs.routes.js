import express from 'express';
import pool from '../config/db.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET /api/programs (Public: published only; Admin: all or filter)
router.get('/', async (req, res) => {
  try {
    const { category = '', featured = '', status = '', admin = false } = req.query;

    let whereClause = "WHERE 1=1";
    const params = [];

    // If public request, show only published
    if (!admin || admin === 'false') {
      whereClause += " AND status = 'Published'";
    } else if (status && status !== 'all') {
      whereClause += " AND status = ?";
      params.push(status);
    } else {
      whereClause += " AND status != 'Archived'";
    }

    if (category && category !== 'all') {
      whereClause += " AND category = ?";
      params.push(category);
    }

    if (featured === 'true' || featured === '1') {
      whereClause += " AND featured = 1";
    }

    const [programs] = await pool.query(
      `SELECT * FROM programs ${whereClause} ORDER BY featured DESC, id ASC`,
      params
    );

    return res.json({ success: true, programs });
  } catch (err) {
    console.error('Fetch programs error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve programs.' });
  }
});

// GET /api/programs/:slug_or_id
router.get('/:slug_or_id', async (req, res) => {
  try {
    const param = req.params.slug_or_id;
    const isNumeric = /^\d+$/.test(param);

    const query = isNumeric 
      ? 'SELECT * FROM programs WHERE id = ?'
      : 'SELECT * FROM programs WHERE slug = ?';

    const [rows] = await pool.query(query, [param]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    return res.json({ success: true, program: rows[0] });
  } catch (err) {
    console.error('Get program detail error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving program.' });
  }
});

// POST /api/programs (Admin: Add program)
router.post('/', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { 
      title, 
      category, 
      short_description, 
      full_description, 
      cover_image, 
      start_date, 
      end_date, 
      location, 
      status = 'Published', 
      featured = 0 
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and Category are required.' });
    }

    let slug = slugify(title);
    // Check slug collision
    const [existing] = await pool.query('SELECT id FROM programs WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const [result] = await pool.query(
      `INSERT INTO programs 
       (title, slug, category, short_description, full_description, cover_image, start_date, end_date, location, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        slug,
        category,
        short_description || null,
        full_description || null,
        cover_image || null,
        start_date || null,
        end_date || null,
        location || null,
        status,
        featured ? 1 : 0
      ]
    );

    await logActivity(req, 'CREATE', 'PROGRAM', result.insertId, `Added program: ${title}`);

    return res.status(201).json({
      success: true,
      message: 'Program created successfully.',
      id: result.insertId,
      slug
    });
  } catch (err) {
    console.error('Create program error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create program.' });
  }
});

// PUT /api/programs/:id (Admin: Edit program)
router.put('/:id', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { 
      title, 
      category, 
      short_description, 
      full_description, 
      cover_image, 
      start_date, 
      end_date, 
      location, 
      status, 
      featured 
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM programs WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    await pool.query(
      `UPDATE programs 
       SET title = ?, category = ?, short_description = ?, full_description = ?, cover_image = ?, 
           start_date = ?, end_date = ?, location = ?, status = ?, featured = ? 
       WHERE id = ?`,
      [
        title || existing[0].title,
        category || existing[0].category,
        short_description !== undefined ? short_description : existing[0].short_description,
        full_description !== undefined ? full_description : existing[0].full_description,
        cover_image !== undefined ? cover_image : existing[0].cover_image,
        start_date !== undefined ? start_date : existing[0].start_date,
        end_date !== undefined ? end_date : existing[0].end_date,
        location !== undefined ? location : existing[0].location,
        status || existing[0].status,
        featured !== undefined ? (featured ? 1 : 0) : existing[0].featured,
        req.params.id
      ]
    );

    await logActivity(req, 'UPDATE', 'PROGRAM', req.params.id, `Updated program: ${title || existing[0].title}`);

    return res.json({ success: true, message: 'Program updated successfully.' });
  } catch (err) {
    console.error('Update program error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update program.' });
  }
});

// DELETE /api/programs/:id
router.delete('/:id', requireAuth, requireRoles('Super Admin'), async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM programs WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    await pool.query("UPDATE programs SET status = 'Archived' WHERE id = ?", [req.params.id]);
    await logActivity(req, 'ARCHIVE', 'PROGRAM', req.params.id, `Archived program: ${existing[0].title}`);

    return res.json({ success: true, message: 'Program archived successfully.' });
  } catch (err) {
    console.error('Archive program error:', err);
    return res.status(500).json({ success: false, message: 'Failed to archive program.' });
  }
});

export default router;
