import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

// Rate limiter for login: max 15 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { 
    success: false, 
    message: 'Too many login attempts. Please try again after 15 minutes for security.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide both email and password.' 
      });
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, password, role, status, phone, avatar FROM admin_users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }

    const user = rows[0];

    if (user.status !== 'Active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your admin account has been suspended or deactivated.' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }

    // Update last_login
    await pool.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Create JWT
    const secret = process.env.JWT_SECRET || 'togu_foundation_secure_jwt_secret_key_2026_!@#$%^';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Set HTTP-Only Cookie
    res.cookie('togu_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar
    };

    req.user = userProfile;
    await logActivity(req, 'LOGIN', 'AUTH', user.id, `User logged in successfully as ${user.role}`);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: userProfile
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  try {
    await logActivity(req, 'LOGOUT', 'AUTH', req.user.id, 'User logged out');
    res.clearCookie('togu_token');
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err);
    res.clearCookie('togu_token');
    return res.json({ success: true, message: 'Logged out.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Name cannot be empty.' });
    }

    await pool.query(
      'UPDATE admin_users SET name = ?, phone = ?, avatar = ? WHERE id = ?',
      [name.trim(), phone || null, avatar || null, req.user.id]
    );

    await logActivity(req, 'UPDATE', 'USER_PROFILE', req.user.id, 'Updated own profile details');

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: { ...req.user, name: name.trim(), phone, avatar }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new password.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const [rows] = await pool.query('SELECT password FROM admin_users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE admin_users SET password = ? WHERE id = ?', [newHash, req.user.id]);
    await logActivity(req, 'UPDATE', 'AUTH_PASSWORD', req.user.id, 'Changed account password');

    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
});

export default router;
