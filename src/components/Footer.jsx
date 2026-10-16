import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const [contactData, setContactData] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/content/contact_info')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.section?.content) {
          setContactData(data.section.content);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer style={{ background: '#051d11', color: '#f1f5f9', paddingTop: '5rem', paddingBottom: '2.5rem', borderTop: '1px solid #144028' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          
          {/* Brand */}
          <div>
            <a href="/#home" style={{ display: 'inline-block', marginBottom: '1.5rem', textDecoration: 'none' }}>
              <div style={{
                background: '#ffffff',
                padding: '0.65rem 1rem',
                borderRadius: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                maxWidth: '220px'
              }}>
                <img src="/logo.png" alt="TOGU Foundation Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </a>
            <p style={{ color: '#c5e4d2', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>TOGETHER FOR GOOD. UNITED FOR CHANGE.</strong>
              Dedicated to building an inclusive and empowered society through sustainable development, education, and healthcare.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <motion.a href={contactData?.facebook || "#"} target="_blank" rel="noopener noreferrer" whileHover={{ y: -5, scale: 1.1, color: '#eea328' }} style={{ color: '#a3c2b0', transition: 'color 0.3s' }}>
                <FaFacebook size={22} />
              </motion.a>
              <motion.a href={contactData?.twitter || "#"} target="_blank" rel="noopener noreferrer" whileHover={{ y: -5, scale: 1.1, color: '#eea328' }} style={{ color: '#a3c2b0', transition: 'color 0.3s' }}>
                <FaTwitter size={22} />
              </motion.a>
              <motion.a href={contactData?.instagram || "#"} target="_blank" rel="noopener noreferrer" whileHover={{ y: -5, scale: 1.1, color: '#eea328' }} style={{ color: '#a3c2b0', transition: 'color 0.3s' }}>
                <FaInstagram size={22} />
              </motion.a>
              <motion.a href={contactData?.linkedin || "#"} target="_blank" rel="noopener noreferrer" whileHover={{ y: -5, scale: 1.1, color: '#eea328' }} style={{ color: '#a3c2b0', transition: 'color 0.3s' }}>
                <FaLinkedin size={22} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><a href="/#about" style={{ color: '#a3c2b0', transition: 'color 0.3s' }} className="footer-link">About Us</a></li>
              <li><a href="/#focus-areas" style={{ color: '#a3c2b0', transition: 'color 0.3s' }} className="footer-link">Our Focus Areas</a></li>
              <li><a href="/#structure" style={{ color: '#a3c2b0', transition: 'color 0.3s' }} className="footer-link">Foundation Structure</a></li>
              <li><a href="/#get-involved" style={{ color: '#a3c2b0', transition: 'color 0.3s' }} className="footer-link">Get Involved</a></li>
              <li><a href="/#contact" style={{ color: '#a3c2b0', transition: 'color 0.3s' }} className="footer-link">Contact Us</a></li>
              <li>
                <Link to="/admin" style={{ color: '#eea328', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, transition: 'color 0.3s' }} className="footer-link">
                  <Shield size={14} /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>Contact Info</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#a3c2b0' }}>
                <MapPin size={20} style={{ color: '#eea328', flexShrink: 0, marginTop: '0.25rem' }} />
                <span>{contactData?.address || "Balanagar, Hyderabad, Telangana, India"}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#a3c2b0' }}>
                <Phone size={20} style={{ color: '#eea328', flexShrink: 0 }} />
                <span>{contactData?.phone || "+91 98765 43210"}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#a3c2b0' }}>
                <Mail size={20} style={{ color: '#eea328', flexShrink: 0 }} />
                <span>{contactData?.email || "contact@togufoundation.org"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid #144028', 
          paddingTop: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '1rem',
          color: '#82a592',
          fontSize: '0.875rem'
        }} className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TOGU Foundation. All rights reserved.</p>
          <p>
            Developed by <a href="https://www.qubnixtechnology.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#eea328', textDecoration: 'none', fontWeight: '600' }}>Qubnix Technology</a>
          </p>
        </div>
      </div>
      <style>{`
        .footer-link:hover { color: #eea328 !important; }
        @media (min-width: 768px) {
          .footer-bottom { flex-direction: row !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
