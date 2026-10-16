import express from 'express';
import pool from '../config/db.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

async function generateExpenseId() {
  const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM expenses');
  const nextNum = (count || 0) + 7001;
  return `TOGU-EXP-${nextNum}`;
}

// GET /api/expenses (Admin: list with search, category filter, date filter, summary, CSV export)
router.get('/', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { 
      search = '', 
      category = '', 
      startDate = '', 
      endDate = '', 
      page = 1, 
      limit = 15, 
      exportCsv = false 
    } = req.query;

    let whereClause = 'WHERE ex.is_archived = 0';
    const params = [];

    if (search) {
      whereClause += ' AND (ex.title LIKE ? OR ex.vendor_recipient LIKE ? OR ex.expense_id LIKE ? OR ex.category LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    if (category && category !== 'all') {
      whereClause += ' AND ex.category = ?';
      params.push(category);
    }

    if (startDate) {
      whereClause += ' AND ex.expense_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ' AND ex.expense_date <= ?';
      params.push(endDate);
    }

    // Export CSV
    if (exportCsv === 'true') {
      const [allRecords] = await pool.query(
        `SELECT ex.expense_id, ex.title, ex.category, ex.amount, ex.expense_date, 
                ex.payment_method, ex.vendor_recipient, p.title AS program_title, 
                ex.description, ex.receipt_file, ex.created_at 
         FROM expenses ex
         LEFT JOIN programs p ON ex.program_id = p.id 
         ${whereClause} 
         ORDER BY ex.id DESC`,
        params
      );

      let csv = 'Expense ID,Title,Category,Amount,Date,Payment Method,Vendor/Recipient,Program,Description,Receipt File\n';
      for (const r of allRecords) {
        const row = [
          r.expense_id,
          `"${(r.title || '').replace(/"/g, '""')}"`,
          `"${r.category}"`,
          r.amount,
          r.expense_date,
          `"${r.payment_method}"`,
          `"${(r.vendor_recipient || '').replace(/"/g, '""')}"`,
          `"${(r.program_title || 'General Operation').replace(/"/g, '""')}"`,
          `"${(r.description || '').replace(/"/g, '""')}"`,
          r.receipt_file || ''
        ];
        csv += row.join(',') + '\n';
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="togu_expenses.csv"');
      return res.send(csv);
    }

    // Summary calculation
    const [[summary]] = await pool.query(
      `SELECT 
         COUNT(*) AS totalCount,
         COALESCE(SUM(ex.amount), 0) AS totalAmount 
       FROM expenses ex 
       ${whereClause}`,
      params
    );

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const [expenses] = await pool.query(
      `SELECT ex.*, p.title AS program_title, u.name AS created_by_name 
       FROM expenses ex
       LEFT JOIN programs p ON ex.program_id = p.id 
       LEFT JOIN admin_users u ON ex.created_by = u.id 
       ${whereClause} 
       ORDER BY ex.id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    return res.json({
      success: true,
      expenses,
      summary,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: summary.totalCount,
        totalPages: Math.ceil(summary.totalCount / limitNum)
      }
    });
  } catch (err) {
    console.error('Fetch expenses error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve expenses.' });
  }
});

// GET /api/expenses/:id
router.get('/:id', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ex.*, p.title AS program_title, u.name AS created_by_name 
       FROM expenses ex 
       LEFT JOIN programs p ON ex.program_id = p.id 
       LEFT JOIN admin_users u ON ex.created_by = u.id 
       WHERE ex.id = ? AND ex.is_archived = 0`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    return res.json({ success: true, expense: rows[0] });
  } catch (err) {
    console.error('Get expense error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving expense.' });
  }
});

// POST /api/expenses (Admin: Record expense)
router.post('/', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { 
      title, 
      category, 
      amount, 
      expense_date, 
      payment_method = 'Bank Transfer', 
      vendor_recipient, 
      program_id, 
      description, 
      receipt_file 
    } = req.body;

    if (!title || !category || !amount || !vendor_recipient) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, Category, Amount and Vendor/Recipient are required.' 
      });
    }

    const expenseId = await generateExpenseId();
    const eDate = expense_date || new Date().toISOString().split('T')[0];

    const [result] = await pool.query(
      `INSERT INTO expenses 
       (expense_id, title, category, amount, expense_date, payment_method, vendor_recipient, program_id, description, receipt_file, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        expenseId,
        title.trim(),
        category,
        parseFloat(amount),
        eDate,
        payment_method,
        vendor_recipient.trim(),
        program_id ? parseInt(program_id, 10) : null,
        description || null,
        receipt_file || null,
        req.user.id
      ]
    );

    await logActivity(req, 'CREATE', 'EXPENSE', expenseId, `Recorded expense ₹${amount} for ${title} to ${vendor_recipient}`);

    return res.status(201).json({
      success: true,
      message: 'Expense recorded successfully.',
      expenseId,
      id: result.insertId
    });
  } catch (err) {
    console.error('Add expense error:', err);
    return res.status(500).json({ success: false, message: 'Failed to record expense.' });
  }
});

// PUT /api/expenses/:id (Edit expense)
router.put('/:id', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { 
      title, 
      category, 
      amount, 
      expense_date, 
      payment_method, 
      vendor_recipient, 
      program_id, 
      description, 
      receipt_file 
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Expense record not found.' });
    }

    await pool.query(
      `UPDATE expenses 
       SET title = ?, category = ?, amount = ?, expense_date = ?, payment_method = ?, 
           vendor_recipient = ?, program_id = ?, description = ?, receipt_file = ? 
       WHERE id = ?`,
      [
        title || existing[0].title,
        category || existing[0].category,
        amount !== undefined ? parseFloat(amount) : existing[0].amount,
        expense_date || existing[0].expense_date,
        payment_method || existing[0].payment_method,
        vendor_recipient || existing[0].vendor_recipient,
        program_id !== undefined ? (program_id ? parseInt(program_id, 10) : null) : existing[0].program_id,
        description !== undefined ? description : existing[0].description,
        receipt_file !== undefined ? receipt_file : existing[0].receipt_file,
        req.params.id
      ]
    );

    await logActivity(req, 'UPDATE', 'EXPENSE', existing[0].expense_id, `Updated expense: ${existing[0].expense_id}`);

    return res.json({ success: true, message: 'Expense updated successfully.' });
  } catch (err) {
    console.error('Update expense error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update expense.' });
  }
});

// DELETE /api/expenses/:id (Archive)
router.delete('/:id', requireAuth, requireRoles('Super Admin'), async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Expense record not found.' });
    }

    await pool.query('UPDATE expenses SET is_archived = 1 WHERE id = ?', [req.params.id]);
    await logActivity(req, 'ARCHIVE', 'EXPENSE', existing[0].expense_id, `Archived expense: ${existing[0].expense_id}`);

    return res.json({ success: true, message: 'Expense record archived.' });
  } catch (err) {
    console.error('Archive expense error:', err);
    return res.status(500).json({ success: false, message: 'Failed to archive expense.' });
  }
});

export default router;
