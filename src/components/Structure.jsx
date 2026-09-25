import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Users } from 'lucide-react';

const Structure = () => {
  return (
    <section id="structure" className="section" style={{ background: 'var(--surface)', position: 'relative' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: '4rem' }}
        >
          <h2 className="section-title">Foundation Structure</h2>
          <p className="section-subtitle">
            Our organizational framework and geographical focus to maximize impact.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              background: 'linear-gradient(145deg, var(--surface), var(--bg-color))',
              padding: '2.5rem',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--secondary)' }}>
              <Users size={36} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Founders</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>N. Venkat & Ashok</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: 'linear-gradient(145deg, var(--surface), var(--bg-color))',
              padding: '2.5rem',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent)' }}>
              <MapPin size={36} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Base</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>Balanagar, Hyderabad<br/>Telangana</p>
            </div>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            marginTop: '3rem',
            background: 'var(--surface)',
            padding: '3rem',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            textAlign: 'center',
            maxWidth: '1000px',
            margin: '3rem auto 0'
          }}
        >
          <div style={{ display: 'inline-block', background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%', color: '#f59e0b', marginBottom: '1.5rem' }}>
            <Globe size={40} />
          </div>
          <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '1rem' }}>Our Reach Strategy</h4>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
            <span style={{ color: 'var(--secondary)' }}>Telangana</span>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <span style={{ color: 'var(--accent)' }}>India</span>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <span style={{ color: '#f59e0b' }}>International</span>
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '1.125rem' }}>Scaling our community initiatives for global impact.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Structure;
