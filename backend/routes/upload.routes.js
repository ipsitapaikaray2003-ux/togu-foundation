import express from 'express';
import { upload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

// POST /api/upload
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    await logActivity(req, 'UPLOAD', 'FILE', req.file.filename, `Uploaded file: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

    return res.json({
      success: true,
      message: 'File uploaded successfully.',
      fileUrl,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    console.error('File upload error:', err);
    return res.status(500).json({ success: false, message: err.message || 'File upload failed.' });
  }
});

export default router;
