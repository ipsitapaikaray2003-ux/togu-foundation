import express from 'express';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

async function generateMembershipId() {
  const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM members');
  const nextNum = String((count || 0) + 1).padStart(3, '0');
  return `TOGU-MEM-${nextNum}`;
}

// GET /api/members (List with search, status filter, pagination, export)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search = '', status = '', type = '', page = 1, limit = 15, exportCsv = false } = req.query;

    let whereClause = 'WHERE is_archived = 0';
    const params = [];

    if (search) {
      whereClause += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR membership_id LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (type && type !== 'all') {
      whereClause += ' AND membership_type = ?';
      params.push(type);
    }

    if (exportCsv === 'true') {
      const [allRecords] = await pool.query(
        `SELECT membership_id, full_name, email, phone, address, membership_type, joining_date, status, notes, created_at 
         FROM members 
         ${whereClause} 
         ORDER BY id DESC`,
        params
      );

      let csv = 'Membership ID,Full Name,Email,Phone,Address,Membership Type,Joining Date,Status,Notes\n';
      for (const r of allRecords) {
        const row = [
          r.membership_id,
          `"${(r.full_name || '').replace(/"/g, '""')}"`,
          r.email,
          r.phone,
          `"${(r.address || '').replace(/"/g, '""')}"`,
          `"${(r.membership_type || '').replace(/"/g, '""')}"`,
          r.joining_date,
          r.status,
          `"${(r.notes || '').replace(/"/g, '""')}"`
        ];
        csv += row.join(',') + '\n';
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="togu_members.csv"');
      return res.send(csv);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM members ${whereClause}`,
      params
    );

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const [members] = await pool.query(
      `SELECT id, membership_id, full_name, email, phone, address, membership_type, joining_date, status, notes, created_at 
       FROM members 
       ${whereClause} 
       ORDER BY id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    return res.json({
      success: true,
      members,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('Fetch members error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve members.' });
  }
});

// GET /api/members/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM members WHERE id = ? AND is_archived = 0',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    return res.json({ success: true, member: rows[0] });
  } catch (err) {
    console.error('Get member error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving member.' });
  }
});

// POST /api/members (Add new member)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { full_name, email, phone, address, membership_type = 'Regular', joining_date, status = 'Active', notes } = req.body;

    if (!full_name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Full Name, Email and Phone are required.' });
    }

    const membershipId = await generateMembershipId();
    const joinDate = joining_date || new Date().toISOString().split('T')[0];

    const [result] = await pool.query(
      `INSERT INTO members 
       (membership_id, full_name, email, phone, address, membership_type, joining_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        membershipId,
        full_name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        address || null,
        membership_type,
        joinDate,
        status,
        notes || null
      ]
    );

    await logActivity(req, 'CREATE', 'MEMBER', membershipId, `Added new member: ${full_name} (${membershipId})`);

    return res.status(201).json({
      success: true,
      message: 'Member registered successfully.',
      membershipId,
      id: result.insertId
    });
  } catch (err) {
    console.error('Add member error:', err);
    return res.status(500).json({ success: false, message: 'Failed to register member.' });
  }
});

// PUT /api/members/:id (Update member)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { full_name, email, phone, address, membership_type, joining_date, status, notes } = req.body;

    const [existing] = await pool.query('SELECT * FROM members WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    await pool.query(
      `UPDATE members 
       SET full_name = ?, email = ?, phone = ?, address = ?, membership_type = ?, joining_date = ?, status = ?, notes = ? 
       WHERE id = ?`,
      [
        full_name || existing[0].full_name,
        email || existing[0].email,
        phone || existing[0].phone,
        address !== undefined ? address : existing[0].address,
        membership_type || existing[0].membership_type,
        joining_date || existing[0].joining_date,
        status || existing[0].status,
        notes !== undefined ? notes : existing[0].notes,
        req.params.id
      ]
    );

    await logActivity(req, 'UPDATE', 'MEMBER', existing[0].membership_id, `Updated member: ${existing[0].membership_id}`);

    return res.json({ success: true, message: 'Member updated successfully.' });
  } catch (err) {
    console.error('Update member error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update member.' });
  }
});

// DELETE /api/members/:id (Archive)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM members WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    await pool.query('UPDATE members SET is_archived = 1 WHERE id = ?', [req.params.id]);
    await logActivity(req, 'ARCHIVE', 'MEMBER', existing[0].membership_id, `Archived member: ${existing[0].membership_id}`);

    return res.json({ success: true, message: 'Member archived successfully.' });
  } catch (err) {
    console.error('Delete member error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete member.' });
  }
});

export default router;
