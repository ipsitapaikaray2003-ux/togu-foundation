import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

const Inquiry = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'General';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [submitting, setSubmitting] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const form = e.target;
    const formData = new FormData(form);
    const firstName = formData.get('firstName')?.trim();
    const lastName = formData.get('lastName')?.trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    const city = formData.get('city')?.trim() || '';
    const message = formData.get('message')?.trim() || '';

    try {
      setSubmitting(true);
      let refId = '';

      if (role.toLowerCase().includes('volunteer')) {
        // Submit directly to volunteer endpoint
        const res = await fetch('/api/volunteers/public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            email,
            phone,
            city,
            areas_of_interest: 'Community Support',
            skills: 'General Volunteer',
            notes: `Public application for role: ${role}. Note: ${message}`
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Volunteer registration failed');
        refId = data.volunteerId;
      } else {
        // Submit to enquiries endpoint
        const res = await fetch('/api/enquiries/public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName,
            email,
            phone,
            subject: `Join Application: ${role}`,
            message: `Role: ${role}. Location: ${city}. Message: ${message}`
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Enquiry submission failed');
        refId = data.enquiryId;
      }

      setSubmittedData({
        role,
        fullName,
        refId
      });
      form.reset();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: "url('/hero.jpg')", 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      {/* Dark Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5, 26, 14, 0.75) 0%, rgba(4, 18, 10, 0.9) 100%)' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', paddingTop: '100px', paddingBottom: '4rem' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>Join TOGU Foundation</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>
              You are applying for the role of <strong style={{ color: 'var(--secondary)' }}>{role}</strong>. Please fill out the details below.
            </p>
          </div>

          {submittedData ? (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem 1.5rem',
              borderRadius: '20px',
              background: '#f0fdf4',
              border: '2px dashed #10b981'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ color: '#047857', marginBottom: '0.75rem' }}>Application Submitted!</h2>
              <p style={{ color: '#065f46', fontSize: '1.1rem', marginBottom: '1rem' }}>
                Thank you <strong>{submittedData.fullName}</strong>. Your application for <strong>{submittedData.role}</strong> has been saved in our database.
              </p>
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1.25rem',
                borderRadius: '50px',
                background: '#dcfce7',
                color: '#15803d',
                fontWeight: 700,
                fontSize: '1rem',
                marginBottom: '2rem'
              }}>
                Registration Reference: #{submittedData.refId}
              </div>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Our coordinator will review your application and reach out to you within 24-48 hours.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setSubmittedData(null)}
                  className="btn"
                  style={{ background: '#e2e8f0', color: '#1e293b', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600 }}
                >
                  Submit Another Application
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}
                >
                  Back to Homepage
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {errorMsg && (
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  fontSize: '0.9rem'
                }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>First Name *</label>
                  <input type="text" name="firstName" required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="John" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Last Name *</label>
                  <input type="text" name="lastName" required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="Doe" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Email Address *</label>
                <input type="email" name="email" required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="john.doe@example.com" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Phone Number *</label>
                <input type="tel" name="phone" required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="+91 98765 43210" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>City / State</label>
                <input type="text" name="city" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="Hyderabad, Telangana" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Why do you want to join us? (Optional)</label>
                <textarea name="message" rows="4" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem', resize: 'vertical' }} placeholder="Share your skills, previous NGO experience, or motivation..."></textarea>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="btn btn-gold" 
                style={{ 
                  width: '100%', 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  fontSize: '1.125rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Submitting to Database...' : 'Submit Application'} <Send size={20} />
              </button>
            </form>
          )}
        </motion.div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            onClick={() => navigate('/')}
            className="btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--surface)', border: 'none', color: 'var(--primary)',
              cursor: 'pointer', fontSize: '1rem', fontWeight: 600,
              padding: '0.75rem 1.5rem', borderRadius: '50px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
          >
            <ArrowLeft size={20} /> Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default Inquiry;
