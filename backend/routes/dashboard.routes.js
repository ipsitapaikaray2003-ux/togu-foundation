import express from 'express';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    // 1. Total Volunteers
    const [[{ totalVolunteers }]] = await pool.query(
      'SELECT COUNT(*) AS totalVolunteers FROM volunteers WHERE is_archived = 0'
    );
    const [[{ pendingVolunteers }]] = await pool.query(
      "SELECT COUNT(*) AS pendingVolunteers FROM volunteers WHERE status = 'Pending' AND is_archived = 0"
    );

    // 2. Total Enquiries
    const [[{ totalEnquiries }]] = await pool.query(
      'SELECT COUNT(*) AS totalEnquiries FROM enquiries WHERE is_archived = 0'
    );
    const [[{ newEnquiries }]] = await pool.query(
      "SELECT COUNT(*) AS newEnquiries FROM enquiries WHERE status = 'New' AND is_archived = 0"
    );

    // 3. Total Members
    const [[{ totalMembers }]] = await pool.query(
      'SELECT COUNT(*) AS totalMembers FROM members WHERE is_archived = 0'
    );

    // 4. Total Programs
    const [[{ totalPrograms }]] = await pool.query(
      "SELECT COUNT(*) AS totalPrograms FROM programs WHERE status != 'Archived'"
    );

    // 5. Total Events
    const [[{ totalEvents }]] = await pool.query(
      'SELECT COUNT(*) AS totalEvents FROM events WHERE is_archived = 0'
    );
    const [[{ upcomingEventsCount }]] = await pool.query(
      'SELECT COUNT(*) AS upcomingEventsCount FROM events WHERE event_date >= CURDATE() AND is_archived = 0'
    );

    // 6. Donations (Only Successful transactions are summed)
    const [[{ totalDonations, donationCount }]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS totalDonations, COUNT(*) AS donationCount 
       FROM donations 
       WHERE payment_status = 'Successful' AND is_archived = 0`
    );

    const [[{ pendingDonations }]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS pendingDonations 
       FROM donations 
       WHERE payment_status = 'Pending' AND is_archived = 0`
    );

    // 7. Expenses
    const [[{ totalExpenses, expenseCount }]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS totalExpenses, COUNT(*) AS expenseCount 
       FROM expenses 
       WHERE is_archived = 0`
    );

    // 8. Recent Enquiries (latest 5)
    const [recentEnquiries] = await pool.query(
      `SELECT id, enquiry_id, name, email, phone, subject, status, created_at 
       FROM enquiries 
       WHERE is_archived = 0 
       ORDER BY created_at DESC 
       LIMIT 5`
    );

    // 9. Recent Activity Logs (latest 6)
    const [recentActivity] = await pool.query(
      `SELECT id, actor_name, action, record_type, record_id, details, created_at 
       FROM activity_logs 
       ORDER BY created_at DESC 
       LIMIT 6`
    );

    // 10. Upcoming Events (next 3)
    const [upcomingEvents] = await pool.query(
      `SELECT id, event_id, title, event_date, start_time, location, cover_image, status 
       FROM events 
       WHERE event_date >= CURDATE() AND is_archived = 0 
       ORDER BY event_date ASC 
       LIMIT 3`
    );

    // 11. Monthly Trends (last 6 months donations vs expenses)
    const [monthlyDonations] = await pool.query(
      `SELECT DATE_FORMAT(donation_date, '%b %Y') AS month, 
              DATE_FORMAT(donation_date, '%Y-%m') AS ym, 
              SUM(amount) AS total 
       FROM donations 
       WHERE payment_status = 'Successful' AND is_archived = 0 
         AND donation_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY ym, month 
       ORDER BY ym ASC`
    );

    const [monthlyExpenses] = await pool.query(
      `SELECT DATE_FORMAT(expense_date, '%b %Y') AS month, 
              DATE_FORMAT(expense_date, '%Y-%m') AS ym, 
              SUM(amount) AS total 
       FROM expenses 
       WHERE is_archived = 0 
         AND expense_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY ym, month 
       ORDER BY ym ASC`
    );

    return res.json({
      success: true,
      stats: {
        totalVolunteers: Number(totalVolunteers),
        pendingVolunteers: Number(pendingVolunteers),
        totalEnquiries: Number(totalEnquiries),
        newEnquiries: Number(newEnquiries),
        totalMembers: Number(totalMembers),
        totalPrograms: Number(totalPrograms),
        totalEvents: Number(totalEvents),
        upcomingEventsCount: Number(upcomingEventsCount),
        totalDonations: Number(totalDonations),
        donationCount: Number(donationCount),
        pendingDonations: Number(pendingDonations),
        totalExpenses: Number(totalExpenses),
        expenseCount: Number(expenseCount)
      },
      recentEnquiries,
      recentActivity,
      upcomingEvents,
      monthlyDonations,
      monthlyExpenses
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load dashboard statistics.' });
  }
});

export default router;
