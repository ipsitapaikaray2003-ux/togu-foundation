import express from 'express';
import pool from '../config/db.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

async function generateDonationId() {
  const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM donations');
  const nextNum = (count || 0) + 5001;
  return `TOGU-DON-${nextNum}`;
}

async function generateReceiptNumber() {
  const year = new Date().getFullYear();
  const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM donations WHERE receipt_number IS NOT NULL');
  const nextNum = String((count || 0) + 1).padStart(4, '0');
  return `REC-${year}-${nextNum}`;
}

// POST /api/donations/public (Website public donation pledge / record intent)
router.post('/public', async (req, res) => {
  try {
    const { donor_name, donor_email, donor_phone, amount, currency = 'INR', payment_method = 'Bank Transfer', transaction_id, program_id } = req.body;

    if (!donor_name || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid donor name and amount are required.' });
    }

    const donationId = await generateDonationId();

    const [result] = await pool.query(
      `INSERT INTO donations 
       (donation_id, donor_name, donor_email, donor_phone, amount, currency, donation_date, payment_method, transaction_id, payment_status, program_id, internal_notes)
       VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, 'Pending', ?, 'Recorded via public website donation page - Pending verification')`,
      [
        donationId,
        donor_name.trim(),
        donor_email ? donor_email.trim().toLowerCase() : null,
        donor_phone ? donor_phone.trim() : null,
        parseFloat(amount),
        currency,
        payment_method,
        transaction_id ? transaction_id.trim() : null,
        program_id ? parseInt(program_id, 10) : null
      ]
    );

    await logActivity(req, 'CREATE', 'DONATION', donationId, `Public donation intent: ₹${amount} by ${donor_name} (${donationId})`);

    return res.status(201).json({
      success: true,
      message: 'Donation pledge recorded successfully. Thank you for supporting TOGU Foundation! Our accounts team will verify the transaction.',
      donationId
    });
  } catch (err) {
    console.error('Public donation submit error:', err);
    return res.status(500).json({ success: false, message: 'Failed to record donation.' });
  }
});

// GET /api/donations (Admin: list with search, filter, summary, CSV export)
router.get('/', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { 
      search = '', 
      status = '', 
      method = '', 
      startDate = '', 
      endDate = '', 
      page = 1, 
      limit = 15, 
      exportCsv = false 
    } = req.query;

    let whereClause = 'WHERE d.is_archived = 0';
    const params = [];

    if (search) {
      whereClause += ' AND (d.donor_name LIKE ? OR d.donor_email LIKE ? OR d.donor_phone LIKE ? OR d.donation_id LIKE ? OR d.transaction_id LIKE ? OR d.receipt_number LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s, s, s);
    }

    if (status && status !== 'all') {
      whereClause += ' AND d.payment_status = ?';
      params.push(status);
    }

    if (method && method !== 'all') {
      whereClause += ' AND d.payment_method = ?';
      params.push(method);
    }

    if (startDate) {
      whereClause += ' AND d.donation_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ' AND d.donation_date <= ?';
      params.push(endDate);
    }

    // Export CSV
    if (exportCsv === 'true') {
      const [allRecords] = await pool.query(
        `SELECT d.donation_id, d.donor_name, d.donor_email, d.donor_phone, d.amount, d.currency, 
                d.donation_date, d.payment_method, d.transaction_id, d.payment_status, 
                p.title AS program_title, d.receipt_number, d.internal_notes, d.created_at 
         FROM donations d
         LEFT JOIN programs p ON d.program_id = p.id 
         ${whereClause} 
         ORDER BY d.id DESC`,
        params
      );

      let csv = 'Donation ID,Donor Name,Email,Phone,Amount,Currency,Donation Date,Payment Method,Transaction ID,Status,Program,Receipt No,Notes\n';
      for (const r of allRecords) {
        const row = [
          r.donation_id,
          `"${(r.donor_name || '').replace(/"/g, '""')}"`,
          r.donor_email || '',
          r.donor_phone || '',
          r.amount,
          r.currency,
          r.donation_date,
          `"${r.payment_method}"`,
          `"${r.transaction_id || ''}"`,
          r.payment_status,
          `"${(r.program_title || 'General Fund').replace(/"/g, '""')}"`,
          r.receipt_number || '',
          `"${(r.internal_notes || '').replace(/"/g, '""')}"`
        ];
        csv += row.join(',') + '\n';
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="togu_donations.csv"');
      return res.send(csv);
    }

    // Calculate Summary metrics
    const [[summary]] = await pool.query(
      `SELECT 
         COUNT(*) AS totalCount,
         COALESCE(SUM(CASE WHEN d.payment_status = 'Successful' THEN d.amount ELSE 0 END), 0) AS verifiedTotal,
         COALESCE(SUM(CASE WHEN d.payment_status = 'Pending' THEN d.amount ELSE 0 END), 0) AS pendingTotal,
         COUNT(CASE WHEN d.payment_status = 'Successful' THEN 1 END) AS verifiedCount,
         COUNT(CASE WHEN d.payment_status = 'Pending' THEN 1 END) AS pendingCount
       FROM donations d 
       ${whereClause}`,
      params
    );

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const [donations] = await pool.query(
      `SELECT d.*, p.title AS program_title, u.name AS created_by_name 
       FROM donations d
       LEFT JOIN programs p ON d.program_id = p.id 
       LEFT JOIN admin_users u ON d.created_by = u.id 
       ${whereClause} 
       ORDER BY d.id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    return res.json({
      success: true,
      donations,
      summary,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: summary.totalCount,
        totalPages: Math.ceil(summary.totalCount / limitNum)
      }
    });
  } catch (err) {
    console.error('Fetch donations error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve donations.' });
  }
});

// GET /api/donations/:id
router.get('/:id', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.*, p.title AS program_title, u.name AS created_by_name 
       FROM donations d 
       LEFT JOIN programs p ON d.program_id = p.id 
       LEFT JOIN admin_users u ON d.created_by = u.id 
       WHERE d.id = ? AND d.is_archived = 0`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }

    return res.json({ success: true, donation: rows[0] });
  } catch (err) {
    console.error('Get donation error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving donation.' });
  }
});

