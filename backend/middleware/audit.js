import pool from '../config/db.js';

export const logActivity = async (req, action, recordType, recordId = null, details = '') => {
  try {
    const userId = req.user ? req.user.id : null;
    const actorName = req.user ? req.user.name : 'Public / System';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    await pool.query(
      `INSERT INTO activity_logs (user_id, actor_name, action, record_type, record_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, actorName, action, recordType, String(recordId || ''), String(details || ''), ipAddress]
    );
  } catch (err) {
    console.error('Failed to write activity log:', err.message);
  }
};
