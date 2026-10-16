import React, { useState, useEffect } from 'react';
import { membersApi } from '../services/api';
import {
  Award,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
  X,
  Phone,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [exporting, setExporting] = useState(false);

  // Modals
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    membership_type: 'Regular',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'Active',
    notes: ''
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchMembers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await membersApi.getAll({
        search,
        status: statusFilter,
        type: typeFilter,
        page,
        limit: pagination.limit
      });
      if (res.success) {
        setMembers(res.members || []);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, typeFilter]);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await membersApi.exportCsv({ search, status: statusFilter, type: typeFilter });
      showNotification('Member roster exported to CSV successfully!');
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleOpenModal = (mode, mem = null) => {
    setModalMode(mode);
    setSelectedMember(mem);
    setFormError('');

    if (mode === 'create') {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        membership_type: 'Regular',
        joining_date: new Date().toISOString().split('T')[0],
        status: 'Active',
        notes: ''
      });
    } else if (mem) {
      setFormData({
        full_name: mem.full_name || '',
        email: mem.email || '',
        phone: mem.phone || '',
        address: mem.address || '',
        membership_type: mem.membership_type || 'Regular',
        joining_date: mem.joining_date ? mem.joining_date.split('T')[0] : '',
        status: mem.status || 'Active',
        notes: mem.notes || ''
      });
    }

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.full_name || !formData.email || !formData.phone) {
      setFormError('Full Name, Email and Phone are required.');
      return;
    }

    try {
      setSaving(true);
      if (modalMode === 'create') {
        const res = await membersApi.create(formData);
        showNotification(`Member registered with ID ${res.membershipId}`);
      } else if (modalMode === 'edit') {
        await membersApi.update(selectedMember.id, formData);
        showNotification(`Member ${selectedMember.membership_id} updated.`);
      }
      setIsModalOpen(false);
      fetchMembers(pagination.page);
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (mem) => {
    if (window.confirm(`Are you sure you want to archive member ${mem.full_name} (${mem.membership_id})?`)) {
      try {
        await membersApi.delete(mem.id);
        showNotification(`Member ${mem.membership_id} archived.`);
        fetchMembers(pagination.page);
      } catch (err) {
        alert('Failed to delete member: ' + err.message);
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
            Foundation Members
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Manage registered lifetime, executive and regular members of TOGU Foundation
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            style={btnSecondaryStyle}
          >
            <Download size={16} />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          <button
            onClick={() => handleOpenModal('create')}
            style={btnPrimaryStyle}
          >
            <Plus size={16} />
            <span>Register Member</span>
          </button>
        </div>
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
            placeholder="Search by name, email, phone, or membership ID..."
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
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
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
            <option value="all">All Types</option>
            <option value="Founder & President">Founder & President</option>
            <option value="Life Member">Life Member</option>
            <option value="Regular">Regular Member</option>
            <option value="Youth Wing Leader">Youth Wing</option>
            <option value="Honorary Member">Honorary</option>
          </select>
        </div>

        <button
          onClick={() => fetchMembers(pagination.page)}
          style={{ ...btnSecondaryStyle, padding: '0.65rem 0.85rem' }}
          title="Refresh"
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
            <p>Loading members from MySQL...</p>
          </div>
        ) : members.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <Award size={40} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', margin: '0 0 0.25rem 0' }}>No members found</h3>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>Register new members using the button above.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Member ID</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Full Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Contact Info</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Membership Type</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Joining Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(mem => (
                  <tr key={mem.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0b4b25' }}>
                      {mem.membership_id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{mem.full_name}</div>
                      {mem.address && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{mem.address}</div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155' }}>
                        <Mail size={13} style={{ color: '#94a3b8' }} />
                        <span>{mem.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155', marginTop: '2px' }}>
                        <Phone size={13} style={{ color: '#94a3b8' }} />
                        <span>{mem.phone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#0f172a',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: '1px solid #e2e8f0'
                      }}>
                        {mem.membership_type}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {mem.joining_date ? new Date(mem.joining_date).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={getStatusBadge(mem.status)}>
                        {mem.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleOpenModal('view', mem)}
                          style={{ ...iconBtnStyle, color: '#2563eb', background: '#eff6ff' }}
                          title="View Profile"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', mem)}
                          style={{ ...iconBtnStyle, color: '#d97706', background: '#fef3c7' }}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(mem)}
                          style={{ ...iconBtnStyle, color: '#dc2626', background: '#fee2e2' }}
                          title="Archive"
                        >
                          <Trash2 size={14} />
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
              Showing {members.length} of {pagination.total} registered members
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchMembers(pagination.page - 1)}
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
                onClick={() => fetchMembers(pagination.page + 1)}
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

      {/* Modal: Register / Edit / View Member */}
      {isModalOpen && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
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
              {modalMode === 'create' && 'Register Foundation Member'}
              {modalMode === 'edit' && `Edit Member: ${selectedMember?.membership_id}`}
              {modalMode === 'view' && `Member Profile: ${selectedMember?.membership_id}`}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Official NGO membership registry record
            </p>

            {formError && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #ef4444',
                color: '#991b1b',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}>
                {formError}
              </div>
            )}

            {modalMode === 'view' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Member Name</span>
                    <strong>{selectedMember?.full_name}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Membership Type</span>
                    <strong>{selectedMember?.membership_type}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Email Address</span>
                    <span>{selectedMember?.email}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Phone</span>
                    <span>{selectedMember?.phone}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Joining Date</span>
                    <span>{selectedMember?.joining_date ? new Date(selectedMember.joining_date).toLocaleDateString('en-IN') : '—'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Status</span>
                    <span style={getStatusBadge(selectedMember?.status)}>{selectedMember?.status}</span>
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Address</span>
                  <p style={{ margin: '2px 0 0 0', color: '#334155' }}>{selectedMember?.address || 'Not provided'}</p>
                </div>

                {selectedMember?.notes && (
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Internal Remarks</span>
                    <p style={{ margin: '2px 0 0 0', color: '#334155' }}>{selectedMember?.notes}</p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button onClick={() => setIsModalOpen(false)} style={btnPrimaryStyle}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      style={inputStyle}
                      placeholder="e.g. Zahoor Ahmad"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={inputStyle}
                      placeholder="member@example.com"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={inputStyle}
                      placeholder="+91 98765 00000"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Membership Type</label>
                    <select
                      value={formData.membership_type}
                      onChange={(e) => setFormData({ ...formData, membership_type: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Regular">Regular Member</option>
                      <option value="Life Member">Life Member</option>
                      <option value="Founder & President">Founder & President</option>
                      <option value="Trustee">Trustee</option>
                      <option value="Youth Wing Leader">Youth Wing Leader</option>
                      <option value="Honorary Member">Honorary Member</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Joining Date</label>
                    <input
                      type="date"
                      value={formData.joining_date}
                      onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={inputStyle}
                    placeholder="Residential / Office address"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Notes / Contributions</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    style={inputStyle}
                    placeholder="Specific responsibilities, patronage or notes"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={btnSecondaryStyle}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={btnPrimaryStyle}
                  >
                    {saving ? 'Saving...' : modalMode === 'create' ? 'Register Member' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
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
  width: '30px',
  height: '30px',
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
    case 'Active':
      return { ...base, background: '#dcfce7', color: '#15803d' };
    case 'Pending':
      return { ...base, background: '#fef3c7', color: '#b45309' };
    case 'Suspended':
    case 'Inactive':
      return { ...base, background: '#fee2e2', color: '#b91c1c' };
    default:
      return { ...base, background: '#f1f5f9', color: '#64748b' };
  }
}

export default Members;
