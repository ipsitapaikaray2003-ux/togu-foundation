import React from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Replace with the actual WhatsApp number (include country code, without +)
    const phoneNumber = "12345667890"; 
    
    const text = `Hi, I'm ${name} (${email}).\n\nSubject: ${subject}\n\nMessage:\n${message}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    
    window.open(whatsappUrl, '_blank');
    e.target.reset();
  };

  return (
    <section id="contact" className="section" style={{ background: 'var(--surface)', position: 'relative' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center" 
          style={{ marginBottom: '4rem' }}
        >
          <h4 style={{ 
            color: '#f97316', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontWeight: '700', 
            fontSize: '0.875rem',
            marginBottom: '1rem' 
          }}>
            GET IN TOUCH
          </h4>
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">
            Have questions or want to collaborate? Reach out to us through the form below or drop by our office.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '3rem',
          background: 'var(--bg-color)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
          border: '1px solid var(--border)'
        }}>
          {/* Left Column: Form */}
          <div style={{ padding: '3rem' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Send an Inquiry</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Fill out the form and your message will be sent directly to our WhatsApp. We typically reply within a few hours.
            </p>
            
            <form onSubmit={handleWhatsAppSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Your Name *</label>
                <input type="text" name="name" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="John Doe" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Email Address *</label>
                <input type="email" name="email" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="john@example.com" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Subject *</label>
                <input type="text" name="subject" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="How can we help you?" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Message *</label>
                <textarea name="message" required rows="4" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem', resize: 'vertical' }} placeholder="Write your message here..."></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#25D366', color: '#fff', border: 'none' }}>
                Send to WhatsApp <Send size={18} />
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
                  <MapPin size={24} style={{ color: 'var(--accent)', marginTop: '2px' }} />
                  <div>
                    <h5 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', fontWeight: 600 }}>Location</h5>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', lineHeight: 1.6 }}>123 NGO Street, Jubilee Hills,<br/>Hyderabad, Telangana 500033</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Phone size={24} style={{ color: 'var(--accent)' }} />
                  <div>
                    <h5 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', fontWeight: 600 }}>Phone</h5>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>+12 34566 7890</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Mail size={24} style={{ color: 'var(--accent)' }} />
                  <div>
                    <h5 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', fontWeight: 600 }}>Email</h5>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>contact@togufoundation.org</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
