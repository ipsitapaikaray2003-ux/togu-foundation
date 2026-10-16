import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Users, Building, ShieldCheck } from 'lucide-react';

const Structure = () => {
  return (
    <section 
      id="structure" 
      className="section structure-section" 
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        padding: '6.5rem 0'
      }}
    >
      {/* Decorative ambient background accents */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '-15%', 
          right: '-8%', 
          width: '500px', 
          height: '500px', 
          background: 'radial-gradient(circle, rgba(11, 75, 37, 0.18) 0%, rgba(11, 75, 37, 0) 70%)', 
          filter: 'blur(70px)', 
          borderRadius: '50%', 
          pointerEvents: 'none' 
        }} 
      />
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '-15%', 
          left: '-8%', 
          width: '520px', 
          height: '520px', 
          background: 'radial-gradient(circle, rgba(238, 163, 40, 0.2) 0%, rgba(238, 163, 40, 0) 70%)', 
          filter: 'blur(80px)', 
          borderRadius: '50%', 
          pointerEvents: 'none' 
        }} 
      />
      <div 
        style={{ 
          position: 'absolute', 
          top: '30%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: '400px', 
          height: '400px', 
          background: 'radial-gradient(circle, rgba(59, 142, 52, 0.1) 0%, rgba(59, 142, 52, 0) 70%)', 
          filter: 'blur(90px)', 
          borderRadius: '50%', 
          pointerEvents: 'none' 
        }} 
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: '4rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            background: 'rgba(11, 75, 37, 0.08)',
            border: '1px solid rgba(11, 75, 37, 0.2)',
            borderRadius: '9999px',
            marginBottom: '1rem',
            boxShadow: '0 2px 10px rgba(11, 75, 37, 0.05)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eea328', display: 'inline-block' }}></span>
            <span style={{ 
              color: 'var(--primary)', 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              letterSpacing: '1.5px', 
              textTransform: 'uppercase' 
            }}>
              Organizational Framework
            </span>
          </div>

          <h2 className="section-title" style={{ fontSize: '2.75rem', marginBottom: '0.75rem' }}>Foundation Structure</h2>
          <p className="section-subtitle" style={{ fontSize: '1.15rem', maxWidth: '640px' }}>
            Our organizational governance and geographical expansion to maximize lasting grassroots impact.
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem', 
          maxWidth: '1050px', 
          margin: '0 auto' 
        }}>
          
          {/* Card 1: Founders */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(11, 75, 37, 0.18)' }}
            className="structure-card"
            style={{
              background: 'var(--surface)',
              padding: '2.5rem 2rem',
              borderRadius: '24px',
              border: '1px solid rgba(11, 75, 37, 0.15)',
              borderTop: '4px solid #0b4b25',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: '0 12px 35px -5px rgba(11, 75, 37, 0.08)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(11, 75, 37, 0.14) 0%, rgba(59, 142, 52, 0.14) 100%)', 
              padding: '1.15rem', 
              borderRadius: '20px', 
              color: '#0b4b25',
              boxShadow: '0 6px 15px rgba(11, 75, 37, 0.1)',
              flexShrink: 0
            }}>
              <Users size={36} />
            </div>
            <div>
              <span style={{ 
                fontSize: '0.78rem', 
                fontWeight: 700,
                textTransform: 'uppercase', 
                letterSpacing: '1.2px', 
                color: '#51695c', 
                display: 'block',
                marginBottom: '0.35rem' 
              }}>
                FOUNDERS
              </span>
              <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.25 }}>
                N. Venkat & Ashok
              </p>
              <span style={{ fontSize: '0.85rem', color: '#51695c', marginTop: '0.25rem', display: 'block' }}>
                Visionary Leadership & Governance
              </span>
            </div>
          </motion.div>

          {/* Card 2: Base */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(238, 163, 40, 0.22)' }}
            className="structure-card"
            style={{
              background: 'var(--surface)',
              padding: '2.5rem 2rem',
              borderRadius: '24px',
              border: '1px solid rgba(238, 163, 40, 0.25)',
              borderTop: '4px solid #eea328',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: '0 12px 35px -5px rgba(238, 163, 40, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(238, 163, 40, 0.18) 0%, rgba(217, 143, 24, 0.18) 100%)', 
              padding: '1.15rem', 
              borderRadius: '20px', 
              color: '#d98f18',
              boxShadow: '0 6px 15px rgba(238, 163, 40, 0.15)',
              flexShrink: 0
            }}>
              <MapPin size={36} />
            </div>
            <div>
              <span style={{ 
                fontSize: '0.78rem', 
                fontWeight: 700,
                textTransform: 'uppercase', 
                letterSpacing: '1.2px', 
                color: '#eea328', 
                display: 'block',
                marginBottom: '0.35rem' 
              }}>
                HEADQUARTERS & BASE
              </span>
              <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.25 }}>
                Balanagar, Hyderabad
              </p>
              <span style={{ fontSize: '0.85rem', color: '#51695c', marginTop: '0.25rem', display: 'block' }}>
                Telangana, India
              </span>
            </div>
          </motion.div>

        </div>

        {/* Card 3: Reach Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          whileHover={{ y: -4, boxShadow: '0 24px 50px -10px rgba(11, 75, 37, 0.15)' }}
          className="structure-card"
          style={{
            marginTop: '2.5rem',
            background: 'var(--surface)',
            padding: '3.25rem 2.5rem',
            borderRadius: '28px',
            border: '1px solid rgba(11, 75, 37, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 16px 40px -8px rgba(11, 75, 37, 0.09)',
            textAlign: 'center',
            maxWidth: '1050px',
            margin: '2.5rem auto 0',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Subtle top gradient bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #0b4b25 0%, #3b8e34 50%, #eea328 100%)'
          }} />

          <div style={{ 
            display: 'inline-flex', 
            background: 'linear-gradient(135deg, rgba(11, 75, 37, 0.12) 0%, rgba(59, 142, 52, 0.12) 100%)', 
            padding: '1.25rem', 
            borderRadius: '50%', 
            color: '#0b4b25', 
            marginBottom: '1.5rem',
            boxShadow: '0 8px 20px rgba(11, 75, 37, 0.1)'
          }}>
            <Globe size={42} />
          </div>
          
          <h4 style={{ 
            fontSize: '0.85rem', 
            fontWeight: 800,
            textTransform: 'uppercase', 
            letterSpacing: '1.5px', 
            color: '#eea328', 
            marginBottom: '1.25rem' 
          }}>
            OUR GEOGRAPHICAL EXPANSION ROADMAP
          </h4>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            marginBottom: '1.25rem'
          }}>
            <div style={{ 
              background: 'rgba(11, 75, 37, 0.08)', 
              border: '1.5px solid rgba(11, 75, 37, 0.25)', 
              padding: '0.75rem 1.75rem', 
              borderRadius: '9999px',
              color: '#0b4b25',
              fontWeight: 800,
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(11, 75, 37, 0.06)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0b4b25' }}></span>
              Telangana
            </div>

            <span style={{ color: '#eea328', fontSize: '1.5rem', fontWeight: 900 }}>→</span>

            <div style={{ 
              background: 'rgba(46, 125, 50, 0.08)', 
              border: '1.5px solid rgba(46, 125, 50, 0.25)', 
              padding: '0.75rem 1.75rem', 
              borderRadius: '9999px',
              color: '#2e7d32',
              fontWeight: 800,
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.06)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2e7d32' }}></span>
              Pan-India
            </div>

            <span style={{ color: '#eea328', fontSize: '1.5rem', fontWeight: 900 }}>→</span>

            <div style={{ 
              background: 'rgba(238, 163, 40, 0.12)', 
              border: '1.5px solid rgba(238, 163, 40, 0.35)', 
              padding: '0.75rem 1.75rem', 
              borderRadius: '9999px',
              color: '#c47d10',
              fontWeight: 800,
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(238, 163, 40, 0.1)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eea328' }}></span>
              International
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Beginning in Telangana and scaling sustainable community empowerment initiatives globally.
          </p>
        </motion.div>
      </div>

      <style>{`
        .structure-section {
          background: linear-gradient(135deg, #e4f2ea 0%, #edf6f0 45%, #fdf5e5 100%);
        }
        .dark-mode .structure-section {
          background: linear-gradient(135deg, #04190e 0%, #082918 50%, #0d3821 100%) !important;
        }
        .dark-mode .structure-card {
          background: rgba(11, 38, 24, 0.85) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </section>
  );
};

export default Structure;
