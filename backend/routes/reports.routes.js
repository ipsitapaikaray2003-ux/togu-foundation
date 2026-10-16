import express from 'express';
import pool from '../config/db.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reports/summary
router.get('/summary', requireAuth, requireRoles('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { startDate = '', endDate = '' } = req.query;

    let dateCondDonations = 'WHERE payment_status = "Successful" AND is_archived = 0';
    let dateCondExpenses = 'WHERE is_archived = 0';
    let dateCondVolunteers = 'WHERE is_archived = 0';
    let dateCondEnquiries = 'WHERE is_archived = 0';
    let dateCondMembers = 'WHERE is_archived = 0';

    const dParams = [];
    const exParams = [];
    const vParams = [];
    const enqParams = [];
    const mParams = [];

    if (startDate) {
      dateCondDonations += ' AND donation_date >= ?';
      dParams.push(startDate);
      dateCondExpenses += ' AND expense_date >= ?';
      exParams.push(startDate);
      dateCondVolunteers += ' AND created_at >= ?';
      vParams.push(startDate + ' 00:00:00');
      dateCondEnquiries += ' AND created_at >= ?';
      enqParams.push(startDate + ' 00:00:00');
      dateCondMembers += ' AND joining_date >= ?';
      mParams.push(startDate);
    }

    if (endDate) {
      dateCondDonations += ' AND donation_date <= ?';
      dParams.push(endDate);
      dateCondExpenses += ' AND expense_date <= ?';
      exParams.push(endDate);
      dateCondVolunteers += ' AND created_at <= ?';
      vParams.push(endDate + ' 23:59:59');
      dateCondEnquiries += ' AND created_at <= ?';
      enqParams.push(endDate + ' 23:59:59');
      dateCondMembers += ' AND joining_date <= ?';
      mParams.push(endDate);
    }

    // 1. Financials: Verified Donations & Expenses
    const [[donationsRes]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS totalDonations, COUNT(*) AS donationCount FROM donations ${dateCondDonations}`,
      dParams
    );

    const [[expensesRes]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS totalExpenses, COUNT(*) AS expenseCount FROM expenses ${dateCondExpenses}`,
      exParams
    );

    // 2. Volunteers
    const [[volunteersRes]] = await pool.query(
      `SELECT COUNT(*) AS totalVolunteers, 
              COUNT(CASE WHEN status = 'Approved' THEN 1 END) AS approvedVolunteers,
              COUNT(CASE WHEN status = 'Pending' THEN 1 END) AS pendingVolunteers 
       FROM volunteers ${dateCondVolunteers}`,
      vParams
    );

    // 3. Enquiries
    const [[enquiriesRes]] = await pool.query(
      `SELECT COUNT(*) AS totalEnquiries,
              COUNT(CASE WHEN status = 'Resolved' THEN 1 END) AS resolvedEnquiries,
              COUNT(CASE WHEN status = 'New' THEN 1 END) AS newEnquiries 
       FROM enquiries ${dateCondEnquiries}`,
      enqParams
    );

    // 4. Members
    const [[membersRes]] = await pool.query(
      `SELECT COUNT(*) AS totalMembers FROM members ${dateCondMembers}`,
      mParams
    );

    // 5. Expense breakdown by Category
    const [expenseCategories] = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count 
       FROM expenses ${dateCondExpenses} 
       GROUP BY category 
       ORDER BY total DESC`,
      exParams
    );

    // 6. Donations by Payment Method
    const [donationMethods] = await pool.query(
      `SELECT payment_method, COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count 
       FROM donations ${dateCondDonations} 
       GROUP BY payment_method 
       ORDER BY total DESC`,
      dParams
    );

    const netSurplus = Number(donationsRes.totalDonations) - Number(expensesRes.totalExpenses);

    return res.json({
      success: true,
      report: {
        totalDonations: Number(donationsRes.totalDonations),
        donationCount: Number(donationsRes.donationCount),
        totalExpenses: Number(expensesRes.totalExpenses),
        expenseCount: Number(expensesRes.expenseCount),
        netSurplus,
        totalVolunteers: Number(volunteersRes.totalVolunteers),
        approvedVolunteers: Number(volunteersRes.approvedVolunteers),
        pendingVolunteers: Number(volunteersRes.pendingVolunteers),
        totalEnquiries: Number(enquiriesRes.totalEnquiries),
        resolvedEnquiries: Number(enquiriesRes.resolvedEnquiries),
        newEnquiries: Number(enquiriesRes.newEnquiries),
        totalMembers: Number(membersRes.totalMembers),
        expenseCategories,
        donationMethods
      }
    });
  } catch (err) {
    console.error('Report summary error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate report summary.' });
  }
});

export default router;
