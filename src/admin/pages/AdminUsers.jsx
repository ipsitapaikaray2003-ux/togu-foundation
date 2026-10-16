import React, { useState, useEffect } from 'react';
import { adminUsersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Plus,
  Edit,
  Trash2,
  KeyRound,
  RefreshCw,
  X,
  CheckCircle,
  User,
  Mail,
  Phone,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff',
    phone: '',
    status: 'Active'
  });
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminUsersApi.getAll();
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error('Fetch admin users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (u = null) => {
    setSelectedUser(u);
    setFormError('');

    if (!u) {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Staff',
        phone: '',
        status: 'Active'
      });
    } else {
      setFormData({
        name: u.name || '',
        email: u.email || '',
        password: '',
        role: u.role || 'Staff',
        phone: u.phone || '',
        status: u.status || 'Active'
      });
    }

    setIsModalOpen(true);
  };

  const handleOpenPasswordModal = (u) => {
    setSelectedUser(u);
    setNewPassword('');
    setFormError('');
    setIsPasswordModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.email) {
      setFormError('Name and Email are required.');
      return;
    }

    if (!selectedUser && (!formData.password || formData.password.length < 6)) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSaving(true);
      if (!selectedUser) {
        await adminUsersApi.create(formData);
        showNotification(`Admin user ${formData.name} created successfully.`);
      } else {
        await adminUsersApi.update(selectedUser.id, formData);
        showNotification(`Admin user ${selectedUser.name} updated.`);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setFormError('New password must be at least 6 characters long.');
      return;
    }

    try {
      setSaving(true);
      await adminUsersApi.resetPassword(selectedUser.id, newPassword);
      showNotification(`Password for ${selectedUser.name} has been reset.`);
      setIsPasswordModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Reset failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u) => {
    if (u.id === currentUser?.id) {
      alert('You cannot delete your own Super Admin account!');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently delete admin account "${u.name}" (${u.email})?`)) {
      try {
        await adminUsersApi.delete(u.id);
        showNotification(`User ${u.name} deleted.`);
        fetchUsers();
      } catch (err) {
        alert('Failed: ' + err.message);
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
            Admin Account & Role Permissions
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Super Admin access control: assign roles (Super Admin, Admin, Staff) and manage credentials
          </p>
        </div>

        <button onClick={() => handleOpenModal(null)} style={btnPrimaryStyle}>
          <Plus size={16} />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Users Table */}
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
            <p>Loading admin accounts from database...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Administrator</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Email Address</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Assigned Role</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Last Login</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#0b4b25',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>
                            {u.name} {u.id === currentUser?.id && <span style={{ color: '#eea328', fontSize: '0.75rem' }}>(You)</span>}
                          </div>
                          {u.phone && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        background: u.role === 'Super Admin' ? 'rgba(238, 163, 40, 0.2)' : u.role === 'Admin' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: u.role === 'Super Admin' ? '#d97706' : u.role === 'Admin' ? '#059669' : '#2563eb'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        background: u.status === 'Active' ? '#dcfce7' : '#fee2e2',
                        color: u.status === 'Active' ? '#15803d' : '#b91c1c'
                      }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {u.last_login ? new Date(u.last_login).toLocaleString('en-IN') : 'Never'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleOpenPasswordModal(u)}
                          style={{ ...iconBtnStyle, color: '#4f46e5', background: '#e0e7ff' }}
                          title="Reset Password"
                        >
                          <KeyRound size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(u)}
                          style={{ ...iconBtnStyle, color: '#0b4b25', background: '#e2efe8' }}
                          title="Edit Account"
                        >
                          <Edit size={14} />
                        </button>
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDelete(u)}
                            style={{ ...iconBtnStyle, color: '#dc2626', background: '#fee2e2' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add / Edit User */}
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
            maxWidth: '520px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={22} />
            </button>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              {selectedUser ? `Edit Admin Account: ${selectedUser.name}` : 'Create Admin / Staff Account'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Assign role permissions for foundation management
            </p>

            {formError && (
              <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Operations Coordinator"
                />
              </div>

              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={!!selectedUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ ...inputStyle, background: selectedUser ? '#f1f5f9' : '#ffffff' }}
                  placeholder="staff@togufoundation.org"
                />
              </div>

              {!selectedUser && (
                <div>
                  <label style={labelStyle}>Initial Password * (min. 6 characters)</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={inputStyle}
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Role Permission</label>
                  <select
                    value={formData.role}
                    disabled={selectedUser?.id === currentUser?.id}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Staff">Staff (Operations only)</option>
                    <option value="Admin">Admin (Management & Financials)</option>
                    <option value="Super Admin">Super Admin (Full Access)</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Account Status</label>
                  <select
                    value={formData.status}
                    disabled={selectedUser?.id === currentUser?.id}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={inputStyle}
                  placeholder="+91 98765 00000"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={btnSecondaryStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={btnPrimaryStyle}>
                  {saving ? 'Saving...' : selectedUser ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {isPasswordModalOpen && selectedUser && (
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
            maxWidth: '460px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={22} />
            </button>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              Reset Password
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Set a new secure password for <strong>{selectedUser.name}</strong> ({selectedUser.email})
            </p>

            {formError && (
              <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>New Password (min. 6 characters)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter new password..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} style={btnSecondaryStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={btnPrimaryStyle}>
                  {saving ? 'Updating...' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default AdminUsers;
