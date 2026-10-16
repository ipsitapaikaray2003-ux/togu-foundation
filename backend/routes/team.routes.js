import express from 'express';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

// GET /api/team (Public: published only; Admin: all)
router.get('/', async (req, res) => {
  try {
    const { admin = false } = req.query;

    let query = 'SELECT * FROM team_members';
    if (!admin || admin === 'false') {
      query += ' WHERE is_published = 1';
    }
    query += ' ORDER BY display_order ASC, id ASC';

    const [team] = await pool.query(query);

    return res.json({ success: true, team });
  } catch (err) {
    console.error('Fetch team error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve team members.' });
  }
});

// POST /api/team (Admin: Add team member)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, designation, role_type = 'Executive', photo, bio, display_order = 0, is_published = 1 } = req.body;

    if (!name || !designation) {
      return res.status(400).json({ success: false, message: 'Name and Designation are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO team_members (name, designation, role_type, photo, bio, display_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), designation.trim(), role_type, photo || null, bio || null, parseInt(display_order || 0, 10), is_published ? 1 : 0]
    );

    await logActivity(req, 'CREATE', 'TEAM', result.insertId, `Added team member: ${name}`);

    return res.status(201).json({
      success: true,
      message: 'Team member added successfully.',
      id: result.insertId
    });
  } catch (err) {
    console.error('Add team member error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add team member.' });
  }
});

// PUT /api/team/:id (Admin: Edit team member)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { name, designation, role_type, photo, bio, display_order, is_published } = req.body;

    const [existing] = await pool.query('SELECT * FROM team_members WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    await pool.query(
      `UPDATE team_members 
       SET name = ?, designation = ?, role_type = ?, photo = ?, bio = ?, display_order = ?, is_published = ? 
       WHERE id = ?`,
      [
        name || existing[0].name,
        designation || existing[0].designation,
        role_type || existing[0].role_type,
        photo !== undefined ? photo : existing[0].photo,
        bio !== undefined ? bio : existing[0].bio,
        display_order !== undefined ? parseInt(display_order, 10) : existing[0].display_order,
        is_published !== undefined ? (is_published ? 1 : 0) : existing[0].is_published,
        req.params.id
      ]
    );

    await logActivity(req, 'UPDATE', 'TEAM', req.params.id, `Updated team member: ${name || existing[0].name}`);

    return res.json({ success: true, message: 'Team member updated successfully.' });
  } catch (err) {
    console.error('Update team error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update team member.' });
  }
});

// DELETE /api/team/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM team_members WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    await pool.query('DELETE FROM team_members WHERE id = ?', [req.params.id]);
    await logActivity(req, 'DELETE', 'TEAM', req.params.id, `Deleted team member: ${existing[0].name}`);

    return res.json({ success: true, message: 'Team member deleted successfully.' });
  } catch (err) {
    console.error('Delete team error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete team member.' });
  }
});

export default router;
