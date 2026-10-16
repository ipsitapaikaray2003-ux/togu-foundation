import express from 'express';
import pool from '../config/db.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';

const router = express.Router();

// GET /api/activity-logs
router.get('/', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { search = '', action = '', recordType = '', page = 1, limit = 20 } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (actor_name LIKE ? OR details LIKE ? OR record_id LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    if (action && action !== 'all') {
      whereClause += ' AND action = ?';
      params.push(action);
    }

    if (recordType && recordType !== 'all') {
      whereClause += ' AND record_type = ?';
      params.push(recordType);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM activity_logs ${whereClause}`,
      params
    );

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const [logs] = await pool.query(
      `SELECT id, user_id, actor_name, action, record_type, record_id, details, ip_address, created_at 
       FROM activity_logs 
       ${whereClause} 
       ORDER BY id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    return res.json({
      success: true,
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('Fetch activity logs error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve activity logs.' });
  }
});

export default router;
