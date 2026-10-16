import React, { useState, useEffect } from 'react';
import { volunteersApi } from '../services/api';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  X,
  Phone,
  Mail,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [exporting, setExporting] = useState(false);

  // Modals state
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    areas_of_interest: '',
    skills: '',
    status: 'Approved',
    admin_notes: ''
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchVolunteers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await volunteersApi.getAll({
        search,
        status: statusFilter,
        page,
        limit: pagination.limit
      });
      if (res.success) {
        setVolunteers(res.volunteers || []);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVolunteers(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await volunteersApi.exportCsv({ search, status: statusFilter });
      showNotification('Volunteers exported to CSV successfully!');
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleOpenModal = (mode, vol = null) => {
    setModalMode(mode);
    setSelectedVolunteer(vol);
    setFormError('');

    if (mode === 'create') {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: 'Hyderabad',
        state: 'Telangana',
        areas_of_interest: 'Healthcare & Health Awareness',
        skills: '',
        status: 'Approved',
        admin_notes: ''
      });
    } else if (vol) {
      setFormData({
        full_name: vol.full_name || '',
        email: vol.email || '',
        phone: vol.phone || '',
        address: vol.address || '',
        city: vol.city || '',
        state: vol.state || '',
        areas_of_interest: vol.areas_of_interest || '',
        skills: vol.skills || '',
        status: vol.status || 'Pending',
        admin_notes: vol.admin_notes || ''
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
        const res = await volunteersApi.create(formData);
        showNotification(`Volunteer ${formData.full_name} added successfully! (${res.volunteerId})`);
      } else if (modalMode === 'edit') {
        await volunteersApi.update(selectedVolunteer.id, formData);
        showNotification(`Volunteer record updated successfully!`);
      }
      setIsModalOpen(false);
      fetchVolunteers(pagination.page);
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusChange = async (vol, newStatus) => {
    try {
      await volunteersApi.update(vol.id, { ...vol, status: newStatus });
      showNotification(`Volunteer ${vol.full_name} status set to ${newStatus}.`);
      fetchVolunteers(pagination.page);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (vol) => {
    if (window.confirm(`Are you sure you want to archive volunteer ${vol.full_name} (${vol.volunteer_id})?`)) {
      try {
        await volunteersApi.delete(vol.id);
        showNotification(`Volunteer ${vol.volunteer_id} archived.`);
        fetchVolunteers(pagination.page);
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Notification Toast */}
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

      {/* Top Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Volunteer Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Manage volunteer registrations, applications, skills and participation
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
            <span>Add Volunteer</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
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
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name, email, phone, city, or ID..."
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

        {/* Status Filter */}
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
            <option value="Pending">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          onClick={() => fetchVolunteers(pagination.page)}
          style={{ ...btnSecondaryStyle, padding: '0.65rem 0.85rem' }}
          title="Refresh table"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Volunteers Table */}
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
            <p>Loading volunteers from MySQL...</p>
          </div>
        ) : volunteers.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <Users size={40} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', margin: '0 0 0.25rem 0' }}>No volunteers found</h3>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>Try adjusting your search criteria or add a new volunteer.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Volunteer Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Contact Info</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Location</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Interest & Skills</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map(vol => (
                  <tr key={vol.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0b4b25' }}>
                      {vol.volunteer_id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{vol.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Joined: {new Date(vol.created_at).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155' }}>
                        <Mail size={13} style={{ color: '#94a3b8' }} />
                        <span>{vol.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155', marginTop: '2px' }}>
                        <Phone size={13} style={{ color: '#94a3b8' }} />
                        <span>{vol.phone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                      {vol.city ? `${vol.city}, ${vol.state || 'India'}` : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', maxWidth: '240px' }}>
                      <div style={{ fontWeight: 500, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {vol.areas_of_interest || 'General'}
                      </div>
                      {vol.skills && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Skills: {vol.skills}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={getStatusBadge(vol.status)}>
                        {vol.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        {vol.status === 'Pending' && (
                          <button
                            onClick={() => handleQuickStatusChange(vol, 'Approved')}
                            style={{ ...iconBtnStyle, color: '#16a34a', background: '#dcfce7' }}
                            title="Approve Volunteer"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenModal('view', vol)}
                          style={{ ...iconBtnStyle, color: '#2563eb', background: '#eff6ff' }}
                          title="View Profile"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', vol)}
                          style={{ ...iconBtnStyle, color: '#d97706', background: '#fef3c7' }}
                          title="Edit Details"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(vol)}
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

        {/* Pagination Bar */}
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
              Showing {volunteers.length} of {pagination.total} volunteers
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchVolunteers(pagination.page - 1)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                  opacity: pagination.page <= 1 ? 0.5 : 1
                }}
              >
                Previous
              </button>
              <span style={{ padding: '0.35rem 0.75rem', fontWeight: 600 }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchVolunteers(pagination.page + 1)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                  opacity: pagination.page >= pagination.totalPages ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add / Edit / View Volunteer */}
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
            maxWidth: '620px',
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
              {modalMode === 'create' && 'Register New Volunteer'}
              {modalMode === 'edit' && `Edit Volunteer: ${selectedVolunteer?.volunteer_id}`}
              {modalMode === 'view' && `Volunteer Profile: ${selectedVolunteer?.volunteer_id}`}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {modalMode === 'view' ? 'Complete profile details and history' : 'Fill in the volunteer information below'}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#0b4b25',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700
                  }}>
                    {selectedVolunteer?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                      {selectedVolunteer?.full_name}
                    </h3>
                    <div style={{ marginTop: '4px' }}>
                      <span style={getStatusBadge(selectedVolunteer?.status)}>
                        {selectedVolunteer?.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Email</span>
                    <strong>{selectedVolunteer?.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Phone</span>
                    <strong>{selectedVolunteer?.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>City & State</span>
                    <span>{selectedVolunteer?.city}, {selectedVolunteer?.state}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Registration Date</span>
                    <span>{new Date(selectedVolunteer?.created_at).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Full Address</span>
                  <p style={{ margin: '2px 0 0 0', color: '#334155' }}>{selectedVolunteer?.address || 'Not specified'}</p>
                </div>

                <div style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Areas of Interest</span>
                  <p style={{ margin: '2px 0 0 0', color: '#334155' }}>{selectedVolunteer?.areas_of_interest || 'General'}</p>
                </div>

                <div style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Skills & Experience</span>
                  <p style={{ margin: '2px 0 0 0', color: '#334155' }}>{selectedVolunteer?.skills || 'None stated'}</p>
                </div>

                {selectedVolunteer?.admin_notes && (
                  <div style={{ fontSize: '0.875rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Admin Notes</span>
                    <p style={{ margin: '2px 0 0 0', color: '#334155' }}>{selectedVolunteer?.admin_notes}</p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button onClick={() => setIsModalOpen(false)} style={btnPrimaryStyle}>
                    Close Profile
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
                      placeholder="e.g. Ramesh Reddy"
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
                      placeholder="ramesh@example.com"
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
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={inputStyle}
                      placeholder="Hyderabad"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      style={inputStyle}
                      placeholder="Telangana"
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={inputStyle}
                    placeholder="Colony, Street, Landmark"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Areas of Interest</label>
                  <input
                    type="text"
                    value={formData.areas_of_interest}
                    onChange={(e) => setFormData({ ...formData, areas_of_interest: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. Healthcare, Education, Food Drive, Disaster Relief"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Skills & Background</label>
                  <textarea
                    rows={2}
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. Doctor, Pharmacist, Driver, Teacher, Photographer"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Internal Admin Notes</label>
                  <textarea
                    rows={2}
                    value={formData.admin_notes}
                    onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                    style={inputStyle}
                    placeholder="Notes visible only to admins"
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
                    {saving ? 'Saving...' : modalMode === 'create' ? 'Create Volunteer' : 'Save Changes'}
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

// Styles
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
  cursor: 'pointer',
  transition: 'background 0.2s'
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
    case 'Approved':
      return { ...base, background: '#dcfce7', color: '#15803d' };
    case 'Pending':
      return { ...base, background: '#fef3c7', color: '#b45309' };
    case 'Rejected':
      return { ...base, background: '#fee2e2', color: '#b91c1c' };
    default:
      return { ...base, background: '#f1f5f9', color: '#64748b' };
  }
}

export default Volunteers;
