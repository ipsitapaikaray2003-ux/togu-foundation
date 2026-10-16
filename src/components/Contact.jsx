import React from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  const [submitting, setSubmitting] = React.useState(false);
  const [successInfo, setSuccessInfo] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone') || '';
    const subject = formData.get('subject');
    const message = formData.get('message');

    try {
      setSubmitting(true);
      const res = await fetch('/api/enquiries/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit enquiry');

      setSuccessInfo({
        enquiryId: data.enquiryId,
        message: data.message || 'Your enquiry has been received and stored in our database. We will get back to you shortly!'
      });
      form.reset();
    } catch (err) {
      setErrorMessage(err.message || 'Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative ambient background accents */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(11, 75, 37, 0.16) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(238, 163, 40, 0.16) 0%, transparent 70%)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center" 
          style={{ marginBottom: '4rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            background: 'rgba(238, 163, 40, 0.1)',
            border: '1px solid rgba(238, 163, 40, 0.25)',
            borderRadius: '9999px',
            marginBottom: '1rem',
            boxShadow: '0 2px 10px rgba(238, 163, 40, 0.08)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eea328', display: 'inline-block' }}></span>
            <span style={{ color: '#d98f18', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              GET IN TOUCH
            </span>
          </div>

          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">
            Have questions or want to collaborate? Reach out to us through the form below or drop by our office.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '3rem',
          background: 'var(--surface)',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px -15px rgba(11, 75, 37, 0.12)',
          border: '1px solid rgba(11, 75, 37, 0.15)'
        }}>
          {/* Left Column: Form */}
          <div style={{ padding: '3rem' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Send an Inquiry</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Fill out the form below. Your message will be securely recorded in our system and our team will get back to you promptly.
            </p>

            {successInfo && (
              <div style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#065f46',
                marginBottom: '1.25rem',
                fontSize: '0.9rem'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>✓ Thank You! Ref #{successInfo.enquiryId}</div>
                <div>{successInfo.message}</div>
              </div>
            )}

            {errorMessage && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#b91c1c',
                marginBottom: '1.25rem',
                fontSize: '0.88rem'
              }}>
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem' }}>Your Name *</label>
                <input type="text" name="name" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.95rem' }} placeholder="John Doe" />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem' }}>Email Address *</label>
                  <input type="email" name="email" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.95rem' }} placeholder="john@example.com" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem' }}>Phone Number</label>
                  <input type="tel" name="phone" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.95rem' }} placeholder="+91 98765 43210" />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem' }}>Subject *</label>
                <input type="text" name="subject" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.95rem' }} placeholder="How can we help you?" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem' }}>Message *</label>
                <textarea name="message" required rows="4" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.95rem', resize: 'vertical' }} placeholder="Write your message here..."></textarea>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  marginTop: '0.5rem', 
                  padding: '0.9rem', 
                  fontSize: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  background: 'var(--primary)', 
                  color: '#fff', 
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Submitting...' : 'Send Enquiry'} <Send size={18} />
              </button>
            </form>
          </div>

          {/* Right Column: Map & Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: '350px', background: '#e2e8f0' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.31604068593!2d78.26795908225026!3d17.412299801128362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              ></iframe>
            </div>
            <div style={{ padding: '2rem', background: 'var(--primary)', color: 'white' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <MapPin size={24} style={{ color: '#eea328', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', fontWeight: 600 }}>Location</h5>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', lineHeight: 1.6 }}>123 NGO Street, Jubilee Hills,<br/>Hyderabad, Telangana 500033</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Phone size={24} style={{ color: '#eea328', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', fontWeight: 600 }}>Phone</h5>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>+12 34566 7890</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Mail size={24} style={{ color: '#eea328', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', fontWeight: 600 }}>Email</h5>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>contact@togufoundation.org</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .contact-section {
          background: linear-gradient(180deg, #edf6f0 0%, #e2efe6 50%, #eaf4ed 100%);
        }
        .dark-mode .contact-section {
          background: linear-gradient(180deg, #05190e 0%, #082617 50%, #031109 100%) !important;
        }
      `}</style>
    </section>
  );
};

export default Contact;
