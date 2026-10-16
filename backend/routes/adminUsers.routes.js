import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

// All routes here strictly require Super Admin role
router.use(requireAuth, requireRoles('Super Admin'));

// GET /api/admin-users (List all admins)
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT id, name, email, role, status, phone, avatar, last_login, created_at, updated_at 
       FROM admin_users 
       ORDER BY id ASC`
    );

    return res.json({ success: true, users });
  } catch (err) {
    console.error('Fetch admin users error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin accounts.' });
  }
});

// POST /api/admin-users (Create admin/staff)
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role = 'Staff', phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, Email and Password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [existing] = await pool.query('SELECT id FROM admin_users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      `INSERT INTO admin_users (name, email, password, role, status, phone)
       VALUES (?, ?, ?, ?, 'Active', ?)`,
      [name.trim(), cleanEmail, passwordHash, role, phone || null]
    );

    await logActivity(req, 'CREATE', 'ADMIN_USER', result.insertId, `Created admin account: ${name} (${role})`);

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      id: result.insertId
    });
  } catch (err) {
    console.error('Create admin user error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create admin account.' });
  }
});

// PUT /api/admin-users/:id (Edit name, phone, role, status)
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, role, status } = req.body;
    const targetId = parseInt(req.params.id, 10);

    const [existing] = await pool.query('SELECT * FROM admin_users WHERE id = ?', [targetId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent changing own role or deactivating own account
    if (targetId === req.user.id && (status === 'Inactive' || role !== 'Super Admin')) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot demote or deactivate your own Super Admin account.' 
      });
    }

    await pool.query(
      `UPDATE admin_users 
       SET name = ?, phone = ?, role = ?, status = ? 
       WHERE id = ?`,
      [
        name || existing[0].name,
        phone !== undefined ? phone : existing[0].phone,
        role || existing[0].role,
        status || existing[0].status,
        targetId
      ]
    );

    await logActivity(req, 'UPDATE', 'ADMIN_USER', targetId, `Updated admin account: ${targetId} (${role || existing[0].role}, ${status || existing[0].status})`);

    return res.json({ success: true, message: 'Admin account updated successfully.' });
  } catch (err) {
    console.error('Update admin user error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update admin account.' });
  }
});

// PUT /api/admin-users/:id/reset-password (Super admin resets password)
router.put('/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const targetId = parseInt(req.params.id, 10);

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE admin_users SET password = ? WHERE id = ?', [passwordHash, targetId]);

    await logActivity(req, 'UPDATE', 'ADMIN_PASSWORD', targetId, `Super Admin reset password for user ID: ${targetId}`);

    return res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
});

// DELETE /api/admin-users/:id (Delete admin)
router.delete('/:id', async (req, res) => {
  try {
    const targetId = parseInt(req.params.id, 10);

    if (targetId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account!' });
    }

    const [existing] = await pool.query('SELECT email, name FROM admin_users WHERE id = ?', [targetId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await pool.query('DELETE FROM admin_users WHERE id = ?', [targetId]);

    await logActivity(req, 'DELETE', 'ADMIN_USER', targetId, `Deleted admin account: ${existing[0].name} (${existing[0].email})`);

    return res.json({ success: true, message: 'Admin account deleted successfully.' });
  } catch (err) {
    console.error('Delete admin user error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
});

export default router;
