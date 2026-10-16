import express from 'express';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

async function generateEnquiryId() {
  const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM enquiries');
  const nextNum = (count || 0) + 2001;
  return `TOGU-ENQ-${nextNum}`;
}

// POST /api/enquiries/public (Public contact form submission)
router.post('/public', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, Email and Message are required.' 
      });
    }

    const enquiryId = await generateEnquiryId();

    const [result] = await pool.query(
      `INSERT INTO enquiries (enquiry_id, name, email, phone, subject, message, status)
       VALUES (?, ?, ?, ?, ?, ?, 'New')`,
      [
        enquiryId,
        name.trim(),
        email.trim().toLowerCase(),
        phone ? phone.trim() : null,
        subject ? subject.trim() : 'General Inquiry',
        message.trim()
      ]
    );

    await logActivity(req, 'CREATE', 'ENQUIRY', enquiryId, `New public enquiry from ${name.trim()} (${enquiryId})`);

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! Our team will get back to you soon.',
      enquiryId
    });
  } catch (err) {
    console.error('Public enquiry submit error:', err);
    return res.status(500).json({ success: false, message: 'Server error processing enquiry.' });
  }
});

// GET /api/enquiries (Admin: list with search, filter, pagination, export)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search = '', status = '', page = 1, limit = 15, exportCsv = false } = req.query;

    let whereClause = 'WHERE e.is_archived = 0';
    const params = [];

    if (search) {
      whereClause += ' AND (e.name LIKE ? OR e.email LIKE ? OR e.phone LIKE ? OR e.enquiry_id LIKE ? OR e.subject LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s, s);
    }

    if (status && status !== 'all') {
      whereClause += ' AND e.status = ?';
      params.push(status);
    }

    // Export CSV
    if (exportCsv === 'true') {
      const [allRecords] = await pool.query(
        `SELECT e.enquiry_id, e.name, e.email, e.phone, e.subject, e.message, e.status, 
                u.name AS assigned_staff, e.internal_notes, e.created_at 
         FROM enquiries e
         LEFT JOIN admin_users u ON e.assigned_to = u.id 
         ${whereClause} 
         ORDER BY e.id DESC`,
        params
      );

      let csv = 'Enquiry ID,Name,Email,Phone,Subject,Message,Status,Assigned Staff,Internal Notes,Date & Time\n';
      for (const r of allRecords) {
        const row = [
          r.enquiry_id,
          `"${(r.name || '').replace(/"/g, '""')}"`,
          r.email,
          r.phone || '',
          `"${(r.subject || '').replace(/"/g, '""')}"`,
          `"${(r.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          r.status,
          `"${(r.assigned_staff || 'Unassigned').replace(/"/g, '""')}"`,
          `"${(r.internal_notes || '').replace(/"/g, '""')}"`,
          r.created_at
        ];
        csv += row.join(',') + '\n';
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="togu_enquiries.csv"');
      return res.send(csv);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM enquiries e ${whereClause}`,
      params
    );

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const [enquiries] = await pool.query(
      `SELECT e.id, e.enquiry_id, e.name, e.email, e.phone, e.subject, e.message, 
              e.status, e.assigned_to, u.name AS assigned_staff_name, e.internal_notes, e.created_at, e.updated_at 
       FROM enquiries e
       LEFT JOIN admin_users u ON e.assigned_to = u.id 
       ${whereClause} 
       ORDER BY e.id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    return res.json({
      success: true,
      enquiries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('Fetch enquiries error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve enquiries.' });
  }
});

// GET /api/enquiries/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, u.name AS assigned_staff_name 
       FROM enquiries e 
       LEFT JOIN admin_users u ON e.assigned_to = u.id 
       WHERE e.id = ? AND e.is_archived = 0`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    return res.json({ success: true, enquiry: rows[0] });
  } catch (err) {
    console.error('Get enquiry error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving enquiry.' });
  }
});

// PUT /api/enquiries/:id (Update status, internal notes, assigned staff)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { status, assigned_to, internal_notes } = req.body;

    const [existing] = await pool.query('SELECT * FROM enquiries WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    await pool.query(
      `UPDATE enquiries 
       SET status = ?, assigned_to = ?, internal_notes = ? 
       WHERE id = ?`,
      [
        status || existing[0].status,
        assigned_to !== undefined ? (assigned_to || null) : existing[0].assigned_to,
        internal_notes !== undefined ? internal_notes : existing[0].internal_notes,
        req.params.id
      ]
    );

    await logActivity(req, 'UPDATE', 'ENQUIRY', existing[0].enquiry_id, `Updated enquiry status to: ${status || existing[0].status}`);

    return res.json({ success: true, message: 'Enquiry updated successfully.' });
  } catch (err) {
    console.error('Update enquiry error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update enquiry.' });
  }
});

// DELETE /api/enquiries/:id (Archive)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM enquiries WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    await pool.query('UPDATE enquiries SET is_archived = 1 WHERE id = ?', [req.params.id]);
    await logActivity(req, 'ARCHIVE', 'ENQUIRY', existing[0].enquiry_id, `Archived enquiry: ${existing[0].enquiry_id}`);

    return res.json({ success: true, message: 'Enquiry archived successfully.' });
  } catch (err) {
    console.error('Delete enquiry error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete enquiry.' });
  }
});

export default router;
