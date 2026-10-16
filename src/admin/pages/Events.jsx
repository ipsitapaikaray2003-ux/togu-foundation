import React, { useState, useEffect } from 'react';
import { eventsApi, programsApi, uploadApi } from '../services/api';
import {
  CalendarDays,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Upload,
  Clock,
  MapPin,
  RefreshCw,
  X,
  CheckCircle,
  Calendar as CalendarIcon
} from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [timelineFilter, setTimelineFilter] = useState('all'); // 'all' | 'true' (upcoming) | 'false' (past)

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image: '',
    event_date: '',
    start_time: '09:00 AM',
    end_time: '04:00 PM',
    location: '',
    program_id: '',
    status: 'Published'
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = { admin: 'true', search };
      if (timelineFilter === 'upcoming') params.upcoming = 'true';
      if (timelineFilter === 'past') params.upcoming = 'false';

      const res = await eventsApi.getAll(params);
      if (res.success) {
        setEvents(res.events || []);
      }
    } catch (err) {
      console.error('Fetch events error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [timelineFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Load programs for dropdown
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const res = await programsApi.getAll();
        if (res.success) setPrograms(res.programs || []);
      } catch {
        // quiet
      }
    };
    loadPrograms();
  }, []);

  const handleOpenModal = (evt = null) => {
    setSelectedEvent(evt);
    setFormError('');

    if (!evt) {
      setFormData({
        title: '',
        description: '',
        cover_image: '/healthcare-camp.jpg',
        event_date: new Date().toISOString().split('T')[0],
        start_time: '09:30 AM',
        end_time: '04:30 PM',
        location: 'Hyderabad, Telangana',
        program_id: programs.length > 0 ? programs[0].id : '',
        status: 'Published'
      });
    } else {
      setFormData({
        title: evt.title || '',
        description: evt.description || '',
        cover_image: evt.cover_image || '',
        event_date: evt.event_date ? evt.event_date.split('T')[0] : '',
        start_time: evt.start_time || '',
        end_time: evt.end_time || '',
        location: evt.location || '',
        program_id: evt.program_id || '',
        status: evt.status || 'Published'
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
        showNotification('Cover photo uploaded.');
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

    if (!formData.title || !formData.event_date) {
      setFormError('Title and Event Date are required.');
      return;
    }

    try {
      setSaving(true);
      if (!selectedEvent) {
        await eventsApi.create(formData);
        showNotification(`Event "${formData.title}" scheduled successfully.`);
      } else {
        await eventsApi.update(selectedEvent.id, formData);
        showNotification(`Event updated.`);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (evt) => {
    if (window.confirm(`Are you sure you want to archive event "${evt.title}"?`)) {
      try {
        await eventsApi.delete(evt.id);
        showNotification('Event archived.');
        fetchEvents();
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
            Events & Activities Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Schedule medical check-up camps, education drives, workshops and community gatherings
          </p>
        </div>

        <button onClick={() => handleOpenModal(null)} style={btnPrimaryStyle}>
          <Plus size={16} />
          <span>Add New Event</span>
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
            placeholder="Search events by title, location or description..."
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
          value={timelineFilter}
          onChange={(e) => setTimelineFilter(e.target.value)}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            background: '#ffffff',
            outline: 'none'
          }}
        >
          <option value="all">All Timelines</option>
          <option value="upcoming">Upcoming Events</option>
          <option value="past">Past / Completed Events</option>
        </select>

        <button onClick={fetchEvents} style={{ ...btnSecondaryStyle, padding: '0.65rem 0.85rem' }} title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw size={28} className="animate-spin" style={{ color: '#0b4b25', margin: '0 auto 0.5rem auto' }} />
          <p>Loading events from database...</p>
        </div>
      ) : events.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <CalendarDays size={40} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>No events found</h3>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem'
        }}>
          {events.map(evt => {
            const isUpcoming = evt.timeline_status === 'Upcoming';
            const eventDate = new Date(evt.event_date);

            return (
              <div key={evt.id} style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  height: '140px',
                  background: 'linear-gradient(135deg, #0b4b25, #051d11)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {evt.cover_image && (
                    <img
                      src={evt.cover_image}
                      alt={evt.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <span style={{
                      background: isUpcoming ? '#16a34a' : '#64748b',
                      color: '#ffffff',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      {isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <span style={{
                      background: 'rgba(6, 40, 23, 0.85)',
                      color: '#eea328',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      {evt.event_id}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0b4b25', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <CalendarIcon size={14} />
                    <span>{eventDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {evt.start_time && <span>• {evt.start_time}</span>}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                    {evt.title}
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
                    {evt.description || 'No description provided.'}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.85rem' }}>
                    📍 {evt.location || 'Location details will be updated'}
                  </div>

                  <div style={{
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Status: <strong>{evt.status}</strong>
                    </span>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => handleOpenModal(evt)}
                        style={{ ...iconBtnStyle, color: '#0b4b25', background: '#e2efe8' }}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(evt)}
                        style={{ ...iconBtnStyle, color: '#dc2626', background: '#fee2e2' }}
                        title="Archive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
            maxWidth: '650px',
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
              {selectedEvent ? 'Edit Event Details' : 'Schedule New Event / Camp'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Published events will automatically appear on the public foundation website
            </p>

            {formError && (
              <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Free Diagnostic & Health Camp - Medak"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Related NGO Program</label>
                  <select
                    value={formData.program_id}
                    onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">-- General Event --</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Start Time</label>
                  <input
                    type="text"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    style={inputStyle}
                    placeholder="09:00 AM"
                  />
                </div>
                <div>
                  <label style={labelStyle}>End Time</label>
                  <input
                    type="text"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    style={inputStyle}
                    placeholder="04:30 PM"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Location / Venue</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Community Health Center, Balanagar, Hyderabad"
                />
              </div>

              <div>
                <label style={labelStyle}>Event Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={inputStyle}
                  placeholder="Details of medical checkup, medicines provided, chief guests..."
                />
              </div>

              <div>
                <label style={labelStyle}>Cover Photo URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="/healthcare-camp.jpg or https://..."
                  />
                  <label style={{ ...btnSecondaryStyle, padding: '0.65rem 1rem', cursor: uploading ? 'not-allowed' : 'pointer' }}>
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

              <div>
                <label style={labelStyle}>Publication Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Published">Published (Visible on Live Website)</option>
                  <option value="Draft">Draft (Internal Only)</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={btnSecondaryStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={btnPrimaryStyle}>
                  {saving ? 'Saving...' : selectedEvent ? 'Save Changes' : 'Schedule Event'}
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

export default Events;
