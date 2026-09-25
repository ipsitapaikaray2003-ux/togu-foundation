import React from 'react';
import { HeartHandshake, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#f1f5f9', paddingTop: '5rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          
          {/* Brand */}
          <div>
            <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                borderRadius: '50%', padding: '0.5rem', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <HeartHandshake size={28} />
              </div>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white' }}>
                TOGU <span style={{ color: '#10b981' }}>Foundation</span>
              </span>
            </a>
            <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem' }}>
              Unity in Action, Growth for All. Dedicated to building an inclusive and empowered society.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <motion.a href="#" whileHover={{ y: -5, scale: 1.1, color: '#3b82f6' }} style={{ color: '#94a3b8', transition: 'color 0.3s' }}>
                <FaFacebook size={22} />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -5, scale: 1.1, color: '#38bdf8' }} style={{ color: '#94a3b8', transition: 'color 0.3s' }}>
                <FaTwitter size={22} />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -5, scale: 1.1, color: '#ec4899' }} style={{ color: '#94a3b8', transition: 'color 0.3s' }}>
                <FaInstagram size={22} />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -5, scale: 1.1, color: '#0ea5e9' }} style={{ color: '#94a3b8', transition: 'color 0.3s' }}>
                <FaLinkedin size={22} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'white' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><a href="/#about" style={{ color: '#94a3b8', transition: 'color 0.3s' }} className="footer-link">About Us</a></li>
              <li><a href="/#focus-areas" style={{ color: '#94a3b8', transition: 'color 0.3s' }} className="footer-link">Our Focus Areas</a></li>
              <li><a href="/#structure" style={{ color: '#94a3b8', transition: 'color 0.3s' }} className="footer-link">Foundation Structure</a></li>
              <li><a href="/#get-involved" style={{ color: '#94a3b8', transition: 'color 0.3s' }} className="footer-link">Get Involved</a></li>
              <li><a href="#" style={{ color: '#94a3b8', transition: 'color 0.3s' }} className="footer-link">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'white' }}>Contact Info</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#94a3b8' }}>
                <MapPin size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '0.25rem' }} />
                <span>Balanagar, Hyderabad<br/>Telangana, India</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                <Phone size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                <Mail size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>contact@togufoundation.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid #1e293b', 
          paddingTop: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '1rem',
          color: '#64748b',
          fontSize: '0.875rem'
        }} className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TOGU Foundation. All rights reserved.</p>
          <p>
            Developed by <a href="https://www.qubnixtechnology.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '500' }}>Qubnix Technology</a>
          </p>
        </div>
      </div>
      <style>{`
        .social-link:hover { color: #10b981 !important; }
        .footer-link:hover { color: white !important; }
        @media (min-width: 768px) {
          .footer-bottom { flex-direction: row !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
