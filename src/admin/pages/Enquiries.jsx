import React, { useState, useEffect } from 'react';
import { enquiriesApi, adminUsersApi } from '../services/api';
import {
  MessageSquareQuote,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  RefreshCw,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [exporting, setExporting] = useState(false);

  // Detail & Edit Drawer
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('New');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchEnquiries = async (page = 1) => {
    try {
      setLoading(true);
      const res = await enquiriesApi.getAll({
        search,
        status: statusFilter,
        page,
        limit: pagination.limit
      });
      if (res.success) {
        setEnquiries(res.enquiries || []);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load staff list for assignment dropdown
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await adminUsersApi.getAll();
        if (res.success) {
          setStaffUsers(res.users || []);
        }
      } catch {
        // quiet fallback
      }
    };
    loadStaff();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnquiries(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await enquiriesApi.exportCsv({ search, status: statusFilter });
      showNotification('Enquiries exported to CSV successfully!');
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleOpenDetail = (enq) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status || 'New');
    setEditAssignedTo(enq.assigned_to || '');
    setEditNotes(enq.internal_notes || '');
    setIsDrawerOpen(true);
  };

  const handleSaveDetail = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    try {
      setSaving(true);
      await enquiriesApi.update(selectedEnquiry.id, {
        status: editStatus,
        assigned_to: editAssignedTo ? parseInt(editAssignedTo, 10) : null,
        internal_notes: editNotes
      });
      showNotification(`Enquiry ${selectedEnquiry.enquiry_id} updated successfully.`);
      setIsDrawerOpen(false);
      fetchEnquiries(pagination.page);
    } catch (err) {
      alert('Failed to update enquiry: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (enq) => {
    if (window.confirm(`Are you sure you want to archive enquiry ${enq.enquiry_id} from ${enq.name}?`)) {
      try {
        await enquiriesApi.delete(enq.id);
        showNotification(`Enquiry ${enq.enquiry_id} archived.`);
        fetchEnquiries(pagination.page);
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#062817',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          borderLeft: '4px solid #eea328',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={18} style={{ color: '#eea328' }} />
          <span>{notification}</span>
        </div>
      )}

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
            Contact Enquiries & Messages
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Public website contact inquiries, partnerships and assistance requests stored in MySQL
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={exporting}
          style={btnSecondaryStyle}
        >
          <Download size={16} />
          <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Toolbar */}
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
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name, email, phone, subject, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.5rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: '#64748b' }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              background: '#ffffff',
              color: '#1e293b',
              outline: 'none'
            }}
          >
            <option value="all">All Enquiries</option>
            <option value="New">New / Unread</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <button
          onClick={() => fetchEnquiries(pagination.page)}
          style={{ ...btnSecondaryStyle, padding: '0.65rem 0.85rem' }}
          title="Refresh table"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={28} className="animate-spin" style={{ color: '#0b4b25', margin: '0 auto 0.5rem auto' }} />
            <p>Loading enquiries from database...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <MessageSquareQuote size={40} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', margin: '0 0 0.25rem 0' }}>No enquiries found</h3>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>Public form submissions will automatically appear here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Enquiry ID</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Sender Details</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Subject & Message</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Assigned To</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(enq => (
                  <tr key={enq.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0b4b25' }}>
                      {enq.enquiry_id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{enq.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{enq.email}</div>
                      {enq.phone && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{enq.phone}</div>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', maxWidth: '280px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {enq.subject || 'General Inquiry'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {enq.message}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={getStatusBadge(enq.status)}>
                        {enq.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.8rem' }}>
                      {enq.assigned_staff_name || 'Unassigned'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {new Date(enq.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleOpenDetail(enq)}
                          style={{ ...iconBtnStyle, color: '#0b4b25', background: '#e2efe8' }}
                          title="View / Update Enquiry"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(enq)}
                          style={{ ...iconBtnStyle, color: '#dc2626', background: '#fee2e2' }}
                          title="Archive"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            color: '#64748b'
          }}>
            <div>
              Showing {enquiries.length} of {pagination.total} records
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchEnquiries(pagination.page - 1)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span style={{ padding: '0.35rem 0.75rem', fontWeight: 600 }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchEnquiries(pagination.page + 1)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail / Update Drawer */}
      {isDrawerOpen && selectedEnquiry && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsDrawerOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8'
              }}
            >
              <X size={22} />
            </button>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              Enquiry: {selectedEnquiry.enquiry_id}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Submitted on {new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}
            </p>

            {/* Sender summary box */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.875rem'
            }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>Sender Name</span>
                <strong>{selectedEnquiry.name}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>Email Address</span>
                <a href={`mailto:${selectedEnquiry.email}`} style={{ color: '#0b4b25', textDecoration: 'none', fontWeight: 600 }}>
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>Phone</span>
                <span>{selectedEnquiry.phone || 'Not provided'}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>Subject</span>
                <span>{selectedEnquiry.subject || 'General'}</span>
              </div>
            </div>

            {/* Message Body */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Full Message Content
              </span>
              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: '#1e293b',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleSaveDetail} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Update Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Assign Staff Member</label>
                  <select
                    value={editAssignedTo}
                    onChange={(e) => setEditAssignedTo(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">-- Unassigned --</option>
                    {staffUsers.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Internal Follow-up Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record call logs, action items, or remarks for internal team reference..."
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  style={btnSecondaryStyle}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={btnPrimaryStyle}
                >
                  {saving ? 'Updating...' : 'Save & Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

const btnPrimaryStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.65rem 1.25rem',
  borderRadius: '10px',
  border: 'none',
  background: '#062817',
  color: '#ffffff',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer'
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

const iconBtnStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#334155',
  marginBottom: '0.35rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.875rem',
  outline: 'none',
  background: '#ffffff'
};

function getStatusBadge(status) {
  const base = { padding: '3px 8px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 };
  switch (status) {
    case 'New':
      return { ...base, background: '#fee2e2', color: '#b91c1c' };
    case 'In Progress':
      return { ...base, background: '#fef3c7', color: '#b45309' };
    case 'Resolved':
      return { ...base, background: '#dcfce7', color: '#15803d' };
    default:
      return { ...base, background: '#f1f5f9', color: '#64748b' };
  }
}

export default Enquiries;
