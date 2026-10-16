import React, { useState, useEffect } from 'react';
import { galleryApi, uploadApi } from '../services/api';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  X,
  CheckCircle,
  Filter,
  AlertCircle
} from 'lucide-react';

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    category: 'Healthcare',
    image_url: '',
    is_published: 1
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await galleryApi.getAll({ admin: 'true', category: categoryFilter });
      if (res.success) {
        setGallery(res.gallery || []);
      }
    } catch (err) {
      console.error('Fetch gallery error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [categoryFilter]);

  const handleOpenModal = (item = null) => {
    setSelectedItem(item);
    setFormError('');

    if (!item) {
      setFormData({
        title: '',
        caption: '',
        category: 'Healthcare',
        image_url: '',
        is_published: 1
      });
    } else {
      setFormData({
        title: item.title || '',
        caption: item.caption || '',
        category: item.category || 'General',
        image_url: item.image_url || '',
        is_published: item.is_published !== undefined ? item.is_published : 1
      });
    }

    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadApi.uploadFile(file);
      if (res.success) {
        setFormData(prev => ({
          ...prev,
          image_url: res.fileUrl,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }));
        showNotification('Photo uploaded successfully.');
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

    if (!formData.title || !formData.image_url) {
      setFormError('Photo Title and Image URL or uploaded file are required.');
      return;
    }

    try {
      setSaving(true);
      if (!selectedItem) {
        await galleryApi.create(formData);
        showNotification(`Photo "${formData.title}" added to gallery.`);
      } else {
        await galleryApi.update(selectedItem.id, formData);
        showNotification(`Gallery item updated.`);
      }
      setIsModalOpen(false);
      fetchGallery();
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to remove "${item.title}" from the gallery?`)) {
      try {
        await galleryApi.delete(item.id);
        showNotification('Photo removed from gallery.');
        fetchGallery();
      } catch (err) {
        alert('Failed: ' + err.message);
      }
    }
  };

  const handleTogglePublish = async (item) => {
    const nextVal = item.is_published ? 0 : 1;
    try {
      await galleryApi.update(item.id, { ...item, is_published: nextVal });
      showNotification(`Photo ${nextVal ? 'published' : 'hidden'}.`);
      fetchGallery();
    } catch (err) {
      alert('Failed: ' + err.message);
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
            Gallery & Media Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Upload, categorize and publish event photos, field visits and medical camp pictures
          </p>
        </div>

        <button onClick={() => handleOpenModal(null)} style={btnPrimaryStyle}>
          <Plus size={16} />
          <span>Upload New Photograph</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '0.85rem 1rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: '#64748b' }} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              background: '#ffffff',
              outline: 'none'
            }}
          >
            <option value="all">All Gallery Categories</option>
            <option value="Healthcare">Healthcare Camps</option>
            <option value="Education">Education & School Drives</option>
            <option value="Community">Community Development</option>
            <option value="Events">Annual Events & Awards</option>
            <option value="General">General Activities</option>
          </select>
        </div>

        <button onClick={fetchGallery} style={{ ...btnSecondaryStyle, padding: '0.55rem 0.85rem' }} title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw size={28} className="animate-spin" style={{ color: '#0b4b25', margin: '0 auto 0.5rem auto' }} />
          <p>Loading media records from MySQL...</p>
        </div>
      ) : gallery.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <ImageIcon size={40} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>No photos in this category</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Upload high-resolution event photographs using the button above.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem'
        }}>
          {gallery.map(item => (
            <div key={item.id} style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                height: '180px',
                background: '#062817',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }} onClick={() => setPreviewImage(item.image_url)}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div style={{
                  position: 'absolute',
                  top: '0.65rem',
                  left: '0.65rem',
                  background: 'rgba(6, 40, 23, 0.85)',
                  color: '#eea328',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }}>
                  {item.category}
                </div>

                <div style={{
                  position: 'absolute',
                  top: '0.65rem',
                  right: '0.65rem'
                }}>
                  <span style={{
                    background: item.is_published ? '#16a34a' : '#64748b',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {item.is_published ? 'Live' : 'Hidden'}
                  </span>
                </div>
              </div>

              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {item.title}
                </h4>
                {item.caption && (
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.78rem', color: '#64748b', flex: 1 }}>
                    {item.caption}
                  </p>
                )}

                <div style={{
                  paddingTop: '0.65rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto'
                }}>
                  <button
                    onClick={() => handleTogglePublish(item)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: item.is_published ? '#dc2626' : '#16a34a'
                    }}
                  >
                    {item.is_published ? 'Hide from Site' : 'Publish to Site'}
                  </button>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleOpenModal(item)}
                      style={{ ...iconBtnStyle, color: '#0b4b25', background: '#e2efe8' }}
                      title="Edit details"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      style={{ ...iconBtnStyle, color: '#dc2626', background: '#fee2e2' }}
                      title="Delete"
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

      {/* Lightbox Preview */}
      {previewImage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }} onClick={() => setPreviewImage(null)}>
          <img
            src={previewImage}
            alt="Preview"
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
          />
        </div>
      )}

      {/* Modal: Upload / Edit */}
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
              {selectedItem ? 'Edit Photo Details' : 'Add Photograph to Gallery'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Upload JPEG, PNG or WEBP photos up to 10MB
            </p>

            {formError && (
              <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Photo Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Free Eye Checkup Camp - Balanagar"
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
                  <option value="Community">Community</option>
                  <option value="Events">Events</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Image File / Upload *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="/uploads/photo.jpg or url"
                  />
                  <label style={{ ...btnSecondaryStyle, padding: '0.65rem 1rem', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Browse'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Short Caption</label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  style={inputStyle}
                  placeholder="Optional caption displayed under image"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="pubToggle"
                  checked={formData.is_published === 1}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                  style={{ width: '16px', height: '16px', accentColor: '#0b4b25' }}
                />
                <label htmlFor="pubToggle" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  Publish immediately to public website
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={btnSecondaryStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={btnPrimaryStyle}>
                  {saving ? 'Saving...' : selectedItem ? 'Save Changes' : 'Upload to Gallery'}
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

export default Gallery;
