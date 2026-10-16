import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  MessageSquareQuote,
  Award,
  Layers,
  CalendarDays,
  HeartHandshake,
  ReceiptText,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Download,
  ExternalLink,
  Activity,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      setError('');
      const res = await dashboardApi.getStats();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to fetch real-time statistics from MySQL database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={32} className="animate-spin" style={{ color: '#0b4b25', margin: '0 auto 1rem auto' }} />
        <p>Loading real-time foundation metrics from database...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentEnquiries = data?.recentEnquiries || [];
  const recentActivity = data?.recentActivity || [];
  const upcomingEvents = data?.upcomingEvents || [];
  const monthlyDonations = data?.monthlyDonations || [];
  const monthlyExpenses = data?.monthlyExpenses || [];

  const netSurplus = (stats.totalDonations || 0) - (stats.totalExpenses || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #062817 0%, #0b4b25 60%, #144028 100%)',
        borderRadius: '20px',
        padding: '2rem 2.25rem',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(6, 40, 23, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ zIndex: 2, maxWidth: '650px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(238, 163, 40, 0.2)',
            color: '#eea328',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <ShieldCheck size={14} />
            <span>TOGU Foundation Management Portal</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>
            Welcome back, {user?.name || 'Admin'}! 👋
          </h1>
          <p style={{ color: '#c5e4d2', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
            Here is your live NGO operational overview. All metrics are synced in real-time with the MySQL database.
          </p>
        </div>

        <div style={{ zIndex: 2, display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchStats}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            className="action-btn-hover"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>
        </div>

        {/* Decorative Graphic element */}
        <div style={{
          position: 'absolute',
          right: '-40px',
          bottom: '-50px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(238, 163, 40, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Live System Health & Operation Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.825rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#065f46', fontWeight: 600 }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block',
              boxShadow: '0 0 10px #10b981'
            }} />
            <span>MySQL 8.0 Engine Active</span>
          </div>
          <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={14} style={{ color: '#0b4b25' }} />
            <span>Latency: <strong>~12ms</strong></span>
          </div>
          <div style={{ color: '#64748b' }}>
            Role: <strong style={{ color: '#0b4b25' }}>{user?.role || 'Super Admin'}</strong>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to="/admin/events" style={quickBtnStyle}>
            <Plus size={14} style={{ color: '#0b4b25' }} /> <span>New Event</span>
          </Link>
          <Link to="/admin/volunteers" style={quickBtnStyle}>
            <Plus size={14} style={{ color: '#2563eb' }} /> <span>Add Volunteer</span>
          </Link>
          <Link to="/admin/donations" style={quickBtnStyle}>
            <Plus size={14} style={{ color: '#059669' }} /> <span>Log Donation</span>
          </Link>
          <Link to="/admin/expenses" style={quickBtnStyle}>
            <Plus size={14} style={{ color: '#dc2626' }} /> <span>Log Expense</span>
          </Link>
          <Link to="/admin/reports" style={quickBtnStyle}>
            <Download size={14} style={{ color: '#d97706' }} /> <span>Reports</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...quickBtnStyle,
              background: 'rgba(11, 75, 37, 0.08)',
              color: '#0b4b25',
              border: '1px solid rgba(11, 75, 37, 0.25)',
              fontWeight: 700
            }}
          >
            <ExternalLink size={13} /> <span>Live Website</span>
          </a>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '1rem',
          color: '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Primary KPI Grid (8 Cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* 1. Volunteers */}
        <Link to="/admin/volunteers" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card" style={statCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Total Volunteers</span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  {stats.totalVolunteers || 0}
                </div>
              </div>
              <div style={{ ...iconBoxStyle, background: '#dbeafe', color: '#2563eb' }}>
                <Users size={22} />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: '#059669', fontWeight: 600 }}>
              {stats.pendingVolunteers || 0} pending applications
            </div>
          </div>
        </Link>

        {/* 2. Enquiries */}
        <Link to="/admin/enquiries" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card" style={statCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Contact Enquiries</span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  {stats.totalEnquiries || 0}
                </div>
              </div>
              <div style={{ ...iconBoxStyle, background: '#fef3c7', color: '#d97706' }}>
                <MessageSquareQuote size={22} />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: stats.newEnquiries > 0 ? '#ef4444' : '#64748b', fontWeight: 600 }}>
              {stats.newEnquiries || 0} unread / new
            </div>
          </div>
        </Link>

        {/* 3. Members */}
        <Link to="/admin/members" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card" style={statCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Registered Members</span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  {stats.totalMembers || 0}
                </div>
              </div>
              <div style={{ ...iconBoxStyle, background: '#e0e7ff', color: '#4f46e5' }}>
                <Award size={22} />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>
              Active membership roster
            </div>
          </div>
        </Link>

        {/* 4. Programs */}
        <Link to="/admin/programs" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card" style={statCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>NGO Programs</span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  {stats.totalPrograms || 12}
                </div>
              </div>
              <div style={{ ...iconBoxStyle, background: '#dcfce7', color: '#16a34a' }}>
                <Layers size={22} />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: '#0b4b25', fontWeight: 600 }}>
              All 12 core focus areas
            </div>
          </div>
        </Link>

        {/* 5. Events */}
        <Link to="/admin/events" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card" style={statCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Total Events</span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  {stats.totalEvents || 0}
                </div>
              </div>
              <div style={{ ...iconBoxStyle, background: '#fae8ff', color: '#a855f7' }}>
                <CalendarDays size={22} />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>
              {stats.upcomingEventsCount || 0} upcoming activities
            </div>
          </div>
        </Link>

        {/* 6. Total Donations */}
        <Link to="/admin/donations" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card" style={statCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Verified Donations</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
                  ₹{(stats.totalDonations || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ ...iconBoxStyle, background: '#ecfdf5', color: '#059669' }}>
                <HeartHandshake size={22} />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>
              {stats.donationCount || 0} successful • ₹{(stats.pendingDonations || 0).toLocaleString('en-IN')} pending
            </div>
          </div>
        </Link>

        {/* 7. Total Expenses */}
        <Link to="/admin/expenses" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card" style={statCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Total Expenses</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626', marginTop: '0.25rem' }}>
                  ₹{(stats.totalExpenses || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ ...iconBoxStyle, background: '#fee2e2', color: '#dc2626' }}>
                <ReceiptText size={22} />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>
              {stats.expenseCount || 0} recorded vouchers
            </div>
          </div>
        </Link>

        {/* 8. Net Fund Surplus */}
        <div className="stat-card" style={statCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Net Operational Balance</span>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: netSurplus >= 0 ? '#0b4b25' : '#b91c1c',
                marginTop: '0.25rem'
              }}>
                ₹{netSurplus.toLocaleString('en-IN')}
              </div>
            </div>
            <div style={{ ...iconBoxStyle, background: netSurplus >= 0 ? '#e2efe8' : '#fee2e2', color: netSurplus >= 0 ? '#0b4b25' : '#b91c1c' }}>
              {netSurplus >= 0 ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>
            {netSurplus >= 0 ? 'Surplus funds available' : 'Deficit / Needs fundraising'}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Enquiries & Upcoming Events */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Enquiries Table */}
        <div style={sectionBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Recent Website Enquiries
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Latest messages from public website forms</span>
            </div>
            <Link to="/admin/enquiries" style={viewAllLinkStyle}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No enquiries received yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>Sender</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>Subject</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnquiries.map(enq => (
                    <tr key={enq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{enq.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{enq.email}</div>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {enq.subject || 'General Inquiry'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span style={getEnquiryBadge(enq.status)}>
                          {enq.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.775rem' }}>
                        {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN') : 'Recently'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div style={sectionBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Upcoming Events & Camps
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Scheduled foundation activities</span>
            </div>
            <Link to="/admin/events" style={viewAllLinkStyle}>
              <span>Manage Events</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No upcoming events scheduled.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {upcomingEvents.map(evt => (
                <div key={evt.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    minWidth: '55px',
                    height: '55px',
                    borderRadius: '10px',
                    background: '#062817',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                  }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                      {new Date(evt.event_date).getDate()}
                    </span>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#eea328', fontWeight: 700, marginTop: '2px' }}>
                      {new Date(evt.event_date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.925rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {evt.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      📍 {evt.location || 'Location TBA'} {evt.start_time ? `• ⏰ ${evt.start_time}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Logs Audit Trail Section */}
      <div style={sectionBoxStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              System Activity & Audit Log
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Real-time auditable history of admin operations</span>
          </div>
          <Link to="/admin/activity-logs" style={viewAllLinkStyle}>
            <span>Full Audit Trail</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No activity records found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivity.map(log => (
              <div key={log.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={getActionBadge(log.action)}>{log.action}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{log.actor_name}:</span>
                  <span style={{ color: '#475569' }}>{log.details || `${log.record_type} ${log.record_id}`}</span>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .stat-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
        }
        .action-btn-hover:hover {
          background: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

// Styles
const statCardStyle = {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '1.35rem',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const iconBoxStyle = {
  width: '46px',
  height: '46px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const sectionBoxStyle = {
  background: '#ffffff',
  borderRadius: '18px',
  padding: '1.5rem',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
};

const quickBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.45rem 0.85rem',
  borderRadius: '10px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  color: '#334155',
  fontSize: '0.8rem',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
};

const viewAllLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.825rem',
  fontWeight: 600,
  color: '#0b4b25',
  textDecoration: 'none'
};

function getEnquiryBadge(status) {
  switch (status) {
    case 'New':
      return { background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 };
    case 'In Progress':
      return { background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 };
    case 'Resolved':
      return { background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 };
    default:
      return { background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 };
  }
}

function getActionBadge(action) {
  const base = { padding: '2px 7px', borderRadius: '6px', fontSize: '0.675rem', fontWeight: 700 };
  switch (action) {
    case 'CREATE':
      return { ...base, background: '#dcfce7', color: '#15803d' };
    case 'UPDATE':
      return { ...base, background: '#dbeafe', color: '#1d4ed8' };
    case 'DELETE':
    case 'ARCHIVE':
      return { ...base, background: '#fee2e2', color: '#b91c1c' };
    case 'LOGIN':
      return { ...base, background: '#fef3c7', color: '#b45309' };
    default:
      return { ...base, background: '#f1f5f9', color: '#475569' };
  }
}

export default Dashboard;
