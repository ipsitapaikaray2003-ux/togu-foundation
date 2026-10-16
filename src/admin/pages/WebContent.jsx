import React, { useState, useEffect } from 'react';
import { contentApi, uploadApi } from '../services/api';
import {
  FileEdit,
  Save,
  Globe,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  Sliders,
  Info,
  Phone,
  BarChart,
  HelpCircle
} from 'lucide-react';

const WebContent = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [contentData, setContentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await contentApi.getAll();
      if (res.success && res.content) {
        setContentData(res.content);
      }
    } catch (err) {
      console.error('Fetch content error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleHeroChange = (field, val) => {
    setContentData(prev => ({
      ...prev,
      hero: {
        ...(prev.hero || {}),
        [field]: val
      }
    }));
  };

  const handleHeroImageChange = (index, val) => {
    const list = [...(contentData?.hero?.sliderImages || ['', '', '', ''])];
    list[index] = val;
    handleHeroChange('sliderImages', list);
  };

  const handleAboutChange = (field, val) => {
    setContentData(prev => ({
      ...prev,
      about: {
        ...(prev.about || {}),
        [field]: val
      }
    }));
  };

  const handleContactChange = (field, val) => {
    setContentData(prev => ({
      ...prev,
      contact_info: {
        ...(prev.contact_info || {}),
        [field]: val
      }
    }));
  };

  const handleStatsChange = (field, val) => {
    setContentData(prev => ({
      ...prev,
      impact_stats: {
        ...(prev.impact_stats || {}),
        [field]: val
      }
    }));
  };

  const handleSaveSection = async (sectionKey) => {
    const sectionData = contentData[sectionKey];
    if (!sectionData) return;

    try {
      setSaving(true);
      await contentApi.updateSection(sectionKey, {
        title: sectionKey.toUpperCase(),
        content: sectionData,
        status: 'Published'
      });
      showNotification(`Section "${sectionKey}" saved and published to live website!`);
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadHeroImage = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadApi.uploadFile(file);
      if (res.success) {
        handleHeroImageChange(index, res.fileUrl);
        showNotification(`Slider image ${index + 1} uploaded.`);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={28} className="animate-spin" style={{ color: '#0b4b25', margin: '0 auto 0.5rem auto' }} />
        <p>Loading website content from MySQL database...</p>
      </div>
    );
  }

  const hero = contentData.hero || {};
  const about = contentData.about || {};
  const contact = contentData.contact_info || {};
  const stats = contentData.impact_stats || {};

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
            Website Content Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Live content manager for homepage hero banners, about text, mission and contact details
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnSecondaryStyle, textDecoration: 'none' }}
        >
          <Eye size={16} />
          <span>Preview Public Website</span>
        </a>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('hero')}
          style={{ ...tabBtnStyle, ...(activeTab === 'hero' ? activeTabStyle : {}) }}
        >
          <Sliders size={16} />
          <span>Hero Banner & Slider</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          style={{ ...tabBtnStyle, ...(activeTab === 'about' ? activeTabStyle : {}) }}
        >
          <Info size={16} />
          <span>About, Vision & Mission</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          style={{ ...tabBtnStyle, ...(activeTab === 'contact' ? activeTabStyle : {}) }}
        >
          <Phone size={16} />
          <span>Contact & Social Links</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          style={{ ...tabBtnStyle, ...(activeTab === 'stats' ? activeTabStyle : {}) }}
        >
          <BarChart size={16} />
          <span>Impact Statistics</span>
        </button>
      </div>

      {/* TAB 1: HERO */}
      {activeTab === 'hero' && (
        <div style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Hero Banner Settings
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Configure headlines, buttons and slider photos</span>
            </div>
            <button
              onClick={() => handleSaveSection('hero')}
              disabled={saving}
              style={btnPrimaryStyle}
            >
              <Save size={16} />
              <span>{saving ? 'Publishing...' : 'Publish Hero Changes'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Top Badge / Tagline</label>
              <input
                type="text"
                value={hero.tagline || ''}
                onChange={(e) => handleHeroChange('tagline', e.target.value)}
                style={inputStyle}
                placeholder="Empowering Communities • Transforming Lives"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Main Heading</label>
                <input
                  type="text"
                  value={hero.title || ''}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  style={inputStyle}
                  placeholder="TOGU FOUNDATION"
                />
              </div>
              <div>
                <label style={labelStyle}>Subheading / Motto</label>
                <input
                  type="text"
                  value={hero.subtitle || ''}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  style={inputStyle}
                  placeholder="Together for Good. United for Change."
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Hero Introduction Text</label>
              <textarea
                rows={3}
                value={hero.description || ''}
                onChange={(e) => handleHeroChange('description', e.target.value)}
                style={inputStyle}
                placeholder="Introductory paragraph appearing over the hero slider..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Primary Button Text</label>
                <input
                  type="text"
                  value={hero.ctaPrimaryText || ''}
                  onChange={(e) => handleHeroChange('ctaPrimaryText', e.target.value)}
                  style={inputStyle}
                  placeholder="Donate Now"
                />
              </div>
              <div>
                <label style={labelStyle}>Primary Button Link</label>
                <input
                  type="text"
                  value={hero.ctaPrimaryLink || ''}
                  onChange={(e) => handleHeroChange('ctaPrimaryLink', e.target.value)}
                  style={inputStyle}
                  placeholder="/donate"
                />
              </div>
            </div>

            {/* Slider Images */}
            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ ...labelStyle, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Hero Background Slider Images (4 Slides)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {[0, 1, 2, 3].map(idx => (
                  <div key={idx} style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    background: '#f8fafc'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0b4b25', display: 'block', marginBottom: '0.4rem' }}>
                      Slide {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={hero.sliderImages?.[idx] || ''}
                      onChange={(e) => handleHeroImageChange(idx, e.target.value)}
                      placeholder="/hero-1.jpg or url"
                      style={{ ...inputStyle, fontSize: '0.8rem', marginBottom: '0.5rem' }}
                    />
                    <label style={{ ...btnSecondaryStyle, width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '0.45rem' }}>
                      <Upload size={13} />
                      <span>Upload Slide Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleUploadHeroImage(e, idx)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT & VISION */}
      {activeTab === 'about' && (
        <div style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                About, Vision & Mission
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Edit organizational history and guiding principles</span>
            </div>
            <button
              onClick={() => handleSaveSection('about')}
              disabled={saving}
              style={btnPrimaryStyle}
            >
              <Save size={16} />
              <span>{saving ? 'Publishing...' : 'Publish About Changes'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Section Badge</label>
                <input
                  type="text"
                  value={about.badge || ''}
                  onChange={(e) => handleAboutChange('badge', e.target.value)}
                  style={inputStyle}
                  placeholder="About TOGU Foundation"
                />
              </div>
              <div>
                <label style={labelStyle}>Section Heading</label>
                <input
                  type="text"
                  value={about.heading || ''}
                  onChange={(e) => handleAboutChange('heading', e.target.value)}
                  style={inputStyle}
                  placeholder="Dedicated to Compassion, Equality & Lasting Change"
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Paragraph 1 (Foundation Origin & Values)</label>
              <textarea
                rows={3}
                value={about.paragraph1 || ''}
                onChange={(e) => handleAboutChange('paragraph1', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Paragraph 2 (Grassroots Approach & Community Work)</label>
              <textarea
                rows={3}
                value={about.paragraph2 || ''}
                onChange={(e) => handleAboutChange('paragraph2', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Vision Statement</label>
                <textarea
                  rows={3}
                  value={about.vision || ''}
                  onChange={(e) => handleAboutChange('vision', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Mission Statement</label>
                <textarea
                  rows={3}
                  value={about.mission || ''}
                  onChange={(e) => handleAboutChange('mission', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT & SOCIAL */}
      {activeTab === 'contact' && (
        <div style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Contact & Social Links
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Manage public office addresses, helpline numbers and social URLs</span>
            </div>
            <button
              onClick={() => handleSaveSection('contact_info')}
              disabled={saving}
              style={btnPrimaryStyle}
            >
              <Save size={16} />
              <span>{saving ? 'Publishing...' : 'Publish Contact Info'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Physical Office Address</label>
              <input
                type="text"
                value={contact.address || ''}
                onChange={(e) => handleContactChange('address', e.target.value)}
                style={inputStyle}
                placeholder="Balanagar, Hyderabad, Telangana - 500037, India"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Primary Contact Phone</label>
                <input
                  type="text"
                  value={contact.phone || ''}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  style={inputStyle}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label style={labelStyle}>Official Email</label>
                <input
                  type="email"
                  value={contact.email || ''}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  style={inputStyle}
                  placeholder="contact@togufoundation.org"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Facebook URL</label>
                <input
                  type="text"
                  value={contact.facebook || ''}
                  onChange={(e) => handleContactChange('facebook', e.target.value)}
                  style={inputStyle}
                  placeholder="https://facebook.com/togufoundation"
                />
              </div>
              <div>
                <label style={labelStyle}>Instagram URL</label>
                <input
                  type="text"
                  value={contact.instagram || ''}
                  onChange={(e) => handleContactChange('instagram', e.target.value)}
                  style={inputStyle}
                  placeholder="https://instagram.com/togufoundation"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Twitter / X URL</label>
                <input
                  type="text"
                  value={contact.twitter || ''}
                  onChange={(e) => handleContactChange('twitter', e.target.value)}
                  style={inputStyle}
                  placeholder="https://twitter.com/togufoundation"
                />
              </div>
              <div>
                <label style={labelStyle}>LinkedIn URL</label>
                <input
                  type="text"
                  value={contact.linkedin || ''}
                  onChange={(e) => handleContactChange('linkedin', e.target.value)}
                  style={inputStyle}
                  placeholder="https://linkedin.com/company/togufoundation"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IMPACT STATS */}
      {activeTab === 'stats' && (
        <div style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Impact Highlights Counters
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Counters displayed on the public homepage banner</span>
            </div>
            <button
              onClick={() => handleSaveSection('impact_stats')}
              disabled={saving}
              style={btnPrimaryStyle}
            >
              <Save size={16} />
              <span>{saving ? 'Publishing...' : 'Publish Impact Stats'}</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Lives Touched / Beneficiaries</label>
              <input
                type="text"
                value={stats.livesTouched || '25,000+'}
                onChange={(e) => handleStatsChange('livesTouched', e.target.value)}
                style={inputStyle}
                placeholder="25,000+"
              />
            </div>
            <div>
              <label style={labelStyle}>Health Camps Organized</label>
              <input
                type="text"
                value={stats.healthCampsOrganized || '85+'}
                onChange={(e) => handleStatsChange('healthCampsOrganized', e.target.value)}
                style={inputStyle}
                placeholder="85+"
              />
            </div>
            <div>
              <label style={labelStyle}>Scholarships Awarded</label>
              <input
                type="text"
                value={stats.scholarshipsAwarded || '1,200+'}
                onChange={(e) => handleStatsChange('scholarshipsAwarded', e.target.value)}
                style={inputStyle}
                placeholder="1,200+"
              />
            </div>
            <div>
              <label style={labelStyle}>Villages & Slums Reached</label>
              <input
                type="text"
                value={stats.villagesReached || '40+'}
                onChange={(e) => handleStatsChange('villagesReached', e.target.value)}
                style={inputStyle}
                placeholder="40+"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const cardBoxStyle = {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '1.75rem',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
};

const tabBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.65rem 1.15rem',
  borderRadius: '10px',
  border: '1px solid transparent',
  background: 'transparent',
  color: '#64748b',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer'
};

const activeTabStyle = {
  background: '#062817',
  color: '#ffffff',
  borderColor: '#062817'
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

export default WebContent;
