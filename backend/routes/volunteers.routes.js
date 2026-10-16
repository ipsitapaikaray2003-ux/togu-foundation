import express from 'express';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

// Helper to generate unique Volunteer ID
async function generateVolunteerId() {
  const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM volunteers');
  const nextNum = (count || 0) + 1001;
  return `TOGU-VOL-${nextNum}`;
}

// POST /api/volunteers/public (Public submission from website Get Involved section)
router.post('/public', async (req, res) => {
  try {
    const fullName = (req.body.fullName || req.body.full_name || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const phone = (req.body.phone || '').trim();
    const address = req.body.address || null;
    const city = req.body.city || null;
    const state = req.body.state || null;
    const areasOfInterest = req.body.areasOfInterest || req.body.areas_of_interest || null;
    const skills = req.body.skills || null;
    const notes = req.body.notes || null;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Full Name, Email and Phone are required.' 
      });
    }

    // Prevent duplicate submission within last 24 hours
    const [recent] = await pool.query(
      `SELECT id FROM volunteers 
       WHERE (email = ? OR phone = ?) AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
      [email.trim().toLowerCase(), phone.trim()]
    );

    if (recent.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A volunteer application with this email or phone was already submitted recently. Our team will contact you soon!'
      });
    }

    const volunteerId = await generateVolunteerId();

    const adminNotes = notes ? `Public application: ${notes}` : 'Submitted online via TOGU Foundation website';

    const [result] = await pool.query(
      `INSERT INTO volunteers 
       (volunteer_id, full_name, email, phone, address, city, state, areas_of_interest, skills, status, admin_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        volunteerId,
        fullName,
        email,
        phone,
        address,
        city,
        state,
        areasOfInterest,
        skills,
        adminNotes
      ]
    );

    await logActivity(req, 'CREATE', 'VOLUNTEER', volunteerId, `Public registration: ${fullName.trim()} (${volunteerId})`);

    return res.status(201).json({
      success: true,
      message: 'Thank you for volunteering with TOGU Foundation! Your application has been received.',
      volunteerId
    });
  } catch (err) {
    console.error('Public volunteer registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error processing application.' });
  }
});

// GET /api/volunteers (Admin: list with search, filter, pagination, export)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search = '', status = '', page = 1, limit = 15, exportCsv = false } = req.query;

    let whereClause = 'WHERE is_archived = 0';
    const params = [];

    if (search) {
      whereClause += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR volunteer_id LIKE ? OR city LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s, s);
    }

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Export CSV handling
    if (exportCsv === 'true') {
      const [allRecords] = await pool.query(
        `SELECT volunteer_id, full_name, email, phone, city, state, areas_of_interest, skills, status, created_at 
         FROM volunteers 
         ${whereClause} 
         ORDER BY id DESC`,
        params
      );

      let csv = 'Volunteer ID,Full Name,Email,Phone,City,State,Areas of Interest,Skills,Status,Registration Date\n';
      for (const r of allRecords) {
        const row = [
          r.volunteer_id,
          `"${(r.full_name || '').replace(/"/g, '""')}"`,
          r.email,
          r.phone,
          `"${(r.city || '').replace(/"/g, '""')}"`,
          `"${(r.state || '').replace(/"/g, '""')}"`,
          `"${(r.areas_of_interest || '').replace(/"/g, '""')}"`,
          `"${(r.skills || '').replace(/"/g, '""')}"`,
          r.status,
          r.created_at
        ];
        csv += row.join(',') + '\n';
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="togu_volunteers.csv"');
      return res.send(csv);
    }

    // Count total matching
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM volunteers ${whereClause}`,
      params
    );

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const [volunteers] = await pool.query(
      `SELECT id, volunteer_id, full_name, email, phone, address, city, state, areas_of_interest, skills, status, admin_notes, created_at, updated_at 
       FROM volunteers 
       ${whereClause} 
       ORDER BY id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    return res.json({
      success: true,
      volunteers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('Fetch volunteers error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve volunteers.' });
  }
});

// GET /api/volunteers/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM volunteers WHERE id = ? AND is_archived = 0',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Volunteer not found.' });
    }

    return res.json({ success: true, volunteer: rows[0] });
  } catch (err) {
    console.error('Get volunteer detail error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving volunteer.' });
  }
});

// POST /api/volunteers (Admin manual add)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { full_name, email, phone, address, city, state, areas_of_interest, skills, status = 'Approved', admin_notes } = req.body;

    if (!full_name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Full Name, Email and Phone are required.' });
    }

    const volunteerId = await generateVolunteerId();

    const [result] = await pool.query(
      `INSERT INTO volunteers 
       (volunteer_id, full_name, email, phone, address, city, state, areas_of_interest, skills, status, admin_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        volunteerId,
        full_name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        address || null,
        city || null,
        state || null,
        areas_of_interest || null,
        skills || null,
        status,
        admin_notes || null
      ]
    );

    await logActivity(req, 'CREATE', 'VOLUNTEER', volunteerId, `Admin added volunteer: ${full_name}`);

    return res.status(201).json({
      success: true,
      message: 'Volunteer added successfully.',
      volunteerId,
      id: result.insertId
    });
  } catch (err) {
    console.error('Add volunteer error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add volunteer.' });
  }
});

// PUT /api/volunteers/:id (Edit volunteer)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { full_name, email, phone, address, city, state, areas_of_interest, skills, status, admin_notes } = req.body;

    const [existing] = await pool.query('SELECT * FROM volunteers WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Volunteer not found.' });
    }

    await pool.query(
      `UPDATE volunteers 
       SET full_name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, areas_of_interest = ?, skills = ?, status = ?, admin_notes = ? 
       WHERE id = ?`,
      [
        full_name || existing[0].full_name,
        email || existing[0].email,
        phone || existing[0].phone,
        address !== undefined ? address : existing[0].address,
        city !== undefined ? city : existing[0].city,
        state !== undefined ? state : existing[0].state,
        areas_of_interest !== undefined ? areas_of_interest : existing[0].areas_of_interest,
        skills !== undefined ? skills : existing[0].skills,
        status || existing[0].status,
        admin_notes !== undefined ? admin_notes : existing[0].admin_notes,
        req.params.id
      ]
    );

    await logActivity(req, 'UPDATE', 'VOLUNTEER', existing[0].volunteer_id, `Updated volunteer: ${existing[0].volunteer_id}`);

    return res.json({ success: true, message: 'Volunteer updated successfully.' });
  } catch (err) {
    console.error('Update volunteer error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update volunteer.' });
  }
});

// DELETE /api/volunteers/:id (Soft archive or delete)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM volunteers WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Volunteer not found.' });
    }

    // Soft delete / archive to preserve history
    await pool.query('UPDATE volunteers SET is_archived = 1 WHERE id = ?', [req.params.id]);

    await logActivity(req, 'ARCHIVE', 'VOLUNTEER', existing[0].volunteer_id, `Archived volunteer: ${existing[0].volunteer_id}`);

    return res.json({ success: true, message: 'Volunteer record archived successfully.' });
  } catch (err) {
    console.error('Delete volunteer error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete volunteer.' });
  }
});

export default router;
