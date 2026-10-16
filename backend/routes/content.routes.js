import express from 'express';
import pool from '../config/db.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

// GET /api/content (Public or Admin: get website sections)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT section_key, title, content, status, updated_at FROM website_content WHERE status = "Published"'
    );

    const contentMap = {};
    for (const r of rows) {
      try {
        contentMap[r.section_key] = typeof r.content === 'string' ? JSON.parse(r.content) : r.content;
      } catch {
        contentMap[r.section_key] = r.content;
      }
    }

    return res.json({ success: true, content: contentMap });
  } catch (err) {
    console.error('Fetch website content error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve website content.' });
  }
});

// GET /api/content/:section_key (Get specific section with status)
router.get('/:section_key', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM website_content WHERE section_key = ?',
      [req.params.section_key]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Content section not found.' });
    }

    const row = rows[0];
    const parsedContent = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;

    return res.json({
      success: true,
      section: {
        ...row,
        content: parsedContent
      }
    });
  } catch (err) {
    console.error('Get section error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving section.' });
  }
});

// PUT /api/content/:section_key (Admin: Update section content)
router.put('/:section_key', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { title, content, status = 'Published' } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Section content data is required.' });
    }

    const jsonContent = JSON.stringify(content);

    const [existing] = await pool.query(
      'SELECT id FROM website_content WHERE section_key = ?',
      [req.params.section_key]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE website_content 
         SET title = COALESCE(?, title), content = ?, status = ?, updated_by = ? 
         WHERE section_key = ?`,
        [title || null, jsonContent, status, req.user.id, req.params.section_key]
      );
    } else {
      await pool.query(
        `INSERT INTO website_content (section_key, title, content, status, updated_by)
         VALUES (?, ?, ?, ?, ?)`,
        [req.params.section_key, title || req.params.section_key, jsonContent, status, req.user.id]
      );
    }

    await logActivity(req, 'UPDATE', 'CONTENT', req.params.section_key, `Updated website content section: ${req.params.section_key} (${status})`);

    return res.json({
      success: true,
      message: `Section "${req.params.section_key}" updated and published successfully.`
    });
  } catch (err) {
    console.error('Update content error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update content.' });
  }
});

export default router;
