import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    text: "TOGU Foundation has helped many children continue their education. Their dedication towards society is truly inspiring.",
    name: "Ramesh Singh",
    role: "Volunteer"
  },
  {
    text: "I learned computer skills through their training program, which helped me get my first job. Thank you for changing my life.",
    name: "Anjali Verma",
    role: "Student"
  },
  {
    text: "Their healthcare camps and awareness programs have made a real difference in our community.",
    name: "Vikas Kumar",
    role: "Community Member"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section testimonials-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative ambient background accents */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(238, 163, 40, 0.18) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(11, 75, 37, 0.16) 0%, transparent 70%)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

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
              COMMUNITY VOICES
            </span>
          </div>

          <h2 className="section-title">What People Say About Us</h2>
          <p className="section-subtitle">
            Our journey is reflected through the voices of the people whose lives we have touched.
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          justifyContent: 'center'
        }}>
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="testimonial-card"
              style={{
                background: 'var(--surface)',
                borderRadius: '24px',
                padding: '2.5rem',
                border: '1px solid rgba(238, 163, 40, 0.22)',
                borderTop: '4px solid #eea328',
                boxShadow: '0 14px 35px -8px rgba(238, 163, 40, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="#eea328" color="#eea328" />
                ))}
              </div>
              <p style={{ 
                color: 'var(--text-muted)', 
                lineHeight: '1.7', 
                marginBottom: '2rem', 
                flex: 1 
              }}>
                {testimonial.text}
              </p>
              <div>
                <h4 style={{ 
                  color: 'var(--primary)', 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  marginBottom: '0.25rem' 
                }}>
                  {testimonial.name}
                </h4>
                <span style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.875rem' 
                }}>
                  {testimonial.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .testimonials-section {
          background: linear-gradient(180deg, #fef9ef 0%, #f4f8f4 50%, #edf5ee 100%);
        }
        .dark-mode .testimonials-section {
          background: linear-gradient(180deg, #0d2114 0%, #06190e 50%, #03120a 100%) !important;
        }
        .dark-mode .testimonial-card {
          background: rgba(11, 38, 24, 0.85) !important;
          border-color: rgba(238, 163, 40, 0.25) !important;
        }
        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(238, 163, 40, 0.2) !important;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
