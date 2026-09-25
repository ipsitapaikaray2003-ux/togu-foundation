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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your interest in becoming a ${role}. We will contact you soon!`);
    navigate('/');
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
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', paddingTop: '100px', paddingBottom: '4rem' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>Join TOGU Foundation</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>
              You are applying for the role of <strong style={{ color: 'var(--secondary)' }}>{role}</strong>. Please fill out the details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>First Name *</label>
                <input type="text" required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="John" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Last Name *</label>
                <input type="text" required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="Doe" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Email Address *</label>
              <input type="email" required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="john.doe@example.com" />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Phone Number *</label>
              <input type="tel" required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="+91 98765 43210" />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Address / City</label>
              <input type="text" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="Hyderabad, Telangana" />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Why do you want to join us? (Optional)</label>
              <textarea rows="4" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem', resize: 'vertical' }} placeholder="Share your thoughts or previous experience..."></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Submit Inquiry <Send size={20} />
            </button>
          </form>
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
