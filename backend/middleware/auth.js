import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check cookies first
    if (req.cookies && req.cookies.togu_token) {
      token = req.cookies.togu_token;
    } 
    // Fallback to Authorization Header (Bearer token)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required. Please log in.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'togu_foundation_secure_jwt_secret_key_2026_!@#$%^');

    // Fetch user from DB to verify status
    const [rows] = await pool.query(
      'SELECT id, name, email, role, status, phone, avatar FROM admin_users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'User account no longer exists.' 
      });
    }

    const user = rows[0];

    if (user.status !== 'Active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Account has been deactivated. Please contact Super Admin.' 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Session expired. Please log in again.' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid authorization token.' 
    });
  }
};

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Requires one of: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}` 
      });
    }

    next();
  };
};