// POST /api/donations (Admin: Add verified/offline donation record)
router.post('/', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { 
      donor_name, 
      donor_email, 
      donor_phone, 
      amount, 
      currency = 'INR', 
      donation_date, 
      payment_method = 'Bank Transfer', 
      transaction_id, 
      payment_status = 'Successful', 
      program_id, 
      internal_notes 
    } = req.body;

    if (!donor_name || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Donor Name and a valid Amount are required.' });
    }

    const donationId = await generateDonationId();
    let receiptNumber = null;
    if (payment_status === 'Successful') {
      receiptNumber = await generateReceiptNumber();
    }

    const dDate = donation_date || new Date().toISOString().split('T')[0];

    const [result] = await pool.query(
      `INSERT INTO donations 
       (donation_id, donor_name, donor_email, donor_phone, amount, currency, donation_date, payment_method, transaction_id, payment_status, program_id, receipt_number, internal_notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        donationId,
        donor_name.trim(),
        donor_email ? donor_email.trim().toLowerCase() : null,
        donor_phone ? donor_phone.trim() : null,
        parseFloat(amount),
        currency,
        dDate,
        payment_method,
        transaction_id || null,
        payment_status,
        program_id ? parseInt(program_id, 10) : null,
        receiptNumber,
        internal_notes || null,
        req.user.id
      ]
    );

    await logActivity(req, 'CREATE', 'DONATION', donationId, `Recorded donation ₹${amount} (${payment_status}) from ${donor_name}`);

    return res.status(201).json({
      success: true,
      message: 'Donation record added successfully.',
      donationId,
      receiptNumber,
      id: result.insertId
    });
  } catch (err) {
    console.error('Add donation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add donation record.' });
  }
});

// PUT /api/donations/:id (Edit donation record)
router.put('/:id', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { 
      donor_name, 
      donor_email, 
      donor_phone, 
      amount, 
      currency, 
      donation_date, 
      payment_method, 
      transaction_id, 
      payment_status, 
      program_id, 
      internal_notes 
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM donations WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Donation record not found.' });
    }

    let receiptNumber = existing[0].receipt_number;
    // Generate receipt if status transitioned to Successful and none existed
    if (payment_status === 'Successful' && !receiptNumber) {
      receiptNumber = await generateReceiptNumber();
    }

    await pool.query(
      `UPDATE donations 
       SET donor_name = ?, donor_email = ?, donor_phone = ?, amount = ?, currency = ?, 
           donation_date = ?, payment_method = ?, transaction_id = ?, payment_status = ?, 
           program_id = ?, receipt_number = ?, internal_notes = ? 
       WHERE id = ?`,
      [
        donor_name || existing[0].donor_name,
        donor_email !== undefined ? donor_email : existing[0].donor_email,
        donor_phone !== undefined ? donor_phone : existing[0].donor_phone,
        amount !== undefined ? parseFloat(amount) : existing[0].amount,
        currency || existing[0].currency,
        donation_date || existing[0].donation_date,
        payment_method || existing[0].payment_method,
        transaction_id !== undefined ? transaction_id : existing[0].transaction_id,
        payment_status || existing[0].payment_status,
        program_id !== undefined ? (program_id ? parseInt(program_id, 10) : null) : existing[0].program_id,
        receiptNumber,
        internal_notes !== undefined ? internal_notes : existing[0].internal_notes,
        req.params.id
      ]
    );

    await logActivity(req, 'UPDATE', 'DONATION', existing[0].donation_id, `Updated donation ${existing[0].donation_id} (Status: ${payment_status || existing[0].payment_status})`);

    return res.json({ success: true, message: 'Donation record updated successfully.', receiptNumber });
  } catch (err) {
    console.error('Update donation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update donation.' });
  }
});

// DELETE /api/donations/:id (Archive only - do not permanently erase financial trail)
router.delete('/:id', requireAuth, requireRoles('Super Admin'), async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM donations WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Donation record not found.' });
    }

    await pool.query('UPDATE donations SET is_archived = 1 WHERE id = ?', [req.params.id]);
    await logActivity(req, 'ARCHIVE', 'DONATION', existing[0].donation_id, `Archived donation record: ${existing[0].donation_id}`);

    return res.json({ success: true, message: 'Donation record archived.' });
  } catch (err) {
    console.error('Archive donation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to archive donation.' });
  }
});

export default router;
