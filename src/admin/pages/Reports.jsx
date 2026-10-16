import React, { useState, useEffect } from 'react';
import { reportsApi, donationsApi, expensesApi, volunteersApi, membersApi, enquiriesApi } from '../services/api';
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Users,
  HeartHandshake,
  ReceiptText,
  MessageSquareQuote,
  Award
} from 'lucide-react';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await reportsApi.getSummary({ startDate, endDate });
      if (res.success) {
        setReport(res.report);
      }
    } catch (err) {
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async (type) => {
    try {
      if (type === 'donations') await donationsApi.exportCsv({ startDate, endDate });
      if (type === 'expenses') await expensesApi.exportCsv({ startDate, endDate });
      if (type === 'volunteers') await volunteersApi.exportCsv();
      if (type === 'members') await membersApi.exportCsv();
      if (type === 'enquiries') await enquiriesApi.exportCsv();
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Auditable Reports & Analytics
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Generate date-wise audit reports for donations, expenses, volunteers and community enquiries
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handlePrint} style={btnSecondaryStyle}>
            <Printer size={16} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Date Filter Toolbar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '1rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
          <Calendar size={16} style={{ color: '#0b4b25' }} />
          <span>Report Date Range:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />
          <span style={{ color: '#94a3b8' }}>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {(startDate || endDate) && (
          <button
            onClick={() => { setStartDate(''); setEndDate(''); }}
            style={{ ...btnSecondaryStyle, padding: '0.55rem 0.85rem', fontSize: '0.8rem' }}
          >
            Clear Filters
          </button>
        )}

        <button onClick={fetchReport} style={{ ...btnSecondaryStyle, padding: '0.55rem 0.85rem', marginLeft: 'auto' }} title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Quick Download Buttons */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '1rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#062817' }}>Export Specific Data:</span>
        <button onClick={() => handleExport('donations')} style={csvBtnStyle}>
          <Download size={13} /> Donations CSV
        </button>
        <button onClick={() => handleExport('expenses')} style={csvBtnStyle}>
          <Download size={13} /> Expenses CSV
        </button>
        <button onClick={() => handleExport('volunteers')} style={csvBtnStyle}>
          <Download size={13} /> Volunteers CSV
        </button>
        <button onClick={() => handleExport('members')} style={csvBtnStyle}>
          <Download size={13} /> Members CSV
        </button>
        <button onClick={() => handleExport('enquiries')} style={csvBtnStyle}>
          <Download size={13} /> Enquiries CSV
        </button>
      </div>

      {/* Report Content */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw size={28} className="animate-spin" style={{ color: '#0b4b25', margin: '0 auto 0.5rem auto' }} />
          <p>Compiling database report metrics...</p>
        </div>
      ) : !report ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Failed to compile report.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Summary Overview Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem'
          }}>
            <div style={reportCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Total Verified Income</span>
                <HeartHandshake size={20} style={{ color: '#059669' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
                ₹{Number(report.totalDonations).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                {report.donationCount} verified transactions
              </div>
            </div>

            <div style={reportCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Total Expenditures</span>
                <ReceiptText size={20} style={{ color: '#dc2626' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626', marginTop: '0.25rem' }}>
                ₹{Number(report.totalExpenses).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                {report.expenseCount} disbursement vouchers
              </div>
            </div>

            <div style={reportCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Net Surplus Funds</span>
                {report.netSurplus >= 0 ? <TrendingUp size={20} style={{ color: '#0b4b25' }} /> : <TrendingDown size={20} style={{ color: '#b91c1c' }} />}
              </div>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: report.netSurplus >= 0 ? '#0b4b25' : '#b91c1c',
                marginTop: '0.25rem'
              }}>
                ₹{Number(report.netSurplus).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                Income minus expenses
              </div>
            </div>

            <div style={reportCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Active Volunteers</span>
                <Users size={20} style={{ color: '#2563eb' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                {report.totalVolunteers}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                {report.approvedVolunteers} approved • {report.pendingVolunteers} pending
              </div>
            </div>
          </div>

          {/* Breakdown Tables: Expenses by Category & Donations by Method */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {/* Category Expenses Breakdown */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#0f172a' }}>
                Disbursements by Category
              </h3>
              {(!report.expenseCategories || report.expenseCategories.length === 0) ? (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No expenses recorded for this period.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {report.expenseCategories.map(cat => (
                    <div key={cat.category} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{cat.category}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cat.count} vouchers</div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.95rem' }}>
                        ₹{Number(cat.total).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Donations by Method */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#0f172a' }}>
                Verified Contributions by Mode
              </h3>
              {(!report.donationMethods || report.donationMethods.length === 0) ? (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No donations recorded for this period.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {report.donationMethods.map(m => (
                    <div key={m.payment_method} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{m.payment_method}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.count} contributors</div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.95rem' }}>
                        ₹{Number(m.total).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const reportCardStyle = {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '1.25rem',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
};

const btnSecondaryStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.65rem 1.15rem',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer'
};

const csvBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.4rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  background: '#f8fafc',
  color: '#0b4b25',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: 'pointer'
};

const inputStyle = {
  padding: '0.55rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.85rem',
  outline: 'none',
  background: '#ffffff'
};

export default Reports;
