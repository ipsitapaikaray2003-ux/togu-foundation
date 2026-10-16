import React, { useState, useEffect } from 'react';
import { teamApi, uploadApi } from '../services/api';
import {
  UserCheck,
  Plus,
  Edit,
  Trash2,
  Upload,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    role_type: 'Executive',
    photo: '',
    bio: '',
    display_order: 1,
    is_published: 1
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await teamApi.getAll({ admin: 'true' });
      if (res.success) {
        setTeam(res.team || []);
      }
    } catch (err) {
      console.error('Fetch team error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenModal = (mem = null) => {
    setSelectedMember(mem);
    setFormError('');

    if (!mem) {
      setFormData({
        name: '',
        designation: '',
        role_type: 'Executive',
        photo: '/logo-icon.png',
        bio: '',
        display_order: team.length + 1,
        is_published: 1
      });
    } else {
      setFormData({
        name: mem.name || '',
        designation: mem.designation || '',
        role_type: mem.role_type || 'Executive',
        photo: mem.photo || '',
        bio: mem.bio || '',
        display_order: mem.display_order || 0,
        is_published: mem.is_published !== undefined ? mem.is_published : 1
      });
    }

    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadApi.uploadFile(file);
      if (res.success) {
        setFormData(prev => ({ ...prev, photo: res.fileUrl }));
        showNotification('Profile photo uploaded.');
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.designation) {
      setFormError('Name and Designation are required.');
      return;
    }

    try {
      setSaving(true);
      if (!selectedMember) {
        await teamApi.create(formData);
        showNotification(`Team member "${formData.name}" added successfully.`);
      } else {
        await teamApi.update(selectedMember.id, formData);
        showNotification(`Team member details updated.`);
      }
      setIsModalOpen(false);
      fetchTeam();
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (mem) => {
    if (window.confirm(`Are you sure you want to remove "${mem.name}" from team records?`)) {
      try {
        await teamApi.delete(mem.id);
        showNotification('Team member removed.');
        fetchTeam();
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
            Founders & Leadership Team
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Manage profiles, trustees, executive leaders and advisors shown on the public site
          </p>
        </div>

        <button onClick={() => handleOpenModal(null)} style={btnPrimaryStyle}>
          <Plus size={16} />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw size={28} className="animate-spin" style={{ color: '#0b4b25', margin: '0 auto 0.5rem auto' }} />
          <p>Loading team members from MySQL...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {team.map(mem => (
            <div key={mem.id} style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#062817',
                  border: '2px solid #eea328',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {mem.photo ? (
                    <img src={mem.photo} alt={mem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.4rem' }}>{mem.name.charAt(0)}</span>
                  )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    {mem.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0b4b25' }}>
                    {mem.designation}
                  </div>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    fontSize: '0.675rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    color: '#475569'
                  }}>
                    {mem.role_type}
                  </span>
                </div>
              </div>

              {mem.bio && (
                <p style={{
                  fontSize: '0.825rem',
                  color: '#64748b',
                  lineHeight: 1.5,
                  margin: '0 0 1rem 0',
                  flex: 1
                }}>
                  {mem.bio}
                </p>
              )}

              <div style={{
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto'
              }}>
                <span style={{ fontSize: '0.75rem', color: mem.is_published ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
                  {mem.is_published ? '● Live on site' : '○ Hidden'}
                </span>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button onClick={() => handleOpenModal(mem)} style={{ ...iconBtnStyle, color: '#0b4b25', background: '#e2efe8' }} title="Edit">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(mem)} style={{ ...iconBtnStyle, color: '#dc2626', background: '#fee2e2' }} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
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
            maxWidth: '560px',
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
              {selectedMember ? 'Edit Team Member Profile' : 'Add New Leadership Member'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Displayed on public leadership & founder sections
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
                  placeholder="e.g. Syed Zahoor Ahmad"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. Founder & President"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Leadership Role Type</label>
                  <select
                    value={formData.role_type}
                    onChange={(e) => setFormData({ ...formData, role_type: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Founder">Founder</option>
                    <option value="Trustee">Trustee</option>
                    <option value="Executive">Executive Member</option>
                    <option value="Advisory">Advisory Board</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Profile Photo URL / Upload</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="/logo-icon.png or url"
                  />
                  <label style={{ ...btnSecondaryStyle, padding: '0.65rem 1rem', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Browse'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Short Biography & Background</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  style={inputStyle}
                  placeholder="Summary of philanthropic work, experience and vision..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Display Order Sequence</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.25rem' }}>
                  <input
                    type="checkbox"
                    id="teamPub"
                    checked={formData.is_published === 1}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                    style={{ width: '16px', height: '16px', accentColor: '#0b4b25', marginRight: '0.5rem' }}
                  />
                  <label htmlFor="teamPub" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    Publish to Live Website
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={btnSecondaryStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={btnPrimaryStyle}>
                  {saving ? 'Saving...' : selectedMember ? 'Save Changes' : 'Add to Team'}
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

export default Team;
