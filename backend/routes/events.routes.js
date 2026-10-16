import express from 'express';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

async function generateEventId() {
  const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM events');
  const nextNum = (count || 0) + 101;
  return `TOGU-EVT-${nextNum}`;
}

// GET /api/events (Public: published only; Admin: all)
router.get('/', async (req, res) => {
  try {
    const { status = '', upcoming = '', search = '', admin = false } = req.query;

    let whereClause = 'WHERE e.is_archived = 0';
    const params = [];

    if (!admin || admin === 'false') {
      whereClause += " AND e.status = 'Published'";
    } else if (status && status !== 'all') {
      whereClause += ' AND e.status = ?';
      params.push(status);
    }

    if (upcoming === 'true') {
      whereClause += ' AND e.event_date >= CURDATE()';
    } else if (upcoming === 'false') {
      whereClause += ' AND e.event_date < CURDATE()';
    }

    if (search) {
      whereClause += ' AND (e.title LIKE ? OR e.location LIKE ? OR e.description LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    const [events] = await pool.query(
      `SELECT e.*, p.title AS program_title,
              CASE WHEN e.event_date >= CURDATE() THEN 'Upcoming' ELSE 'Completed' END AS timeline_status
       FROM events e
       LEFT JOIN programs p ON e.program_id = p.id 
       ${whereClause} 
       ORDER BY e.event_date ASC`,
      params
    );

    return res.json({ success: true, events });
  } catch (err) {
    console.error('Fetch events error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve events.' });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, p.title AS program_title 
       FROM events e 
       LEFT JOIN programs p ON e.program_id = p.id 
       WHERE e.id = ? AND e.is_archived = 0`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    return res.json({ success: true, event: rows[0] });
  } catch (err) {
    console.error('Get event error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving event.' });
  }
});

// POST /api/events (Admin: Create event)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, cover_image, event_date, start_time, end_time, location, program_id, status = 'Published' } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ success: false, message: 'Title and Event Date are required.' });
    }

    const eventId = await generateEventId();

    const [result] = await pool.query(
      `INSERT INTO events 
       (event_id, title, description, cover_image, event_date, start_time, end_time, location, program_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventId,
        title.trim(),
        description || null,
        cover_image || null,
        event_date,
        start_time || null,
        end_time || null,
        location || null,
        program_id ? parseInt(program_id, 10) : null,
        status
      ]
    );

    await logActivity(req, 'CREATE', 'EVENT', eventId, `Added event: ${title} (${eventId})`);

    return res.status(201).json({
      success: true,
      message: 'Event added successfully.',
      eventId,
      id: result.insertId
    });
  } catch (err) {
    console.error('Add event error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add event.' });
  }
});

// PUT /api/events/:id (Admin: Edit event)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, description, cover_image, event_date, start_time, end_time, location, program_id, status } = req.body;

    const [existing] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    await pool.query(
      `UPDATE events 
       SET title = ?, description = ?, cover_image = ?, event_date = ?, start_time = ?, end_time = ?, 
           location = ?, program_id = ?, status = ? 
       WHERE id = ?`,
      [
        title || existing[0].title,
        description !== undefined ? description : existing[0].description,
        cover_image !== undefined ? cover_image : existing[0].cover_image,
        event_date || existing[0].event_date,
        start_time !== undefined ? start_time : existing[0].start_time,
        end_time !== undefined ? end_time : existing[0].end_time,
        location !== undefined ? location : existing[0].location,
        program_id !== undefined ? (program_id ? parseInt(program_id, 10) : null) : existing[0].program_id,
        status || existing[0].status,
        req.params.id
      ]
    );

    await logActivity(req, 'UPDATE', 'EVENT', existing[0].event_id, `Updated event: ${existing[0].event_id}`);

    return res.json({ success: true, message: 'Event updated successfully.' });
  } catch (err) {
    console.error('Update event error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
});

// DELETE /api/events/:id (Archive)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    await pool.query('UPDATE events SET is_archived = 1 WHERE id = ?', [req.params.id]);
    await logActivity(req, 'ARCHIVE', 'EVENT', existing[0].event_id, `Archived event: ${existing[0].event_id}`);

    return res.json({ success: true, message: 'Event archived successfully.' });
  } catch (err) {
    console.error('Delete event error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
});

export default router;
