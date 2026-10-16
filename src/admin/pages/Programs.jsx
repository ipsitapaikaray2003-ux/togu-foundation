import React, { useState, useEffect } from 'react';
import { programsApi, uploadApi } from '../services/api';
import {
  Layers,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  X,
  Upload,
  Star,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Healthcare',
    short_description: '',
    full_description: '',
    cover_image: '',
    location: '',
    start_date: '',
    end_date: '',
    status: 'Published',
    featured: false
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await programsApi.getAll({ admin: 'true', status: statusFilter });
      if (res.success) {
        setPrograms(res.programs || []);
      }
    } catch (err) {
      console.error('Fetch programs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [statusFilter]);

  const handleOpenModal = (prog = null) => {
    setSelectedProgram(prog);
    setFormError('');

    if (!prog) {
      setFormData({
        title: '',
        category: 'Healthcare',
        short_description: '',
        full_description: '',
        cover_image: '/healthcare-camp.jpg',
        location: 'Hyderabad, Telangana',
        start_date: '',
        end_date: '',
        status: 'Published',
        featured: false
      });
    } else {
      setFormData({
        title: prog.title || '',
        category: prog.category || 'Healthcare',
        short_description: prog.short_description || '',
        full_description: prog.full_description || '',
        cover_image: prog.cover_image || '',
        location: prog.location || '',
        start_date: prog.start_date ? prog.start_date.split('T')[0] : '',
        end_date: prog.end_date ? prog.end_date.split('T')[0] : '',
        status: prog.status || 'Published',
        featured: !!prog.featured
      });
    }

    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadApi.uploadFile(file);
      if (res.success) {
        setFormData(prev => ({ ...prev, cover_image: res.fileUrl }));
        showNotification('Cover image uploaded successfully.');
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

    if (!formData.title || !formData.category) {
      setFormError('Title and Category are required.');
      return;
    }

    try {
      setSaving(true);
      if (!selectedProgram) {
        await programsApi.create(formData);
        showNotification(`Program "${formData.title}" created successfully!`);
      } else {
        await programsApi.update(selectedProgram.id, formData);
        showNotification(`Program "${formData.title}" updated.`);
      }
      setIsModalOpen(false);
      fetchPrograms();
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (prog) => {
    const nextStatus = prog.status === 'Published' ? 'Draft' : 'Published';
    try {
      await programsApi.update(prog.id, { ...prog, status: nextStatus });
      showNotification(`Program set to ${nextStatus}.`);
      fetchPrograms();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const handleArchive = async (prog) => {
    if (window.confirm(`Are you sure you want to archive "${prog.title}"?`)) {
      try {
        await programsApi.delete(prog.id);
        showNotification(`Program archived.`);
        fetchPrograms();
      } catch (err) {
        alert('Failed: ' + err.message);
      }
    }
  };

  const filteredPrograms = programs.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.title.toLowerCase().includes(s) || p.category.toLowerCase().includes(s) || (p.location && p.location.toLowerCase().includes(s));
  });

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
            NGO Programs & Focus Areas
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Manage the 12 core focus areas, active missions, descriptions and public visibility
          </p>
        </div>

        <button
          onClick={() => handleOpenModal(null)}
          style={btnPrimaryStyle}
        >
          <Plus size={16} />
          <span>Add Program</span>
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
            placeholder="Search programs by title or category..."
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            background: '#ffffff',
            outline: 'none'
          }}
        >
          <option value="all">All Statuses</option>
          <option value="Published">Published Only</option>
          <option value="Draft">Drafts Only</option>
          <option value="Archived">Archived</option>
        </select>

        <button
          onClick={fetchPrograms}
          style={{ ...btnSecondaryStyle, padding: '0.65rem 0.85rem' }}
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Program Cards Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw size={28} className="animate-spin" style={{ color: '#0b4b25', margin: '0 auto 0.5rem auto' }} />
          <p>Loading programs from database...</p>
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <Layers size={40} style={{ color: '#cbd5e1', margin: '0 auto 0.5rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>No programs match your search</h3>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredPrograms.map(prog => (
            <div key={prog.id} style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }} className="program-card">
              {/* Cover Image */}
              <div style={{
                height: '140px',
                background: 'linear-gradient(135deg, #0b4b25 0%, #062817 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {prog.cover_image && (
                  <img
                    src={prog.cover_image}
                    alt={prog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  left: '0.75rem',
                  display: 'flex',
                  gap: '0.35rem'
                }}>
                  <span style={{
                    background: 'rgba(6, 40, 23, 0.85)',
                    color: '#eea328',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    backdropFilter: 'blur(4px)'
                  }}>
                    {prog.category}
                  </span>
                  {prog.featured === 1 && (
                    <span style={{
                      background: '#eea328',
                      color: '#062817',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      <Star size={11} /> Featured
                    </span>
                  )}
                </div>

                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                  <span style={{
                    background: prog.status === 'Published' ? '#16a34a' : '#64748b',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {prog.status}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                  {prog.title}
                </h3>
                <p style={{
                  fontSize: '0.825rem',
                  color: '#64748b',
                  lineHeight: 1.5,
                  margin: '0 0 1rem 0',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {prog.short_description || 'No description provided.'}
                </p>

                {prog.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#0b4b25', fontWeight: 600, marginBottom: '0.85rem' }}>
                    <MapPin size={12} />
                    <span>{prog.location}</span>
                  </div>
                )}

                {/* Card Actions */}
                <div style={{
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => handleTogglePublish(prog)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: prog.status === 'Published' ? '#dc2626' : '#16a34a'
                    }}
                  >
                    {prog.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </button>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleOpenModal(prog)}
                      style={{ ...iconBtnStyle, color: '#0b4b25', background: '#e2efe8' }}
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleArchive(prog)}
                      style={{ ...iconBtnStyle, color: '#dc2626', background: '#fee2e2' }}
                      title="Archive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create / Edit Program */}
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
            maxWidth: '680px',
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
              {selectedProgram ? 'Edit NGO Program' : 'Create New Focus Area Program'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Changes will update the public website and program pages
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

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Program Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. Healthcare & Health Awareness"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Livelihood">Livelihood</option>
                    <option value="Skill Development">Skill Development</option>
                    <option value="Community">Community</option>
                    <option value="Social Welfare">Social Welfare</option>
                    <option value="Special Care">Special Care</option>
                    <option value="Environment">Environment</option>
                    <option value="Emergency Relief">Emergency Relief</option>
                    <option value="Hunger Relief">Hunger Relief</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Short Summary / Teaser</label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  style={inputStyle}
                  placeholder="A concise 1-2 sentence description for homepage cards..."
                />
              </div>

              <div>
                <label style={labelStyle}>Full Program Description</label>
                <textarea
                  rows={4}
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  style={inputStyle}
                  placeholder="Detailed mission, scope of activities, doctor checkups, kit distribution..."
                />
              </div>

              {/* Cover Image URL / Upload */}
              <div>
                <label style={labelStyle}>Cover Image URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="/healthcare-camp.jpg or https://..."
                  />
                  <label style={{
                    ...btnSecondaryStyle,
                    padding: '0.65rem 1rem',
                    cursor: uploading ? 'not-allowed' : 'pointer'
                  }}>
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Location / Scope</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. Hyderabad & Rural Districts"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Published">Published (Live on Website)</option>
                    <option value="Draft">Draft (Internal Only)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#0b4b25' }}
                />
                <label htmlFor="featuredToggle" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  Highlight as Featured Program on Homepage
                </label>
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
                  {saving ? 'Saving...' : selectedProgram ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .program-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
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

export default Programs;
